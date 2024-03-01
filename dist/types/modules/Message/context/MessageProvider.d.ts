import React from 'react';
import { BaseMessage } from '@sendbird/chat/message';
export type MessageProviderProps = {
    children: React.ReactNode;
    message: BaseMessage;
    isByMe?: boolean;
};
export type MessageProviderInterface = Omit<MessageProviderProps, 'children'>;
declare const MessageProvider: React.FC<MessageProviderProps>;
declare const useMessageContext: () => MessageProviderInterface;
export { MessageProvider, useMessageContext, };
