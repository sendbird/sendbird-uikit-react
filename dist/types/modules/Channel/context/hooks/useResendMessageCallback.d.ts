import React from 'react';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SendableMessageType } from '../../../../utils';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
type UseResendMessageCallbackOptions = {
    currentGroupChannel: null | GroupChannel;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type UseResendMessageCallbackParams = {
    logger: LoggerInterface;
    pubSub: SBUGlobalPubSub;
};
declare function useResendMessageCallback({ currentGroupChannel, messagesDispatcher }: UseResendMessageCallbackOptions, { logger, pubSub }: UseResendMessageCallbackParams): (failedMessage: SendableMessageType) => void;
export default useResendMessageCallback;
