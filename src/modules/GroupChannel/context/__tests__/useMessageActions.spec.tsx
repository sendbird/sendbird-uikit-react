import { renderHook } from '@testing-library/react';
import { UserMessageCreateParams, FileMessageCreateParams } from '@sendbird/chat/message';

import { useMessageActions } from '../hooks/useMessageActions';

const mockEventHandlers = {
  message: {
    onSendMessageFailed: vi.fn(),
    onUpdateMessageFailed: vi.fn(),
    onFileUploadFailed: vi.fn(),
  },
};
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
};
const mockGetChannel = vi.fn().mockResolvedValue(mockChannel);
const mockMessageCollection = {
  dispose: vi.fn(),
  setMessageCollectionHandler: vi.fn(),
  initialize: vi.fn().mockResolvedValue(null),
  loadPrevious: vi.fn(),
  loadNext: vi.fn(),
};
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    state: {
      eventHandlers: mockEventHandlers,
      stores: {
        sdkStore: {
          sdk: {
            groupChannel: {
              getChannel: mockGetChannel,
              addGroupChannelHandler: vi.fn(),
              removeGroupChannelHandler: vi.fn(),
            },
            createMessageCollection: vi.fn().mockReturnValue(mockMessageCollection),
          },
          initialized: true,
        },
      },
      config: {
        markAsReadScheduler: {
          push: vi.fn(),
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
          subscribe: () => ({ remove: vi.fn() }),
          publish: vi.fn(),
        },
      },
    },
  })),
}));

describe('useMessageActions', () => {
  // Setup common mocks
  const mockSendUserMessage = vi.fn();
  const mockSendFileMessage = vi.fn();
  const mockSendMultipleFilesMessage = vi.fn();
  const mockUpdateUserMessage = vi.fn(async () => {});
  const mockScrollToBottom = vi.fn();

  // Default params for the hook
  const defaultParams = {
    sendUserMessage: mockSendUserMessage,
    sendFileMessage: mockSendFileMessage,
    sendMultipleFilesMessage: mockSendMultipleFilesMessage,
    updateUserMessage: mockUpdateUserMessage,
    scrollToBottom: mockScrollToBottom,
    quoteMessage: null,
    replyType: 'NONE',
    pubSub: {
      publish: vi.fn(),
    },
    channel: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
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
      const onBeforeSendUserMessage = vi.fn((params) => ({
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
      const onBeforeSendFileMessage = vi.fn((params) => ({
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
      const onBeforeUpdateUserMessage = vi.fn((params) => ({
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
      sendUserMessage: vi.fn(),
      sendFileMessage: vi.fn(),
      sendMultipleFilesMessage: vi.fn(),
      updateUserMessage: vi.fn(),
      scrollToBottom: vi.fn(),
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
      const onBeforeSendFileMessage = vi.fn();
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
      const onBeforeSendFileMessage = vi.fn().mockRejectedValue(error);
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
      const onBeforeUpdateUserMessage = vi.fn().mockRejectedValue(error);
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
      const onBeforeSendUserMessage = vi.fn().mockImplementation((params) => ({
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
