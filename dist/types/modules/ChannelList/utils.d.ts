import { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';
import { SBUGlobalPubSub } from '../../lib/pubSub/topics';
import { SdkStore } from '../../lib/types';
import React from 'react';
import { ChannelListInitialStateType } from './dux/initialState';
import { ChannelListActionTypes } from './dux/actionTypes';
import { GroupChannelListQueryParamsInternal } from './context/ChannelListProvider';
import { LoggerInterface } from '../../lib/Logger';
import { MarkAsDeliveredSchedulerType } from '../../lib/hooks/useMarkAsDeliveredScheduler';
type CreateChannelListQueryParams = {
    sdk: SdkStore['sdk'];
    userFilledChannelListQuery: GroupChannelListQueryParamsInternal;
};
export declare const createChannelListQuery: ({ sdk, userFilledChannelListQuery, }: CreateChannelListQueryParams) => GroupChannelListQuery;
/**
 * Setup event listener
 * create channel source query
 * add loading screen
 */
type SetupChannelListParams = {
    sdk: SdkStore['sdk'];
    sdkChannelHandlerId: string;
    channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
    setChannelSource: (query: GroupChannelListQuery) => void;
    onChannelSelect: (channel: ChannelListInitialStateType['currentChannel']) => void;
    userFilledChannelListQuery: GroupChannelListQueryParamsInternal;
    logger: LoggerInterface;
    sortChannelList: (channels: GroupChannel[]) => GroupChannel[];
    disableAutoSelect: boolean;
    markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
    disableMarkAsDelivered: boolean;
};
declare function setupChannelList({ sdk, sdkChannelHandlerId, channelListDispatcher, setChannelSource, onChannelSelect, userFilledChannelListQuery, logger, sortChannelList, disableAutoSelect, markAsDeliveredScheduler, disableMarkAsDelivered, }: SetupChannelListParams): void;
export declare const pubSubHandleRemover: (subscriber: Map<string, {
    remove: () => void;
}>) => void;
export declare const pubSubHandler: (pubSub: SBUGlobalPubSub, channelListDispatcher: React.Dispatch<ChannelListActionTypes>) => Map<string, {
    remove: () => void;
}>;
export default setupChannelList;
