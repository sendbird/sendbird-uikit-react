import { renderHook } from '@testing-library/react';
import { BaseMessage } from '@sendbird/chat/message';
import { useThreadFetchers } from '../hooks/useThreadFetchers';
import { ThreadListStateTypes } from '../../types';
import { SendableMessageType } from '../../../../utils';

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({
    state: {
      stores: {
        sdkStore: {
          initialized: true,
        },
      },
    },
  }),
}));

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useThreadFetchers', () => {
  const mockParentMessage = {
    messageId: 12345,
    getThreadedMessagesByTimestamp: jest.fn(),
  } as unknown as SendableMessageType;

  const mockAnchorMessage = {
    messageId: 67890,
    createdAt: 1234567890,
  } as unknown as SendableMessageType;

  const mockThreadedMessages = [
    { messageId: 1 },
    { messageId: 2 },
  ] as BaseMessage[];

  const createMockCallbacks = () => ({
    initializeThreadListStart: jest.fn(),
    initializeThreadListSuccess: jest.fn(),
    initializeThreadListFailure: jest.fn(),
    getPrevMessagesStart: jest.fn(),
    getPrevMessagesSuccess: jest.fn(),
    getPrevMessagesFailure: jest.fn(),
    getNextMessagesStart: jest.fn(),
    getNextMessagesSuccess: jest.fn(),
    getNextMessagesFailure: jest.fn(),
  });

  const renderThreadFetchersHook = ({
    threadListState = ThreadListStateTypes.INITIALIZED,
    oldestMessageTimeStamp = 0,
    latestMessageTimeStamp = 0,
    callbacks = createMockCallbacks(),
  } = {}) => {
    return renderHook(() => useThreadFetchers({
      anchorMessage: mockAnchorMessage,
      parentMessage: mockParentMessage,
      isReactionEnabled: true,
      logger: mockLogger,
      threadListState,
      oldestMessageTimeStamp,
      latestMessageTimeStamp,
      ...callbacks,
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize thread list successfully', async () => {
    (mockParentMessage.getThreadedMessagesByTimestamp as jest.Mock).mockResolvedValue({
      threadedMessages: mockThreadedMessages,
      parentMessage: mockParentMessage,
    });

    const callbacks = createMockCallbacks();
    const { result } = renderThreadFetchersHook({ callbacks });

    await result.current.initializeThreadFetcher();

    expect(callbacks.initializeThreadListStart).toHaveBeenCalled();
    expect(callbacks.initializeThreadListSuccess).toHaveBeenCalledWith(
      mockParentMessage,
      mockAnchorMessage,
      mockThreadedMessages,
    );
  });

  it('should handle initialization failure', async () => {
    const mockError = new Error('Failed to initialize');
    (mockParentMessage.getThreadedMessagesByTimestamp as jest.Mock).mockRejectedValue(mockError);

    const callbacks = createMockCallbacks();
    const { result } = renderThreadFetchersHook({ callbacks });

    await result.current.initializeThreadFetcher();

    expect(callbacks.initializeThreadListStart).toHaveBeenCalled();
    expect(callbacks.initializeThreadListFailure).toHaveBeenCalled();
  });

  it('should fetch previous messages successfully', async () => {
    (mockParentMessage.getThreadedMessagesByTimestamp as jest.Mock).mockResolvedValue({
      threadedMessages: mockThreadedMessages,
      parentMessage: mockParentMessage,
    });

    const callbacks = createMockCallbacks();
    const { result } = renderThreadFetchersHook({
      oldestMessageTimeStamp: 1000,
      latestMessageTimeStamp: 2000,
      callbacks,
    });

    await result.current.fetchPrevThreads();

    expect(callbacks.getPrevMessagesStart).toHaveBeenCalled();
    expect(callbacks.getPrevMessagesSuccess).toHaveBeenCalledWith(mockThreadedMessages);
  });

  it('should fetch next messages successfully', async () => {
    (mockParentMessage.getThreadedMessagesByTimestamp as jest.Mock).mockResolvedValue({
      threadedMessages: mockThreadedMessages,
      parentMessage: mockParentMessage,
    });

    const callbacks = createMockCallbacks();
    const { result } = renderThreadFetchersHook({
      oldestMessageTimeStamp: 1000,
      latestMessageTimeStamp: 2000,
      callbacks,
    });

    await result.current.fetchNextThreads();

    expect(callbacks.getNextMessagesStart).toHaveBeenCalled();
    expect(callbacks.getNextMessagesSuccess).toHaveBeenCalledWith(mockThreadedMessages);
  });

  it('should not fetch when threadListState is not INITIALIZED', async () => {
    const callbacks = createMockCallbacks();
    const { result } = renderThreadFetchersHook({
      threadListState: ThreadListStateTypes.LOADING,
      oldestMessageTimeStamp: 1000,
      latestMessageTimeStamp: 2000,
      callbacks,
    });

    await result.current.fetchPrevThreads();
    await result.current.fetchNextThreads();

    expect(callbacks.getPrevMessagesStart).not.toHaveBeenCalled();
    expect(callbacks.getNextMessagesStart).not.toHaveBeenCalled();
  });
});
