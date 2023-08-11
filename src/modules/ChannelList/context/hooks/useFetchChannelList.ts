import { useCallback } from 'react';
import { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';

import { Nullable } from '../../../../types';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { MarkAsDeliveredSchedulerType } from '../../../../lib/hooks/useMarkAsDeliveredScheduler';
import * as channelListActions from '../../dux/actionTypes';
import { DELIVERY_RECEIPT } from '../../../../utils/consts';

interface DynamicProps {
  channelSource: Nullable<GroupChannelListQuery>;
  premiumFeatureList: string[];
  disableMarkAsDelivered: boolean;
}
interface StaticProps {
  channelListDispatcher: CustomUseReducerDispatcher;
  logSubtitle: string;
  logger: Logger;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
}

export const useFetchChannelList = ({
  channelSource,
  premiumFeatureList,
  disableMarkAsDelivered,
}: DynamicProps, {
  channelListDispatcher,
  logSubtitle,
  logger,
  markAsDeliveredScheduler,
}: StaticProps) => {
  return useCallback(async () => {
    const setMarkAsDelivered = premiumFeatureList.find((feature) => feature === DELIVERY_RECEIPT);
    if (!channelSource?.hasNext) {
      logger.info(`${logSubtitle}: not able to fetch`);
      return;
    }
    logger.info(`${logSubtitle}: starting fetch`);
    channelListDispatcher({
      type: channelListActions.FETCH_CHANNELS_START,
      payload: null,
    });
    try {
      const channelList: GroupChannel[] = await channelSource.next();
      logger.info(`${logSubtitle}: succeeded fetch`, { channelList });
      channelListDispatcher({
        type: channelListActions.FETCH_CHANNELS_SUCCESS,
        payload: channelList,
      });
      if (setMarkAsDelivered && !disableMarkAsDelivered) {
        logger.info(`${logSubtitle}: mark as delivered to fetched channels`);
        // eslint-disable-next-line no-unused-expressions
        channelList?.forEach((channel) => {
          if (channel?.unreadMessageCount > 0) {
            markAsDeliveredScheduler.push(channel);
          }
        });
      }
    } catch (error) {
      logger.error(`${logSubtitle}: failed fetch`, { error });
      channelListDispatcher({
        type: channelListActions.FETCH_CHANNELS_FAILURE,
        payload: error,
      });
    }
  }, [
    channelSource,
    premiumFeatureList,
    disableMarkAsDelivered,
  ]);
};
