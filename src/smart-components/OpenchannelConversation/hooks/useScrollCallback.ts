import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
  lastMessageTimestamp: number;
}
interface StaticParams {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
  hasMore: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  userFilledMessageListParams?: Record<string, any>;
}
type CallbackReturn = (callback: () => void) => void;

function useScrollCallback(
  { currentOpenChannel, lastMessageTimestamp }: DynamicParams,
  { sdk, logger, messagesDispatcher, hasMore, userFilledMessageListParams }: StaticParams,
): CallbackReturn {
  return useCallback((callback) => {
    if (hasMore && sdk && sdk.MessageListParams) {
      logger.info('OpenChannel | useScrollCallback: start');
      const messageListParams = new sdk.MessageListParams();
      messageListParams.prevResultSize = 30;
      messageListParams.includeReplies = false;
      messageListParams.includeReactions = false;

      if (userFilledMessageListParams) {
        Object.keys(userFilledMessageListParams).forEach((key) => {
          messageListParams[key] = userFilledMessageListParams[key];
        });
        logger.info('OpenChannel | useScrollCallback: Used userFilledMessageListParams', userFilledMessageListParams);
      }

      logger.info('OpenChannel | useScrollCallback: Fetching messages', { currentOpenChannel, messageListParams });

      currentOpenChannel.getMessagesByTimestamp(lastMessageTimestamp || new Date().getTime(), messageListParams, (messages, error) => {
        if (!error) {
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
        } else {
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
        }
      });
    }
  }, [currentOpenChannel, lastMessageTimestamp]);
}

export default useScrollCallback;
