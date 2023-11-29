import React, { useCallback } from 'react';
import { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';

import { Nullable } from '../../../../types';
import { Logger } from '../../../../lib/SendbirdState';
import { MarkAsDeliveredSchedulerType } from '../../../../lib/hooks/useMarkAsDeliveredScheduler';
import * as channelListActions from '../../dux/actionTypes';
import { ChannelListActionTypes } from '../../dux/actionTypes';

interface DynamicProps {
  channelSource: Nullable<GroupChannelListQuery>;
  disableMarkAsDelivered: boolean;
}
interface StaticProps {
  channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
  logger: Logger;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
}

export const useFetchChannelList = (
  { channelSource, disableMarkAsDelivered }: DynamicProps,
  { channelListDispatcher, logger, markAsDeliveredScheduler }: StaticProps,
) => {
  return useCallback(async () => {
    if (!channelSource?.hasNext) {
      logger.info('ChannelList: not able to fetch');
      return;
    }
    logger.info('ChannelList: starting fetch');
    channelListDispatcher({
      type: channelListActions.FETCH_CHANNELS_START,
      payload: null,
    });
    try {
      const channelList: GroupChannel[] = await channelSource.next();
      logger.info('ChannelList: succeeded fetch', { channelList });
      channelListDispatcher({
        type: channelListActions.FETCH_CHANNELS_SUCCESS,
        payload: channelList,
      });
      if (!disableMarkAsDelivered) {
        logger.info('ChannelList: mark as delivered to fetched channels');
        // eslint-disable-next-line no-unused-expressions
        channelList?.forEach((channel) => {
          if (channel?.unreadMessageCount > 0) {
            markAsDeliveredScheduler.push(channel);
          }
        });
      }
    } catch (error) {
      logger.error('ChannelList: failed fetch', { error });
      channelListDispatcher({
        type: channelListActions.FETCH_CHANNELS_FAILURE,
        payload: error,
      });
    }
  }, [
    channelSource,
    disableMarkAsDelivered,
  ]);
};
