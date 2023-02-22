import { useEffect } from 'react';
import * as messageActionTypes from '../../dux/actionTypes';
import { GroupChannel, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { Logger } from '../../../../lib/SendbirdState';

export type DynamicProps = {
  activeChannelUrl?: string;
  channels?: GroupChannel[];
  sdk?: SendbirdGroupChat;
};

export type StaticProps = {
  logger: Logger;
  channelListDispatcher: React.Dispatch<any>;
};

function useActiveChannelUrl({
  activeChannelUrl,
  channels,
  sdk
}: DynamicProps, {
  logger,
  channelListDispatcher
}: StaticProps): void {
  return useEffect(() => {
    if (activeChannelUrl) {
      logger.info('ChannelListProvider: looking for active channel', { activeChannelUrl });
      const activeChannel = channels.find(channel => channel.url === activeChannelUrl);
      if (activeChannel) {
        channelListDispatcher({
          type: messageActionTypes.SET_CURRENT_CHANNEL,
          payload: activeChannel,
        });
      } else {
        logger.info('ChannelListProvider: searching backend for active channel', { activeChannelUrl });
        sdk?.groupChannel?.getChannel(activeChannelUrl)
          .then((channel) => {
            channelListDispatcher({
              type: messageActionTypes.FETCH_CHANNELS_SUCCESS,
              payload: [channel],
            });
            channelListDispatcher({
              type: messageActionTypes.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          })
          .catch(() => {
            logger.warning('ChannelListProvider: Active channel not found');
          });
      }
    }
  }, [activeChannelUrl, channels, sdk]);
}

export default useActiveChannelUrl;
