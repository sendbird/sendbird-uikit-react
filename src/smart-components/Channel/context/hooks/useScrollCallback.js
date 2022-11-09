import { useCallback } from 'react';
import { ReplyType } from '@sendbird/chat/message';

import * as messageActionTypes from '../dux/actionTypes';
import { PREV_RESULT_SIZE } from '../const';

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
    const isReactionEnabled = appInfo.useReaction || false;

    const messageListParams = {
      prevResultSize: PREV_RESULT_SIZE,
      isInclusive: true,
      includeReactions: isReactionEnabled,
    };
    if (replyType && (replyType === 'QUOTE_REPLY' || replyType === 'THREAD')) {
      messageListParams.includeThreadInfo = true;
      messageListParams.includeParentMessageInfo = true;
      messageListParams.replyType = ReplyType.ONLY_REPLY_TO_CHANNEL;
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
        messagesDispatcher({
          type: messageActionTypes.FETCH_PREV_MESSAGES_SUCCESS,
          payload: { currentGroupChannel, messages },
        });
        cb([messages, null]);
      })
      .catch((error) => {
        logger.error('Channel: Fetching messages failed', error);
        messagesDispatcher({
          type: messageActionTypes.FETCH_PREV_MESSAGES_FAILURE,
          payload: { currentGroupChannel },
        });
        cb([null, error]);
      });
  }, [currentGroupChannel, oldestMessageTimeStamp, replyType]);
}

export default useScrollCallback;
