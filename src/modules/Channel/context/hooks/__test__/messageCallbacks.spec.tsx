import { act, renderHook } from '@testing-library/react';

import * as actionTypes from '../../dux/actionTypes';
import * as channelUtils from '../../utils';
import topics from '../../../../../lib/pubSub/topics';
import useInitialMessagesFetch from '../useInitialMessagesFetch';
import useResendMessageCallback from '../useResendMessageCallback';
import useSendFileMessageCallback from '../useSendFileMessageCallback';
import useSendMessageCallback from '../useSendMessageCallback';

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const pubSub = {
  publish: jest.fn(),
};

const createChain = () => {
  const chain: any = {
    onPending: jest.fn((callback) => {
      callback({ messageId: 1, reqId: 'req-1', isUserMessage: () => true, isFileMessage: () => false });
      return chain;
    }),
    onFileUploaded: jest.fn((callback) => {
      callback('req-1', 0, { fileName: 'a.png' }, null);
      return chain;
    }),
    onFailed: jest.fn((callback) => {
      callback(new Error('failed'), { messageId: 2, reqId: 'req-2' });
      return chain;
    }),
    onSucceeded: jest.fn((callback) => {
      callback({ messageId: 3, reqId: 'req-3', sender: { userId: 'me' } });
      return chain;
    }),
  };
  return chain;
};

