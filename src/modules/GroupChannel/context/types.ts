import type { EmojiCategory, SendbirdError, User } from '@sendbird/chat';
import {
  type FileMessage,
  FileMessageCreateParams,
  type MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { GroupChannel, MessageCollectionParams, MessageFilterParams } from '@sendbird/chat/groupChannel';
import type { PubSubTypes } from '../../../lib/pubSub';
import type { ScrollTopics, ScrollTopicUnion } from './hooks/useMessageListScroll';
import type { SendableMessageType } from '../../../utils';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { ReplyType } from '../../../types';
import { useMessageActions } from './hooks/useMessageActions';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import { ThreadReplySelectType } from './const';
import { PropsWithChildren } from 'react';

// Message data source types
type MessageDataSource = ReturnType<typeof useGroupChannelMessages>;
export type MessageActions = ReturnType<typeof useMessageActions>;
export type MessageListQueryParamsType = Omit<MessageCollectionParams, 'filter'> & MessageFilterParams;

// Handler types
export type OnBeforeHandler<T> = (params: T) => T | Promise<T> | void | Promise<void>;
export type OnBeforeDownloadFileMessageType = (params: {
  message: FileMessage | MultipleFilesMessage;
  index?: number
}) => Promise<boolean>;

// Include all the props and states
export interface GroupChannelState extends GroupChannelProviderProps,
  Omit<InternalGroupChannelState, keyof GroupChannelProviderProps> {
}
// Only include the states
interface InternalGroupChannelState extends MessageDataSource {
  // Channel state
  currentChannel: GroupChannel | null;
  channelUrl: string;
  fetchChannelError: SendbirdError | null;
  nicknamesMap: Map<string, string>;

  // UI state
  quoteMessage: SendableMessageType | null;
  animatedMessageId: number | null;
  isScrollBottomReached: boolean;
  readState: string | null;

  // References - will be managed together
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollDistanceFromBottomRef: React.MutableRefObject<number>;
  scrollPositionRef: React.MutableRefObject<number>;
  messageInputRef: React.RefObject<HTMLDivElement>;

  // Configuration
  isReactionEnabled: boolean;
  isMessageGroupingEnabled: boolean;
  isMultipleFilesMessageEnabled: boolean;
  showSearchIcon: boolean;
  replyType: ReplyType;
  threadReplySelectType: ThreadReplySelectType;
  disableMarkAsRead: boolean;
  scrollBehavior: 'smooth' | 'auto';

  // Actions (React UIKit specific)
  markAsUnread?: (message: SendableMessageType) => void;
  markAsUnreadSourceRef: React.MutableRefObject<'manual' | 'internal' | null>;

  // Legacy - Will be removed after migration
  scrollPubSub: PubSubTypes<ScrollTopics, ScrollTopicUnion>;
}

export interface GroupChannelProviderProps extends PropsWithChildren<
  Pick<UserProfileProviderProps,
    'renderUserProfile' |
    'disableUserProfile' |
    'onUserProfileMessage'|
    'onStartDirectMessage'
  >> {
  // Required
  channelUrl: string;

  // Flags
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  isMultipleFilesMessageEnabled?: boolean;
  showSearchIcon?: boolean;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  disableMarkAsRead?: boolean;
  scrollBehavior?: 'smooth' | 'auto';
  forceLeftToRightMessageLayout?: boolean;

  startingPoint?: number;

  // Message Focusing
  animatedMessageId?: number | null;
  onMessageAnimated?: () => void;

  // Custom
  messageListQueryParams?: MessageListQueryParamsType;
  filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];

  // Handlers
  onBeforeSendUserMessage?: OnBeforeHandler<UserMessageCreateParams>;
  onBeforeSendFileMessage?: OnBeforeHandler<FileMessageCreateParams>;
  onBeforeSendVoiceMessage?: OnBeforeHandler<FileMessageCreateParams>;
  onBeforeSendMultipleFilesMessage?: OnBeforeHandler<MultipleFilesMessageCreateParams>;
  onBeforeUpdateUserMessage?: OnBeforeHandler<UserMessageUpdateParams>;
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;

  // Click handlers
  onBackClick?(): void;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onReplyInThreadClick?: (props: { message: SendableMessageType }) => void;
  onSearchClick?(): void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;

  // Render props
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}
