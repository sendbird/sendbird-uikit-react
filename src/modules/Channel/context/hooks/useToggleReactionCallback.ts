import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { BaseMessage } from '@sendbird/chat/message';

const LOG_PRESET = 'useToggleReactionCallback:';

/**
 * POTENTIAL IMPROVEMENT NEEDED:
 * Current implementation might have race condition issues when the hook is called multiple times in rapid succession:
 *
 * 1. Race Condition Risk:
 *    - Multiple rapid clicks on reaction buttons could trigger concurrent API calls
 *    - The server responses might arrive in different order than the requests were sent
 *    - This could lead to inconsistent UI states where the final reaction state doesn't match user's last action
 *
 * 2. Performance Impact:
 *    - Each click generates a separate API call without debouncing/throttling
 *    - Under high-frequency clicks, this could cause unnecessary server load
 *
 * But we won't address these issues for now since it's being used only in the legacy codebase.
 * */
export default function useToggleReactionCallback(
  currentChannel: GroupChannel | null,
  logger?: LoggerInterface,
) {
  return useCallback(
    (message: BaseMessage, key: string, isReacted: boolean) => {
      if (!currentChannel) {
        logger?.warning(`${LOG_PRESET} currentChannel doesn't exist`, currentChannel);
        return;
      }
      if (isReacted) {
        currentChannel
          .deleteReaction(message, key)
          .then((res) => {
            logger?.info(`${LOG_PRESET} Delete reaction success`, res);
          })
          .catch((err) => {
            logger?.warning(`${LOG_PRESET} Delete reaction failed`, err);
          });
      } else {
        currentChannel
          .addReaction(message, key)
          .then((res) => {
            logger?.info(`${LOG_PRESET} Add reaction success`, res);
          })
          .catch((err) => {
            logger?.warning(`${LOG_PRESET} Add reaction failed`, err);
          });
      }
    },
    [currentChannel],
  );
}
