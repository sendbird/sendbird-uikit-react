import React from 'react';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage, UserMessageUpdateParams } from '@sendbird/chat/message';
import { LoggerInterface } from '../../../../lib/Logger';
import { SendbirdError, User } from '@sendbird/chat';
type UseUpdateMessageCallbackOptions = {
    currentGroupChannel: null | GroupChannel;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    onBeforeUpdateUserMessage?: (text: string) => UserMessageUpdateParams;
    isMentionEnabled: boolean;
};
type UseUpdateMessageCallbackParams = {
    logger: LoggerInterface;
    pubSub: SBUGlobalPubSub;
};
type UpdateMessageParams = {
    messageId: number;
    message: string;
    mentionedUsers?: User[];
    mentionTemplate?: string;
};
type UpdateMessageCallback = (err: SendbirdError, message: UserMessage) => void;
declare function useUpdateMessageCallback({ currentGroupChannel, messagesDispatcher, onBeforeUpdateUserMessage, isMentionEnabled, }: UseUpdateMessageCallbackOptions, { logger, pubSub }: UseUpdateMessageCallbackParams): (props: UpdateMessageParams, callback?: UpdateMessageCallback) => void;
export default useUpdateMessageCallback;
