import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
}
interface StaticParams {
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

type CallbackReturn = (
  message: SendbirdUIKit.ClientUserMessage | SendbirdUIKit.ClientFileMessage,
  callback?: () => void,
) => void;

function useDeleteMessageCallback(
  { currentOpenChannel }: DynamicParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback((message, callback) => {
    logger.info('OpenChannel | useDeleteMessageCallback: Deleting message', message);
    const { sendingStatus } = message;
    logger.info('OpenChannel | useDeleteMessageCallback: Deleting message requestState', sendingStatus);

    if (sendingStatus === 'failed' || sendingStatus === 'pending') {
      logger.info('OpenChannel | useDeleteMessageCallback: Deleted message from local', message);
      messagesDispatcher({
        type: messageActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
        payload: message.reqId,
      });
      if (callback) {
        callback();
      }
    } else {
      if (!(message.messageType ==='file' || message.messageType === 'user')) {
        return;
      }
      const messageToDelete = message as SendBird.UserMessage;
      currentOpenChannel.deleteMessage(messageToDelete, (error) => {
        logger.info('OpenChannel | useDeleteMessageCallback: Deleting message on server', sendingStatus);
        if (callback) {
          callback();
        }
        if (!error) {
          logger.info('OpenChannel | useDeleteMessageCallback: Deleting message succeeded', message);
          messagesDispatcher({
            type: messageActionTypes.ON_MESSAGE_DELETED,
            payload: {
              channel: currentOpenChannel,
              messageId: message.messageId,
            },
          });
        } else {
          logger.warning('OpenChannel | useDeleteMessageCallback: Deleting message failed', error);
        }
      });
    }
  }, [currentOpenChannel]);
}

export default useDeleteMessageCallback;
