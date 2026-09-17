import { vi } from 'vitest';

/**
 * Minimal `useSendbird()` return value for integration tests that mount a real GroupChannelProvider.
 *
 * Mirrors the connected-SDK shape the provider reads on mount: sdk.groupChannel.getChannel /
 * createMessageCollection, and config.logger / markAsReadScheduler / groupChannel / pubSub. Each call
 * returns fresh spies. Parameterize `replyType` for dashboard-config precedence tests.
 */
export function makeGroupChannelSendbirdState({ replyType = 'NONE' }: { replyType?: string } = {}) {
  const mockChannel = {
    url: 'test-channel',
    members: [{ userId: '1', nickname: 'user1' }],
    serialize: () => JSON.stringify({}),
  };
  const mockMessageCollection = {
    dispose: vi.fn(),
    setMessageCollectionHandler: vi.fn(),
    initialize: vi.fn().mockResolvedValue(null),
    loadPrevious: vi.fn(),
    loadNext: vi.fn(),
    messages: [],
  };
  return {
    state: {
      stores: {
        sdkStore: {
          sdk: {
            groupChannel: {
              getChannel: vi.fn().mockResolvedValue(mockChannel),
              addGroupChannelHandler: vi.fn(),
              removeGroupChannelHandler: vi.fn(),
            },
            createMessageCollection: vi.fn().mockReturnValue(mockMessageCollection),
          },
          initialized: true,
        },
      },
      config: {
        logger: { warning: vi.fn(), info: vi.fn(), error: vi.fn() },
        markAsReadScheduler: { push: vi.fn() },
        groupChannel: { replyType, threadReplySelectType: 'PARENT' },
        groupChannelSettings: { enableMessageSearch: true },
        isOnline: true,
        pubSub: { subscribe: () => ({ remove: vi.fn() }) },
      },
    },
  };
}
