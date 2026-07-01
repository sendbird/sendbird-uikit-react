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
    logger: console,
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

    renderComponent({ initialized: true }, { renderHeader });

    expect(renderHeader).toHaveBeenCalled();
  });
});
