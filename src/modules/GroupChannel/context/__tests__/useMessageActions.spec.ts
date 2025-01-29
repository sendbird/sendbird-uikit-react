import { renderHook } from '@testing-library/react';
import { useMessageActions } from '../hooks/useMessageActions';
import { UserMessageCreateParams, FileMessageCreateParams } from '@sendbird/chat/message';

const mockEventHandlers = {
  message: {
    onSendMessageFailed: jest.fn(),
    onUpdateMessageFailed: jest.fn(),
    onFileUploadFailed: jest.fn(),
  },
};

jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: () => ({
    eventHandlers: mockEventHandlers,
  }),
}));

describe('useMessageActions', () => {
  const mockParams = {
    sendUserMessage: jest.fn(),
    sendFileMessage: jest.fn(),
    sendMultipleFilesMessage: jest.fn(),
    updateUserMessage: jest.fn(),
    scrollToBottom: jest.fn(),
    replyType: 'NONE',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processParams', () => {
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
