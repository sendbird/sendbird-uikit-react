import React, { useCallback, useEffect } from 'react';
import { MessageListParams, ReplyType } from '@sendbird/chat/message';

import * as utils from '../utils';
import * as messageActionTypes from '../dux/actionTypes';
import { PREV_RESULT_SIZE, NEXT_RESULT_SIZE } from '../const';
import { CoreMessageType } from '../../../../utils';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SCROLL_BOTTOM_DELAY_FOR_FETCH } from '../../../../utils/consts';

type UseInitialMessagesFetchOptions = {
  currentGroupChannel: GroupChannel | null;
  initialTimeStamp: number | null | undefined;
  userFilledMessageListQuery?: MessageListParamsInternal;
  replyType: ReplyTypeInternal;
  setIsScrolled: (val: boolean) => void;
};

type UseInitialMessagesFetchParams = {
  logger: LoggerInterface
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  scrollRef: React.RefObject<HTMLElement>;
};

function useInitialMessagesFetch(
  {
    currentGroupChannel,
    initialTimeStamp,
    userFilledMessageListQuery,
    replyType,
    setIsScrolled,
  }: UseInitialMessagesFetchOptions,
  { logger, scrollRef, messagesDispatcher }: UseInitialMessagesFetchParams,
): () => void {
  const channelUrl = currentGroupChannel?.url;

  /**
   * useCallback(() => {}, [currentGroupChannel]) was buggy, that is why we did
   * const channelUrl = currentGroupChannel && currentGroupChannel.url;
   * useCallback(() => {}, [channelUrl])
   * Again, this hook is supposed to execute when currentGroupChannel changes
   * The 'channelUrl' here is not the same memory reference from Conversation.props
   */
  const fetchMessages = useCallback(() => {
    logger.info('Channel useInitialMessagesFetch: Setup started', currentGroupChannel);
    setIsScrolled(false);
    messagesDispatcher({
      type: messageActionTypes.RESET_MESSAGES,
      payload: null,
    });

    if (currentGroupChannel && currentGroupChannel?.getMessagesByTimestamp) {
      const messageListParams: MessageListParamsInternal = {
        prevResultSize: PREV_RESULT_SIZE,
        isInclusive: true,
        includeReactions: true,
        includeMetaArray: true,
      };
      if (initialTimeStamp) {
        messageListParams.nextResultSize = NEXT_RESULT_SIZE;
      }
      if (replyType === 'QUOTE_REPLY' || replyType === 'THREAD') {
        messageListParams.includeThreadInfo = true;
        messageListParams.includeParentMessageInfo = true;
        messageListParams.replyType = ReplyType.ONLY_REPLY_TO_CHANNEL;
      }
      if (userFilledMessageListQuery) {
        Object.keys(userFilledMessageListQuery).forEach((key) => {
          // @ts-ignore
          messageListParams[key] = userFilledMessageListQuery[key];
        });
      }
      if (
        (replyType
          && (replyType === 'QUOTE_REPLY' || replyType === 'THREAD'))
        || userFilledMessageListQuery
      ) {
        logger.info('Channel useInitialMessagesFetch: Setup messageListParams', messageListParams);
        messagesDispatcher({
          type: messageActionTypes.MESSAGE_LIST_PARAMS_CHANGED,
          payload: messageListParams,
        });
      }

      logger.info('Channel: Fetching messages', { currentGroupChannel, userFilledMessageListQuery });
      messagesDispatcher({
        type: messageActionTypes.FETCH_INITIAL_MESSAGES_START,
        payload: null,
      });

      currentGroupChannel
        .getMessagesByTimestamp(
          initialTimeStamp || new Date().getTime(),
          messageListParams as MessageListParams,
        )
        .then((messages) => {
          messagesDispatcher({
            type: messageActionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
            payload: {
              currentGroupChannel,
              messages: messages as CoreMessageType[],
            },
          });
        })
        .catch((error) => {
          logger.error('Channel: Fetching messages failed', error);
          messagesDispatcher({
            type: messageActionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
            payload: { currentGroupChannel },
          });
        })
        .finally(() => {
          if (!initialTimeStamp) {
            setTimeout(() => utils.scrollIntoLast(0, scrollRef, setIsScrolled), SCROLL_BOTTOM_DELAY_FOR_FETCH);
          } else {
            setTimeout(() => {
              utils.scrollToRenderedMessage(
                scrollRef,
                initialTimeStamp,
                setIsScrolled,
              );
            }, 500);
          }
        });
    }
  }, [channelUrl, userFilledMessageListQuery, initialTimeStamp]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return fetchMessages;
}

export default useInitialMessagesFetch;
