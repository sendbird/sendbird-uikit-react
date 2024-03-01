/// <reference types="react" />
import type { BaseMessage } from '@sendbird/chat/message';
import { LoggerInterface } from '../../../../lib/Logger';
interface DynamicParams {
    setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
    setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
    allMessages: BaseMessage[];
    scrollRef: React.RefObject<HTMLDivElement>;
}
interface StaticParams {
    logger: LoggerInterface;
}
declare function useScrollToMessage({ setInitialTimeStamp, setAnimatedMessageId, allMessages, scrollRef, }: DynamicParams, { logger }: StaticParams): (createdAt: number, messageId: number) => void;
export default useScrollToMessage;
