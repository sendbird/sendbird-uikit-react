import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface MainProps {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
}
interface ToolProps {
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

type CallbackReturn = (
  message: SendbirdUIKit.ClientUserMessage | SendbirdUIKit.ClientFileMessage,
  callback?: () => void,
) => void;

function useDeleteMessageCallback(
  { currentOpenChannel }: MainProps,
  { logger, messagesDispatcher }: ToolProps,
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
      currentOpenChannel.deleteMessage(message, (error) => {
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
