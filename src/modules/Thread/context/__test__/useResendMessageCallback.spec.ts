import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, UserMessage, MessageType, SendingStatus, MultipleFilesMessage } from '@sendbird/chat/message';
import useResendMessageCallback from '../hooks/useResendMessageCallback';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';

const mockSetEmojiContainer = jest.fn();

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      setEmojiContainer: mockSetEmojiContainer,
    },
  }),
}));

const mockPubSub = {
  publish: jest.fn(),
} as unknown as SBUGlobalPubSub;

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const mockResendMessageStart = jest.fn();
const mockSendMessageSuccess = jest.fn();
const mockSendMessageFailure = jest.fn();

describe('useResendMessageCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not resend when message is not resendable', () => {
    const mockMessage = {
      isResendable: false,
    } as unknown as SendableMessageType;

    const { result } = renderHook(() => useResendMessageCallback(
      {
        currentChannel: {} as GroupChannel,
        resendMessageStart: mockResendMessageStart,
        sendMessageSuccess: mockSendMessageSuccess,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockMessage);
    expect(mockResendMessageStart).not.toHaveBeenCalled();
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useResendMessageCallback: Message is not resendable.',
      mockMessage,
    );
  });

  it('should resend user message successfully', async () => {
    const mockUserMessage = {
      isResendable: true,
      messageType: MessageType.USER,
      isUserMessage: () => true,
    } as UserMessage;

    const createMockPromise = () => {
      const chainMethods = {
        onPending: jest.fn(),
        onSucceeded: jest.fn(),
        onFailed: jest.fn(),
      };

      chainMethods.onPending.mockImplementation((cb) => {
        cb(mockUserMessage);
        return chainMethods;
      });

      chainMethods.onSucceeded.mockImplementation((cb) => {
        cb(mockUserMessage);
        return chainMethods;
      });

      chainMethods.onFailed.mockImplementation(() => {
        return chainMethods;
      });

      return chainMethods;
    };

    const mockChannel = {
      resendMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useResendMessageCallback(
      {
        currentChannel: mockChannel,
        resendMessageStart: mockResendMessageStart,
        sendMessageSuccess: mockSendMessageSuccess,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockUserMessage);

    expect(mockChannel.resendMessage).toHaveBeenCalledWith(mockUserMessage);
    expect(mockResendMessageStart).toHaveBeenCalledWith(mockUserMessage);
    expect(mockSendMessageSuccess).toHaveBeenCalledWith(mockUserMessage);
    expect(mockPubSub.publish).toHaveBeenCalled();
  });

  it('should handle user message resend failure', () => {
    const mockError = new Error('Failed to resend message');
    const mockUserMessage = {
      isResendable: true,
      messageType: MessageType.USER,
      isUserMessage: () => true,
      sendingStatus: SendingStatus.FAILED,
    } as UserMessage;

    const createMockPromise = () => {
      const chainMethods = {
        onPending: jest.fn(),
        onSucceeded: jest.fn(),
        onFailed: jest.fn(),
      };

      chainMethods.onPending.mockImplementation((cb) => {
        cb(mockUserMessage);
        return chainMethods;
      });

      chainMethods.onFailed.mockImplementation((cb) => {
        cb(mockError);
        return chainMethods;
      });

      return chainMethods;
    };

    const mockChannel = {
      resendMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useResendMessageCallback(
      {
        currentChannel: mockChannel,
        resendMessageStart: mockResendMessageStart,
        sendMessageSuccess: mockSendMessageSuccess,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockUserMessage);

    expect(mockSendMessageFailure).toHaveBeenCalledWith(mockUserMessage);
    expect(mockLogger.warning).toHaveBeenCalled();
  });

  it('should resend file message successfully', () => {
    const mockFileMessage = {
      isResendable: true,
      isFileMessage: () => true,
    } as FileMessage;

    const createMockPromise = () => {
      const chainMethods = {
        onPending: jest.fn(),
        onSucceeded: jest.fn(),
        onFailed: jest.fn(),
      };

      chainMethods.onPending.mockImplementation((cb) => {
        cb(mockFileMessage);
        return chainMethods;
      });

      chainMethods.onSucceeded.mockImplementation((cb) => {
        cb(mockFileMessage);
        return chainMethods;
      });

      return chainMethods;
    };

    const mockChannel = {
      resendMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useResendMessageCallback(
      {
        currentChannel: mockChannel,
        resendMessageStart: mockResendMessageStart,
        sendMessageSuccess: mockSendMessageSuccess,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockFileMessage);

    expect(mockResendMessageStart).toHaveBeenCalledWith(mockFileMessage);
    expect(mockSendMessageSuccess).toHaveBeenCalledWith(mockFileMessage);
    expect(mockPubSub.publish).toHaveBeenCalled();
  });

  it('should resend multiple files message successfully', () => {
    const mockMultipleFilesMessage = {
      isResendable: true,
      isMultipleFilesMessage: () => true,
    } as MultipleFilesMessage;

    const createMockPromise = () => {
      const chainMethods = {
        onPending: jest.fn(),
        onSucceeded: jest.fn(),
        onFailed: jest.fn(),
        onFileUploaded: jest.fn(),
      };

      chainMethods.onPending.mockImplementation((cb) => {
        cb(mockMultipleFilesMessage);
        return chainMethods;
      });

      chainMethods.onSucceeded.mockImplementation((cb) => {
        cb(mockMultipleFilesMessage);
        return chainMethods;
      });

      chainMethods.onFileUploaded.mockImplementation((cb) => {
        cb('requestId', 0, { url: 'test-url' }, null);
        return chainMethods;
      });

      return chainMethods;
    };

    const mockChannel = {
      resendMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useResendMessageCallback(
      {
        currentChannel: mockChannel,
        resendMessageStart: mockResendMessageStart,
        sendMessageSuccess: mockSendMessageSuccess,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockMultipleFilesMessage);

    expect(mockResendMessageStart).toHaveBeenCalledWith(mockMultipleFilesMessage);
    expect(mockSendMessageSuccess).toHaveBeenCalledWith(mockMultipleFilesMessage);
    expect(mockPubSub.publish).toHaveBeenCalledTimes(2); // onFileUploaded and onSucceeded
  });
});
