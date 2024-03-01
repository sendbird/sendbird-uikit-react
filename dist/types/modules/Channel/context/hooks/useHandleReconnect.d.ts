import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../../../../lib/SendbirdState';
import { MarkAsReadSchedulerType } from '../../../../lib/hooks/useMarkAsReadScheduler';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SdkStore } from '../../../../lib/types';
interface DynamicParams {
    isOnline: boolean;
    replyType?: string;
    disableMarkAsRead: boolean;
    reconnectOnIdle: boolean;
}
interface StaticParams {
    logger: Logger;
    sdk: SdkStore['sdk'];
    currentGroupChannel: GroupChannel;
    scrollRef: React.RefObject<HTMLDivElement>;
    markAsReadScheduler: MarkAsReadSchedulerType;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    userFilledMessageListQuery?: Record<string, any>;
}
declare function useHandleReconnect({ isOnline, replyType, disableMarkAsRead, reconnectOnIdle }: DynamicParams, { logger, sdk, scrollRef, currentGroupChannel, messagesDispatcher, markAsReadScheduler, userFilledMessageListQuery, }: StaticParams): void;
export default useHandleReconnect;
