import { useEffect } from 'react';

import * as utils from '../utils';
import { PREV_RESULT_SIZE } from '../const';
import * as messageActionTypes from '../dux/actionTypes';
import SendBird, { GroupChannel } from 'sendbird';
import { Logger } from '../../../../lib/SendbirdState';

interface DynamicParams {
  isOnline: boolean;
  replyType?: string;
}

interface StaticParams {
  logger: Logger;
  sdk: SendBird.SendBirdInstance;
  currentGroupChannel: GroupChannel;
  messagesDispatcher: ({ type: string, payload: any }) => void;
  userFilledMessageListQuery?: Record<string, any>;
}

function useHandleReconnect(
  { isOnline, replyType }: DynamicParams,
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
        messageListParams.prevResultSize = PREV_RESULT_SIZE;
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
        messagesDispatcher({
          type: messageActionTypes.FETCH_INITIAL_MESSAGES_START,
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
                  type: messageActionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
                  payload: {
                    currentGroupChannel,
                    messages,
                  },
                });
                setTimeout(() => utils.scrollIntoLast());
              })
              .catch((error) => {
                logger.error('Channel: Fetching messages failed', error);
                messagesDispatcher({
                  type: messageActionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
                  payload: { currentGroupChannel },
                });
              })
              .finally(() => {
                currentGroupChannel.markAsRead?.();
              });
          });
      }
    };
  }, [isOnline, replyType]);
}

export default useHandleReconnect;
