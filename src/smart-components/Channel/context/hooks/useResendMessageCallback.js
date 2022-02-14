import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

function useResendMessageCallback({
  currentGroupChannel,
  messagesDispatcher,
}, {
  logger,
}) {
  return useCallback((failedMessage) => {
    logger.info('Channel: Resending message has started', failedMessage);
    const { messageType, file } = failedMessage;
    if (failedMessage && typeof failedMessage.isResendable === 'function'
      && failedMessage.isResendable()
    ) {
      // eslint-disable-next-line no-param-reassign
      failedMessage.requestState = 'pending';
      messagesDispatcher({
        type: messageActionTypes.RESEND_MESSAGEGE_START,
        payload: failedMessage,
      });

      // userMessage
      if (messageType === 'user') {
        currentGroupChannel
          .resendUserMessage(failedMessage)
          .then((message) => {
            logger.info('Channel: Resending message success!', { message });
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
              payload: message,
            });
          })
          .catch((e) => {
            logger.warning('Channel: Resending message failed!', { e });
            // eslint-disable-next-line no-param-reassign
            failedMessage.requestState = 'failed';
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
              payload: failedMessage,
            });
          });

        // eslint-disable-next-line no-param-reassign
        failedMessage.requestState = 'pending';
        messagesDispatcher({
          type: messageActionTypes.RESEND_MESSAGEGE_START,
          payload: failedMessage,
        });
        return;
      }

      if (messageType === 'file') {
        currentGroupChannel
          .resendFileMessage(failedMessage, file)
          .then((message) => {
            logger.info('Channel: Resending file message success!', { message });
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
              payload: message,
            });
          })
          .catch((e) => {
            logger.warning('Channel: Resending file message failed!', { e });
            // eslint-disable-next-line no-param-reassign
            failedMessage.requestState = 'failed';
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
              payload: failedMessage,
            });
          });

        // eslint-disable-next-line no-param-reassign
        failedMessage.requestState = 'pending';
        messagesDispatcher({
          type: messageActionTypes.RESEND_MESSAGEGE_START,
          payload: failedMessage,
        });
      }
    } else {
      // to alert user on console
      // eslint-disable-next-line no-console
      console.error('Message is not resendable');
      logger.warning('Message is not resendable', failedMessage);
    }
  }, [currentGroupChannel, messagesDispatcher]);
}

export default useResendMessageCallback;
