import React, { useCallback } from 'react';
import { ReplyType, MessageListParams } from '@sendbird/chat/message';

import * as messageActionTypes from '../dux/actionTypes';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { PREV_RESULT_SIZE } from '../const';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { LoggerInterface } from '../../../../lib/Logger';
import { ChannelActionTypes } from '../dux/actionTypes';
import { CoreMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';

type UseScrollCallbackOptions = {
  currentGroupChannel: GroupChannel | null;
  oldestMessageTimeStamp: number;
  userFilledMessageListQuery?: MessageListParamsInternal;
  replyType: ReplyTypeInternal;
};

type UseScrollCallbackParams = {
  hasMorePrev: boolean;
  logger: LoggerInterface;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  sdk: SdkStore['sdk'];
};

function useScrollCallback(
  { currentGroupChannel, oldestMessageTimeStamp, userFilledMessageListQuery, replyType }: UseScrollCallbackOptions,
  { hasMorePrev, logger, messagesDispatcher, sdk }: UseScrollCallbackParams,
) {
  return useCallback((callback: () => void) => {
    if (!hasMorePrev) {
      return;
    }

    const messageListParams: MessageListParamsInternal = {
      prevResultSize: PREV_RESULT_SIZE,
      isInclusive: true,
      includeMetaArray: true,
      includeReactions: sdk?.appInfo?.useReaction ?? false,
    };

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

    logger.info('Channel: Fetching messages', {
      currentGroupChannel,
      userFilledMessageListQuery,
    });

    currentGroupChannel?.getMessagesByTimestamp(oldestMessageTimeStamp || new Date().getTime(), messageListParams as MessageListParams)
      .then((messages) => {
        messagesDispatcher({
          type: messageActionTypes.FETCH_PREV_MESSAGES_SUCCESS,
          payload: { currentGroupChannel, messages: messages as CoreMessageType[] },
        });
        if (callback) setTimeout(() => callback());
      })
      .catch(() => {
        messagesDispatcher({
          type: messageActionTypes.FETCH_PREV_MESSAGES_FAILURE,
          payload: { currentGroupChannel },
        });
      });
  }, [currentGroupChannel, oldestMessageTimeStamp, replyType]);
}

export default useScrollCallback;
