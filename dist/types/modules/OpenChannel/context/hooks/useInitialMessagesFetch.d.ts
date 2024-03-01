import type { OpenChannel } from '@sendbird/chat/openChannel';
import React from 'react';
import type { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
interface DynamicParams {
    currentOpenChannel: OpenChannel;
    userFilledMessageListParams?: Record<string, any>;
}
interface StaticParams {
    logger: Logger;
    messagesDispatcher: CustomUseReducerDispatcher;
    scrollRef: React.RefObject<HTMLElement>;
}
declare function useInitialMessagesFetch({ currentOpenChannel, userFilledMessageListParams }: DynamicParams, { logger, messagesDispatcher, scrollRef }: StaticParams): void;
export default useInitialMessagesFetch;
