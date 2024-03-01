import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../SendbirdState';
export type MarkAsReadSchedulerType = {
    push: (channel: GroupChannel) => void;
    clear: () => void;
    getQueue: () => GroupChannel[];
};
interface DynamicParams {
    isConnected: boolean;
}
interface StaticParams {
    logger: Logger;
}
export declare function useMarkAsReadScheduler({ isConnected, }: DynamicParams, { logger, }: StaticParams): MarkAsReadSchedulerType;
export {};
