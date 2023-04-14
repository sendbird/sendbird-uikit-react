import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useCallback } from 'react';
import { Logger } from '../../../..';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
}

type MessagesDispatcherType = {
  type: string, payload: any,
};

interface StaticParams {
  logger: Logger;
  messagesDispatcher: (dispatcher: MessagesDispatcherType) => void;
}

type CallbackReturn = (
  message: UserMessage | FileMessage,
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
      if (!(message.messageType === 'file' || message.messageType === 'user')) {
        return;
      }
      const messageToDelete = message as UserMessage;
      currentOpenChannel.deleteMessage(messageToDelete).then(() => {
        logger.info('OpenChannel | useDeleteMessageCallback: Deleting message on server', sendingStatus);
        if (callback) {
          callback();
        }
        logger.info('OpenChannel | useDeleteMessageCallback: Deleting message succeeded', message);
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED,
          payload: {
            channel: currentOpenChannel,
            messageId: message.messageId,
          },
        });
      }).catch((error) => {
        logger.warning('OpenChannel | useDeleteMessageCallback: Deleting message failed', error);
      });
    }
  }, [currentOpenChannel]);
}

export default useDeleteMessageCallback;
