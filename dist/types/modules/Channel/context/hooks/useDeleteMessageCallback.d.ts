import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { ChannelActionTypes } from '../dux/actionTypes';
import { LoggerInterface } from '../../../../lib/Logger';
import { CoreMessageType } from '../../../../utils';
type UseDeleteMessageCallbackOptions = {
    currentGroupChannel: null | GroupChannel;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type UseDeleteMessageCallbackParams = {
    logger: LoggerInterface;
};
declare function useDeleteMessageCallback({ currentGroupChannel, messagesDispatcher }: UseDeleteMessageCallbackOptions, { logger }: UseDeleteMessageCallbackParams): (message: CoreMessageType) => Promise<void>;
export default useDeleteMessageCallback;
