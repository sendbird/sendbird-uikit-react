import type { UserMessageCreateParams } from '@sendbird/chat/message';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import React from 'react';
import type { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface DynamicParams {
    currentOpenChannel: OpenChannel;
    onBeforeSendUserMessage: (text: string) => UserMessageCreateParams;
    checkScrollBottom: () => boolean;
    messageInputRef: React.RefObject<HTMLInputElement>;
}
interface StaticParams {
    sdk: SdkStore['sdk'];
    logger: Logger;
    messagesDispatcher: (props: {
        type: string;
        payload: any;
    }) => void;
    scrollRef: React.RefObject<HTMLElement>;
}
declare function useSendMessageCallback({ currentOpenChannel, onBeforeSendUserMessage, messageInputRef }: DynamicParams, { sdk, logger, messagesDispatcher, scrollRef }: StaticParams): () => void;
export default useSendMessageCallback;
