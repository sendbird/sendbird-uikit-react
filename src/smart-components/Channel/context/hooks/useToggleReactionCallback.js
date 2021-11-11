import { useCallback } from 'react';

export default function useToggleReactionCallback({ currentGroupChannel }, { logger }) {
  return useCallback((message, key, isReacted) => {
    if (isReacted) {
      currentGroupChannel.deleteReaction(message, key)
        .then((res) => {
          logger.info('Delete reaction success', res);
        })
        .catch((err) => {
          logger.warning('Delete reaction failed', err);
        });
      return;
    }
    currentGroupChannel.addReaction(message, key)
      .then((res) => {
        logger.info('Add reaction success', res);
      })
      .catch((err) => {
        logger.warning('Add reaction failed', err);
      });
  }, [currentGroupChannel]);
}
