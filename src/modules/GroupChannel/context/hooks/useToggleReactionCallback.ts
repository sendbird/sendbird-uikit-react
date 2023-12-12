import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { BaseMessage } from '@sendbird/chat/message';

export default function useToggleReactionCallback(
  currentGroupChannel: GroupChannel | null,
  logger?: LoggerInterface,
) {
  return useCallback(
    (message: BaseMessage, key: string, isReacted: boolean) => {
      if (isReacted) {
        currentGroupChannel
          .deleteReaction(message, key)
          .then((res) => {
            logger.info('Delete reaction success', res);
          })
          .catch((err) => {
            logger.warning('Delete reaction failed', err);
          });
      } else {
        currentGroupChannel
          .addReaction(message, key)
          .then((res) => {
            logger.info('Add reaction success', res);
          })
          .catch((err) => {
            logger.warning('Add reaction failed', err);
          });
      }
    },
    [currentGroupChannel],
  );
}
