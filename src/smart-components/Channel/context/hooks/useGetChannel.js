import { useEffect } from 'react';

import * as messageActionTypes from '../dux/actionTypes';

function useSetChannel({ channelUrl, sdkInit }, {
  messagesDispatcher,
  sdk,
  logger,
}) {
  useEffect(() => {
    if (channelUrl && sdkInit && sdk && sdk.GroupChannel) {
      logger.info('Channel | useSetChannel fetching channel', channelUrl);
      sdk.GroupChannel.getChannel(channelUrl)
        .then((groupChannel) => {
          logger.info('Channel | useSetChannel fetched channel', groupChannel);
          messagesDispatcher({
            type: messageActionTypes.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });

          logger.info('Channel: Mark as read', groupChannel);
          // this order is important - this mark as read should update the event handler up above
          groupChannel.markAsRead();
        })
        .catch((e) => {
          logger.warning('Channel | useSetChannel fetch channel failed', { channelUrl, e });
          messagesDispatcher({
            type: messageActionTypes.SET_CHANNEL_INVALID,
          });
        });
      sdk.getAllEmoji((emojiContainer_, err) => {
        if (err) {
          logger.error('Channel: Getting emojis failed', err);
          return;
        }
        logger.info('Channel: Getting emojis success', emojiContainer_);
        messagesDispatcher({
          type: messageActionTypes.SET_EMOJI_CONTAINER,
          payload: emojiContainer_,
        });
      });
    }
  }, [channelUrl, sdkInit]);
}

export default useSetChannel;
