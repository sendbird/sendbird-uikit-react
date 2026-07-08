import React from 'react';
import { waitFor, act, renderHook } from '@testing-library/react';
import { GroupChannelProvider, useGroupChannelContext } from '../GroupChannelProvider';
import { useGroupChannel } from '../hooks/useGroupChannel';

const mockLogger = { warning: vi.fn() };
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  serialize: () => JSON.stringify({}),
};

const mockGetChannel = vi.fn().mockResolvedValue(mockChannel);
const mockMessageCollection = {
  dispose: vi.fn(),
  setMessageCollectionHandler: vi.fn(),
  initialize: vi.fn().mockResolvedValue(null),
  loadPrevious: vi.fn(),
  loadNext: vi.fn(),
  messages: [],
};
// Stable references so `sdkStore.sdk` (an effect dependency) does not change identity on every
// render — otherwise the channel-init effect would refetch in a loop.
const mockSdk = {
  groupChannel: {
    getChannel: mockGetChannel,
    addGroupChannelHandler: vi.fn(),
    removeGroupChannelHandler: vi.fn(),
  },
  createMessageCollection: vi.fn().mockReturnValue(mockMessageCollection),
};
const mockState = {
  stores: { sdkStore: { sdk: mockSdk, initialized: true } },
  config: {
    logger: mockLogger,
    markAsReadScheduler: { push: vi.fn() },
    groupChannel: { replyType: 'NONE', threadReplySelectType: 'PARENT' },
    groupChannelSettings: { enableMessageSearch: true },
    isOnline: true,
    pubSub: { subscribe: () => ({ remove: vi.fn() }) },
  },
};
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

describe('GroupChannelProvider', () => {
  it('provides the correct initial state', () => {
    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="test-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannelContext(), { wrapper });

    expect(result.current.channelUrl).toBe('test-channel');
    expect(result.current.currentChannel).toBe(null);
    expect(result.current.isScrollBottomReached).toBe(true);
  });

  it('updates state correctly when channel is fetched', async () => {
    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="test-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannel(), { wrapper });

    act(() => {
      waitFor(() => {
        expect(result.current.state.currentChannel).toBeTruthy();
        expect(result.current.state.currentChannel?.url).toBe('test-channel');
      });
    });
  });

  it('handles channel error correctly', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Channel fetch failed');
    mockGetChannel.mockRejectedValueOnce(mockError);

    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="error-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannel(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.currentChannel).toBeNull();
      expect(result.current.state.fetchChannelError).toBe(mockError);
    });
  });

  it('correctly handles scroll to bottom', async () => {
    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="test-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannel(), { wrapper });

    act(() => {
      result.current.actions.scrollToBottom();
      waitFor(() => {
        expect(result.current.state.isScrollBottomReached).toBe(true);
      });
    });
  });
});
