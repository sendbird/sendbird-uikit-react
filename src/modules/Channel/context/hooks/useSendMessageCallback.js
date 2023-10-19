import { useRef, useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import topics from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';

export default function useSendMessageCallback({
  isMentionEnabled,
  currentGroupChannel,
  onBeforeSendUserMessage,
}, {
  logger,
  pubSub,
  scrollRef,
  messagesDispatcher,
}) {
  const messageInputRef = useRef(null);

  const sendMessage = useCallback(
    (props) => {
      const {
        quoteMessage = null,
        message,
        mentionTemplate,
        // mentionedUserIds,
        mentionedUsers,
      } = props;
      const createParamsDefault = () => {
        const params = {};
        params.message = message;
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

      const createCustomPrams = onBeforeSendUserMessage
        && typeof onBeforeSendUserMessage === 'function';

      if (createCustomPrams) {
        logger.info('Channel: creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
      }

      const params = onBeforeSendUserMessage
        ? onBeforeSendUserMessage(message, quoteMessage)
        : createParamsDefault();

      logger.info('Channel: Sending message has started', params);
      currentGroupChannel.sendUserMessage(params)
        .onPending((pendingMsg) => {
          pubSub.publish(topics.SEND_MESSAGE_START, {
            /* pubSub is used instead of messagesDispatcher
              to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
            message: pendingMsg,
            channel: currentGroupChannel,
            publishingModules: [PublishingModuleType.CHANNEL],
          });
          setTimeout(() => utils.scrollIntoLast(0, scrollRef));
        })
        .onFailed((err, msg) => {
          logger.warning('Channel: Sending message failed!', { message: msg, error: err });
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGE_FAILURE,
            payload: msg,
          });
        })
        .onSucceeded((msg) => {
          logger.info('Channel: Sending message success!', msg);
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGE_SUCESS,
            payload: msg,
          });
        });
    },
    [currentGroupChannel, onBeforeSendUserMessage],
  );

  return [messageInputRef, sendMessage];
}
