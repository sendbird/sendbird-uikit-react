import React, { useEffect } from 'react';

import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageListParams, ReplyType } from '@sendbird/chat/message';
import * as utils from '../utils';
import { PREV_RESULT_SIZE, NEXT_RESULT_SIZE } from '../const';
import * as messageActionTypes from '../dux/actionTypes';
import { Logger } from '../../../../lib/SendbirdState';
import { MarkAsReadSchedulerType } from '../../../../lib/hooks/useMarkAsReadScheduler';
import useReconnectOnIdle from './useReconnectOnIdle';
import { ChannelActionTypes } from '../dux/actionTypes';
import { CoreMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';
import { SCROLL_BOTTOM_DELAY_FOR_FETCH } from '../../../../utils/consts';

interface DynamicParams {
  isOnline: boolean;
  replyType?: string;
  disableMarkAsRead: boolean;
  reconnectOnIdle: boolean;
}

interface StaticParams {
  logger: Logger;
  sdk: SdkStore['sdk'];
  currentGroupChannel: GroupChannel;
  scrollRef: React.RefObject<HTMLDivElement>;
  markAsReadScheduler: MarkAsReadSchedulerType;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  userFilledMessageListQuery?: Record<string, any>;
}

function useHandleReconnect(
  { isOnline, replyType, disableMarkAsRead, reconnectOnIdle }: DynamicParams,
  {
    logger,
    sdk,
    scrollRef,
    currentGroupChannel,
    messagesDispatcher,
    markAsReadScheduler,
    userFilledMessageListQuery,
  }: StaticParams,
): void {
  const { shouldReconnect } = useReconnectOnIdle(isOnline, currentGroupChannel, reconnectOnIdle);

  useEffect(() => {
    return () => {
      // state changed from offline to online AND tab is visible
      if (shouldReconnect) {
        logger.info('Refreshing conversation state');
        const isReactionEnabled = sdk?.appInfo?.useReaction || false;

        const messageListParams: MessageListParams = {
          prevResultSize: PREV_RESULT_SIZE,
          isInclusive: true,
          includeReactions: isReactionEnabled,
          includeMetaArray: true,
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
                    messages: messages as CoreMessageType[],
                  },
                });
                setTimeout(() => utils.scrollIntoLast(0, scrollRef), SCROLL_BOTTOM_DELAY_FOR_FETCH);
              })
              .catch((error) => {
                logger.error('Channel: Fetching messages failed', error);
                messagesDispatcher({
                  type: messageActionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
                  payload: { currentGroupChannel },
                });
              });
            if (!disableMarkAsRead) {
              markAsReadScheduler.push(currentGroupChannel);
            }
          });
      }
    };
  }, [shouldReconnect, replyType]);
}

export default useHandleReconnect;
