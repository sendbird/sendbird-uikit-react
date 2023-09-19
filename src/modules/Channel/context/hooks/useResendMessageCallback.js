import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { isMultipleFilesMessage } from '../../../../utils';

function useResendMessageCallback({
  currentGroupChannel,
  messagesDispatcher,
}, {
  logger,
}) {
  return useCallback((failedMessage) => {
    logger.info('Channel: Resending message has started', failedMessage);
    const { messageType, file } = failedMessage;
    if (failedMessage?.isResendable) {
      // Move the logic setting sendingStatus to pending into the reducer
      // eslint-disable-next-line no-param-reassign
      failedMessage.requestState = 'pending';
      // eslint-disable-next-line no-param-reassign
      failedMessage.sendingStatus = 'pending';
      messagesDispatcher({
        type: messageActionTypes.RESEND_MESSAGE_START,
        payload: failedMessage,
      });

      // userMessage
      if (messageType === 'user') {
        currentGroupChannel.resendUserMessage(failedMessage)
          .then((message) => {
            logger.info('Channel: Resending message success!', message);
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_SUCESS,
              payload: message,
            });
          })
          .catch((e) => {
            logger.warning('Channel: Resending message failed!', e);
            // eslint-disable-next-line no-param-reassign
            failedMessage.requestState = 'failed';
            // eslint-disable-next-line no-param-reassign
            failedMessage.sendingStatus = 'failed';
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_FAILURE,
              payload: failedMessage,
            });
          });

        // eslint-disable-next-line no-param-reassign
        failedMessage.requestState = 'pending';
        // eslint-disable-next-line no-param-reassign
        failedMessage.sendingStatus = 'pending';
        messagesDispatcher({
          type: messageActionTypes.RESEND_MESSAGE_START,
          payload: failedMessage,
        });
        return;
      }

      if (messageType === 'file') {
        currentGroupChannel
          .resendFileMessage(failedMessage, file)
          .then((message) => {
            logger.info('Channel: Resending file message success!', message);
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_SUCESS,
              payload: message,
            });
          })
          .catch((e) => {
            logger.warning('Channel: Resending file message failed!', e);
            // eslint-disable-next-line no-param-reassign
            failedMessage.requestState = 'failed';
            // eslint-disable-next-line no-param-reassign
            failedMessage.sendingStatus = 'failed';
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_FAILURE,
              payload: failedMessage,
            });
          });

        // eslint-disable-next-line no-param-reassign
        failedMessage.requestState = 'pending';
        // eslint-disable-next-line no-param-reassign
        failedMessage.sendingStatus = 'pending';
        messagesDispatcher({
          type: messageActionTypes.RESEND_MESSAGE_START,
          payload: failedMessage,
        });
      }

      if (isMultipleFilesMessage(failedMessage)) {
        currentGroupChannel.resendMessage(failedMessage)
          .onPending((message) => {
            messagesDispatcher({
              type: messageActionTypes.RESEND_MESSAGE_START,
              payload: message,
            });
          })
          // TODO: Handle on file info upload event.
          .onSucceeded((message) => {
            logger.info('Channel: Resending multiple files message success!', message);
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_SUCESS,
              payload: message,
            });
          })
          .onFailed((e, message) => {
            logger.warning('Channel: Resending multiple files message failed!', e);
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_FAILURE,
              payload: message,
            });
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
