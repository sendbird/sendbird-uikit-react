import { act, renderHook } from '@testing-library/react';

import * as actionTypes from '../../dux/actionTypes';
import * as openActionTypes from '../../../../OpenChannel/context/dux/actionTypes';
import pubSubTopics from '../../../../../lib/pubSub/topics';
import useScrollToMessage from '../useScrollToMessage';
import useScrollCallback from '../useScrollCallback';
import useScrollDownCallback from '../useScrollDownCallback';
import useUpdateMessageCallback from '../useUpdateMessageCallback';
import useDeleteMessageCallback from '../useDeleteMessageCallback';
import useSendVoiceMessageCallback from '../useSendVoiceMessageCallback';
import useToggleReactionCallback from '../useToggleReactionCallback';
import useOpenChannelUpdateMessageCallback from '../../../../OpenChannel/context/hooks/useUpdateMessageCallback';
import useOpenChannelScrollCallback from '../../../../OpenChannel/context/hooks/useScrollCallback';
import { scrollToRenderedMessage, scrollIntoLast } from '../../utils';
import { SCROLL_BOTTOM_DELAY_FOR_SEND } from '../../../../../utils/consts';

jest.mock('../../utils', () => ({
  scrollToRenderedMessage: jest.fn(),
  scrollIntoLast: jest.fn(),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const createFile = () => new File(['voice'], 'voice.webm', { type: 'audio/webm' });

describe('legacy channel callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('scrolls to present and missing messages while disabling clicks', () => {
    jest.useFakeTimers();
    const setInitialTimeStamp = jest.fn();
    const setAnimatedMessageId = jest.fn();
    const parent = document.createElement('div');
    const element = document.createElement('div');
    parent.appendChild(element);
    const scrollRef = { current: element };
    const { result, rerender } = renderHook(
      ({ allMessages }: any) => useScrollToMessage({
        setInitialTimeStamp,
        setAnimatedMessageId,
        allMessages,
        scrollRef,
      }, { logger: logger as any }),
      { initialProps: { allMessages: [{ messageId: 1 }] } },
    );

    result.current(100, 1);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(scrollToRenderedMessage).toHaveBeenCalledWith(scrollRef, 100);
    expect(setAnimatedMessageId).toHaveBeenCalledWith(1);
    expect(element.style.pointerEvents).toBe('auto');
    expect(parent.style.cursor).toBe('auto');

    rerender({ allMessages: [] });
    result.current(200, 2);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(setInitialTimeStamp).toHaveBeenCalledWith(null);
    expect(setInitialTimeStamp).toHaveBeenCalledWith(200);
    expect(setAnimatedMessageId).toHaveBeenCalledWith(2);
    jest.useRealTimers();
  });

  it('fetches previous and next messages for legacy Channel scroll callbacks', async () => {
    jest.useFakeTimers();
    const prevMessages = [{ messageId: 1 }];
    const nextMessages = [{ messageId: 2 }];
    const channel = {
      getMessagesByTimestamp: jest.fn()
        .mockResolvedValueOnce(prevMessages)
        .mockRejectedValueOnce(new Error('prev failed'))
        .mockResolvedValueOnce(nextMessages)
        .mockRejectedValueOnce(new Error('next failed')),
    };
    const messagesDispatcher = jest.fn();
    const sdk = { appInfo: { useReaction: true } };

    const { result: prev } = renderHook(() => useScrollCallback(
      {
        currentGroupChannel: channel as any,
        oldestMessageTimeStamp: 10,
        userFilledMessageListQuery: { prevResultSize: 5 },
        replyType: 'THREAD' as any,
      },
      {
        hasMorePrev: true,
        logger: logger as any,
        messagesDispatcher,
        sdk: sdk as any,
      },
    ));
    const prevCb = jest.fn();
    prev.current(prevCb);
    await act(async () => {
      await Promise.resolve();
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: channel, messages: prevMessages },
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(prevCb).toHaveBeenCalled();

    prev.current(jest.fn());
    await act(async () => {
      await Promise.resolve();
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.FETCH_PREV_MESSAGES_FAILURE,
      payload: { currentGroupChannel: channel },
    });

    const { result: next } = renderHook(() => useScrollDownCallback(
      {
        currentGroupChannel: channel as any,
        latestMessageTimeStamp: 20,
        userFilledMessageListQuery: { nextResultSize: 6 },
        hasMoreNext: true,
        replyType: 'QUOTE_REPLY' as any,
      },
      {
        logger: logger as any,
        messagesDispatcher,
        sdk: sdk as any,
      },
    ));
    const nextCb = jest.fn();
    next.current(nextCb);
    await act(async () => {
      await Promise.resolve();
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: channel, messages: nextMessages },
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(nextCb).toHaveBeenCalledWith([nextMessages, null]);

    next.current(nextCb);
    await act(async () => {
      await Promise.resolve();
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.FETCH_NEXT_MESSAGES_FAILURE,
      payload: { currentGroupChannel: channel },
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(nextCb).toHaveBeenCalledWith([null, expect.any(Error)]);
    jest.useRealTimers();
  });

  it('refreshes legacy Channel scroll callbacks when pagination or query params change', async () => {
    const prevMessages = [{ messageId: 1 }];
    const nextMessages = [{ messageId: 2 }];
    const channel = {
      getMessagesByTimestamp: jest.fn()
        .mockResolvedValueOnce(prevMessages)
        .mockResolvedValueOnce(nextMessages),
    };
    const messagesDispatcher = jest.fn();

    const { result: prev, rerender: rerenderPrev } = renderHook(
      ({ hasMorePrev, query, useReaction }) => useScrollCallback(
        {
          currentGroupChannel: channel as any,
          oldestMessageTimeStamp: 10,
          userFilledMessageListQuery: query,
          replyType: 'NONE' as any,
        },
        {
          hasMorePrev,
          logger: logger as any,
          messagesDispatcher,
          sdk: { appInfo: { useReaction } } as any,
        },
      ),
      {
        initialProps: {
          hasMorePrev: false,
          query: { prevResultSize: 4 },
          useReaction: false,
        },
      },
    );

    prev.current(jest.fn());
    expect(channel.getMessagesByTimestamp).not.toHaveBeenCalled();

    rerenderPrev({
      hasMorePrev: true,
      query: { prevResultSize: 7 },
      useReaction: true,
    });
    prev.current(jest.fn());
    await act(async () => {
      await Promise.resolve();
    });

    expect(channel.getMessagesByTimestamp).toHaveBeenNthCalledWith(1, 10, expect.objectContaining({
      prevResultSize: 7,
      includeReactions: true,
    }));
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: channel, messages: prevMessages },
    });

    const { result: next, rerender: rerenderNext } = renderHook(
      ({ hasMoreNext, query, useReaction }) => useScrollDownCallback(
        {
          currentGroupChannel: channel as any,
          latestMessageTimeStamp: 20,
          userFilledMessageListQuery: query,
          hasMoreNext,
          replyType: 'NONE' as any,
        },
        {
          logger: logger as any,
          messagesDispatcher,
          sdk: { appInfo: { useReaction } } as any,
        },
      ),
      {
        initialProps: {
          hasMoreNext: false,
          query: { nextResultSize: 4 },
          useReaction: false,
        },
      },
    );

    next.current(jest.fn());
    expect(channel.getMessagesByTimestamp).toHaveBeenCalledTimes(1);

    rerenderNext({
      hasMoreNext: true,
      query: { nextResultSize: 8 },
      useReaction: true,
    });
    next.current(jest.fn());
    await act(async () => {
      await Promise.resolve();
    });

    expect(channel.getMessagesByTimestamp).toHaveBeenNthCalledWith(2, 20, expect.objectContaining({
      nextResultSize: 8,
      includeReactions: true,
    }));
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
      payload: { currentGroupChannel: channel, messages: nextMessages },
    });
  });

  it('updates, deletes, sends voice messages, and toggles reactions', async () => {
    jest.useFakeTimers();
    const messagesDispatcher = jest.fn();
    const pubSub = { publish: jest.fn() };
    const updatedMessage = { messageId: 1, message: 'updated' };
    const deleteMessage = jest.fn().mockResolvedValue(undefined);
    const chain = {
      onPending: jest.fn(function onPending(callback) {
        callback({ messageId: 2 });
        return this;
      }),
      onFailed: jest.fn(function onFailed(callback) {
        callback(new Error('voice failed'), { messageId: 3, reqId: 'failed' });
        return this;
      }),
      onSucceeded: jest.fn(function onSucceeded(callback) {
        callback({ messageId: 4 });
        return this;
      }),
    };
    const channel = {
      url: 'channel-url',
      updateUserMessage: jest.fn().mockResolvedValue(updatedMessage),
      deleteMessage,
      sendFileMessage: jest.fn(() => chain),
      addReaction: jest.fn().mockResolvedValue('added'),
      deleteReaction: jest.fn().mockResolvedValue('deleted'),
    };

    const { result: update } = renderHook(() => useUpdateMessageCallback(
      {
        currentGroupChannel: channel as any,
        messagesDispatcher,
        isMentionEnabled: true,
      },
      { logger: logger as any, pubSub: pubSub as any },
    ));
    const updateCb = jest.fn();
    update.current({
      messageId: 1,
      message: 'updated',
      mentionedUsers: [{ userId: 'user-a' }] as any,
      mentionTemplate: '@a updated',
    }, updateCb);
    await act(async () => {
      await Promise.resolve();
    });
    expect(updateCb).toHaveBeenCalledWith(null, updatedMessage);
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.ON_MESSAGE_UPDATED,
      payload: { channel, message: updatedMessage },
    });
    expect(pubSub.publish).toHaveBeenCalledWith(pubSubTopics.UPDATE_USER_MESSAGE, expect.objectContaining({
      message: updatedMessage,
      channel,
    }));

    const { result: deleteHook } = renderHook(() => useDeleteMessageCallback(
      { currentGroupChannel: channel as any, messagesDispatcher },
      { logger: logger as any },
    ));
    await expect(deleteHook.current({ messageId: 11, reqId: 'local', sender: {}, sendingStatus: 'failed' } as any)).resolves.toBeUndefined();
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
      payload: 'local',
    });
    await expect(deleteHook.current({ messageId: 12 } as any)).resolves.toBeUndefined();
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.ON_MESSAGE_DELETED,
      payload: 12,
    });

    const { result: voice } = renderHook(() => {
      const [sendVoice] = useSendVoiceMessageCallback(
        { currentGroupChannel: channel as any },
        { logger: logger as any, pubSub: pubSub as any, scrollRef: { current: document.createElement('div') }, messagesDispatcher },
      );
      return sendVoice;
    });
    await expect(voice.current(createFile(), 7, { messageId: 99 } as any)).rejects.toThrow('voice failed');
    expect(pubSub.publish).toHaveBeenCalledWith(pubSubTopics.SEND_MESSAGE_START, expect.objectContaining({
      message: { messageId: 2 },
      channel,
    }));
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: actionTypes.SEND_MESSAGE_FAILURE,
      payload: { messageId: 3, reqId: 'failed' },
    });
    act(() => {
      jest.advanceTimersByTime(SCROLL_BOTTOM_DELAY_FOR_SEND);
    });
    expect(scrollIntoLast).toHaveBeenCalled();

    const { result: toggle } = renderHook(() => useToggleReactionCallback(channel as any, logger as any));
    toggle.current({ messageId: 1 } as any, 'smile', false);
    toggle.current({ messageId: 1 } as any, 'smile', true);
    await act(async () => {
      await Promise.resolve();
    });
    expect(channel.addReaction).toHaveBeenCalledWith({ messageId: 1 }, 'smile');
    expect(channel.deleteReaction).toHaveBeenCalledWith({ messageId: 1 }, 'smile');

    const { result: noChannelToggle } = renderHook(() => useToggleReactionCallback(null, logger as any));
    noChannelToggle.current({ messageId: 1 } as any, 'smile', false);
    expect(logger.warning).toHaveBeenCalledWith("useToggleReactionCallback: currentChannel doesn't exist", null);
    jest.useRealTimers();
  });

  it('covers OpenChannel update and scroll callbacks', async () => {
    jest.useFakeTimers();
    const messagesDispatcher = jest.fn();
    const openMessages = [{ messageId: 5, createdAt: 500 }];
    const openChannel = {
      updateUserMessage: jest.fn().mockResolvedValue({ messageId: 5, message: 'updated' }),
      getMessagesByTimestamp: jest.fn()
        .mockResolvedValueOnce(openMessages)
        .mockRejectedValueOnce(new Error('open failed')),
    };
    const { result: update } = renderHook(() => useOpenChannelUpdateMessageCallback(
      {
        currentOpenChannel: openChannel as any,
        onBeforeSendUserMessage: (text) => ({ message: `${text}!` }) as any,
      },
      { logger: logger as any, messagesDispatcher },
    ));
    const callback = jest.fn();
    update.current(5, 'updated', callback);
    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: openActionTypes.ON_MESSAGE_UPDATED,
      payload: {
        channel: openChannel,
        message: { messageId: 5, message: 'updated' },
      },
    });

    const { result: scroll } = renderHook(() => useOpenChannelScrollCallback(
      {
        currentOpenChannel: openChannel as any,
        lastMessageTimestamp: 500,
        fetchMore: true,
      },
      {
        sdk: {} as any,
        logger: logger as any,
        messagesDispatcher,
        hasMore: true,
        userFilledMessageListParams: { prevResultSize: 3 },
      },
    ));
    const cb = jest.fn();
    scroll.current(cb);
    await act(async () => {
      await Promise.resolve();
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: openActionTypes.GET_PREV_MESSAGES_SUCESS,
      payload: {
        currentOpenChannel: openChannel,
        messages: openMessages,
        hasMore: true,
        lastMessageTimestamp: 500,
      },
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(cb).toHaveBeenCalledTimes(1);

    scroll.current(cb);
    await act(async () => {
      await Promise.resolve();
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: openActionTypes.GET_PREV_MESSAGES_FAIL,
      payload: {
        currentOpenChannel: openChannel,
        messages: [],
        hasMore: false,
        lastMessageTimestamp: 0,
      },
    });
    jest.useRealTimers();
  });
});
