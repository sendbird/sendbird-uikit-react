import React, { useEffect } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import type { SdkStore } from '../../../../lib/Sendbird/types';
import { LoggerInterface } from '../../../../lib/Logger';
import { MarkAsReadSchedulerType } from '../../../../lib/hooks/useMarkAsReadScheduler';

type UseGetChannelOptions = {
  channelUrl: string;
  sdkInit: boolean;
  disableMarkAsRead: boolean;
};
type UseGetChannelParams = {
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  sdk: SdkStore['sdk'];
  logger: LoggerInterface;
  markAsReadScheduler: MarkAsReadSchedulerType;
};
function useGetChannel(
  { channelUrl, sdkInit, disableMarkAsRead }: UseGetChannelOptions,
  { messagesDispatcher, sdk, logger, markAsReadScheduler }: UseGetChannelParams,
) {
  useEffect(() => {
    let disposed = false;

    if (sdkInit && !channelUrl) {
      messagesDispatcher({
        type: messageActionTypes.SET_CURRENT_CHANNEL,
        payload: null,
      });
      messagesDispatcher({
        type: messageActionTypes.RESET_MESSAGES,
        payload: null,
      });
      return;
    }

    if (channelUrl && sdkInit && sdk && sdk.groupChannel) {
      logger.info('Channel | useSetChannel fetching channel', channelUrl);
      sdk.groupChannel
        .getChannel(channelUrl)
        .then((groupChannel) => {
          if (disposed) return;
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
          if (disposed) return;
          logger.warning('Channel | useSetChannel fetch channel failed', { channelUrl, e });
          messagesDispatcher({
            type: messageActionTypes.SET_CHANNEL_INVALID,
          });
        });
      sdk
        .getAllEmoji()
        .then((emojiContainer_) => {
          if (disposed) return;
          logger.info('Channel: Getting emojis success', emojiContainer_);
          messagesDispatcher({
            type: messageActionTypes.SET_EMOJI_CONTAINER,
            payload: emojiContainer_,
          });
        })
        .catch((err) => {
          if (disposed) return;
          logger.error('Channel: Getting emojis failed', err);
        });
    }
    return () => {
      disposed = true;
    };
  }, [channelUrl, sdkInit]);
}

export default useGetChannel;
