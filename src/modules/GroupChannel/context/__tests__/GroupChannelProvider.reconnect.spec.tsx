import React from 'react';
import { waitFor, renderHook, act } from '@testing-library/react';
import { GroupChannelProvider } from '../GroupChannelProvider';
import { useGroupChannel } from '../hooks/useGroupChannel';

// Regression coverage for the reconnect-retry fix: a getChannel() that fails during a disconnect
// must be retried (and recover currentChannel) once the SDK reconnects (config.isOnline flips
// false -> true), while an already-loaded channel must not be refetched on reconnect.

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  serialize: () => '{}',
};
const mockGetChannel = jest.fn();
const mockMessageCollection = {
  dispose: jest.fn(),
  setMessageCollectionHandler: jest.fn(),
  initialize: jest.fn().mockResolvedValue(null),
  loadPrevious: jest.fn(),
  loadNext: jest.fn(),
  messages: [],
};
// Stable references so the ONLY effect dependency that changes across rerenders is config.isOnline.
// (A fresh sdk/config object per render would change the `sdkStore.sdk` dep and cause spurious refetches.)
const mockConfig = {
  logger: { warning: jest.fn(), error: jest.fn(), info: jest.fn() },
  markAsReadScheduler: { push: jest.fn() },
  groupChannel: { replyType: 'NONE', threadReplySelectType: 'PARENT' },
  groupChannelSettings: { enableMessageSearch: true },
  isOnline: true,
  pubSub: { subscribe: () => ({ remove: jest.fn() }) },
};
const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        groupChannel: {
          getChannel: mockGetChannel,
          addGroupChannelHandler: jest.fn(),
          removeGroupChannelHandler: jest.fn(),
        },
        createMessageCollection: jest.fn().mockReturnValue(mockMessageCollection),
      },
      initialized: true,
    },
  },
  config: mockConfig,
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GroupChannelProvider channelUrl="test-channel">{children}</GroupChannelProvider>
);

describe('GroupChannelProvider reconnect retry', () => {
  beforeEach(() => {
    mockConfig.isOnline = true;
    mockGetChannel.mockReset();
  });

  it('retries getChannel and recovers currentChannel when the connection is restored after a failed fetch', async () => {
    // First fetch fails (as during an unstable disconnect); later fetches succeed.
    mockConfig.isOnline = false;
    mockGetChannel.mockRejectedValueOnce(new Error('connection lost')).mockResolvedValue(mockChannel);

    const { result, rerender } = renderHook(() => useGroupChannel(), { wrapper });

    // The failing fetch leaves currentChannel null with a fetchChannelError set.
    await waitFor(() => {
      expect(mockGetChannel).toHaveBeenCalledTimes(1);
      expect(result.current.state.currentChannel).toBeNull();
      expect(result.current.state.fetchChannelError).not.toBeNull();
    });

    // Reconnect: isOnline false -> true re-runs the effect and retries getChannel.
    mockConfig.isOnline = true;
    rerender();

    await waitFor(() => {
      expect(result.current.state.currentChannel?.url).toBe('test-channel');
      expect(result.current.state.fetchChannelError).toBeNull();
    });
    expect(mockGetChannel).toHaveBeenCalledTimes(2);
  });

  it('does not refetch an already-loaded channel across a disconnect/reconnect cycle', async () => {
    mockGetChannel.mockResolvedValue(mockChannel);

    const { result, rerender } = renderHook(() => useGroupChannel(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.currentChannel?.url).toBe('test-channel');
    });
    expect(mockGetChannel).toHaveBeenCalledTimes(1);

    // Disconnect then reconnect while the channel is healthy: no refetch expected.
    mockConfig.isOnline = false;
    rerender();
    mockConfig.isOnline = true;
    rerender();

    await waitFor(() => {
      expect(result.current.state.currentChannel?.url).toBe('test-channel');
    });
    expect(mockGetChannel).toHaveBeenCalledTimes(1);
  });

  it('ignores a stale getChannel rejection that arrives after a newer fetch has succeeded', async () => {
    // The first fetch stays pending; it is rejected manually only AFTER a newer fetch succeeds.
    let rejectFirst!: (reason: Error) => void;
    const firstPending = new Promise((_resolve, reject) => { rejectFirst = reject; });
    mockGetChannel.mockImplementationOnce(() => firstPending).mockResolvedValue(mockChannel);
    mockConfig.isOnline = false;

    const { result, rerender } = renderHook(() => useGroupChannel(), { wrapper });

    // First fetch is in flight (unresolved) so the channel is not set yet.
    await waitFor(() => expect(mockGetChannel).toHaveBeenCalledTimes(1));
    expect(result.current.state.currentChannel).toBeNull();

    // Reconnect: a newer fetch resolves and sets currentChannel.
    mockConfig.isOnline = true;
    rerender();
    await waitFor(() => {
      expect(result.current.state.currentChannel?.url).toBe('test-channel');
    });
    expect(mockGetChannel).toHaveBeenCalledTimes(2);

    // Now the stale first fetch rejects late: the request-id guard must ignore it (no clobber).
    await act(async () => {
      rejectFirst(new Error('stale rejection'));
      await new Promise((r) => { setTimeout(r, 0); });
    });

    expect(result.current.state.currentChannel?.url).toBe('test-channel');
    expect(result.current.state.fetchChannelError).toBeNull();
  });
});
