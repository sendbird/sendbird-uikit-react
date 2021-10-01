import { useEffect } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

const PREV_RESULT_SIZE = 30;
const NEXT_RESULT_SIZE = 10;

const getLatestMessageTimeStamp = (messages = []) => {
  const latestMessage = messages[messages.length - 1];
  return (latestMessage && latestMessage.createdAt) || null;
};

function useInitialMessagesFetch({
  currentGroupChannel,
  userFilledMessageListQuery,
  intialTimeStamp,
  replyType,
}, {
  sdk,
  logger,
  messagesDispatcher,
}) {
  const channelUrl = currentGroupChannel && currentGroupChannel.url;
  useEffect(() => {
    logger.info('Channel useInitialMessagesFetch: Setup started', currentGroupChannel);
    messagesDispatcher({
      type: messageActionTypes.RESET_MESSAGES,
    });

    if (sdk && sdk.MessageListParams
      && currentGroupChannel && currentGroupChannel.getMessagesByTimestamp) {
      const messageListParams = new sdk.MessageListParams();
      messageListParams.prevResultSize = PREV_RESULT_SIZE;
      messageListParams.isInclusive = true;
      messageListParams.includeReplies = false;
      messageListParams.includeReaction = true;
      if (replyType && replyType === 'QUOTE_REPLY') {
        messageListParams.includeParentMessageInfo = true;
        messageListParams.replyTypeFilter = 'all';
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
        type: messageActionTypes.GET_PREV_MESSAGES_START,
      });

      if (intialTimeStamp) {
        messageListParams.nextResultSize = NEXT_RESULT_SIZE;
        currentGroupChannel.getMessagesByTimestamp(
          intialTimeStamp,
          messageListParams,
        )
          .then((messages) => {
            const hasMore = (messages && messages.length > 0);
            const lastMessageTimeStamp = hasMore
              ? messages[0].createdAt
              : null;
            const latestFetchedMessageTimeStamp = getLatestMessageTimeStamp(messages);
            // to make sure there are no more messages below
            const nextMessageListParams = new sdk.MessageListParams();
            nextMessageListParams.nextResultSize = NEXT_RESULT_SIZE;
            currentGroupChannel.getMessagesByTimestamp(
              latestFetchedMessageTimeStamp || new Date().getTime(),
              nextMessageListParams,
            ).then((nextMessages) => {
              messagesDispatcher({
                type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
                payload: {
                  messages,
                  hasMore,
                  lastMessageTimeStamp,
                  currentGroupChannel,
                  latestFetchedMessageTimeStamp,
                  hasMoreToBottom: nextMessages && nextMessages.length > 0,
                },
              });
            });
          })
          .catch((error) => {
            logger.error('Channel: Fetching messages failed', error);
            messagesDispatcher({
              type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
              payload: {
                messages: [],
                hasMore: false,
                lastMessageTimeStamp: 0,
                currentGroupChannel,
              },
            });
          })
          .finally(() => {
            if (!intialTimeStamp) {
              setTimeout(() => utils.scrollIntoLast());
            }
            currentGroupChannel.markAsRead();
          });
      } else {
        currentGroupChannel.getMessagesByTimestamp(
          new Date().getTime(),
          messageListParams,
        )
          .then((messages) => {
            const hasMore = (messages && messages.length > 0);
            const lastMessageTimeStamp = hasMore
              ? messages[0].createdAt
              : null;
            const latestFetchedMessageTimeStamp = getLatestMessageTimeStamp(messages);
            messagesDispatcher({
              type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
              payload: {
                messages,
                hasMore,
                lastMessageTimeStamp,
                currentGroupChannel,
                latestFetchedMessageTimeStamp,
                hasMoreToBottom: false,
              },
            });
          })
          .catch((error) => {
            logger.error('Channel: Fetching messages failed', error);
            messagesDispatcher({
              type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
              payload: {
                messages: [],
                hasMore: false,
                lastMessageTimeStamp: 0,
                currentGroupChannel,
              },
            });
          })
          .finally(() => {
            if (!intialTimeStamp) {
              setTimeout(() => utils.scrollIntoLast());
            }
            currentGroupChannel.markAsRead();
          });
      }
    }
  }, [channelUrl, userFilledMessageListQuery, intialTimeStamp]);
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
