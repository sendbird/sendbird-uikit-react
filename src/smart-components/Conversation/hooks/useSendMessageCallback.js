import { useRef, useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import * as topics from '../../../lib/pubSub/topics';

export default function useSendMessageCallback({ currentGroupChannel, onBeforeSendUserMessage }, {
  sdk,
  logger,
  pubSub,
  messagesDispatcher,
}) {
  const messageInputRef = useRef(null);

  const sendMessage = useCallback(
    (quoteMessage = null) => {
      const text = messageInputRef.current.value;
      const createParamsDefault = (txt) => {
        const message = (typeof txt === 'string') ? txt.trim() : txt;
        const params = new sdk.UserMessageParams();
        params.message = message;
        if (quoteMessage) {
          params.isReplyTochannel = true;
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
        ? onBeforeSendUserMessage(text, quoteMessage)
        : createParamsDefault(text);

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
