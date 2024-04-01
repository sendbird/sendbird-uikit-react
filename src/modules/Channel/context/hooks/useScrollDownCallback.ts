import React, { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import { NEXT_RESULT_SIZE } from '../const';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { SBUEventHandlers, SdkStore } from '../../../../lib/types';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { BaseMessage, MessageListParams, ReplyType } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';

type UseScrollDownCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  latestMessageTimeStamp: number;
  userFilledMessageListQuery: MessageListParamsInternal;
  hasMoreNext: boolean;
  replyType: ReplyTypeInternal;
};
type UseScrollDownCallbackParams = {
  logger: LoggerInterface;
  eventHandlers?: SBUEventHandlers
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  sdk: SdkStore['sdk'];
};
type Callback = (param: [BaseMessage[], null] | [null, unknown]) => void;
function useScrollDownCallback(
  {
    currentGroupChannel,
    latestMessageTimeStamp,
    userFilledMessageListQuery,
    hasMoreNext,
    replyType,
  }: UseScrollDownCallbackOptions,
  { logger, messagesDispatcher, sdk, eventHandlers }: UseScrollDownCallbackParams,
) {
  return useCallback(
    (cb: Callback) => {
      if (!hasMoreNext) {
        return;
      }
      const isReactionEnabled = sdk?.appInfo?.useReaction ?? false;
      const messageListParams: MessageListParamsInternal = {
        nextResultSize: NEXT_RESULT_SIZE,
        isInclusive: true,
        includeReactions: isReactionEnabled,
        includeMetaArray: true,
      };
      if (replyType && (replyType === 'QUOTE_REPLY' || replyType === 'THREAD')) {
        messageListParams.includeThreadInfo = true;
        messageListParams.includeParentMessageInfo = true;
        messageListParams.replyType = ReplyType.ONLY_REPLY_TO_CHANNEL;
      }
      if (userFilledMessageListQuery) {
        Object.keys(userFilledMessageListQuery).forEach((key) => {
          messageListParams[key] = userFilledMessageListQuery[key];
        });
      }
      logger.info('Channel: Fetching later messages', { currentGroupChannel, userFilledMessageListQuery });

      currentGroupChannel
        .getMessagesByTimestamp(latestMessageTimeStamp || new Date().getTime(), messageListParams as MessageListParams)
        .then((messages) => {
          messagesDispatcher({
            type: messageActionTypes.FETCH_NEXT_MESSAGES_SUCCESS,
            payload: { currentGroupChannel, messages: messages as CoreMessageType[] },
          });
          setTimeout(() => cb([messages, null]));
        })
        .catch((error) => {
          logger.error('Channel: Fetching later messages failed', error);
          eventHandlers?.request?.onFailed?.(error);
          messagesDispatcher({
            type: messageActionTypes.FETCH_NEXT_MESSAGES_FAILURE,
            payload: { currentGroupChannel },
          });
          setTimeout(() => cb([null, error]));
        });
    },
    [currentGroupChannel, latestMessageTimeStamp, hasMoreNext, replyType],
  );
}

export default useScrollDownCallback;
