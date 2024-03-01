import React from 'react';
import { ChannelActionTypes } from '../dux/actionTypes';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { SdkStore } from '../../../../lib/types';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { BaseMessage } from '@sendbird/chat/message';
type UseScrollDownCallbackOptions = {
    currentGroupChannel: null | GroupChannel;
    latestMessageTimeStamp: number;
    userFilledMessageListQuery: MessageListParamsInternal;
    hasMoreNext: boolean;
    replyType: ReplyTypeInternal;
};
type UseScrollDownCallbackParams = {
    logger: LoggerInterface;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    sdk: SdkStore['sdk'];
};
type Callback = (param: [BaseMessage[], null] | [null, unknown]) => void;
declare function useScrollDownCallback({ currentGroupChannel, latestMessageTimeStamp, userFilledMessageListQuery, hasMoreNext, replyType, }: UseScrollDownCallbackOptions, { logger, messagesDispatcher, sdk }: UseScrollDownCallbackParams): (cb: Callback) => void;
export default useScrollDownCallback;
