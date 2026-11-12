import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import { GroupChannelProvider } from '../GroupChannelProvider';
import { useGroupChannel } from '../hooks/useGroupChannel';

vi.mock('@sendbird/uikit-tools', async () => ({
  ...(await vi.importActual('@sendbird/uikit-tools')),
  useGroupChannelMessages: vi.fn(),
}));

const mockChannel = {
  url: 'test-channel',
  members: [],
  serialize: () => JSON.stringify({ url: 'test-channel' }),
};
const mockSdk = {
  groupChannel: {
    getChannel: vi.fn().mockResolvedValue(mockChannel),
    addGroupChannelHandler: vi.fn(),
    removeGroupChannelHandler: vi.fn(),
  },
};
const mockState = {
  stores: { sdkStore: { sdk: mockSdk, initialized: true } },
  config: {
    logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
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

const message = { messageId: 1, createdAt: 1, serialize: () => 'message-1' };
let hasPreviousValue = true;
const hasPrevious = () => hasPreviousValue;
const dataSourceWith = (messages: unknown[]) => ({
  initialized: true,
  loading: false,
  refreshing: false,
  messages,
  newMessages: [],
  hasNext: () => false,
  hasPrevious,
  loadPrevious: vi.fn(),
  loadNext: vi.fn(),
  resetNewMessages: vi.fn(),
  resetWithStartingPoint: vi.fn(),
});

describe('GroupChannelProvider message data source sync (CLNP-9056)', () => {
  beforeEach(() => {
    hasPreviousValue = true;
  });

  it('hands the latest messages to the channel state when only hasPrevious changes', async () => {
    const fromCache = [message];
    vi.mocked(useGroupChannelMessages).mockReturnValue(dataSourceWith(fromCache) as any);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GroupChannelProvider channelUrl="test-channel">{children}</GroupChannelProvider>
    );
    const { result, rerender } = renderHook(() => useGroupChannel(), { wrapper });
    await waitFor(() => expect(result.current.state.messages).toBe(fromCache));

    const fromServer = [message];
    hasPreviousValue = false;
    vi.mocked(useGroupChannelMessages).mockReturnValue(dataSourceWith(fromServer) as any);
    rerender();

    await waitFor(() => expect(result.current.state.messages).toBe(fromServer));
  });

  it('keeps the channel state as it is when neither the messages nor hasPrevious change', async () => {
    const fromCache = [message];
    vi.mocked(useGroupChannelMessages).mockReturnValue(dataSourceWith(fromCache) as any);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GroupChannelProvider channelUrl="test-channel">{children}</GroupChannelProvider>
    );
    const { result, rerender } = renderHook(() => useGroupChannel(), { wrapper });
    await waitFor(() => expect(result.current.state.messages).toBe(fromCache));

    vi.mocked(useGroupChannelMessages).mockReturnValue(dataSourceWith([message]) as any);
    rerender();

    expect(result.current.state.messages).toBe(fromCache);
  });
});
