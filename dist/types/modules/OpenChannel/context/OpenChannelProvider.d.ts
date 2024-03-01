import React from 'react';
import type { FileMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import { RenderUserProfileProps } from '../../../types';
import { State as MessageStoreState } from './dux/initialState';
type OpenChannelQueries = {
    messageListParams?: {
        replyType?: string;
        messageType?: string;
        prevResultSize?: number;
        nextResultSize?: number;
        reverse?: boolean;
        isInclusive?: boolean;
        includeMetaArray?: boolean;
        includeParentMessageInfo?: boolean;
        showSubchannelMessagesOnly?: boolean;
        customTypes?: Array<string>;
        senderUserIds?: Array<string>;
    };
};
export interface OpenChannelProviderProps {
    channelUrl: string;
    children?: React.ReactElement;
    isMessageGroupingEnabled?: boolean;
    queries?: OpenChannelQueries;
    messageLimit?: number;
    onBeforeSendUserMessage?(text: string): UserMessageCreateParams;
    onBeforeSendFileMessage?(file_: File): FileMessageCreateParams;
    onChatHeaderActionClick?(): void;
    onBackClick?(): void;
    disableUserProfile?: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}
interface OpenChannelInterface extends OpenChannelProviderProps, MessageStoreState {
    messageInputRef: React.RefObject<HTMLInputElement>;
    conversationScrollRef: React.RefObject<HTMLDivElement>;
    disabled: boolean;
    amIBanned: boolean;
    amIMuted: boolean;
    amIOperator: boolean;
    fetchMore: boolean;
    checkScrollBottom: () => boolean;
    onScroll: (callback: () => void) => void;
    handleSendMessage: any;
    handleFileUpload: any;
    updateMessage: any;
    deleteMessage: any;
    resendMessage: any;
}
declare const OpenChannelProvider: React.FC<OpenChannelProviderProps>;
export type UseOpenChannelType = () => OpenChannelInterface;
declare const useOpenChannelContext: UseOpenChannelType;
export { OpenChannelProvider, useOpenChannelContext, };
