import type { EveryMessage, RenderCustomSeparatorProps, RenderMessageParamsType, ReplyType } from '../../../../types';
import React from 'react';
import { EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import { ThreadReplySelectType } from '../../context/const';
import { CoreMessageType, SendableMessageType } from '../../../../utils';
import { MessageContentProps } from '../../../../ui/MessageContent';
export interface MessageProps {
    message: EveryMessage;
    hasSeparator?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    handleScroll?: (isBottomMessageAffected?: boolean) => void;
    /**
     * Customizes all child components of the message.
     * */
    children?: React.ReactNode;
    /**
     * A function that customizes the rendering of the content portion of message component.
     */
    renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a separator between messages.
     */
    renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of the edit input portion of the message component.
     * */
    renderEditInput?: () => React.ReactElement;
    /**
     * @deprecated Please use `children` instead
     * @description Customizes all child components of the message.
     * */
    renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
}
export interface MessageViewProps extends MessageProps {
    channel: GroupChannel;
    emojiContainer: EmojiContainer;
    editInputDisabled: boolean;
    shouldRenderSuggestedReplies: boolean;
    isReactionEnabled: boolean;
    replyType: ReplyType;
    threadReplySelectType: ThreadReplySelectType;
    nicknamesMap: Map<string, string>;
    renderUserMentionItem: (props: {
        user: User;
    }) => React.ReactElement;
    scrollToMessage: (createdAt: number, messageId: number) => void;
    toggleReaction: (message: SendableMessageType, emojiKey: string, isReacted: boolean) => void;
    setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType>>;
    onQuoteMessageClick: (params: {
        message: SendableMessageType;
    }) => void;
    onReplyInThreadClick: (params: {
        message: SendableMessageType;
    }) => void;
    sendUserMessage: (params: UserMessageCreateParams) => void;
    updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => void;
    resendMessage: (failedMessage: SendableMessageType) => void;
    deleteMessage: (message: CoreMessageType) => Promise<void>;
    renderFileViewer: (props: {
        message: FileMessage;
        onCancel: () => void;
    }) => React.ReactElement;
    renderRemoveMessageModal?: (props: {
        message: EveryMessage;
        onCancel: () => void;
    }) => React.ReactElement;
    animatedMessageId: number;
    setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
    onMessageAnimated?: () => void;
    /** @deprecated * */
    highLightedMessageId?: number;
    /** @deprecated * */
    setHighLightedMessageId?: React.Dispatch<React.SetStateAction<number>>;
    /** @deprecated * */
    onMessageHighlighted?: () => void;
}
declare const MessageView: (props: MessageViewProps) => React.JSX.Element;
export default MessageView;
