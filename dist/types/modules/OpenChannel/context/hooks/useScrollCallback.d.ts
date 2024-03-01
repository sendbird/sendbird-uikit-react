import type { OpenChannel } from '@sendbird/chat/openChannel';
import type { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface DynamicParams {
    currentOpenChannel: OpenChannel;
    lastMessageTimestamp: number;
    fetchMore?: boolean;
}
interface StaticParams {
    sdk: SdkStore['sdk'];
    logger: Logger;
    messagesDispatcher: CustomUseReducerDispatcher;
    hasMore: boolean;
    userFilledMessageListParams?: Record<string, any>;
}
type CallbackReturn = (callback: () => void) => void;
declare function useScrollCallback({ currentOpenChannel, lastMessageTimestamp, fetchMore }: DynamicParams, { sdk, logger, messagesDispatcher, hasMore, userFilledMessageListParams }: StaticParams): CallbackReturn;
export default useScrollCallback;
