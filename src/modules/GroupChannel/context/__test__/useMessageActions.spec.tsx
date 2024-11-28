import { renderHook } from '@testing-library/react-hooks';
import { useMessageActions } from '../hooks/useMessageActions';

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
});
