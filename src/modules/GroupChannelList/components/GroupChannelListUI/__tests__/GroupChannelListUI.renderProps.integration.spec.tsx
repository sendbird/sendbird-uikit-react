import React from 'react';
import { render } from '@testing-library/react';
import GroupChannelListUI from '../index';
import { useGroupChannelList as useGroupChannelListModule } from '../../../context/useGroupChannelList';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import type { Mock } from 'vitest';

// Verify the customer's render props reach the list: renderChannelPreview is invoked per channel
// with the channel item, and renderHeader is invoked.
const mockState = {
  stores: {
    userStore: { user: { userId: 'test-user-id' } },
    sdkStore: { sdk: { currentUser: { userId: 'test-user-id' } }, initialized: true },
  },
  config: {
    logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
    userId: 'test-user-id',
    groupChannel: { enableMention: true },
    isOnline: true,
  },
};
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));
vi.mock('../../../context/useGroupChannelList');

const mockStringSet = { PLACE_HOLDER__NO_CHANNEL: 'No channels' };

const defaultMockState = {
  className: '',
  selectedChannelUrl: '',
  typingChannelUrls: [],
  initialized: false,
  groupChannels: [],
  loadMore: null,
  onChannelSelect: undefined,
  onThemeChange: undefined,
  onUserProfileUpdated: undefined,
  allowProfileEdit: false,
};

const renderComponent = (state: Record<string, unknown> = {}, uiProps: Record<string, unknown> = {}) => {
  (useGroupChannelListModule as Mock).mockReturnValue({ state: { ...defaultMockState, ...state } });
  return render(
    <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
      <GroupChannelListUI {...uiProps} />
    </LocalizationContext.Provider>,
  );
};

describe('GroupChannelListUI — render-prop propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invokes a custom renderChannelPreview for each channel with the channel item', () => {
    const channels = [
      { name: 'ch-1', url: 'url-1' },
      { name: 'ch-2', url: 'url-2' },
    ];
    const renderChannelPreview = vi.fn(() => <div data-testid="custom-preview" />);

    renderComponent({ groupChannels: channels, initialized: true }, { renderChannelPreview });

    expect(renderChannelPreview).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[0], tabIndex: 0 }));
    expect(renderChannelPreview).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[1] }));
  });

  it('invokes a custom renderHeader', () => {
    const renderHeader = vi.fn(() => <div data-testid="custom-header" />);

    const { getByTestId } = renderComponent({ initialized: true }, { renderHeader });

    expect(renderHeader).toHaveBeenCalled();
    // the custom header actually renders in place of the default
    expect(getByTestId('custom-header')).toBeInTheDocument();
  });

  it('hands renderChannelPreview exactly the group channel item props', () => {
    const channel = { name: 'ch-1', url: 'url-1' };
    let payload: Record<string, unknown> = {};
    const renderChannelPreview = vi.fn((props: Record<string, unknown>) => {
      payload = props;
      return <div />;
    });

    renderComponent({ groupChannels: [channel], initialized: true }, { renderChannelPreview });

    expect(Object.keys(payload).sort()).toEqual([
      'channel', 'isSelected', 'isTyping', 'onClick', 'onLeaveChannel', 'renderChannelAction', 'tabIndex',
    ]);
    expect(payload.channel).toBe(channel);
    expect(payload.tabIndex).toBe(0);
    expect(payload.isSelected).toBe(false);
    expect(payload.isTyping).toBe(false);
  });

  it('does not select a channel when clicked while offline without cache', () => {
    const onChannelSelect = vi.fn();
    const channel = { name: 'ch-1', url: 'url-1' };
    mockState.config.isOnline = false;

    try {
      const { container } = renderComponent(
        { groupChannels: [channel], initialized: true, onChannelSelect },
        { renderChannelPreview: () => <div data-testid="custom-preview" /> },
      );
      container.querySelector('[data-testid="custom-preview"]')!.parentElement!.click();
      expect(onChannelSelect).not.toHaveBeenCalled();
    } finally {
      mockState.config.isOnline = true;
    }
  });
});
