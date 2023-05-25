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
  scrollRef,
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
      messageListParams.includeMetaArray = true;
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
      if ((replyType && (replyType === 'QUOTE_REPLY' || replyType === 'THREAD')) || userFilledMessageListQuery) {
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

      currentGroupChannel.getMessagesByTimestamp(
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
          try {
            if (!initialTimeStamp) {
              setTimeout(() => utils.scrollIntoLast(0, scrollRef));
            } else {
              setTimeout(() => {
                const container = scrollRef.current;
                // scroll into the message with initialTimeStamp
                const element = container.querySelectorAll(`[data-sb-created-at="${initialTimeStamp}"]`)?.[0];
                if (element) {
                  // Calculate the offset of the element from the top of the container
                  const containerHeight = container.offsetHeight;
                  const elementHeight = element.offsetHeight;
                  const elementOffset = (containerHeight - elementHeight) / 2;

                  // Set the scroll position of the container to bring the element to the middle
                  container.scrollTop = element.offsetTop - elementOffset;
                }
              });
            }
          } catch (error) {
            logger.error('Channel: scrolling to message failed', error);
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
