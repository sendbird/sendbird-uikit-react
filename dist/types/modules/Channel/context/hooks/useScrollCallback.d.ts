import React from 'react';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { LoggerInterface } from '../../../../lib/Logger';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SdkStore } from '../../../../lib/types';
type UseScrollCallbackOptions = {
    currentGroupChannel: GroupChannel;
    oldestMessageTimeStamp: number;
    userFilledMessageListQuery: MessageListParamsInternal;
    replyType: ReplyTypeInternal;
};
type UseScrollCallbackParams = {
    hasMorePrev: boolean;
    logger: LoggerInterface;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    sdk: SdkStore['sdk'];
};
declare function useScrollCallback({ currentGroupChannel, oldestMessageTimeStamp, userFilledMessageListQuery, replyType }: UseScrollCallbackOptions, { hasMorePrev, logger, messagesDispatcher, sdk }: UseScrollCallbackParams): (callback: () => void) => void;
export default useScrollCallback;
