import React, { useEffect } from 'react';

import {
  GroupChannel,
  GroupChannelListQuery,
} from '@sendbird/chat/groupChannel';
import { Logger } from '../../../../lib/SendbirdState';
import useReconnectOnIdle from './useReconnectOnIdle';
import { SdkStore } from '../../../../lib/types';
import { ChannelListActionTypes } from '../../../ChannelList/dux/actionTypes';
import { GroupChannelListQueryParamsInternal } from '../../../ChannelList/context/ChannelListProvider';
import { MarkAsDeliveredSchedulerType } from '../../../../lib/hooks/useMarkAsDeliveredScheduler';
import * as channelActions from '../../../ChannelList/dux/actionTypes';
import { createChannelListQuery } from '../../../ChannelList/utils';
import { DELIVERY_RECEIPT } from '../../../../utils/consts';

interface UseHandleReconnectForChannelListProps {
  // Dynamic props
  isOnline: boolean;
  reconnectOnIdle?: boolean;

  // Static props
  logger: Logger;
  sdk: SdkStore['sdk'];
  currentGroupChannel: GroupChannel | null;
  channelListDispatcher: React.Dispatch<ChannelListActionTypes>
  setChannelSource: (query: GroupChannelListQuery) => void;
  userFilledChannelListQuery?: GroupChannelListQueryParamsInternal;
  sortChannelList?: (channels: GroupChannel[]) => GroupChannel[];
  disableAutoSelect: boolean;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
  disableMarkAsDelivered: boolean;
}

function useHandleReconnectForChannelList({
  isOnline,
  reconnectOnIdle,
  logger,
  sdk,
  currentGroupChannel,
  channelListDispatcher,
  setChannelSource,
  userFilledChannelListQuery,
  sortChannelList,
  disableAutoSelect,
  markAsDeliveredScheduler,
  disableMarkAsDelivered,
}: UseHandleReconnectForChannelListProps): void {
  const { shouldReconnect } = useReconnectOnIdle(isOnline, currentGroupChannel, reconnectOnIdle);

  useEffect(() => {
    return () => {
      // state changed from offline to online AND tab is visible
      if (shouldReconnect) {
        logger.info('ChannelList refresh - creating query', { userFilledChannelListQuery });
        const channelListQuery = createChannelListQuery({ sdk, userFilledChannelListQuery });
        logger.info('ChannelList refresh - created query', channelListQuery);
        setChannelSource(channelListQuery);

        channelListDispatcher({
          type: channelActions.INIT_CHANNELS_START,
          payload: {
            currentUserId: sdk?.currentUser?.userId ?? '',
          },
        });

        if (userFilledChannelListQuery) {
          logger.info('ChannelList refresh - setting up channelListQuery', channelListQuery);
          channelListDispatcher({
            type: channelActions.CHANNEL_LIST_PARAMS_UPDATED,
            payload: {
              channelListQuery,
              currentUserId: sdk?.currentUser?.userId ?? '',
            },
          });
        }

        logger.info('ChannelList refresh - fetching channels');
        if (channelListQuery.hasNext) {
          channelListQuery
            .next()
            .then((channelList) => {
              logger.info('ChannelList refresh - fetched channels', channelList);
              let sortedChannelList = channelList;
              if (sortChannelList && typeof sortChannelList === 'function') {
                sortedChannelList = sortChannelList(channelList);
                logger.info('ChannelList refresh - channel list sorted', sortedChannelList);
              }
              // select first channel
              let newCurrentChannel: GroupChannel | null = !disableAutoSelect ? sortedChannelList[0] : null;
              if (currentGroupChannel?.url) {
                const foundChannel = sortedChannelList.find((channel) => (
                  channel.url === currentGroupChannel.url
                ));
                if (foundChannel) {
                  newCurrentChannel = foundChannel;
                }
              }
              logger.info('ChannelList refresh - highlight channel', newCurrentChannel);
              channelListDispatcher({
                type: channelActions.REFRESH_CHANNELS_SUCCESS,
                payload: {
                  channelList: sortedChannelList,
                  currentChannel: newCurrentChannel,
                },
              });
              const canSetMarkAsDelivered = sdk?.appInfo?.premiumFeatureList?.find((feature) => feature === DELIVERY_RECEIPT);

              if (canSetMarkAsDelivered && !disableMarkAsDelivered) {
                sortedChannelList.forEach((channel) => {
                  markAsDeliveredScheduler.push(channel);
                });
              }
            })
            .catch((err) => {
              if (err) {
                logger.error('ChannelList refresh - could not fetch channels', err);
                channelListDispatcher({
                  type: channelActions.INIT_CHANNELS_FAILURE,
                });
              }
            });
        } else {
          logger.info('ChannelList refresh - there are no more channels');
        }
      }
    };
  }, [shouldReconnect]);
}

export default useHandleReconnectForChannelList;
