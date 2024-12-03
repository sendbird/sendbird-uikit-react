import { renderHook } from '@testing-library/react-hooks';
import { UserMessageCreateParams, FileMessageCreateParams } from '@sendbird/chat/message';

import { useMessageActions } from '../hooks/useMessageActions';

const mockEventHandlers = {
  message: {
    onSendMessageFailed: jest.fn(),
    onUpdateMessageFailed: jest.fn(),
    onFileUploadFailed: jest.fn(),
  },
};
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
};
const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);
const mockMessageCollection = {
  dispose: jest.fn(),
  setMessageCollectionHandler: jest.fn(),
  initialize: jest.fn().mockResolvedValue(null),
  loadPrevious: jest.fn(),
  loadNext: jest.fn(),
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      eventHandlers: mockEventHandlers,
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
      config: {
        markAsReadScheduler: {
          push: jest.fn(),
        },
        groupChannel: {
          replyType: 'NONE',
          threadReplySelectType: 'PARENT',
        },
        groupChannelSettings: {
          enableMessageSearch: true,
        },
        isOnline: true,
        pubSub: {
          subscribe: () => ({ remove: jest.fn() }),
        },
      },
    },
  })),
}));

describe('useMessageActions', () => {
  // Setup common mocks
  const mockSendUserMessage = jest.fn();
  const mockSendFileMessage = jest.fn();
  const mockSendMultipleFilesMessage = jest.fn();
  const mockUpdateUserMessage = jest.fn();
  const mockScrollToBottom = jest.fn();

  // Default params for the hook
  const defaultParams = {
    sendUserMessage: mockSendUserMessage,
    sendFileMessage: mockSendFileMessage,
    sendMultipleFilesMessage: mockSendMultipleFilesMessage,
    updateUserMessage: mockUpdateUserMessage,
    scrollToBottom: mockScrollToBottom,
    quoteMessage: null,
    replyType: 'NONE',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendUserMessage', () => {
    it('sends basic message without quote', async () => {
      const { result } = renderHook(() => useMessageActions(defaultParams));
      const messageParams = { message: 'test message' };

      mockSendUserMessage.mockResolvedValueOnce({ messageId: 1, message: 'test message' });

      await result.current.sendUserMessage(messageParams);

      expect(mockSendUserMessage).toHaveBeenCalledWith(
        messageParams,
        expect.any(Function),
      );
    });

    it('includes parent message id when quote message exists', async () => {
      const paramsWithQuote = {
        ...defaultParams,
        quoteMessage: { messageId: 123, message: 'quoted message' },
        replyType: 'QUOTE_REPLY',
      };

      const { result } = renderHook(() => useMessageActions(paramsWithQuote));
      const messageParams = { message: 'test reply' };

      await result.current.sendUserMessage(messageParams);

      expect(mockSendUserMessage).toHaveBeenCalledWith(
        {
          ...messageParams,
          isReplyToChannel: true,
          parentMessageId: 123,
        },
        expect.any(Function),
      );
    });

    it('applies onBeforeSendUserMessage hook', async () => {
      const onBeforeSendUserMessage = jest.fn((params) => ({
        ...params,
        message: `Modified: ${params.message}`,
      }));

      const paramsWithHook = {
        ...defaultParams,
        onBeforeSendUserMessage,
      };

      const { result } = renderHook(() => useMessageActions(paramsWithHook));
      const messageParams = { message: 'test message' };

      await result.current.sendUserMessage(messageParams);

      expect(onBeforeSendUserMessage).toHaveBeenCalledWith(messageParams);
      expect(mockSendUserMessage).toHaveBeenCalledWith(
        {
          message: 'Modified: test message',
        },
        expect.any(Function),
      );
    });
  });

  describe('sendFileMessage', () => {
    it('sends basic file message', async () => {
      const { result } = renderHook(() => useMessageActions(defaultParams));
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const messageParams = { file };

      await result.current.sendFileMessage(messageParams);

      expect(mockSendFileMessage).toHaveBeenCalledWith(
        messageParams,
        expect.any(Function),
      );
    });

    it('applies onBeforeSendFileMessage hook', async () => {
      const onBeforeSendFileMessage = jest.fn((params) => ({
        ...params,
        fileName: 'modified.txt',
      }));

      const paramsWithHook = {
        ...defaultParams,
        onBeforeSendFileMessage,
      };

      const { result } = renderHook(() => useMessageActions(paramsWithHook));
      const messageParams = { file: new File(['test'], 'test.txt') };

      await result.current.sendFileMessage(messageParams);

      expect(onBeforeSendFileMessage).toHaveBeenCalledWith(messageParams);
      expect(mockSendFileMessage).toHaveBeenCalledWith(
        expect.objectContaining({ fileName: 'modified.txt' }),
        expect.any(Function),
      );
    });
  });

  describe('sendMultipleFilesMessage', () => {
    it('sends multiple files message', async () => {
      const { result } = renderHook(() => useMessageActions(defaultParams));
      const files = [
        new File(['test1'], 'test1.txt'),
        new File(['test2'], 'test2.txt'),
      ];
      const messageParams = { files };

      await result.current.sendMultipleFilesMessage(messageParams);

      expect(mockSendMultipleFilesMessage).toHaveBeenCalledWith(
        messageParams,
        expect.any(Function),
      );
    });
  });

  describe('updateUserMessage', () => {
    it('updates user message', async () => {
      const { result } = renderHook(() => useMessageActions(defaultParams));
      const messageId = 1;
      const updateParams = { message: 'updated message' };

      await result.current.updateUserMessage(messageId, updateParams);

      expect(mockUpdateUserMessage).toHaveBeenCalledWith(
        messageId,
        updateParams,
      );
    });

    it('applies onBeforeUpdateUserMessage hook', async () => {
      const onBeforeUpdateUserMessage = jest.fn((params) => ({
        ...params,
        message: `Modified: ${params.message}`,
      }));

      const paramsWithHook = {
        ...defaultParams,
        onBeforeUpdateUserMessage,
      };

      const { result } = renderHook(() => useMessageActions(paramsWithHook));
      const messageId = 1;
      const updateParams = { message: 'update test' };

      await result.current.updateUserMessage(messageId, updateParams);

      expect(onBeforeUpdateUserMessage).toHaveBeenCalledWith(updateParams);
      expect(mockUpdateUserMessage).toHaveBeenCalledWith(
        messageId,
        {
          message: 'Modified: update test',
        },
      );
    });
  });

  describe('processParams', () => {
    const mockParams = {
      sendUserMessage: jest.fn(),
      sendFileMessage: jest.fn(),
      sendMultipleFilesMessage: jest.fn(),
      updateUserMessage: jest.fn(),
      scrollToBottom: jest.fn(),
      replyType: 'NONE',
    };
    it('should handle successful user message', async () => {
      const { result } = renderHook(() => useMessageActions(mockParams));
      const params: UserMessageCreateParams = { message: 'test' };

      await result.current.sendUserMessage(params);

      expect(mockParams.sendUserMessage).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'test' }),
        expect.any(Function),
      );
    });

    it('should handle void return from onBeforeSendFileMessage', async () => {
      const onBeforeSendFileMessage = jest.fn();
      const { result } = renderHook(() => useMessageActions({
        ...mockParams,
        onBeforeSendFileMessage,
      }),
      );

      const fileParams: FileMessageCreateParams = {
        file: new File([], 'test.txt'),
      };

      await result.current.sendFileMessage(fileParams);

      expect(onBeforeSendFileMessage).toHaveBeenCalled();
      expect(mockParams.sendFileMessage).toHaveBeenCalledWith(
        expect.objectContaining(fileParams),
        expect.any(Function),
      );
    });

    it('should handle file upload error', async () => {
      // Arrange
      const error = new Error('Upload failed');
      const onBeforeSendFileMessage = jest.fn().mockRejectedValue(error);
      const fileParams: FileMessageCreateParams = {
        file: new File([], 'test.txt'),
        fileName: 'test.txt',
      };

      const { result } = renderHook(() => useMessageActions({
        ...mockParams,
        onBeforeSendFileMessage,
      }),
      );

      await expect(async () => {
        await result.current.sendFileMessage(fileParams);
      }).rejects.toThrow('Upload failed');

      // Wait for next tick to ensure all promises are resolved
      await new Promise(process.nextTick);

      expect(onBeforeSendFileMessage).toHaveBeenCalled();
      expect(mockEventHandlers.message.onFileUploadFailed).toHaveBeenCalledWith(error);
      expect(mockEventHandlers.message.onSendMessageFailed).toHaveBeenCalledWith(
        expect.objectContaining({
          file: fileParams.file,
          fileName: fileParams.fileName,
        }),
        error,
      );
    });

    it('should handle message update error', async () => {
      // Arrange
      const error = new Error('Update failed');
      const onBeforeUpdateUserMessage = jest.fn().mockRejectedValue(error);
      const messageParams = {
        messageId: 1,
        message: 'update message',
      };

      const { result } = renderHook(() => useMessageActions({
        ...mockParams,
        onBeforeUpdateUserMessage,
      }),
      );

      await expect(async () => {
        await result.current.updateUserMessage(messageParams.messageId, {
          message: messageParams.message,
        });
      }).rejects.toThrow('Update failed');

      // Wait for next tick to ensure all promises are resolved
      await new Promise(process.nextTick);

      expect(onBeforeUpdateUserMessage).toHaveBeenCalled();
      expect(mockEventHandlers.message.onUpdateMessageFailed).toHaveBeenCalledWith(
        expect.objectContaining({
          message: messageParams.message,
        }),
        error,
      );
    });

    it('should preserve modified params from onBefore handlers', async () => {
      const onBeforeSendUserMessage = jest.fn().mockImplementation((params) => ({
        ...params,
        message: 'modified',
      }));

      const { result } = renderHook(() => useMessageActions({
        ...mockParams,
        onBeforeSendUserMessage,
      }),
      );

      await result.current.sendUserMessage({ message: 'original' });

      expect(mockParams.sendUserMessage).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'modified' }),
        expect.any(Function),
      );
    });
  });
});
