import { BaseMessage } from '@sendbird/chat/message';
import { SendableMessageType } from '../../../../utils';
import { CustomUseReducerDispatcher } from '../../../../lib/SendbirdState';
import { LoggerInterface } from '../../../../lib/Logger';
import { ThreadListStateTypes } from '../../types';
type Params = {
    anchorMessage?: SendableMessageType;
    parentMessage: SendableMessageType;
    isReactionEnabled?: boolean;
    threadDispatcher: CustomUseReducerDispatcher;
    logger: LoggerInterface;
    threadListState: ThreadListStateTypes;
    oldestMessageTimeStamp: number;
    latestMessageTimeStamp: number;
};
export declare const useThreadFetchers: ({ isReactionEnabled, anchorMessage, parentMessage: staleParentMessage, threadDispatcher, logger, oldestMessageTimeStamp, latestMessageTimeStamp, threadListState, }: Params) => {
    initialize: (callback?: (messages: BaseMessage[]) => void) => Promise<void>;
    loadPrevious: (callback?: (messages: BaseMessage[]) => void) => Promise<void>;
    loadNext: (callback?: (messages: BaseMessage[]) => void) => Promise<void>;
};
export {};
