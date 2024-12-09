import { renderHook } from '@testing-library/react-hooks';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, SendingStatus, MessageMetaArray } from '@sendbird/chat/message';
import useSendVoiceMessageCallback from '../hooks/useSendVoiceMessageCallback';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';

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

describe('useSendVoiceMessageCallback', () => {
  const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
  const mockDuration = 10;
  const mockQuoteMessage = {
    messageId: 12345,
  } as unknown as SendableMessageType;

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  it('should not send voice message when currentChannel is null', () => {
    const { result } = renderHook(() => useSendVoiceMessageCallback(
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

    result.current(mockFile, mockDuration, mockQuoteMessage);
    expect(mockSendMessageStart).not.toHaveBeenCalled();
  });

  it('should send voice message successfully', async () => {
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

    const { result } = renderHook(() => useSendVoiceMessageCallback(
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

    result.current(mockFile, mockDuration, mockQuoteMessage);

    expect(mockChannel.sendFileMessage).toHaveBeenCalledWith({
      file: mockFile,
      fileName: VOICE_MESSAGE_FILE_NAME,
      mimeType: VOICE_MESSAGE_MIME_TYPE,
      metaArrays: [
        new MessageMetaArray({
          key: META_ARRAY_VOICE_DURATION_KEY,
          value: [`${mockDuration}`],
        }),
        new MessageMetaArray({
          key: META_ARRAY_MESSAGE_TYPE_KEY,
          value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
        }),
      ],
      isReplyToChannel: true,
      parentMessageId: mockQuoteMessage.messageId,
    });
    expect(mockSendMessageStart).toHaveBeenCalledWith({
      ...mockPendingMessage,
      url: 'mock-url',
      sendingStatus: SendingStatus.PENDING,
    });
    expect(mockPubSub.publish).toHaveBeenCalled();
  });

  it('should handle voice message sending failure', async () => {
    const mockError = new Error('Failed to send voice message');
    const mockPendingMessage = {
      messageId: 67890,
      sendingStatus: SendingStatus.PENDING,
    } as FileMessage;

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

      chainMethods.onFailed.mockImplementation((cb) => {
        cb(mockError, mockPendingMessage);
        return chainMethods;
      });

      return chainMethods;
    };

    const mockChannel = {
      sendFileMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendVoiceMessageCallback(
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

    result.current(mockFile, mockDuration, mockQuoteMessage);

    expect(mockSendMessageFailure).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useSendVoiceMessageCallback: Sending voice message failed.',
      expect.any(Object),
    );
  });

  it('should use onBeforeSendVoiceMessage callback when provided', () => {
    const mockCustomParams = {
      file: mockFile,
      customField: 'test',
    };
    const mockOnBeforeSendVoiceMessage = jest.fn().mockReturnValue(mockCustomParams);

    const createMockPromise = () => ({
      onPending: jest.fn().mockReturnThis(),
      onSucceeded: jest.fn().mockReturnThis(),
      onFailed: jest.fn().mockReturnThis(),
    });

    const mockChannel = {
      sendFileMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendVoiceMessageCallback(
      {
        currentChannel: mockChannel,
        onBeforeSendVoiceMessage: mockOnBeforeSendVoiceMessage,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current(mockFile, mockDuration, mockQuoteMessage);

    expect(mockOnBeforeSendVoiceMessage).toHaveBeenCalledWith(mockFile, mockQuoteMessage);
    expect(mockChannel.sendFileMessage).toHaveBeenCalledWith(mockCustomParams);
  });
});
