import React from 'react';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SdkStore } from '../../../../lib/types';
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
declare function useGetChannel({ channelUrl, sdkInit, disableMarkAsRead }: UseGetChannelOptions, { messagesDispatcher, sdk, logger, markAsReadScheduler }: UseGetChannelParams): void;
export default useGetChannel;
