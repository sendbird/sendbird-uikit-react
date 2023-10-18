import { useCallback } from "react";
import { ReplyType, MessageListParams, BaseMessage } from "@sendbird/chat/message";

import * as messageActionTypes from "../dux/actionTypes";
import { ReplyType as ReplyTypeInternal } from "../../../../types";
import { PREV_RESULT_SIZE } from "../const";
import { GroupChannel, SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { CustomUseReducerDispatcher } from "../../../../lib/SendbirdState";
import { MessageListParams as MessageListParamsInternal } from "../ChannelProvider";
import { LoggerInterface } from "../../../../lib/Logger";

type UseScrollCallbackOptions = {
  currentGroupChannel: GroupChannel;
  oldestMessageTimeStamp: number;
  userFilledMessageListQuery: MessageListParamsInternal;
  replyType: ReplyTypeInternal;
};

type UseScrollCallbackParams = {
  hasMorePrev: boolean;
  logger: LoggerInterface;
  messagesDispatcher: CustomUseReducerDispatcher;
  sdk: SendbirdGroupChat;
};

function useScrollCallback(
  { currentGroupChannel, oldestMessageTimeStamp, userFilledMessageListQuery, replyType }: UseScrollCallbackOptions,
  { hasMorePrev, logger, messagesDispatcher, sdk }: UseScrollCallbackParams
) {
  return useCallback(() => {
    if (!hasMorePrev) {
      return;
    }

    const messageListParams: MessageListParamsInternal = {
      prevResultSize: PREV_RESULT_SIZE,
      isInclusive: true,
      includeMetaArray: true,
      includeReactions: sdk?.appInfo?.useReaction ?? false,
    };

    if (replyType === "QUOTE_REPLY" || replyType === "THREAD") {
      messageListParams.includeThreadInfo = true;
      messageListParams.includeParentMessageInfo = true;
      messageListParams.replyType = ReplyType.ONLY_REPLY_TO_CHANNEL;
    }

    if (userFilledMessageListQuery) {
      Object.keys(userFilledMessageListQuery).forEach((key) => {
        messageListParams[key] = userFilledMessageListQuery[key];
      });
    }

    logger.info("Channel: Fetching messages", {
      currentGroupChannel,
      userFilledMessageListQuery,
    });

    currentGroupChannel
      .getMessagesByTimestamp(oldestMessageTimeStamp || new Date().getTime(), messageListParams as MessageListParams)
      .then((messages) => {
        messagesDispatcher({
          type: messageActionTypes.FETCH_PREV_MESSAGES_SUCCESS,
          payload: { currentGroupChannel, messages },
        });
      })
      .catch((error) => {
        messagesDispatcher({
          type: messageActionTypes.FETCH_PREV_MESSAGES_FAILURE,
          payload: { currentGroupChannel },
        });
      });
  }, [currentGroupChannel, oldestMessageTimeStamp, replyType]);
}

export default useScrollCallback;
