import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import topics from '../../../../lib/pubSub/topics';

interface DynamicProps {
  isMentionEnabled: boolean;
  currentChannel: GroupChannel;
}
interface StaticProps {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}

export type SendMessageParams = {
  message: string;
  quoteMessage?: UserMessage | FileMessage;
  mentionTemplate?: string;
  mentionedUsers?: Array<User>;
};

export default function useSendUserMessageCallback({
  isMentionEnabled,
  currentChannel,
}: DynamicProps, {
  logger,
  pubSub,
  threadDispatcher,
}: StaticProps): (props: SendMessageParams) => void {
  const sendMessage = useCallback((props: SendMessageParams) => {
    const {
      message,
      quoteMessage = null,
      mentionTemplate,
      mentionedUsers,
    } = props;
    const createDefaultParams = () => {
      const params = {} as UserMessageCreateParams;
      params.message = message;
      const mentionedUsersLength = mentionedUsers?.length || 0;
      if (isMentionEnabled && mentionedUsersLength) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate && mentionedUsersLength) {
        params.mentionedMessageTemplate = mentionTemplate;
      }
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };

    const params = createDefaultParams();
    logger.info('Thread | useSendUserMessageCallback: Sending user message start.', params);

    if (currentChannel?.sendUserMessage) {
      currentChannel?.sendUserMessage(params)
        .onPending((pendingMessage) => {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_START,
            payload: { message: pendingMessage },
          });
        })
        .onFailed((error, message) => {
          logger.info('Thread | useSendUserMessageCallback: Sending user message failed.', { message, error });
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { error, message },
          });
        })
        .onSucceeded((message) => {
          logger.info('Thread | useSendUserMessageCallback: Sending user message succeeded.', message);
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
            payload: { message },
          });
          // because Thread doesn't subscribe SEND_USER_MESSAGE
          pubSub.publish(topics.SEND_USER_MESSAGE, {
            channel: currentChannel,
            message: message,
          });
        });
    }
  }, [isMentionEnabled, currentChannel]);
  return sendMessage;
}
