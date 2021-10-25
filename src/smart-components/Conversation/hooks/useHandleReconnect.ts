import { useEffect } from 'react';

import * as utils from '../utils';
import * as messageActionTypes from '../dux/actionTypes';
import { Logger, Sdk } from '../../..';
import { GroupChannel } from 'sendbird';

interface DynamicParams {
  isOnline: boolean;
}

interface StaticParams {
  logger: Logger;
  sdk: Sdk;
  currentGroupChannel: GroupChannel;
  messagesDispatcher: ({ type: string, payload: any }) => void;
  userFilledMessageListQuery?: Record<string, any>;
}

function useHandleReconnect(
  { isOnline }: DynamicParams,
  {
    logger,
    sdk,
    currentGroupChannel,
    messagesDispatcher,
    userFilledMessageListQuery,
  }: StaticParams,
): void {
  useEffect(() => {
    const wasOffline = !isOnline;
    return () => {
      // state changed from offline to online
      if (wasOffline && currentGroupChannel?.url) {
        logger.info('Refreshing conversation state');
        const useReaction = sdk?.appInfo?.isUsingReaction || false;

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
          payload: null,
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
                  payload: null,
                });

                const hasMore = messages?.length > 0;
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
                currentGroupChannel.markAsRead?.();
              });
          });
      }
    };
  }, [isOnline]);
}

export default useHandleReconnect;
