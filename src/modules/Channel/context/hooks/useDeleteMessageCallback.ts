import React, { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import { LoggerInterface } from '../../../../lib/Logger';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType, isSendableMessage } from '../../../../utils';
import { SendingStatus } from '@sendbird/chat/message';

type UseDeleteMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type UseDeleteMessageCallbackParams = {
  logger: LoggerInterface;
};
function useDeleteMessageCallback(
  { currentGroupChannel, messagesDispatcher }: UseDeleteMessageCallbackOptions,
  { logger }: UseDeleteMessageCallbackParams,
) {
  return useCallback(
    (message: CoreMessageType): Promise<CoreMessageType> => {
      logger.info('Channel | useDeleteMessageCallback: Deleting message', message);

      const sendingStatus = isSendableMessage(message) ? message.sendingStatus : undefined;
      return new Promise((resolve, reject) => {
        logger.info('Channel | useDeleteMessageCallback: Deleting message requestState:', sendingStatus);
        // Message is only on local
        if ((sendingStatus === SendingStatus.FAILED || sendingStatus === SendingStatus.PENDING) && 'reqId' in message) {
          logger.info('Channel | useDeleteMessageCallback: Deleted message from local:', message);
          messagesDispatcher({
            type: messageActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
            payload: message.reqId,
          });
          resolve(message);
        } else {
          logger.info('Channel | useDeleteMessageCallback: Deleting message from remote:', sendingStatus);
          currentGroupChannel
            .deleteMessage(message)
            .then(() => {
              logger.info('Channel | useDeleteMessageCallback: Deleting message success!', message);
              messagesDispatcher({
                type: messageActionTypes.ON_MESSAGE_DELETED,
                payload: message.messageId,
              });
              resolve(message);
            })
            .catch((err) => {
              logger.warning('Channel | useDeleteMessageCallback: Deleting message failed!', err);
              reject(err);
            });
        }
      });
    },
    [currentGroupChannel, messagesDispatcher],
  );
}

export default useDeleteMessageCallback;
