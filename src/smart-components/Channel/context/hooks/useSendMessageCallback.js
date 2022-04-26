import { useRef, useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import * as topics from '../../../../lib/pubSub/topics';

export default function useSendMessageCallback({ currentGroupChannel, onBeforeSendUserMessage, isMentionEnabled }, {
  sdk,
  logger,
  pubSub,
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
        const params = new sdk.UserMessageParams();
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
      console.log('보내기 전 ', params)

      logger.info('Channel: Sending message has started', params);
      const pendingMsg = currentGroupChannel.sendUserMessage(params, (res, err) => {
        const swapParams = sdk.getErrorFirstCallback();
        let message = res;
        let error = err;
        if (swapParams) {
          message = err;
          error = res;
        }
        // sending params instead of pending message
        // to make sure that we can resend the message once it fails
        if (error) {
          logger.warning('Channel: Sending message failed!', {
            message,
          });
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
            payload: message,
          });
          return;
        }
        logger.info('Channel: Sending message success!', message);
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
          payload: message,
        });
      });
      pubSub.publish(topics.SEND_MESSAGE_START, {
        /* pubSub is used instead of messagesDispatcher
          to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
        message: pendingMsg,
        channel: currentGroupChannel,
      });
      setTimeout(() => utils.scrollIntoLast());
    },
    [currentGroupChannel, onBeforeSendUserMessage],
  );

  return [messageInputRef, sendMessage];
}
