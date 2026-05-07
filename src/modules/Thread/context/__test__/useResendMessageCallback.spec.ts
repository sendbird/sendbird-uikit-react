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

  const renderWith = (channel: any) => renderHook(() => useResendMessageCallback(
    {
      currentChannel: channel as GroupChannel,
      resendMessageStart: mockResendMessageStart,
      sendMessageSuccess: mockSendMessageSuccess,
      sendMessageFailure: mockSendMessageFailure,
    },
    { logger: mockLogger, pubSub: mockPubSub },
  ));

  it('handles synchronous throw when resending a user message', () => {
    const userMsg = {
      isResendable: true,
      messageType: MessageType.USER,
      isUserMessage: () => true,
    } as UserMessage;
    const channel = {
      resendMessage: jest.fn(() => { throw new Error('boom'); }),
    };
    renderWith(channel).result.current(userMsg);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(userMsg);
    expect(userMsg.sendingStatus).toBe(SendingStatus.FAILED);
  });

  it('handles file message resend failure via onFailed callback', () => {
    const fileMsg = {
      isResendable: true,
      isFileMessage: () => true,
    } as FileMessage;
    const chain = {
      onPending: jest.fn().mockImplementation(function (this: any) { return this; }),
      onSucceeded: jest.fn().mockImplementation(function (this: any) { return this; }),
      onFailed: jest.fn().mockImplementation(function (this: any, cb: (e: Error) => void) {
        cb(new Error('upload failed'));
        return this;
      }),
    };
    const channel = { resendMessage: jest.fn(() => chain) };
    renderWith(channel).result.current(fileMsg);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(fileMsg);
    expect(fileMsg.sendingStatus).toBe(SendingStatus.FAILED);
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useResendMessageCallback: Resending file message failed.',
      expect.any(Error),
    );
  });

  it('handles synchronous throw when resending a file message', () => {
    const fileMsg = {
      isResendable: true,
      isFileMessage: () => true,
    } as FileMessage;
    const channel = { resendMessage: jest.fn(() => { throw new Error('boom'); }) };
    renderWith(channel).result.current(fileMsg);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(fileMsg);
    expect(fileMsg.sendingStatus).toBe(SendingStatus.FAILED);
  });

  it('handles MFM resend failure via onFailed callback', () => {
    const mfm = {
      isResendable: true,
      isMultipleFilesMessage: () => true,
    } as MultipleFilesMessage;
    const failedMessage = { ...mfm } as MultipleFilesMessage;
    const chain: any = {
      onPending: jest.fn().mockImplementation(function (this: any) { return this; }),
      onFileUploaded: jest.fn().mockImplementation(function (this: any) { return this; }),
      onSucceeded: jest.fn().mockImplementation(function (this: any) { return this; }),
      onFailed: jest.fn().mockImplementation(function (this: any, cb: (e: Error, m: MultipleFilesMessage) => void) {
        cb(new Error('mfm upload failed'), failedMessage);
        return this;
      }),
    };
    const channel = { url: 'channel-url', resendMessage: jest.fn(() => chain) };
    renderWith(channel).result.current(mfm);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(failedMessage);
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useResendMessageCallback: Resending MFM failed.',
      expect.any(Error),
    );
  });

  it('handles synchronous throw when resending a MFM', () => {
    const mfm = {
      isResendable: true,
      isMultipleFilesMessage: () => true,
    } as MultipleFilesMessage;
    const channel = { url: 'c', resendMessage: jest.fn(() => { throw new Error('boom'); }) };
    renderWith(channel).result.current(mfm);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(mfm);
  });

  it('falls into the unsupported message branch when none of isUser/isFile/isMFM match', () => {
    const weirdMsg = {
      isResendable: true,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isMultipleFilesMessage: () => false,
    } as unknown as SendableMessageType;
    renderWith({}).result.current(weirdMsg);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(weirdMsg);
    expect(weirdMsg.sendingStatus).toBe(SendingStatus.FAILED);
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useResendMessageCallback: Message is not resendable.',
      weirdMsg,
    );
  });

  it('handles user message resend failure via the onFailed callback (proper chain)', () => {
    const userMsg = {
      isResendable: true,
      messageType: MessageType.USER,
      isUserMessage: () => true,
    } as UserMessage;
    const chain: any = {
      onPending: jest.fn().mockImplementation(function (this: any) { return this; }),
      onSucceeded: jest.fn().mockImplementation(function (this: any) { return this; }),
      onFailed: jest.fn().mockImplementation(function (this: any, cb: (e: Error) => void) {
        cb(new Error('user-fail'));
        return this;
      }),
    };
    const channel = { resendMessage: jest.fn(() => chain) };
    renderWith(channel).result.current(userMsg);
    expect(userMsg.sendingStatus).toBe(SendingStatus.FAILED);
    expect(mockSendMessageFailure).toHaveBeenCalledWith(userMsg);
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useResendMessageCallback: Resending user message failed.',
      expect.any(Error),
    );
  });

  it('treats a pending user message (messageType USER, no isUserMessage method) as user-resend', () => {
    const userMsg = {
      isResendable: true,
      messageType: MessageType.USER,
    } as unknown as UserMessage;
    const chain: any = {
      onPending: jest.fn().mockImplementation(function (this: any) { return this; }),
      onSucceeded: jest.fn().mockImplementation(function (this: any, cb: (m: UserMessage) => void) {
        cb(userMsg); return this;
      }),
      onFailed: jest.fn().mockImplementation(function (this: any) { return this; }),
    };
    const channel = { resendMessage: jest.fn(() => chain) };
    renderWith(channel).result.current(userMsg);
    expect(channel.resendMessage).toHaveBeenCalledWith(userMsg);
    expect(mockSendMessageSuccess).toHaveBeenCalledWith(userMsg);
  });
});
