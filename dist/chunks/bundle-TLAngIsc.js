import { useCallback } from 'react';

var LOG_PRESET = 'useToggleReactionCallback:';
function useToggleReactionCallback(currentChannel, logger) {
    return useCallback(function (message, key, isReacted) {
        if (!currentChannel) {
            logger.warning("".concat(LOG_PRESET, " currentChannel doesn't exist"), currentChannel);
            return;
        }
        if (isReacted) {
            currentChannel
                .deleteReaction(message, key)
                .then(function (res) {
                logger.info("".concat(LOG_PRESET, " Delete reaction success"), res);
            })
                .catch(function (err) {
                logger.warning("".concat(LOG_PRESET, " Delete reaction failed"), err);
            });
        }
        else {
            currentChannel
                .addReaction(message, key)
                .then(function (res) {
                logger.info("".concat(LOG_PRESET, " Add reaction success"), res);
            })
                .catch(function (err) {
                logger.warning("".concat(LOG_PRESET, " Add reaction failed"), err);
            });
        }
    }, [currentChannel]);
}

export { useToggleReactionCallback as u };
//# sourceMappingURL=bundle-TLAngIsc.js.map
