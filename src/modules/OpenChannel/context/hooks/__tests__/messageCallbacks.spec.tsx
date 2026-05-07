import { act, renderHook } from '@testing-library/react';

import * as actionTypes from '../../dux/actionTypes';
import * as openChannelUtils from '../../utils';
import { compressImages } from '../../../../../utils/compressImages';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useGlobalModalContext } from '../../../../../hooks/useModal';
import useDeleteMessageCallback from '../useDeleteMessageCallback';
import useFileUploadCallback from '../useFileUploadCallback';
import useResendMessageCallback from '../useResendMessageCallback';
import useSendMessageCallback from '../useSendMessageCallback';

jest.mock('../../../../../utils/compressImages', () => ({
  compressImages: jest.fn(),
}));

jest.mock('../../../../../hooks/useModal', () => ({
  useGlobalModalContext: jest.fn(),
}));

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../../lib/LocalizationContext', () => ({
  useLocalization: () => ({
    stringSet: {
      FILE_UPLOAD_NOTIFICATION__SIZE_LIMIT: 'Max %dMB',
      BUTTON__OK: 'OK',
    },
  }),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const createChain = () => {
  const chain: any = {
    onPending: jest.fn((callback) => {
      callback({ messageId: 1, reqId: 'req-1', isUserMessage: () => true, isFileMessage: () => false });
      return chain;
    }),
    onSucceeded: jest.fn((callback) => {
      callback({ messageId: 2, reqId: 'req-2' });
      return chain;
    }),
    onFailed: jest.fn((callback) => {
      callback({ code: 900041, message: 'muted' }, { messageId: 3, reqId: 'req-3' });
      return chain;
    }),
  };
  return chain;
};

