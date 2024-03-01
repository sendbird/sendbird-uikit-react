import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { LoggerInterface } from '../../../../lib/Logger';
import { SendableMessageType } from '../../../../utils';
import { SendBirdState } from '../../../../lib/types';
type UseSendFileMessageCallbackOptions = {
    currentGroupChannel: null | GroupChannel;
    onBeforeSendFileMessage?: (file: File, quoteMessage: SendableMessageType | null) => FileMessageCreateParams;
    imageCompression?: SendBirdState['config']['imageCompression'];
};
type UseSendFileMessageCallbackParams = {
    logger: LoggerInterface;
    pubSub: SBUGlobalPubSub;
    scrollRef: React.MutableRefObject<HTMLDivElement | null>;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
export default function useSendFileMessageCallback({ currentGroupChannel, onBeforeSendFileMessage, imageCompression }: UseSendFileMessageCallbackOptions, { logger, pubSub, scrollRef, messagesDispatcher }: UseSendFileMessageCallbackParams): ((compressedFile: File, quoteMessage?: any) => Promise<FileMessage>)[];
export {};
