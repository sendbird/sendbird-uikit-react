import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

function useDeleteMessageCallback({ currentGroupChannel, messagesDispatcher }, { logger }) {
  return useCallback((message, cb) => {
    logger.info('Channel | useDeleteMessageCallback: Deleting message', message);
    const { requestState } = message;
    logger.info('Channel | useDeleteMessageCallback: Deleting message requestState:', requestState);

    // Message is only on local
    if (requestState === 'failed' || requestState === 'pending') {
      logger.info('Channel | useDeleteMessageCallback: Deleted message from local:', message);
      messagesDispatcher({
        type: messageActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
        payload: message.reqId,
      });
      if (cb) { cb(); }
      return;
    }

    // Message is on server
    currentGroupChannel.deleteMessage(message, (err) => {
      logger.info('Channel | useDeleteMessageCallback: Deleting message from remote:', requestState);
      if (cb) { cb(err); }
      if (!err) {
        logger.info('Channel | useDeleteMessageCallback: Deleting message success!', message);
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED,
          payload: message.messageId,
        });
      } else {
        logger.warning('Channel | useDeleteMessageCallback: Deleting message failed!', err);
      }
    });
  }, [currentGroupChannel, messagesDispatcher]);
}

export default useDeleteMessageCallback;
