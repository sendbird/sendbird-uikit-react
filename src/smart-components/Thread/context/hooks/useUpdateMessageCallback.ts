import { useCallback } from "react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { UserMessage, UserMessageUpdateParams } from "@sendbird/chat/message";

import { CustomUseReducerDispatcher, Logger } from "../../../../lib/SendbirdState";
import { ThreadContextActionTypes } from "../dux/actionTypes";

import * as topics from '../../../../lib/pubSub/topics';

interface DynamicProps {
  currentChannel: GroupChannel;
  isMentionEnabled?: boolean;
}
interface StaticProps {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useUpdateMessageCallback({
  currentChannel,
  isMentionEnabled,
}: DynamicProps, {
  logger,
  pubSub,
  threadDispatcher,
}: StaticProps) {
  return useCallback((props) => {
    const {
      messageId,
      message,
      mentionedUsers,
      mentionTemplate,
    } = props;
    const createParamsDefault = () => {
      const params = {} as UserMessageUpdateParams;
      params.message = message;
      if (isMentionEnabled && mentionedUsers?.length > 0) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate) {
        params.mentionedMessageTemplate = mentionTemplate;
      } else {
        params.mentionedMessageTemplate = message;
      }
      return params;
    };

    const params = createParamsDefault();

    currentChannel?.updateUserMessage?.(messageId, params)
      .then((message: UserMessage) => {
        threadDispatcher({
          type: ThreadContextActionTypes.ON_MESSAGE_UPDATED,
          payload: {
            channel: currentChannel,
            message: message,
          },
        });
        pubSub.publish(
          topics.UPDATE_USER_MESSAGE,
          {
            fromSelector: true,
            channel: currentChannel,
            message: message,
          },
        );
      });
  }, [currentChannel, isMentionEnabled])
}
