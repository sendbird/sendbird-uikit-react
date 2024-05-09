import { GroupChannel } from '@sendbird/chat/groupChannel';
import { useCallback } from 'react';
import { Logger } from '../../../../lib/SendbirdState';
import { BaseMessage } from '@sendbird/chat/message';

interface DynamicProps {
  currentChannel: GroupChannel | null;
}
interface StaticProps {
  logger: Logger;
}

export default function useToggleReactionCallback({
  currentChannel,
}: DynamicProps, {
  logger,
}: StaticProps) {
  return useCallback((message: BaseMessage, key: string, isReacted: boolean) => {
    if (isReacted) {
      currentChannel?.deleteReaction?.(message, key)
        .then((res) => {
          logger.info('Thread | useToggleReactionsCallback: Delete reaction succeeded.', res);
        })
        .catch((err) => {
          logger.warning('Thread | useToggleReactionsCallback: Delete reaction failed.', err);
        });
      return;
    }
    currentChannel?.addReaction?.(message, key)
      .then((res) => {
        logger.info('Thread | useToggleReactionsCallback: Add reaction succeeded.', res);
      })
      .catch((err) => {
        logger.warning('Thread | useToggleReactionsCallback: Add reaction failed.', err);
      });
  }, [currentChannel]);
}
