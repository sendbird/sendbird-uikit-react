import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

const RESULT_SIZE = 30;

function useScrollDownCallback({
  currentGroupChannel,
  latestFetchedMessageTimeStamp,
  userFilledMessageListQuery,
  hasMoreToBottom,
  replyType,
}, {
  logger,
  messagesDispatcher,
  sdk,
}) {
  return useCallback((cb) => {
    if (!hasMoreToBottom) { return; }
    const { appInfo = {} } = sdk;
    const useReaction = appInfo.isUsingReaction || false;

    const messageListParams = new sdk.MessageListParams();
    messageListParams.nextResultSize = RESULT_SIZE;
    messageListParams.isInclusive = true;
    messageListParams.includeReplies = false;
    messageListParams.includeReaction = useReaction;
    if (replyType && replyType === 'QUOTE_REPLY') {
      messageListParams.includeThreadInfo = true;
      messageListParams.includeParentMessageInfo = true;
      messageListParams.replyType = 'only_reply_to_channel';
    }
    if (userFilledMessageListQuery) {
      Object.keys(userFilledMessageListQuery).forEach((key) => {
        messageListParams[key] = userFilledMessageListQuery[key];
      });
    }
    logger.info('Channel: Fetching later messages', { currentGroupChannel, userFilledMessageListQuery });

    currentGroupChannel.getMessagesByTimestamp(
      latestFetchedMessageTimeStamp || new Date().getTime(),
      messageListParams,
    )
      .then((messages) => {
        const messagesLength = (messages && messages.length) || 0;
        const hasMoreMessages = (messagesLength > 0)
          && (messageListParams.nextResultSize === messagesLength);
        const lastMessageTs = hasMoreMessages
          ? messages[messages.length - 1].createdAt
          : null;
        messagesDispatcher({
          type: messageActionTypes.GET_NEXT_MESSAGES_SUCESS,
          payload: {
            messages,
            hasMoreToBottom: hasMoreMessages,
            latestFetchedMessageTimeStamp: lastMessageTs,
            currentGroupChannel,
          },
        });
        cb([messages, null]);
      })
      .catch((error) => {
        logger.error('Channel: Fetching later messages failed', error);
        messagesDispatcher({
          type: messageActionTypes.GET_NEXT_MESSAGES_FAILURE,
          payload: {
            messages: [],
            hasMoreToBottom: false,
            latestFetchedMessageTimeStamp: 0,
            currentGroupChannel,
          },
        });
        cb([null, error]);
      })
      .finally(() => {
        try {
          currentGroupChannel.markAsRead();
        } catch {
          //
        }
      });
  }, [currentGroupChannel, latestFetchedMessageTimeStamp, hasMoreToBottom, replyType]);
}

export default useScrollDownCallback;
