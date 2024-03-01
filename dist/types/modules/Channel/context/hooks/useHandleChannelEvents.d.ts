import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { SendableMessageType } from '../../../../utils';
import { ChannelActionTypes } from '../dux/actionTypes';
import { LoggerInterface } from '../../../../lib/Logger';
import { SdkStore } from '../../../../lib/types';
/**
 * Handles ChannelEvents and send values to dispatcher using messagesDispatcher
 * messagesDispatcher: Dispatcher
 * sdk: sdkInstance
 * logger: loggerInstance
 * channelUrl: string
 * sdkInit: bool
 */
interface DynamicParams {
    sdkInit: boolean;
    currentUserId: string;
    currentGroupChannel: GroupChannel;
    disableMarkAsRead: boolean;
}
interface StaticParams {
    sdk: SdkStore['sdk'];
    logger: LoggerInterface;
    scrollRef: React.RefObject<HTMLDivElement>;
    setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType>>;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
}
declare function useHandleChannelEvents({ sdkInit, currentGroupChannel, disableMarkAsRead, }: DynamicParams, { sdk, logger, scrollRef, setQuoteMessage, messagesDispatcher, }: StaticParams): void;
export default useHandleChannelEvents;
