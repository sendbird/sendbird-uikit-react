import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import topics from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from '../../../internalInterfaces';

export type OnBeforeSendUserMessageType = (message: string, quoteMessage?: SendableMessageType) => UserMessageCreateParams;
interface DynamicProps {
  isMentionEnabled: boolean;
  currentChannel: GroupChannel;
  onBeforeSendUserMessage?: OnBeforeSendUserMessageType;
}
interface StaticProps {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}

export type SendMessageParams = {
  message: string;
  quoteMessage?: SendableMessageType;
  mentionTemplate?: string;
  mentionedUsers?: Array<User>;
};

export default function useSendUserMessageCallback({
  isMentionEnabled,
  currentChannel,
  onBeforeSendUserMessage,
}: DynamicProps, {
  logger,
  pubSub,
  threadDispatcher,
}: StaticProps): (props: SendMessageParams) => void {
  const sendMessage = useCallback((props: SendMessageParams) => {
    const {
      message,
      quoteMessage,
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

    const params = onBeforeSendUserMessage?.(message, quoteMessage) ?? createDefaultParams();
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
            publishingModules: [PublishingModuleType.THREAD],
          });
        });
    }
  }, [isMentionEnabled, currentChannel]);
  return sendMessage;
}
