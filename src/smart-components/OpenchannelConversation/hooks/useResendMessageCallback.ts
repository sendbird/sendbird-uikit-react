import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface StaticParams {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
}
interface StaticParams {
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}
type CallbackReturn = (failedMessage: SendbirdUIKit.ClientUserMessage | SendbirdUIKit.ClientFileMessage) => void;

function useResendMessageCallback(
  { currentOpenChannel }: StaticParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback((failedMessage) => {
    logger.info('OpenChannel | useResendMessageCallback: Resending message has started', failedMessage);
    const { messageType, file } = failedMessage;
    if (failedMessage && typeof failedMessage.isResendable === 'function' && failedMessage.isResendable()) {
      // eslint-disable-next-line no-param-reassign
      failedMessage.requestState = 'pending';
      messagesDispatcher({
        type: messageActionTypes.RESENDING_MESSAGE_START,
        payload: {
          channel: currentOpenChannel,
          message: failedMessage,
        },
      });

      // userMessage
      if (messageType === 'user' && failedMessage.messageType === 'user') {
        currentOpenChannel.resendUserMessage(failedMessage, (message, error) => {
          if (!error) {
            logger.info('OpenChannel | useResendMessageCallback: Reseding message succeeded', message);
            messagesDispatcher({
              type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
              payload: message,
            });
          } else {
            logger.warning('OpenChannel | useResendMessageCallback: Resending message failed', error);
            // eslint-disable-next-line no-param-reassign
            failedMessage.requestState = 'failed';
            messagesDispatcher({
              type: messageActionTypes.SENDING_MESSAGE_FAILED,
              payload: failedMessage,
            });
          }
        });
        return;
      }

      // fileMessage
      if (messageType === 'file' && failedMessage.messageType === 'file') {
        currentOpenChannel.resendFileMessage(failedMessage, file, (message, error) => {
          if (!error) {
            logger.info('OpenChannel | useResendMessageCallback: Resending file message succeeded', message);
            messagesDispatcher({
              type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
              payload: message,
            });
          } else {
            logger.warning('OpenChannel | useResendMessageCallback: Resending file message failed', error);
            // eslint-disable-next-line no-param-reassign
            failedMessage.requestState = 'failed';
            messagesDispatcher({
              type: messageActionTypes.SENDING_MESSAGE_FAILED,
              payload: failedMessage,
            });
          }
        });
      }
    } else {
      // to alert user on console
      // eslint-disable-next-line no-console
      console.error('OpenChannel | useResendMessageCallback: Message is not resendable');
      logger.warning('OpenChannel | useResendMessageCallback: Message is not resendable', failedMessage);
    }
  }, [currentOpenChannel]);
}

export default useResendMessageCallback;
