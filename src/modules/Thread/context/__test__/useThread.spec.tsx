import { renderHook } from '@testing-library/react-hooks';
import useThread from '../useThread';

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
};

const mockNewMessage = {
  messageId: 42,
  message: 'new message',
};

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    stores: {
      sdkStore: {
        sdk: {
          groupChannel: {
            getChannel: mockGetChannel,
          },
        },
        initialized: true,
      },
      userStore: { user: { userId: 'test-user-id' } },
    },
    config: {
      logger: console,
      pubSub: {
        publish: jest.fn(),
      },
      groupChannel: {
        enableMention: true,
        enableReactions: true,
      },
    },
  })),
}));

describe('useThread', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if used outside of ThreadProvider', () => {
    const { result } = renderHook(() => useThread());
    expect(result.error).toEqual(new Error('useThread must be used within a ThreadProvider'));
  });
});
