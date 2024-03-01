import React from 'react';
import { GroupChannelListQuery } from '@sendbird/chat/groupChannel';
import { Nullable } from '../../../../types';
import { Logger } from '../../../../lib/SendbirdState';
import { MarkAsDeliveredSchedulerType } from '../../../../lib/hooks/useMarkAsDeliveredScheduler';
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
export declare const useFetchChannelList: ({ channelSource, disableMarkAsDelivered, }: DynamicProps, { channelListDispatcher, logger, markAsDeliveredScheduler, }: StaticProps) => () => Promise<void>;
export {};