describe('OpenChannel message callback hooks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(openChannelUtils, 'scrollIntoLast').mockImplementation(jest.fn());
    URL.createObjectURL = jest.fn(() => 'blob:local');
    (compressImages as jest.Mock).mockResolvedValue({
      compressedFiles: [new File(['compressed'], 'compressed.png', { type: 'image/png' })],
      failedIndexes: [],
    });
    (useGlobalModalContext as jest.Mock).mockReturnValue({ openModal: jest.fn() });
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          uikitUploadSizeLimit: 1024,
        },
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('sends open-channel user messages and handles muted failures', () => {
    const chain = createChain();
    const channel = { sendUserMessage: jest.fn(() => chain) };
    const dispatcher = jest.fn();
    const messageInputRef = { current: { innerText: 'hello' } };
    const sdk = { currentUser: { userId: 'me' } };
    const { result } = renderHook(() => useSendMessageCallback(
      { currentOpenChannel: channel as any, messageInputRef: messageInputRef as any, checkScrollBottom: jest.fn() },
      { sdk: sdk as any, logger: logger as any, messagesDispatcher: dispatcher, scrollRef: { current: document.createElement('div') } },
    ));

    act(() => {
      result.current();
    });

    expect(channel.sendUserMessage).toHaveBeenCalledWith({ message: 'hello' });
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_START }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_SUCCEEDED }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_FAILED }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.ON_USER_MUTED }));

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(openChannelUtils.scrollIntoLast).toHaveBeenCalled();
  });

  it('uses custom open-channel send params when provided', () => {
    const channel = { sendUserMessage: jest.fn(() => createChain()) };
    const onBeforeSendUserMessage = jest.fn(() => ({ message: 'custom' }));
    const { result } = renderHook(() => useSendMessageCallback(
      {
        currentOpenChannel: channel as any,
        onBeforeSendUserMessage,
        messageInputRef: { current: { innerText: 'original' } } as any,
        checkScrollBottom: jest.fn(),
      },
      { sdk: {} as any, logger: logger as any, messagesDispatcher: jest.fn(), scrollRef: { current: null } },
    ));

    act(() => {
      result.current();
    });

    expect(onBeforeSendUserMessage).toHaveBeenCalledWith('original');
    expect(channel.sendUserMessage).toHaveBeenCalledWith({ message: 'custom' });
  });

  it('uploads compressed files and opens the size-limit modal for oversized files', async () => {
    const chain = createChain();
    const channel = { sendFileMessage: jest.fn(() => chain) };
    const dispatcher = jest.fn();
    const openModal = jest.fn();
    (useGlobalModalContext as jest.Mock).mockReturnValue({ openModal });
    const { result } = renderHook(() => useFileUploadCallback(
      { currentOpenChannel: channel as any, imageCompression: { compressionRate: 0.7 } },
      { sdk: {} as any, logger: logger as any, messagesDispatcher: dispatcher, scrollRef: { current: null } },
    ));

    await act(async () => {
      await result.current([new File(['file'], 'file.png', { type: 'image/png' })]);
    });

    expect(compressImages).toHaveBeenCalled();
    expect(channel.sendFileMessage).toHaveBeenCalledWith({ file: expect.any(File) });
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_START }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_SUCCEEDED }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_FAILED }));

    await act(async () => {
      await result.current(new File([new ArrayBuffer(2048)], 'large.png'));
    });

    expect(openModal).toHaveBeenCalledWith(expect.objectContaining({
      modalProps: expect.objectContaining({ titleText: 'Max 0MB' }),
    }));
  });

  it('uses custom file upload params when provided', async () => {
    const channel = { sendFileMessage: jest.fn(() => createChain()) };
    const onBeforeSendFileMessage = jest.fn(() => ({ fileUrl: 'custom' }));
    const { result } = renderHook(() => useFileUploadCallback(
      { currentOpenChannel: channel as any, onBeforeSendFileMessage },
      { sdk: {} as any, logger: logger as any, messagesDispatcher: jest.fn(), scrollRef: { current: null } },
    ));

    await act(async () => {
      await result.current(new File(['file'], 'file.png'));
    });

    expect(onBeforeSendFileMessage).toHaveBeenCalledWith(expect.any(File));
    expect(channel.sendFileMessage).toHaveBeenCalledWith({ fileUrl: 'custom' });
  });

  it('resends user and file messages and logs non-resendable messages', () => {
    const channel = { resendMessage: jest.fn(() => createChain()) };
    const dispatcher = jest.fn();
    const consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const { result } = renderHook(() => useResendMessageCallback(
      { currentOpenChannel: channel as any },
      { logger: logger as any, messagesDispatcher: dispatcher },
    ));

    act(() => {
      result.current({ isResendable: true, isUserMessage: () => true, isFileMessage: () => false } as any);
      result.current({ isResendable: true, isUserMessage: () => false, isFileMessage: () => true } as any);
      result.current({ isResendable: false } as any);
    });

    expect(channel.resendMessage).toHaveBeenCalledTimes(2);
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.RESENDING_MESSAGE_START }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_SUCCEEDED }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SENDING_MESSAGE_FAILED }));
    expect(consoleError).toHaveBeenCalled();
    expect(logger.warning).toHaveBeenCalledWith(
      'OpenChannel | useResendMessageCallback: Message is not resendable',
      { isResendable: false },
    );
  });

  it('deletes local failed messages and server-backed user/file messages', async () => {
    const channel = { deleteMessage: jest.fn().mockResolvedValue(undefined) };
    const dispatcher = jest.fn();
    const callback = jest.fn();
    const { result } = renderHook(() => useDeleteMessageCallback(
      { currentOpenChannel: channel as any },
      { logger: logger as any, messagesDispatcher: dispatcher },
    ));

    act(() => {
      result.current({ sendingStatus: 'failed', reqId: 'req-1' } as any, callback);
    });
    expect(dispatcher).toHaveBeenCalledWith({
      type: actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
      payload: 'req-1',
    });
    expect(callback).toHaveBeenCalled();

    await act(async () => {
      result.current({ sendingStatus: 'succeeded', messageType: 'user', messageId: 10 } as any, callback);
      await Promise.resolve();
    });

    expect(channel.deleteMessage).toHaveBeenCalledWith(expect.objectContaining({ messageId: 10 }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.ON_MESSAGE_DELETED }));

    act(() => {
      result.current({ sendingStatus: 'succeeded', messageType: 'admin', messageId: 11 } as any);
    });
    expect(channel.deleteMessage).toHaveBeenCalledTimes(1);
  });

  it('logs server delete failures', async () => {
    const error = new Error('delete failed');
    const channel = { deleteMessage: jest.fn().mockRejectedValue(error) };
    const { result } = renderHook(() => useDeleteMessageCallback(
      { currentOpenChannel: channel as any },
      { logger: logger as any, messagesDispatcher: jest.fn() },
    ));

    await act(async () => {
      result.current({ sendingStatus: 'succeeded', messageType: 'file', messageId: 10 } as any);
      await Promise.resolve();
    });

    expect(logger.warning).toHaveBeenCalledWith('OpenChannel | useDeleteMessageCallback: Deleting message failed', error);
  });
});
