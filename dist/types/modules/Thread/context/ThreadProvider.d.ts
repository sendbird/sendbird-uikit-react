import React, { ReactElement } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { BaseMessage, FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import { ThreadContextInitialState } from './dux/initialState';
import { SendMessageParams } from './hooks/useSendUserMessageCallback';
import { SendableMessageType } from '../../../utils';
export type ThreadProviderProps = {
    children?: React.ReactElement;
    channelUrl: string;
    message: SendableMessageType | null;
    onHeaderActionClick?: () => void;
    onMoveToParentMessage?: (props: {
        message: SendableMessageType;
        channel: GroupChannel;
    }) => void;
    onBeforeSendUserMessage?: (message: string, quotedMessage?: SendableMessageType) => UserMessageCreateParams;
    onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
    disableUserProfile?: boolean;
    renderUserProfile?: (props: {
        user: User;
        close: () => void;
    }) => ReactElement;
    isMultipleFilesMessageEnabled?: boolean;
};
export interface ThreadProviderInterface extends ThreadProviderProps, ThreadContextInitialState {
    fetchPrevThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
    fetchNextThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
    toggleReaction: (message: any, key: any, isReacted: any) => void;
    sendMessage: (props: SendMessageParams) => void;
    sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
    sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
    resendMessage: (failedMessage: SendableMessageType) => void;
    updateMessage: (props: any, callback?: () => void) => void;
    deleteMessage: (message: SendableMessageType) => Promise<void>;
    nicknamesMap: Map<string, string>;
}
export declare const ThreadProvider: (props: ThreadProviderProps) => React.JSX.Element;
export type UseThreadContextType = () => ThreadProviderInterface;
export declare const useThreadContext: UseThreadContextType;
