import React from 'react';
import type { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import type { SendableMessageType } from '../../../../utils';
import type { Nullable } from '../../../../types';
import { ChannelActionTypes } from '../dux/actionTypes';
interface DynamicParams {
    currentGroupChannel: Nullable<GroupChannel>;
    onBeforeSendVoiceMessage?: (file: File, quoteMessage?: SendableMessageType) => FileMessageCreateParams;
}
interface StaticParams {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    scrollRef: React.RefObject<HTMLDivElement>;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
}
type FuncType = (file: File, duration: number, quoteMessage: SendableMessageType) => Promise<FileMessage>;
export declare const useSendVoiceMessageCallback: ({ currentGroupChannel, onBeforeSendVoiceMessage, }: DynamicParams, { logger, pubSub, scrollRef, messagesDispatcher, }: StaticParams) => Array<FuncType>;
export default useSendVoiceMessageCallback;
