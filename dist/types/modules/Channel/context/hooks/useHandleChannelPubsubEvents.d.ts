import React, { RefObject } from 'react';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { ChannelActionTypes } from '../dux/actionTypes';
export interface UseHandlePubsubEventsParams {
    channelUrl: string;
    sdkInit: boolean;
    pubSub: SBUGlobalPubSub;
    dispatcher: React.Dispatch<ChannelActionTypes>;
    scrollRef: RefObject<HTMLElement>;
}
export declare const useHandleChannelPubsubEvents: ({ channelUrl, sdkInit, pubSub, dispatcher, scrollRef, }: UseHandlePubsubEventsParams) => void;
