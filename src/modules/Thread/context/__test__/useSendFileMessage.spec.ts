import { act, renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, SendingStatus } from '@sendbird/chat/message';
import useSendFileMessage from '../hooks/useSendFileMessage';
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

const mockSendMessageStart = jest.fn();
const mockSendMessageFailure = jest.fn();

describe('useSendFileMessage', () => {
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const mockQuoteMessage = {
    messageId: 12345,
  } as unknown as SendableMessageType;

  beforeEach(() => {
    jest.clearAllMocks();
    // URL.createObjectURL mock
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  it('doesnt send file message when currentChannel is null', async () => {
    const { result } = renderHook(() => useSendFileMessage(
      {
        currentChannel: null,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));
    await act(async () => {
      await result.current(mockFile);
      expect(mockSendMessageStart).not.toHaveBeenCalled();
    });
  });

  it('sends file message successfully', async () => {
    const mockSuccessMessage = {
      messageId: 67890,
      isUserMessage: false,
      isFileMessage: true,
      isAdminMessage: false,
      isMultipleFilesMessage: false,
    } as unknown as FileMessage;

    const mockPendingMessage = {
      ...mockSuccessMessage,
      sendingStatus: SendingStatus.PENDING,
    };

    // 체이닝 구조 개선
    const createMockPromise = () => {
      const chainMethods = {
        onPending: jest.fn(),
        onSucceeded: jest.fn(),
        onFailed: jest.fn(),
      };

      chainMethods.onPending.mockImplementation((cb) => {
        cb(mockPendingMessage);
        return chainMethods;
      });

      chainMethods.onSucceeded.mockImplementation((cb) => {
        cb(mockSuccessMessage);
        return chainMethods;
      });

      chainMethods.onFailed.mockImplementation(() => {
        return chainMethods;
      });

      return chainMethods;
    };

    const mockChannel = {
      sendFileMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendFileMessage(
      {
        currentChannel: mockChannel,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    const response = await result.current(mockFile, mockQuoteMessage);

    expect(mockChannel.sendFileMessage).toHaveBeenCalledWith({
      file: mockFile,
      isReplyToChannel: true,
      parentMessageId: mockQuoteMessage.messageId,
    });
    expect(mockSendMessageStart).toHaveBeenCalledWith({
      ...mockPendingMessage,
      url: 'mock-url',
    });
    expect(mockPubSub.publish).toHaveBeenCalled();
    expect(response).toBe(mockSuccessMessage);
  });

  it('handles error when sending file message fails', async () => {
    const mockError = new Error('Failed to send file message');
    const mockPendingMessage = {
      messageId: 67890,
      sendingStatus: SendingStatus.PENDING,
    } as FileMessage;

    const mockSendFileMessagePromise = {
      onPending: jest.fn(),
      onSucceeded: jest.fn(),
      onFailed: jest.fn(),
    };

    mockSendFileMessagePromise.onPending.mockImplementation((cb) => {
      cb(mockPendingMessage);
      return mockSendFileMessagePromise;
    });

    mockSendFileMessagePromise.onFailed.mockImplementation((cb) => {
      cb(mockError, mockPendingMessage);
      return mockSendFileMessagePromise;
    });

    const mockChannel = {
      sendFileMessage: jest.fn().mockReturnValue(mockSendFileMessagePromise),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendFileMessage(
      {
        currentChannel: mockChannel,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    await expect(result.current(mockFile)).rejects.toBe(mockError);
    expect(mockSendMessageFailure).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useSendFileMessageCallback: Sending file message failed.',
      expect.any(Object),
    );
  });

  it('uses onBeforeSendFileMessage callback', async () => {
    const mockCustomParams = {
      file: mockFile,
      customField: 'test',
    };
    const mockOnBeforeSendFileMessage = jest.fn().mockReturnValue(mockCustomParams);

    const mockSendFileMessagePromise = {
      onPending: jest.fn().mockReturnThis(),
      onSucceeded: jest.fn().mockReturnThis(),
      onFailed: jest.fn().mockReturnThis(),
    };

    const mockChannel = {
      sendFileMessage: jest.fn().mockReturnValue(mockSendFileMessagePromise),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendFileMessage(
      {
        currentChannel: mockChannel,
        onBeforeSendFileMessage: mockOnBeforeSendFileMessage,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockFile, mockQuoteMessage);

    expect(mockOnBeforeSendFileMessage).toHaveBeenCalledWith(mockFile, mockQuoteMessage);
    expect(mockChannel.sendFileMessage).toHaveBeenCalledWith(mockCustomParams);
  });
});
