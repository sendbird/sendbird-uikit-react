import { GroupChannel } from '@sendbird/chat/groupChannel';
import { useCallback } from 'react';
import { Logger } from '../../../../lib/SendbirdState';

interface DynamicProps {
  currentChannel: GroupChannel;
}
interface StaticProps {
  logger: Logger;
}

export default function useToggleReactionCallback({
  currentChannel,
}: DynamicProps, {
  logger,
}: StaticProps): (message, key, isReacted) => void {
  return useCallback((message, key, isReacted) => {
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
