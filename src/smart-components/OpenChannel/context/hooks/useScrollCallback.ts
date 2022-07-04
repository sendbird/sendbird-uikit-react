import { useCallback } from 'react';
import type { MessageListParams } from '@sendbird/chat/message';
import type { OpenChannel, SendbirdOpenChat } from '@sendbird/chat/openChannel';

import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
  lastMessageTimestamp: number;
  fetchMore?: boolean;
}
interface StaticParams {
  sdk: SendbirdOpenChat;
  logger: Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
  hasMore: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  userFilledMessageListParams?: Record<string, any>;
}
type CallbackReturn = (callback: () => void) => void;

function useScrollCallback(
  { currentOpenChannel, lastMessageTimestamp, fetchMore }: DynamicParams,
  { sdk, logger, messagesDispatcher, hasMore, userFilledMessageListParams }: StaticParams,
): CallbackReturn {
  return useCallback((callback) => {
    if (fetchMore && hasMore) {
      logger.info('OpenChannel | useScrollCallback: start');
      const messageListParams: MessageListParams = {
        prevResultSize: 30,
        includeReactions: false,
        nextResultSize: 0,
      };

      if (userFilledMessageListParams) {
        Object.keys(userFilledMessageListParams).forEach((key) => {
          messageListParams[key] = userFilledMessageListParams[key];
        });
        logger.info('OpenChannel | useScrollCallback: Used userFilledMessageListParams', userFilledMessageListParams);
      }

      logger.info('OpenChannel | useScrollCallback: Fetching messages', { currentOpenChannel, messageListParams });

      currentOpenChannel.getMessagesByTimestamp(lastMessageTimestamp || new Date().getTime(), messageListParams).then((messages) => {
        logger.info('OpenChannel | useScrollCallback: Fetching messages succeeded', messages);
        const hasMore = (messages && messages.length > 0);
        const lastMessageTimestamp = hasMore ? messages[0].createdAt : null;
        messagesDispatcher({
          type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
          payload: {
            currentOpenChannel,
            messages,
            hasMore,
            lastMessageTimestamp,
          }
        });
        setTimeout(() => {
          callback();
        });
      }).catch((error) => {
        logger.error('OpenChannel | useScrollCallback: Fetching messages failed', error);
        messagesDispatcher({
          type: messageActionTypes.GET_PREV_MESSAGES_FAIL,
          payload: {
            currentOpenChannel,
            messages: [],
            hasMore: false,
            lastMessageTimestamp: 0,
          }
        });
      });
    }
  }, [currentOpenChannel, lastMessageTimestamp, fetchMore, sdk]);
}

export default useScrollCallback;
