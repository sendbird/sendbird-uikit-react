import { useEffect } from 'react';
import { ReplyType } from '@sendbird/chat/message';

import * as utils from '../utils';
import * as messageActionTypes from '../dux/actionTypes';
import { PREV_RESULT_SIZE, NEXT_RESULT_SIZE } from '../const';

function useInitialMessagesFetch({
  currentGroupChannel,
  userFilledMessageListQuery,
  initialTimeStamp,
  replyType,
}, {
  logger,
  messagesDispatcher,
}) {
  const channelUrl = currentGroupChannel?.url;
  useEffect(() => {
    logger.info('Channel useInitialMessagesFetch: Setup started', currentGroupChannel);
    messagesDispatcher({
      type: messageActionTypes.RESET_MESSAGES,
      payload: null,
    });

    if (currentGroupChannel && currentGroupChannel?.getMessagesByTimestamp) {
      const messageListParams = {};
      messageListParams.prevResultSize = PREV_RESULT_SIZE;
      if (initialTimeStamp) {
        messageListParams.nextResultSize = NEXT_RESULT_SIZE;
      }
      messageListParams.isInclusive = true;
      messageListParams.includeReactions = true;
      if (replyType && replyType === 'QUOTE_REPLY') {
        messageListParams.includeThreadInfo = true;
        messageListParams.includeParentMessageInfo = true;
        messageListParams.replyType = ReplyType.ONLY_REPLY_TO_CHANNEL;
      }
      if (userFilledMessageListQuery) {
        Object.keys(userFilledMessageListQuery).forEach((key) => {
          messageListParams[key] = userFilledMessageListQuery[key];
        });
      }
      if ((replyType && replyType === 'QUOTE_REPLY') || userFilledMessageListQuery) {
        logger.info('Channel useInitialMessagesFetch: Setup messageListParams', messageListParams);
        messagesDispatcher({
          type: messageActionTypes.MESSAGE_LIST_PARAMS_CHANGED,
          payload: messageListParams,
        });
      }

      logger.info('Channel: Fetching messages', { currentGroupChannel, userFilledMessageListQuery });
      messagesDispatcher({
        type: messageActionTypes.FETCH_INITIAL_MESSAGES_START,
        payload: null,
      });

      currentGroupChannel?.getMessagesByTimestamp(
        initialTimeStamp || new Date().getTime(),
        messageListParams,
      )
        .then((messages) => {
          messagesDispatcher({
            type: messageActionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
            payload: {
              currentGroupChannel,
              messages,
            },
          });
        })
        .catch((error) => {
          logger.error('Channel: Fetching messages failed', error);
          messagesDispatcher({
            type: messageActionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
            payload: { currentGroupChannel },
          });
        })
        .finally(() => {
          if (!initialTimeStamp) {
            setTimeout(() => utils.scrollIntoLast());
          }
        });
    }
  }, [channelUrl, userFilledMessageListQuery, initialTimeStamp]);
  /**
   * Note - useEffect(() => {}, [currentGroupChannel])
   * was buggy, that is why we did
   * const channelUrl = currentGroupChannel && currentGroupChannel.url;
   * useEffect(() => {}, [channelUrl])
   * Again, this hook is supposed to execute when currentGroupChannel changes
   * The 'channelUrl' here is not the same memory reference from Conversation.props
   */
}

export default useInitialMessagesFetch;
