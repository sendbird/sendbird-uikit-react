import React, { useEffect } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SBUEventHandlers, SdkStore } from '../../../../lib/types';
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
  eventHandlers?: SBUEventHandlers
};
function useGetChannel(
  { channelUrl, sdkInit, disableMarkAsRead }: UseGetChannelOptions,
  { messagesDispatcher, sdk, logger, markAsReadScheduler, eventHandlers }: UseGetChannelParams,
) {
  useEffect(() => {
    if (channelUrl && sdkInit && sdk && sdk.groupChannel) {
      logger.info('Channel | useSetChannel fetching channel', channelUrl);
      sdk.groupChannel
        .getChannel(channelUrl)
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
          eventHandlers?.request?.onFailed?.(e);
          messagesDispatcher({
            type: messageActionTypes.SET_CHANNEL_INVALID,
          });
        });
      sdk
        .getAllEmoji()
        .then((emojiContainer_) => {
          logger.info('Channel: Getting emojis success', emojiContainer_);
          messagesDispatcher({
            type: messageActionTypes.SET_EMOJI_CONTAINER,
            payload: emojiContainer_,
          });
        })
        .catch((err) => {
          logger.error('Channel: Getting emojis failed', err);
          eventHandlers?.request?.onFailed?.(err);
        });
    }
  }, [channelUrl, sdkInit]);
}

export default useGetChannel;
