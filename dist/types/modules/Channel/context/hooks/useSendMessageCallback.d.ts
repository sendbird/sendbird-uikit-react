import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';
type UseSendMessageCallbackOptions = {
    isMentionEnabled: boolean;
    currentGroupChannel: null | GroupChannel;
    onBeforeSendUserMessage?: (message: string, quoteMessage?: SendableMessageType) => UserMessageCreateParams;
};
type UseSendMessageCallbackParams = {
    logger: LoggerInterface;
    pubSub: SBUGlobalPubSub;
    scrollRef: React.MutableRefObject<HTMLDivElement | null>;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type SendMessageParams = {
    message: string;
    quoteMessage?: SendableMessageType;
    mentionedUsers?: User[];
    mentionTemplate?: string;
};
export default function useSendMessageCallback({ isMentionEnabled, currentGroupChannel, onBeforeSendUserMessage }: UseSendMessageCallbackOptions, { logger, pubSub, scrollRef, messagesDispatcher }: UseSendMessageCallbackParams): readonly [React.MutableRefObject<HTMLInputElement>, ({ quoteMessage, message, mentionTemplate, mentionedUsers, }: SendMessageParams) => void];
export {};
