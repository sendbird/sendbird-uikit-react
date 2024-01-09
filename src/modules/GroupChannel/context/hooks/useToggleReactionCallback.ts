import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { BaseMessage } from '@sendbird/chat/message';

const LOG_PRESET = 'useToggleReactionCallback:';

export default function useToggleReactionCallback(
  currentChannel: GroupChannel | null,
  logger?: LoggerInterface,
) {
  return useCallback(
    (message: BaseMessage, key: string, isReacted: boolean) => {
      if (!currentChannel) {
        logger.warning(`${LOG_PRESET} currentChannel doesn't exist`, currentChannel);
        return;
      }
      if (isReacted) {
        currentChannel
          .deleteReaction(message, key)
          .then((res) => {
            logger.info(`${LOG_PRESET} Delete reaction success`, res);
          })
          .catch((err) => {
            logger.warning(`${LOG_PRESET} Delete reaction failed`, err);
          });
      } else {
        currentChannel
          .addReaction(message, key)
          .then((res) => {
            logger.info(`${LOG_PRESET} Add reaction success`, res);
          })
          .catch((err) => {
            logger.warning(`${LOG_PRESET} Add reaction failed`, err);
          });
      }
    },
    [currentChannel],
  );
}
