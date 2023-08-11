import { useEffect } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

function useSetChannel({ channelUrl, sdkInit, disableMarkAsRead }, {
  messagesDispatcher,
  sdk,
  logger,
  markAsReadScheduler,
}) {
  useEffect(() => {
    if (channelUrl && sdkInit && sdk && sdk.groupChannel) {
      logger.info('Channel | useSetChannel fetching channel', channelUrl);
      sdk.groupChannel.getChannel(channelUrl)
        .then((groupChannel) => {
          logger.info('Channel | useSetChannel fetched channel', groupChannel);
          messagesDispatcher({
            type: messageActionTypes.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });

          logger.info('Channel: Mark as read', groupChannel);
          if (!disableMarkAsRead) {
            markAsReadScheduler.push(groupChannel);
          }
        })
        .catch((e) => {
          logger.warning('Channel | useSetChannel fetch channel failed', { channelUrl, e });
          messagesDispatcher({
            type: messageActionTypes.SET_CHANNEL_INVALID,
          });
        });
      sdk.getAllEmoji().then((emojiContainer_) => {
        logger.info('Channel: Getting emojis success', emojiContainer_);
        messagesDispatcher({
          type: messageActionTypes.SET_EMOJI_CONTAINER,
          payload: emojiContainer_,
        });
      }).catch((err) => {
        logger.error('Channel: Getting emojis failed', err);
      });
    }
  }, [channelUrl, sdkInit]);
}

export default useSetChannel;
