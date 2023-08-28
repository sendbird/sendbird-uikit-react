import { GroupChannel } from '@sendbird/chat/groupChannel';
import { useCallback } from 'react';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import {SendableMessageType} from "../../../../utils";

interface DynamicProps {
  currentChannel: GroupChannel;
  threadDispatcher: CustomUseReducerDispatcher;
}
interface StaticProps {
  logger: Logger;
}

export default function useDeleteMessageCallback({
  currentChannel,
  threadDispatcher,
}: DynamicProps, {
  logger,
}: StaticProps): (message: SendableMessageType) => Promise<SendableMessageType> {
  return useCallback((message: SendableMessageType): Promise<SendableMessageType> => {
    logger.info('Thread | useDeleteMessageCallback: Deleting message.', message);
    const { sendingStatus } = message;
    return new Promise((resolve, reject) => {
      logger.info('Thread | useDeleteMessageCallback: Deleting message requestState:', sendingStatus);
      // Message is only on local
      if (sendingStatus === 'failed' || sendingStatus === 'pending') {
        logger.info('Thread | useDeleteMessageCallback: Deleted message from local:', message);
        threadDispatcher({
          type: ThreadContextActionTypes.ON_MESSAGE_DELETED_BY_REQ_ID,
          payload: message.reqId,
        });
        resolve(message);
      }

      logger.info('Thread | useDeleteMessageCallback: Deleting message from remote:', sendingStatus);
      currentChannel?.deleteMessage?.(message)
        .then(() => {
          logger.info('Thread | useDeleteMessageCallback: Deleting message success!', message);
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_DELETED,
            payload: { message, channel: currentChannel },
          });
          resolve(message);
        })
        .catch((err) => {
          logger.warning('Thread | useDeleteMessageCallback: Deleting message failed!', err);
          reject(err);
        });
    });
  }, [currentChannel]);
}