describe('Channel message callback hooks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(channelUtils, 'scrollIntoLast').mockImplementation(jest.fn());
    jest.spyOn(channelUtils, 'scrollToRenderedMessage').mockImplementation(jest.fn());
    URL.createObjectURL = jest.fn(() => 'blob:local');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('sends user messages with mention and quote metadata', () => {
    const chain = createChain();
    const channel = {
      url: 'channel-url',
      sendUserMessage: jest.fn(() => chain),
    };
    const dispatcher = jest.fn();
    const scrollRef = { current: document.createElement('div') };
    const mentionedUser = { userId: 'mentioned' };

    const { result } = renderHook(() => useSendMessageCallback(
      { isMentionEnabled: true, currentGroupChannel: channel as any },
      { logger: logger as any, pubSub: pubSub as any, scrollRef, messagesDispatcher: dispatcher },
    ));

    act(() => {
      result.current[1]({
        message: 'hello',
        mentionTemplate: '@{mentioned}',
        mentionedUsers: [mentionedUser as any],
        quoteMessage: { messageId: 99 } as any,
      });
    });

    expect(channel.sendUserMessage).toHaveBeenCalledWith({
      message: 'hello',
      mentionedUsers: [mentionedUser],
      mentionedMessageTemplate: '@{mentioned}',
      isReplyToChannel: true,
      parentMessageId: 99,
    });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_MESSAGE_START, expect.objectContaining({
      channel,
      message: expect.objectContaining({ messageId: 1 }),
    }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SEND_MESSAGE_FAILURE }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SEND_MESSAGE_SUCCESS }));

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(channelUtils.scrollIntoLast).toHaveBeenCalled();
  });

  it('uses custom params when onBeforeSendUserMessage is supplied', () => {
    const chain = createChain();
    const channel = { sendUserMessage: jest.fn(() => chain) };
    const onBeforeSendUserMessage = jest.fn(() => ({ message: 'custom', customType: 'type' }));
    const { result } = renderHook(() => useSendMessageCallback(
      { isMentionEnabled: false, currentGroupChannel: channel as any, onBeforeSendUserMessage },
      { logger: logger as any, pubSub: pubSub as any, scrollRef: { current: null }, messagesDispatcher: jest.fn() },
    ));

    act(() => {
      result.current[1]({ message: 'original' });
    });

    expect(onBeforeSendUserMessage).toHaveBeenCalledWith('original', undefined);
    expect(channel.sendUserMessage).toHaveBeenCalledWith({ message: 'custom', customType: 'type' });
  });

  it('sends file messages and resolves or rejects based on SDK callbacks', async () => {
    const chain = createChain();
    const channel = {
      sendFileMessage: jest.fn(() => chain),
    };
    const dispatcher = jest.fn();
    const file = new File(['file'], 'file.png', { type: 'image/png' });
    const { result } = renderHook(() => useSendFileMessageCallback(
      { currentGroupChannel: channel as any },
      { logger: logger as any, pubSub: pubSub as any, scrollRef: { current: null }, messagesDispatcher: dispatcher },
    ));

    await expect(result.current[0](file, { messageId: 77 } as any)).rejects.toThrow('failed');

    expect(channel.sendFileMessage).toHaveBeenCalledWith({
      file,
      isReplyToChannel: true,
      parentMessageId: 77,
    });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_MESSAGE_START, expect.objectContaining({
      message: expect.objectContaining({ url: 'blob:local', requestState: 'pending' }),
    }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SEND_MESSAGE_FAILURE }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SEND_MESSAGE_SUCCESS }));
  });

  it('resends user, file, and multiple-files messages and publishes upload progress', () => {
    const channel = {
      url: 'channel-url',
      resendMessage: jest.fn(() => createChain()),
    };
    const dispatcher = jest.fn();
    const { result } = renderHook(() => useResendMessageCallback(
      { currentGroupChannel: channel as any, messagesDispatcher: dispatcher },
      { logger: logger as any, pubSub: pubSub as any },
    ));

    act(() => {
      result.current({ isResendable: true, isUserMessage: () => true, isFileMessage: () => false, isMultipleFilesMessage: () => false } as any);
      result.current({ isResendable: true, isUserMessage: () => false, isFileMessage: () => true, isMultipleFilesMessage: () => false } as any);
      result.current({ isResendable: true, isUserMessage: () => false, isFileMessage: () => false, isMultipleFilesMessage: () => true } as any);
      result.current({ isResendable: false } as any);
    });

    expect(channel.resendMessage).toHaveBeenCalledTimes(3);
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.RESEND_MESSAGE_START }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SEND_MESSAGE_SUCCESS }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.SEND_MESSAGE_FAILURE }));
    expect(pubSub.publish).toHaveBeenCalledWith(topics.ON_FILE_INFO_UPLOADED, expect.objectContaining({
      response: expect.objectContaining({ channelUrl: 'channel-url', requestId: 'req-1', index: 0 }),
    }));
    expect(logger.error).toHaveBeenCalledWith('Message is not resendable', { isResendable: false });
  });

  it('fetches initial messages with reply params and scrolls to the requested timestamp', async () => {
    const messages = [{ messageId: 1, createdAt: 10 }];
    const channel = {
      url: 'channel-url',
      getMessagesByTimestamp: jest.fn().mockResolvedValue(messages),
    };
    const dispatcher = jest.fn();

    renderHook(() => useInitialMessagesFetch(
      {
        currentGroupChannel: channel as any,
        initialTimeStamp: 1000,
        userFilledMessageListQuery: { prevResultSize: 5 } as any,
        replyType: 'THREAD',
        setIsScrolled: jest.fn(),
      },
      { logger: logger as any, scrollRef: { current: document.createElement('div') }, messagesDispatcher: dispatcher },
    ));

    await act(async () => {
      await Promise.resolve();
    });

    expect(channel.getMessagesByTimestamp).toHaveBeenCalledWith(1000, expect.objectContaining({
      prevResultSize: 5,
      nextResultSize: expect.any(Number),
      includeThreadInfo: true,
      includeParentMessageInfo: true,
    }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED }));
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({
      type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: channel, messages },
    }));

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(channelUtils.scrollToRenderedMessage).toHaveBeenCalledWith(expect.any(Object), 1000, expect.any(Function));
  });

  it('dispatches initial fetch failure and scrolls to bottom when no timestamp is provided', async () => {
    const error = new Error('fetch failed');
    const channel = {
      url: 'channel-url',
      getMessagesByTimestamp: jest.fn().mockRejectedValue(error),
    };
    const dispatcher = jest.fn();
    const setIsScrolled = jest.fn();

    renderHook(() => useInitialMessagesFetch(
      {
        currentGroupChannel: channel as any,
        initialTimeStamp: null,
        replyType: 'NONE',
        setIsScrolled,
      },
      { logger: logger as any, scrollRef: { current: document.createElement('div') }, messagesDispatcher: dispatcher },
    ));

    await act(async () => {
      await Promise.resolve();
    });

    expect(logger.error).toHaveBeenCalledWith('Channel: Fetching messages failed', error);
    expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type: actionTypes.FETCH_INITIAL_MESSAGES_FAILURE }));

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(channelUtils.scrollIntoLast).toHaveBeenCalledWith(0, expect.any(Object), setIsScrolled);
  });
});
