import { MessageListParams } from '@sendbird/chat/message';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import React, { useEffect } from 'react';

import type { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import { scrollIntoLast } from '../utils';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  userFilledMessageListParams?: Record<string, any>;
}
interface StaticParams {
  logger: Logger;
  messagesDispatcher: CustomUseReducerDispatcher;
  scrollRef: React.RefObject<HTMLElement>;
}

function useInitialMessagesFetch(
  { currentOpenChannel, userFilledMessageListParams }: DynamicParams,
  { logger, messagesDispatcher, scrollRef }: StaticParams,
): void {
  useEffect(() => {
    logger.info('OpenChannel | useInitialMessagesFetch: Setup started', currentOpenChannel);
    messagesDispatcher({
      type: messageActionTypes.RESET_MESSAGES,
      payload: null,
    });

    if (currentOpenChannel && currentOpenChannel.getMessagesByTimestamp) {
      const messageListParams: MessageListParams = {
        nextResultSize: 0,
        prevResultSize: 30,
        isInclusive: true,
        includeReactions: false,
      };
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
      currentOpenChannel.getMessagesByTimestamp(new Date().getTime(), messageListParams).then((messages) => {
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
        setTimeout(() => { scrollIntoLast(0, scrollRef); });
      }).catch((error) => {
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
      });
    }
  }, [currentOpenChannel, userFilledMessageListParams]);
}

export default useInitialMessagesFetch;
