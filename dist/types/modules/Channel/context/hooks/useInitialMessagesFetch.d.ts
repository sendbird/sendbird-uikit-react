import React from 'react';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { ChannelActionTypes } from '../dux/actionTypes';
type UseInitialMessagesFetchOptions = {
    currentGroupChannel: GroupChannel;
    initialTimeStamp: number;
    userFilledMessageListQuery: MessageListParamsInternal;
    replyType: ReplyTypeInternal;
    setIsScrolled: (val: boolean) => void;
};
type UseInitialMessagesFetchParams = {
    logger: LoggerInterface;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    scrollRef: React.RefObject<HTMLElement>;
};
declare function useInitialMessagesFetch({ currentGroupChannel, initialTimeStamp, userFilledMessageListQuery, replyType, setIsScrolled, }: UseInitialMessagesFetchOptions, { logger, scrollRef, messagesDispatcher }: UseInitialMessagesFetchParams): () => void;
export default useInitialMessagesFetch;
