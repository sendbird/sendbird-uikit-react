import { useEffect } from 'react';

import * as utils from '../utils';
import * as messageActionTypes from '../dux/actionTypes';

function useHandleReconnect({ isOnline }, {
  logger,
  sdk,
  currentGroupChannel,
  messagesDispatcher,
  userFilledMessageListQuery,
}) {
  useEffect(() => {
    const wasOffline = !isOnline;
    return () => {
      // state changed from offline to online
      if (wasOffline) {
        logger.info('Refreshing conversation state');
        const { appInfo = {} } = sdk;
        const useReaction = appInfo.isUsingReaction || false;

        const messageListParams = new sdk.MessageListParams();
        messageListParams.prevResultSize = 30;
        messageListParams.includeReplies = false;
        messageListParams.includeReaction = useReaction;

        if (userFilledMessageListQuery) {
          Object.keys(userFilledMessageListQuery).forEach((key) => {
            messageListParams[key] = userFilledMessageListQuery[key];
          });
        }
        logger.info('Channel: Fetching messages', { currentGroupChannel, userFilledMessageListQuery });
        messagesDispatcher({
          type: messageActionTypes.GET_PREV_MESSAGES_START,
        });

        sdk.GroupChannel.getChannel(currentGroupChannel.url)
          .then((groupChannel) => {
            const lastMessageTime = new Date().getTime();

            groupChannel.getMessagesByTimestamp(
              lastMessageTime,
              messageListParams,
            )
              .then((messages) => {
                messagesDispatcher({
                  type: messageActionTypes.CLEAR_SENT_MESSAGES,
                });

                const hasMore = (messages && messages.length > 0);
                const lastMessageTimeStamp = hasMore
                  ? messages[0].createdAt
                  : null;
                messagesDispatcher({
                  type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
                  payload: {
                    messages,
                    hasMore,
                    lastMessageTimeStamp,
                    currentGroupChannel,
                  },
                });
                setTimeout(() => utils.scrollIntoLast());
              })
              .catch((error) => {
                logger.error('Channel: Fetching messages failed', error);
              })
              .finally(() => {
                currentGroupChannel.markAsRead();
              });
          });
      }
    };
  }, [isOnline]);
}

export default useHandleReconnect;
