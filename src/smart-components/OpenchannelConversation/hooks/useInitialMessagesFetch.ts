import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import { scrollIntoLast } from '../utils';

interface MainProps {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  userFilledMessageListParams?: Record<string, any>;
}
interface ToolProps {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

function useInitialMessagesFetch(
  { currentOpenChannel, userFilledMessageListParams }: MainProps,
  { sdk, logger, messagesDispatcher }: ToolProps,
): void {
  useEffect(() => {
    logger.info('OpenChannel | useInitialMessagesFetch: Setup started', currentOpenChannel);
    messagesDispatcher({
      type: messageActionTypes.RESET_MESSAGES,
      payload: null,
    });

    if (sdk && sdk.MessageListParams && currentOpenChannel && currentOpenChannel.getMessagesByTimestamp) {
      const messageListParams = new sdk.MessageListParams();
      messageListParams.prevResultSize = 30;
      messageListParams.isInclusive = true;
      messageListParams.includeReplies = false;
      messageListParams.includeReactions = false;
      if (userFilledMessageListParams) {
        Object.keys(userFilledMessageListParams).forEach((key) => {
          messageListParams[key] = userFilledMessageListParams[key];
        });
        logger.info('OpenChannel | useInitialMessagesFetch: Used customizedMessageListParams');
      }

      logger.info('OpenChannel | useInitialMessagesFetch: Fetching messages', { currentOpenChannel, messageListParams });
      messagesDispatcher({
        type: messageActionTypes.GET_PREV_MESSAGES_START,
        payload: null,
      });
      currentOpenChannel.getMessagesByTimestamp(new Date().getTime(), messageListParams, (messages, error) => {
        if (!error) {
          logger.info('OpenChannel | useInitialMessagesFetch: Fetching messages succeeded', messages);
          const hasMore = (messages && messages.length > 0);
          const lastMessageTimestamp = hasMore ? messages[0].createdAt : null;
          messagesDispatcher({
            type: messageActionTypes.GET_PREV_MESSAGES_SUCESS,
            payload: {
              currentOpenChannel,
              messages,
              hasMore,
              lastMessageTimestamp,
            },
          });
          setTimeout(() => { scrollIntoLast(); });
        } else {
          logger.error('OpenChannel | useInitialMessagesFetch: Fetching messages failed', error);
          messagesDispatcher({
            type: messageActionTypes.GET_PREV_MESSAGES_FAIL,
            payload: {
              currentOpenChannel,
              messages: [],
              hasMore: false,
              lastMessageTimestamp: 0,
            },
          });
        }
      });
    }
  }, [currentOpenChannel, userFilledMessageListParams]);
}

export default useInitialMessagesFetch;
