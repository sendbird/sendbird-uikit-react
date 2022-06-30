import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

function useDeleteMessageCallback({ currentGroupChannel, messagesDispatcher }, { logger }) {
  return useCallback((message) => {
    logger.info('Channel | useDeleteMessageCallback: Deleting message', message);
    const { requestState } = message;
    return new Promise((resolve, reject) => {
      logger.info('Channel | useDeleteMessageCallback: Deleting message requestState:', requestState);
      // Message is only on local
      if (requestState === 'failed' || requestState === 'pending') {
        logger.info('Channel | useDeleteMessageCallback: Deleted message from local:', message);
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
          payload: message.reqId,
        });
        resolve(message);
      }

      logger.info('Channel | useDeleteMessageCallback: Deleting message from remote:', requestState);
      currentGroupChannel?.deleteMessage(message).then(() => {
        logger.info('Channel | useDeleteMessageCallback: Deleting message success!', message);
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED,
          payload: message.messageId,
        });
        resolve(message);
      }).catch((err) => {
        logger.warning('Channel | useDeleteMessageCallback: Deleting message failed!', err);
        reject(err);
      });
    });
  }, [currentGroupChannel, messagesDispatcher]);
}

export default useDeleteMessageCallback;
