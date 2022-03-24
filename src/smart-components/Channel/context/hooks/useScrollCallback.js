import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

function useScrollCallback({
  currentGroupChannel,
  oldestMessageTimeStamp,
  userFilledMessageListQuery,
  replyType,
}, {
  hasMorePrev,
  logger,
  messagesDispatcher,
  sdk,
}) {
  return useCallback((cb) => {
    if (!hasMorePrev) { return; }
    const { appInfo = {} } = sdk;
    const useReaction = appInfo.isUsingReaction || false;

    const messageListParams = new sdk.MessageListParams();
    messageListParams.prevResultSize = 30;
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
    logger.info('Channel: Fetching messages', { currentGroupChannel, userFilledMessageListQuery });

    currentGroupChannel.getMessagesByTimestamp(
      oldestMessageTimeStamp || new Date().getTime(),
      messageListParams,
    )
      .then((messages) => {
        const hasMorePrev = (messages && messages.length > 0);
        const lastMessageTs = hasMorePrev
          ? messages[0].createdAt
          : null;

        messagesDispatcher({
          type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
          payload: {
            messages,
            hasMorePrev: hasMorePrev,
            oldestMessageTimeStamp: lastMessageTs,
            currentGroupChannel,
          },
        });
        cb([messages, null]);
      })
      .catch((error) => {
        logger.error('Channel: Fetching messages failed', error);
        messagesDispatcher({
          type: messageActionTypes.GET_PREV_MESSAGES_FAILURE,
          payload: { currentGroupChannel },
        });
        cb([null, error]);
      })
      .finally(() => {
        currentGroupChannel.markAsRead();
      });
  }, [currentGroupChannel, oldestMessageTimeStamp, replyType]);
}

export default useScrollCallback;
