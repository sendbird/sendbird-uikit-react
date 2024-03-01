import React from 'react';
import type { SendbirdError, User } from '@sendbird/chat';
import { FileMessageCreateParams, MultipleFilesMessageCreateParams, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import type { GroupChannel, MessageCollectionParams, MessageFilterParams } from '@sendbird/chat/groupChannel';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import type { SendableMessageType } from '../../../utils';
import { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { ThreadReplySelectType } from './const';
import { RenderUserProfileProps, ReplyType } from '../../../types';
import { ScrollTopics, ScrollTopicUnion } from './hooks/useMessageListScroll';
import { PubSubTypes } from '../../../lib/pubSub';
import { useMessageActions } from './hooks/useMessageActions';
type OnBeforeHandler<T> = (params: T) => T | Promise<T>;
type MessageListQueryParamsType = Omit<MessageCollectionParams, 'filter'> & MessageFilterParams;
type MessageActions = ReturnType<typeof useMessageActions>;
type MessageListDataSourceWithoutActions = Omit<ReturnType<typeof useGroupChannelMessages>, keyof MessageActions>;
interface ContextBaseType {
    channelUrl: string;
    isReactionEnabled?: boolean;
    isMessageGroupingEnabled?: boolean;
    isMultipleFilesMessageEnabled?: boolean;
    showSearchIcon?: boolean;
    replyType?: ReplyType;
    threadReplySelectType?: ThreadReplySelectType;
    disableUserProfile?: boolean;
    disableMarkAsRead?: boolean;
    scrollBehavior?: 'smooth' | 'auto';
    startingPoint?: number;
    animatedMessageId?: number | null;
    onMessageAnimated?: () => void;
    messageListQueryParams?: MessageListQueryParamsType;
    onBeforeSendUserMessage?: OnBeforeHandler<UserMessageCreateParams>;
    onBeforeSendFileMessage?: OnBeforeHandler<FileMessageCreateParams>;
    onBeforeSendVoiceMessage?: OnBeforeHandler<FileMessageCreateParams>;
    onBeforeSendMultipleFilesMessage?: OnBeforeHandler<MultipleFilesMessageCreateParams>;
    onBeforeUpdateUserMessage?: OnBeforeHandler<UserMessageUpdateParams>;
    onBackClick?(): void;
    onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
    onReplyInThreadClick?: (props: {
        message: SendableMessageType;
    }) => void;
    onSearchClick?(): void;
    onQuoteMessageClick?: (props: {
        message: SendableMessageType;
    }) => void;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    renderUserMentionItem?: (props: {
        user: User;
    }) => JSX.Element;
}
export interface GroupChannelContextType extends ContextBaseType, MessageListDataSourceWithoutActions, MessageActions {
    currentChannel: GroupChannel | null;
    fetchChannelError: SendbirdError | null;
    nicknamesMap: Map<string, string>;
    scrollRef: React.MutableRefObject<HTMLDivElement>;
    scrollDistanceFromBottomRef: React.MutableRefObject<number>;
    scrollPubSub: PubSubTypes<ScrollTopics, ScrollTopicUnion>;
    messageInputRef: React.MutableRefObject<HTMLDivElement>;
    quoteMessage: SendableMessageType | null;
    setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
    animatedMessageId: number;
    setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
    isScrollBottomReached: boolean;
    setIsScrollBottomReached: React.Dispatch<React.SetStateAction<boolean>>;
    scrollToBottom: () => void;
    scrollToMessage: (createdAt: number, messageId: number) => void;
    toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void;
}
export interface GroupChannelProviderProps extends ContextBaseType, Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'renderUserProfile' | 'disableUserProfile'> {
    children?: React.ReactNode;
}
export declare const GroupChannelContext: React.Context<GroupChannelContextType>;
export declare const GroupChannelProvider: (props: GroupChannelProviderProps) => React.JSX.Element;
export declare const useGroupChannelContext: () => GroupChannelContextType;
export {};
