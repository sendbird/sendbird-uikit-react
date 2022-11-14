import { useRef, useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import * as topics from '../../../../lib/pubSub/topics';

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
        params.message = message?.trim() || message;
        // if (isMentionEnabled && mentionedUserIds?.length > 0) {
        if (isMentionEnabled && mentionedUsers?.length > 0) {
          // params.mentionedUserIds = mentionedUserIds;
          params.mentionedUsers = mentionedUsers;
        }
        // if (isMentionEnabled && mentionTemplate && mentionedUserIds?.length > 0) {
        if (isMentionEnabled && mentionTemplate && mentionedUsers?.length > 0) {
          params.mentionedMessageTemplate = mentionTemplate?.trim() || mentionTemplate;
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
              to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
            message: pendingMsg,
            channel: currentGroupChannel,
          });
          setTimeout(() => utils.scrollIntoLast(0, scrollRef));
        })
        .onFailed((err, msg) => {
          logger.warning('Channel: Sending message failed!', { message: msg, error: err });
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
            payload: msg,
          });
        })
        .onSucceeded((msg) => {
          logger.info('Channel: Sending message success!', msg);
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
            payload: msg,
          });
        });
    },
    [currentGroupChannel, onBeforeSendUserMessage],
  );

  return [messageInputRef, sendMessage];
}
