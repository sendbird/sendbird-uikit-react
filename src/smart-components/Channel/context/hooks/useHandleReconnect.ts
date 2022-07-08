import { useEffect } from 'react';

import type { GroupChannel, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import {
  MessageListParams,
  ReplyType,
} from '@sendbird/chat/message';
import * as utils from '../utils';
import { PREV_RESULT_SIZE } from '../const';
import * as messageActionTypes from '../dux/actionTypes';
import { Logger } from '../../../../lib/SendbirdState';
import { NEXT_RESULT_SIZE } from '../const';
interface DynamicParams {
  isOnline: boolean;
  replyType?: string;
}

interface StaticParams {
  logger: Logger;
  sdk: SendbirdGroupChat;
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
        const isReactionEnabled = sdk?.appInfo?.useReaction || false;

        const messageListParams: MessageListParams = {
          prevResultSize: PREV_RESULT_SIZE,
          isInclusive: true,
          includeReactions: isReactionEnabled,
          nextResultSize: NEXT_RESULT_SIZE,
        };
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
        logger.info('Channel: Fetching messages', { currentGroupChannel, userFilledMessageListQuery });
        messagesDispatcher({
          type: messageActionTypes.FETCH_INITIAL_MESSAGES_START,
          payload: null,
        });

        sdk?.groupChannel?.getChannel(currentGroupChannel?.url)
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
                currentGroupChannel?.markAsRead?.();
              });
          });
      }
    };
  }, [isOnline, replyType]);
}

export default useHandleReconnect;
