import React from 'react';
import { render } from '@testing-library/react';
import ChannelListUI from '../index';
import { useChannelListContext } from '../../../context/ChannelListProvider';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import type { Mock } from 'vitest';

// Legacy ChannelList. Verify the customer's render props reach the list: renderChannelPreview is
// invoked per channel with the channel item, and renderHeader is invoked. Mirrors
// GroupChannelListUI.renderProps.integration.spec.tsx.
const mockState = {
  stores: {
    userStore: { user: { userId: 'test-user-id' } },
    sdkStore: { sdk: { currentUser: { userId: 'test-user-id' }, isCacheEnabled: false }, initialized: true },
  },
  config: { logger: console, userId: 'test-user-id', isOnline: true },
};
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));
vi.mock('../../../context/ChannelListProvider', () => ({ useChannelListContext: vi.fn() }));

const mockStringSet = { PLACE_HOLDER__NO_CHANNEL: 'No channels' };

const defaultContext = {
  onThemeChange: undefined,
  allowProfileEdit: false,
  allChannels: [],
  currentChannel: null,
  channelListDispatcher: vi.fn(),
  typingChannels: [],
  initialized: false,
  fetchChannelList: vi.fn(),
  onProfileEditSuccess: undefined,
};

const renderComponent = (context: Record<string, unknown> = {}, uiProps: Record<string, unknown> = {}) => {
  (useChannelListContext as Mock).mockReturnValue({ ...defaultContext, ...context });
  return render(
    <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
      <ChannelListUI {...uiProps} />
    </LocalizationContext.Provider>,
  );
};

describe('ChannelListUI (legacy) — render-prop propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invokes a custom renderChannelPreview for each channel with the channel item', () => {
    const channels = [{ url: 'url-1' }, { url: 'url-2' }];
    const renderChannelPreview = vi.fn(() => <div data-testid="custom-preview" />);

    renderComponent({ allChannels: channels, initialized: true }, { renderChannelPreview });

    expect(renderChannelPreview).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[0] }));
    expect(renderChannelPreview).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[1] }));
  });

  it('invokes a custom renderHeader', () => {
    const renderHeader = vi.fn(() => <div data-testid="custom-header" />);

    const { getByTestId } = renderComponent({ initialized: true }, { renderHeader });

    expect(renderHeader).toHaveBeenCalled();
    // the custom header actually renders in place of the default
    expect(getByTestId('custom-header')).toBeInTheDocument();
  });
});
