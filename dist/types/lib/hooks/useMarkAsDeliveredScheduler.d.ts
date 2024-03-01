import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../SendbirdState';
export type MarkAsDeliveredSchedulerType = {
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
export declare function useMarkAsDeliveredScheduler({ isConnected, }: DynamicParams, { logger, }: StaticParams): MarkAsDeliveredSchedulerType;
export {};
