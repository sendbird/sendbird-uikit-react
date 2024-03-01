import './index.scss';
import React from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';
import { SendableMessageType } from '../../../../utils';
export interface MessageInputWrapperViewProps {
    value?: string;
    disabled?: boolean;
    currentChannel: GroupChannel | null;
    isMultipleFilesMessageEnabled?: boolean;
    loading: boolean;
    quoteMessage: SendableMessageType | null;
    setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
    messageInputRef: React.MutableRefObject<HTMLDivElement>;
    sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage> | void;
    sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
    sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
    sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
    renderUserMentionItem?: (props: {
        user: User;
    }) => React.ReactElement;
    renderFileUploadIcon?: () => React.ReactElement;
    renderVoiceMessageIcon?: () => React.ReactElement;
    renderSendMessageIcon?: () => React.ReactElement;
    acceptableMimeTypes?: string[];
}
export declare const MessageInputWrapperView: React.ForwardRefExoticComponent<MessageInputWrapperViewProps & React.RefAttributes<any>>;
export { VoiceMessageInputWrapper, VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';
export default MessageInputWrapperView;
