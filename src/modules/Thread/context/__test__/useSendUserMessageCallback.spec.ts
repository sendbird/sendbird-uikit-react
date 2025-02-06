import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage, SendingStatus } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';
import useSendUserMessageCallback from '../hooks/useSendUserMessageCallback';
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

describe('useSendUserMessageCallback', () => {
  const mockMessage = 'Hello, world!';
  const mockQuoteMessage = {
    messageId: 12345,
  } as unknown as SendableMessageType;
  const mockMentionedUsers = [{ userId: 'user1' }] as User[];
  const mockMentionTemplate = '@{user1}';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not send message when currentChannel is null', async () => {
    const { result } = renderHook(() => useSendUserMessageCallback(
      {
        isMentionEnabled: false,
        currentChannel: null,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current({ message: mockMessage });
    expect(mockSendMessageStart).not.toHaveBeenCalled();
  });

  it('should send message successfully', async () => {
    const mockSuccessMessage = {
      messageId: 67890,
      message: mockMessage,
    } as UserMessage;

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
      sendUserMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendUserMessageCallback(
      {
        isMentionEnabled: false,
        currentChannel: mockChannel,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current({ message: mockMessage });

    expect(mockChannel.sendUserMessage).toHaveBeenCalledWith({
      message: mockMessage,
    });
    expect(mockSendMessageStart).toHaveBeenCalledWith(mockPendingMessage);
    expect(mockPubSub.publish).toHaveBeenCalled();
  });

  it('should handle message sending failure', async () => {
    const mockError = new Error('Failed to send message');
    const mockPendingMessage = {
      messageId: 67890,
      sendingStatus: SendingStatus.PENDING,
    } as UserMessage;

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
      sendUserMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendUserMessageCallback(
      {
        isMentionEnabled: false,
        currentChannel: mockChannel,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current({ message: mockMessage });

    expect(mockSendMessageFailure).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useSendUserMessageCallback: Sending user message failed.',
      expect.any(Object),
    );
  });

  it('should handle mentions when mention is enabled', () => {
    const createMockPromise = () => ({
      onPending: jest.fn().mockReturnThis(),
      onSucceeded: jest.fn().mockReturnThis(),
      onFailed: jest.fn().mockReturnThis(),
    });

    const mockChannel = {
      sendUserMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendUserMessageCallback(
      {
        isMentionEnabled: true,
        currentChannel: mockChannel,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current({
      message: mockMessage,
      mentionedUsers: mockMentionedUsers,
      mentionTemplate: mockMentionTemplate,
    });

    expect(mockChannel.sendUserMessage).toHaveBeenCalledWith({
      message: mockMessage,
      mentionedUsers: mockMentionedUsers,
      mentionedMessageTemplate: mockMentionTemplate,
    });
  });

  it('should use onBeforeSendUserMessage callback when provided', () => {
    const mockCustomParams = {
      message: mockMessage,
      customField: 'test',
    };
    const mockOnBeforeSendUserMessage = jest.fn().mockReturnValue(mockCustomParams);

    const createMockPromise = () => ({
      onPending: jest.fn().mockReturnThis(),
      onSucceeded: jest.fn().mockReturnThis(),
      onFailed: jest.fn().mockReturnThis(),
    });

    const mockChannel = {
      sendUserMessage: jest.fn().mockReturnValue(createMockPromise()),
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useSendUserMessageCallback(
      {
        isMentionEnabled: false,
        currentChannel: mockChannel,
        onBeforeSendUserMessage: mockOnBeforeSendUserMessage,
        sendMessageStart: mockSendMessageStart,
        sendMessageFailure: mockSendMessageFailure,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));

    result.current({ message: mockMessage, quoteMessage: mockQuoteMessage });

    expect(mockOnBeforeSendUserMessage).toHaveBeenCalledWith(mockMessage, mockQuoteMessage);
    expect(mockChannel.sendUserMessage).toHaveBeenCalledWith(mockCustomParams);
  });
});
