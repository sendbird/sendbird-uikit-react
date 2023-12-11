import type { SendbirdError, User } from '@sendbird/chat';
import type {
  FileMessage,
  FileMessageCreateParams,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  ReplyType,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';

import type { CoreMessageType, SendableMessageType } from '../../utils';
import type { ThreadReplySelectType } from './context/const';
import type { RenderUserProfileProps } from '../../types';

export interface GroupChannelContextProps {
  children?: React.ReactElement;
  channelUrl: string;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  isMultipleFilesMessageEnabled?: boolean;
  showSearchIcon?: boolean;
  animatedMessage?: number | null;
  highlightedMessage?: number | null;
  startingPoint?: number | null;
  onBeforeSendUserMessage?(text: string, quotedMessage?: SendableMessageType): UserMessageCreateParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: SendableMessageType): FileMessageCreateParams;
  onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams;
  onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
  onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onSearchClick?(): void;
  onBackClick?(): void;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  // queries?: ChannelQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  filterMessageList?(messages: CoreMessageType): boolean;
  disableUserProfile?: boolean;
  disableMarkAsRead?: boolean;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onMessageAnimated?: () => void;
  onMessageHighlighted?: () => void;
  scrollBehavior?: 'smooth' | 'auto';
  reconnectOnIdle?: boolean;
}

// replace to the useGroupChannelMessages hook
// export interface MessageStoreInterface {
//   allMessages: CoreMessageType[];
//   localMessages: CoreMessageType[];
//   loading: boolean;
//   initialized: boolean;
//   /** @deprecated Please use `unreadSinceDate` instead * */
//   unreadSince: string;
//   unreadSinceDate: Date | null;
//   isInvalid: boolean;
//   currentGroupChannel: Nullable<GroupChannel>;
//   hasMorePrev: boolean;
//   oldestMessageTimeStamp: number;
//   hasMoreNext: boolean;
//   latestMessageTimeStamp: number;
//   emojiContainer: EmojiContainer;
//   readStatus: any;
//   typingMembers: Member[];
// }

interface SendMessageParams {
  message: string;
  quoteMessage?: SendableMessageType;
  // mentionedUserIds?: string;
  mentionedUsers?: User[];
  mentionTemplate?: string;
}

interface UpdateMessageParams {
  messageId: number;
  message: string;
  mentionedUsers?: User[];
  mentionTemplate?: string;
}

export interface GroupChannelProviderInterface extends GroupChannelContextProps {
  scrollToMessage?(createdAt: number, messageId: number): void;
  isScrolled?: boolean;
  setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
  // messageActionTypes: typeof channelAction;
  // messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  quoteMessage: SendableMessageType | null;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  initialTimeStamp: number;
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  animatedMessageId: number;
  highLightedMessageId: number;
  nicknamesMap: Map<string, string>;
  emojiAllMap: any;
  onScrollCallback: () => void;
  onScrollDownCallback: any;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageInputRef: React.MutableRefObject<HTMLInputElement>,
  deleteMessage(message: CoreMessageType): Promise<CoreMessageType>,
  updateMessage(props: UpdateMessageParams, callback?: (err: SendbirdError, message: UserMessage) => void): void,
  resendMessage(failedMessage: SendableMessageType): void,
  // TODO: Good to change interface to using params / This part need refactoring
  sendMessage: (params: SendMessageParams) => void,
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>,
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void,
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>,
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void,
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}
