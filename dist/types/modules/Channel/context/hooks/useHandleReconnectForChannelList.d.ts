import React from 'react';
import { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';
import { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
import { ChannelListActionTypes } from '../../../ChannelList/dux/actionTypes';
import { GroupChannelListQueryParamsInternal } from '../../../ChannelList/context/ChannelListProvider';
import { MarkAsDeliveredSchedulerType } from '../../../../lib/hooks/useMarkAsDeliveredScheduler';
interface UseHandleReconnectForChannelListProps {
    isOnline: boolean;
    reconnectOnIdle: boolean;
    logger: Logger;
    sdk: SdkStore['sdk'];
    currentGroupChannel: GroupChannel;
    channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
    setChannelSource: (query: GroupChannelListQuery) => void;
    userFilledChannelListQuery: GroupChannelListQueryParamsInternal;
    sortChannelList: (channels: GroupChannel[]) => GroupChannel[];
    disableAutoSelect: boolean;
    markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
    disableMarkAsDelivered: boolean;
}
declare function useHandleReconnectForChannelList({ isOnline, reconnectOnIdle, logger, sdk, currentGroupChannel, channelListDispatcher, setChannelSource, userFilledChannelListQuery, sortChannelList, disableAutoSelect, markAsDeliveredScheduler, disableMarkAsDelivered, }: UseHandleReconnectForChannelListProps): void;
export default useHandleReconnectForChannelList;
