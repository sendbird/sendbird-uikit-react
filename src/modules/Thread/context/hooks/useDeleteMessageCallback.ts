import { GroupChannel } from '@sendbird/chat/groupChannel';
import { useCallback } from 'react';
import { Logger } from '../../../../lib/SendbirdState';
import { SendableMessageType } from '../../../../utils';

interface DynamicProps {
  currentChannel: GroupChannel | null;
  onMessageDeletedByReqId: (reqId: string | number) => void,
  onMessageDeleted: (channel: GroupChannel, messageId: number) => void,
}
interface StaticProps {
  logger: Logger;
}

export default function useDeleteMessageCallback({
  currentChannel,
  onMessageDeletedByReqId,
  onMessageDeleted,
}: DynamicProps, {
  logger,
}: StaticProps): (message: SendableMessageType) => Promise<void> {
  return useCallback((message: SendableMessageType): Promise<void> => {
    logger.info('Thread | useDeleteMessageCallback: Deleting message.', message);
    const { sendingStatus } = message;
    return new Promise((resolve, reject) => {
      logger.info('Thread | useDeleteMessageCallback: Deleting message requestState:', sendingStatus);
      // Message is only on local
      if (sendingStatus === 'failed' || sendingStatus === 'pending') {
        logger.info('Thread | useDeleteMessageCallback: Deleted message from local:', message);
        onMessageDeletedByReqId(message.reqId);
        resolve();
      }

      logger.info('Thread | useDeleteMessageCallback: Deleting message from remote:', sendingStatus);
      currentChannel?.deleteMessage?.(message)
        .then(() => {
          logger.info('Thread | useDeleteMessageCallback: Deleting message success!', message);
          onMessageDeleted(currentChannel, message.messageId);
          resolve();
        })
        .catch((err) => {
          logger.warning('Thread | useDeleteMessageCallback: Deleting message failed!', err);
          reject(err);
        });
    });
  }, [currentChannel]);
}
