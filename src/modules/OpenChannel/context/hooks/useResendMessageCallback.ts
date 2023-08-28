import type { FileMessage } from '@sendbird/chat/message';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useCallback } from 'react';
import { Logger } from '../../../..';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
}

type MessagesDispatcherType = { type: string, payload: any };

interface StaticParams {
  logger: Logger;
  messagesDispatcher: (dispatcher: MessagesDispatcherType) => void;
}
type CallbackReturn = (failedMessage: SendableMessageType) => void;

function useResendMessageCallback(
  { currentOpenChannel }: DynamicParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback((failedMessage) => {
    logger.info('OpenChannel | useResendMessageCallback: Resending message has started', failedMessage);
    // eslint-disable-next-line no-param-reassign
    const { messageType, file } = failedMessage as FileMessage;
    if (failedMessage && typeof failedMessage.isResendable === 'function' && failedMessage.isResendable) {
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
        currentOpenChannel.resendUserMessage(failedMessage).then((message) => {
          logger.info('OpenChannel | useResendMessageCallback: Reseding message succeeded', message);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
            payload: message,
          });
        }).catch((error) => {
          logger.warning('OpenChannel | useResendMessageCallback: Resending message failed', error);
          // eslint-disable-next-line no-param-reassign
          failedMessage.requestState = 'failed';
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_FAILED,
            payload: failedMessage,
          });
        });
      }

      // fileMessage
      if (messageType === 'file' && failedMessage.messageType === 'file') {
        currentOpenChannel.resendFileMessage(failedMessage, file).then((message) => {
          logger.info('OpenChannel | useResendMessageCallback: Resending file message succeeded', message);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
            payload: message,
          });
        }).catch((error) => {
          logger.warning('OpenChannel | useResendMessageCallback: Resending file message failed', error);
          // eslint-disable-next-line no-param-reassign
          failedMessage.requestState = 'failed';
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_FAILED,
            payload: failedMessage,
          });
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
