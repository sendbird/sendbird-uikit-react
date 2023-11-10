import React, { useCallback, useRef } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import * as utils from '../utils';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { SendableMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';

type UseSendMessageCallbackOptions = {
  isMentionEnabled: boolean;
  currentGroupChannel: null | GroupChannel;
  onBeforeSendUserMessage?: (message: string, quoteMessage?: SendableMessageType) => UserMessageCreateParams;
};
type UseSendMessageCallbackParams = {
  logger: LoggerInterface;
  pubSub: SBUGlobalPubSub;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type SendMessageParams = {
  message: string;
  quoteMessage?: SendableMessageType;
  // mentionedUserIds?: string[];
  mentionedUsers?: User[];
  mentionTemplate?: string;
};
export default function useSendMessageCallback(
  { isMentionEnabled, currentGroupChannel, onBeforeSendUserMessage }: UseSendMessageCallbackOptions,
  { logger, pubSub, scrollRef, messagesDispatcher }: UseSendMessageCallbackParams,
) {
  const messageInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useCallback(
    ({
      quoteMessage,
      message,
      mentionTemplate,
      // mentionedUserIds,
      mentionedUsers,
    }: SendMessageParams) => {
      const createParamsDefault = () => {
        const params: UserMessageCreateParams = {
          message,
        };
        // if (isMentionEnabled && mentionedUserIds?.length > 0) {
        if (isMentionEnabled && mentionedUsers?.length > 0) {
          // params.mentionedUserIds = mentionedUserIds;
          params.mentionedUsers = mentionedUsers;
        }
        // if (isMentionEnabled && mentionTemplate && mentionedUserIds?.length > 0) {
        if (isMentionEnabled && mentionTemplate && mentionedUsers?.length > 0) {
          params.mentionedMessageTemplate = mentionTemplate;
        }
        if (quoteMessage) {
          params.isReplyToChannel = true;
          params.parentMessageId = quoteMessage.messageId;
        }
        return params;
      };

      const shouldCreateCustomParams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';

      if (shouldCreateCustomParams) {
        logger.info('Channel: creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
      }

      const params = shouldCreateCustomParams ? onBeforeSendUserMessage(message, quoteMessage) : createParamsDefault();

      logger.info('Channel: Sending message has started', params);
      currentGroupChannel
        .sendUserMessage(params)
        .onPending((pendingMsg) => {
          pubSub.publish(topics.SEND_MESSAGE_START, {
            /* pubSub is used instead of messagesDispatcher
              to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
            message: pendingMsg as UserMessage,
            channel: currentGroupChannel,
            publishingModules: [PublishingModuleType.CHANNEL],
          });
          setTimeout(() => utils.scrollIntoLast(0, scrollRef));
        })
        .onFailed((err, msg) => {
          logger.warning('Channel: Sending message failed!', { message: msg, error: err });
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGE_FAILURE,
            payload: msg as SendableMessageType,
          });
        })
        .onSucceeded((msg) => {
          logger.info('Channel: Sending message success!', msg);
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGE_SUCCESS,
            payload: msg as SendableMessageType,
          });
        });
    },
    [currentGroupChannel, onBeforeSendUserMessage],
  );

  return [messageInputRef, sendMessage] as const;
}
