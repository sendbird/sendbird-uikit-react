import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import type { FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import type { SendableMessageType } from '../../../../utils';
import type { ReplyType } from '../../../../types';
import type { GroupChannelProviderProps } from '../GroupChannelProvider';
type MessageListDataSource = ReturnType<typeof useGroupChannelMessages>;
type MessageActions = {
    sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
    sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
    sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
    sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
    updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
};
interface Params extends GroupChannelProviderProps, MessageListDataSource {
    scrollToBottom(): Promise<void>;
    quoteMessage?: SendableMessageType;
    replyType: ReplyType;
}
/**
 * @description This hook controls common processes related to message sending, updating.
 * */
export declare function useMessageActions(params: Params): MessageActions;
export {};
