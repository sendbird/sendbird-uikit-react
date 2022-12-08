/**
 * Type Definitions for SendbirdUIKit v3
 * homepage: https://sendbird.com/
 * git: https://github.com/sendbird/sendbird-uikit-react
 */
import type React from 'react';
import type { ReactElement } from 'react';

import type SendbirdChat from '@sendbird/chat';
import type {
  User,
  SessionHandler,
  SendbirdError,
  EmojiCategory,
  EmojiContainer,
} from '@sendbird/chat';
import type {
  AdminMessage,
  UserMessage,
  FileMessage,
  MessageSearchQuery,
  UserMessageCreateParams,
  FileMessageCreateParams,
  UserMessageUpdateParams,
  MessageListParams,
  MessageSearchQueryParams,
} from '@sendbird/chat/message';
import type {
  Member,
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelUpdateParams,
  GroupChannelListQuery,
} from '@sendbird/chat/groupChannel';

import type { Locale } from 'date-fns';
import {
  OpenChannel,
  OpenChannelCreateParams,
  OpenChannelUpdateParams,
  SendbirdOpenChat,
} from '@sendbird/chat/openChannel';
import { UikitMessageHandler } from './lib/selectors';
import { RenderCustomSeparatorProps } from './types';

type ReplyType = "NONE" | "QUOTE_REPLY" | "THREAD";

type Logger = {
  info?(title?: unknown, description?: unknown): void;
  error?(title?: unknown, description?: unknown): void;
  warning?(title?: unknown, description?: unknown): void;
};

interface UserListQuery {
  hasNext?: boolean;
  next(): Promise<Array<User>>;
}

interface RenderUserProfileProps {
  user: User | Member;
  currentUserId: string;
  close(): void;
}

interface SendBirdProviderConfig {
  logLevel?: 'debug' | 'warning' | 'error' | 'info' | 'all' | Array<string>;
  userMention?: {
    maxMentionCount?: number,
    maxSuggestionCount?: number,
  };
}

interface ClientMessage {
  reqId: string;
  file?: File;
  localUrl?: string;
  _sender: User;
}

interface RenderMessageProps {
  message: EveryMessage;
  chainTop: boolean;
  chainBottom: boolean;
}

interface ClientUserMessage extends UserMessage, ClientMessage { }
interface ClientFileMessage extends FileMessage, ClientMessage { }
interface ClientAdminMessage extends AdminMessage, ClientMessage { }
type EveryMessage = ClientUserMessage | ClientFileMessage | ClientAdminMessage;
type ClientSentMessages = ClientUserMessage | ClientFileMessage;

interface SendBirdProviderProps {
  userId: string;
  appId: string;
  accessToken?: string;
  configureSession?: (sdk: SendbirdChat) => SessionHandler;
  customApiHost?: string,
  customWebSocketHost?: string,
  children?: React.ReactElement;
  theme?: 'light' | 'dark';
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  disableUserProfile?: boolean;
  disableMarkAsDelivered?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  allowProfileEdit?: boolean;
  userListQuery?(): UserListQuery;
  config?: SendBirdProviderConfig;
  stringSet?: Record<string, string>;
  colorSet?: Record<string, string>;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  isMentionEnabled?: boolean;
  // isTypingIndicatorEnabledOnChannelList?: boolean;
  // isMessageReceiptStatusEnabledOnChannelList?: boolean;
}

interface SendBirdStateConfig {
  disableUserProfile: boolean;
  disableMarkAsDelivered: boolean;
  onUserProfileMessage?: (props: GroupChannel) => void;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  allowProfileEdit: boolean;
  isOnline: boolean;
  isReactionEnabled: boolean;
  isMentionEnabled: boolean;
  userMention: {
    maxMentionCount: number;
    maxSuggestionCount: number;
  };
  userId: string;
  appId: string;
  accessToken: string;
  theme: string;
  pubSub: any;
  logger: Logger;
  setCurrenttheme: (theme: string) => void;
  userListQuery?(): UserListQuery;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}
export interface SdkStore {
  error: boolean;
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChat;
}
interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: User;
}
interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}

export interface MessageSearchQueryType extends MessageSearchQuery {
  key?: string;
}

export type SendBirdState = {
  config: SendBirdStateConfig;
  stores: SendBirdStateStore;
  dispatchers: {
    userDispatcher: UserDispatcher,
  },
}

type UserDispatcherParams = {
  type: string,
  payload: User
};

type UserDispatcher = (params: UserDispatcherParams) => void;

type GetSdk = SendbirdChat | undefined;
type GetConnect = (
  userId: string,
  accessToken?: string
) => Promise<User>;
type GetDisconnect = () => Promise<void>;
type GetUpdateUserInfo = (
  nickName: string,
  profileUrl?: string
) => Promise<User>;
type GetCreateGroupChannel = (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;
type GetCreateOpenChannel = (channelParams: OpenChannelCreateParams) => Promise<OpenChannel>;
type GetGetGroupChannel = (
  channelUrl: string,
  isSelected?: boolean,
) => Promise<GroupChannel>;
type GetGetOpenChannel = (
  channelUrl: string,
) => Promise<OpenChannel>;
type GetLeaveGroupChannel = (channelUrl: string) => Promise<void>;
type GetEnterOpenChannel = (channelUrl: string) => Promise<OpenChannel>;
type GetExitOpenChannel = (channelUrl: string) => Promise<void>;
type GetFreezeChannel = (channel: GroupChannel | OpenChannel) => Promise<void>;
type GetUnFreezeChannel = (channel: GroupChannel | OpenChannel) => Promise<void>;
type GetSendUserMessage = (
  channel: GroupChannel | OpenChannel,
  userMessageParams: UserMessageCreateParams,
) => UikitMessageHandler;
type GetSendFileMessage = (
  channel: GroupChannel | OpenChannel,
  fileMessageParams: FileMessageCreateParams
) => UikitMessageHandler;
type GetUpdateUserMessage = (
  channel: GroupChannel | OpenChannel,
  messageId: string | number,
  params: UserMessageUpdateParams
) => Promise<UserMessage>;
// type getUpdateFileMessage = (
//   channel: GroupChannel | OpenChannel,
//   messageId: string | number,
//   params: FileMessageUpdateParams,
// ) => Promise<FileMessage>;
type GetDeleteMessage = (
  channel: GroupChannel | OpenChannel,
  message: AdminMessage | UserMessage | FileMessage
) => Promise<void>;
type GetResendUserMessage = (
  channel: GroupChannel | OpenChannel,
  failedMessage: UserMessage
) => Promise<UserMessage>;
type GetResendFileMessage = (
  channel: GroupChannel | OpenChannel,
  failedMessage: FileMessage
) => Promise<FileMessage>;

interface sendbirdSelectorsInterface {
  getSdk: (store: SendBirdState) => GetSdk;
  getConnect: (store: SendBirdState) => GetConnect
  getDisconnect: (store: SendBirdState) => GetDisconnect;
  getUpdateUserInfo: (store: SendBirdState) => GetUpdateUserInfo;
  getCreateGroupChannel: (store: SendBirdState) => GetCreateGroupChannel;
  getCreateOpenChannel: (store: SendBirdState) => GetCreateOpenChannel;
  getGetGroupChannel: (store: SendBirdState) => GetGetGroupChannel;
  getGetOpenChannel: (store: SendBirdState) => GetGetOpenChannel;
  getLeaveGroupChannel: (store: SendBirdState) => GetLeaveGroupChannel;
  getEnterOpenChannel: (store: SendBirdState) => GetEnterOpenChannel;
  getExitOpenChannel: (store: SendBirdState) => GetExitOpenChannel;
  getFreezeChannel: (store: SendBirdState) => GetFreezeChannel;
  getUnFreezeChannel: (store: SendBirdState) => GetUnFreezeChannel;
  getSendUserMessage: (store: SendBirdState) => GetSendUserMessage;
  getSendFileMessage: (store: SendBirdState) => GetSendFileMessage;
  getUpdateUserMessage: (store: SendBirdState) => GetUpdateUserMessage;
  // getUpdateFileMessage: (store: SendBirdState) => GetUpdateFileMessage;
  getDeleteMessage: (store: SendBirdState) => GetDeleteMessage;
  getResendUserMessage: (store: SendBirdState) => GetResendUserMessage;
  getResendFileMessage: (store: SendBirdState) => GetResendFileMessage;
}

interface AppProps {
  appId: string;
  userId: string;
  accessToken?: string;
  customApiHost?: string,
  customWebSocketHost?: string,
  theme?: 'light' | 'dark';
  userListQuery?(): UserListQuery;
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  allowProfileEdit?: boolean;
  disableUserProfile?: boolean;
  disableMarkAsDelivered?: boolean;
  showSearchIcon?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onProfileEditSuccess?(user: User): void;
  config?: SendBirdProviderConfig;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  stringSet?: Record<string, string>;
  colorSet?: Record<string, string>;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  replyType?: ReplyType;
  disableAutoSelect?: boolean;
  isMentionEnabled?: boolean;
  // isTypingIndicatorEnabledOnChannelList?: boolean;
  // isMessageReceiptStatusEnabledOnChannelList?: boolean;
}

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

// interface GroupChannelListQuery {
//   limit?: number;
//   includeEmpty?: boolean;
//   order?: 'latest_last_message' | 'chronological' | 'channel_name_alphabetical' | 'metadata_value_alphabetical';
//   userIdsExactFilter?: Array<string>;
//   userIdsIncludeFilter?: Array<string>;
//   userIdsIncludeFilterQueryType?: 'AND' | 'OR';
//   nicknameContainsFilter?: string;
//   channelNameContainsFilter?: string;
//   customTypesFilter?: Array<string>;
//   customTypeStartsWithFilter?: string;
//   channelUrlsFilter?: Array<string>;
//   superChannelFilter?: 'all' | 'super' | 'nonsuper';
//   publicChannelFilter?: 'all' | 'public' | 'private';
//   metadataOrderKeyFilter?: string;
//   memberStateFilter?: 'all' | 'joined_only' | 'invited_only' | 'invited_by_friend' | 'invited_by_non_friend';
//   hiddenChannelFilter?: 'unhidden_only' | 'hidden_only' | 'hidden_allow_auto_unhide' | 'hidden_prevent_auto_unhide';
//   unreadChannelFilter?: 'all' | 'unread_message';
//   includeFrozen?: boolean;
// }
interface ChannelListQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
  channelListQuery?: GroupChannelListQuery;
}

export interface ChannelListProviderProps {
  allowProfileEdit?: boolean;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  onThemeChange?(theme: string): void;
  onProfileEditSuccess?(user: User): void;
  onChannelSelect?(channel: GroupChannel): void;
  sortChannelList?: (channels: GroupChannel[]) => GroupChannel[];
  queries?: ChannelListQueries;
  children?: React.ReactElement;
  className?: string | string[];
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  disableUserProfile?: boolean;
  disableAutoSelect?: boolean;
  typingChannels?: Array<GroupChannel>;
  isTypingIndicatorEnabled?: boolean;
  isMessageReceiptStatusEnabled?: boolean;
}

export interface ChannelListProviderInterface extends ChannelListProviderProps {
  initialized: boolean;
  loading: boolean;
  allChannels: GroupChannel[];
  currentChannel: GroupChannel;
  showSettings: boolean;
  channelListQuery: GroupChannelListQuery;
  currentUserId: string;
  // channelListDispatcher: CustomUseReducerDispatcher;
  channelSource: GroupChannelListQuery;
}

interface RenderChannelPreviewProps {
  channel: GroupChannel;
  onLeaveChannel(
    channel: GroupChannel,
    onLeaveChannelCb?: (c: GroupChannel) => void,
  );
}

interface ChannelListUIProps {
  renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactElement;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}

interface ChannelListProps extends ChannelListProviderInterface, ChannelListUIProps {}

interface ChannelListHeaderInterface {
  renderHeader?: (props: void) => React.ReactElement;
  renderTitle?: (props: void) => React.ReactElement;
  renderIconButton?: (props: void) => React.ReactElement;
  onEdit?: (props: void) => void;
  allowProfileEdit?: boolean;
}

interface ChannelPreviewInterface {
  channel: GroupChannel;
  isActive?: boolean;
  isTyping?: boolean;
  onClick: () => void;
  renderChannelAction: (props: { channel: GroupChannel }) => React.ReactElement;
  tabIndex: number;
}

interface ChannelPreviewActionInterface {
  disabled?: boolean;
  onLeaveChannel?: () => void;
}

interface ChannelSettingsProviderInterface {
  channelUrl: string;
  onCloseClick?(): void;
  onChannelModified?(channel: GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): GroupChannelUpdateParams;
  queries?: ChannelSettingsQueries;
  forceUpdateUI(): void;
  channel: GroupChannel;
  invalidChannel: boolean;
}

interface ChannelSettingsUIProps {
  renderPlaceholderError?: () => React.ReactElement;
  renderChannelProfile?: () => React.ReactElement;
  renderModerationPanel?: () => React.ReactElement;
  renderLeaveChannel?: () => React.ReactElement;
}

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

interface ChannelSettingsQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
}

type ChannelSettingsContextProps = {
  children: React.ReactElement;
  channelUrl: string;
  className?: string;
  onCloseClick?(): void;
  onChannelModified?(channel: GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): GroupChannelUpdateParams;
  queries?: ChannelSettingsQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  disableUserProfile?: boolean;
}

interface ChannelSettingsProps extends ChannelSettingsUIProps, ChannelSettingsContextProps {
}

type ChannelSettingsEditDetailsProps = {
  onSubmit: () => void;
  onCancel: () => void;
}

type CustomUser = User & {
  isMuted: boolean;
  role: string;
}

interface UserListItemActionProps {
  actionRef: React.RefObject<HTMLInputElement>;
  parentRef: React.RefObject<HTMLInputElement>;
}

interface UserListItemProps {
  user: CustomUser;
  currentUser?: string;
  className?: string;
  action?(props: UserListItemActionProps): React.ReactElement;
}

type LeaveChannelProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

declare module '@sendbird/uikit-react'  {
  export type App = React.FunctionComponent<AppProps>;
  export type SendBirdProvider = React.FunctionComponent<SendBirdProviderProps>;
  export type sendbirdSelectors = sendbirdSelectorsInterface;
  export type ChannelList = React.FunctionComponent<ChannelListProps>;
  export type ChannelSettings = React.FunctionComponent<ChannelSettingsProps>;
  export type Channel = React.FunctionComponent<ChannelProps>
  export type OpenChannel = React.FunctionComponent<OpenChannelProps>
  export type OpenChannelSettings = React.FunctionComponent<OpenChannelSettingsProps>
  export type MessageSearch = React.FunctionComponent<MessageSearchProps>
  export function withSendBird(
    ChildComp: React.Component | React.ElementType | React.ReactElement,
    mapStoreToProps?: (store: SendBirdState) => unknown
  ): (props: unknown) => React.ReactElement;
  export function useSendbirdStateContext(): SendBirdState;
}

declare module '@sendbird/uikit-react/App' {
  type App = React.FunctionComponent<AppProps>;
  export default App;
}

declare module '@sendbird/uikit-react/SendbirdProvider' {
  type SendbirdProvider = React.FunctionComponent<SendBirdProviderProps>;
  export default SendbirdProvider;
}

declare module '@sendbird/uikit-react/sendbirdSelectors' {
  type sendbirdSelectors = sendbirdSelectorsInterface;
  export default sendbirdSelectors;
}

declare module '@sendbird/uikit-react/useSendbirdStateContext' {
  function useSendbirdStateContext(): SendBirdState;
  export default useSendbirdStateContext;
}

declare module '@sendbird/uikit-react/withSendBird' {
  function withSendBird(
    ChildComp: React.Component | React.ElementType | React.ReactElement,
    mapStoreToProps?: (store: SendBirdState) => unknown
  ): (props: unknown) => React.ReactElement;
  export default withSendBird;
}

declare module '@sendbird/uikit-react/utils/message/getOutgoingMessageState' {
  export enum OutgoingMessageStates {
    NONE = 'NONE',
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
  }
  export function getOutgoingMessageState(
    channel: GroupChannel | OpenChannel,
    message: UserMessage | FileMessage,
  ): OutgoingMessageStates;
}

declare module '@sendbird/uikit-react/ChannelList' {
  type ChannelList = React.FunctionComponent<ChannelListProps>;
  export default ChannelList;
}

declare module '@sendbird/uikit-react/ChannelList/context' {
  export type ChannelListProvider = React.FunctionComponent<ChannelListProviderProps>;
  export function useChannelListContext (): ChannelListProviderInterface;
}

declare module '@sendbird/uikit-react/ChannelList/components/AddChannel' {
  type AddChannel = React.VoidFunctionComponent;
  export default AddChannel;
}

declare module '@sendbird/uikit-react/ChannelList/components/ChannelListUI' {
  type ChannelListUI = React.FunctionComponent<ChannelListUIProps>;
  export default ChannelListUI;
}

declare module '@sendbird/uikit-react/ChannelList/components/ChannelListHeader' {
  type ChannelListHeader = React.FunctionComponent<ChannelListUIProps>;
  export default ChannelListHeader;
}

declare module '@sendbird/uikit-react/ChannelList/components/ChannelPreview' {
  type ChannelPreview = React.FunctionComponent<ChannelPreviewInterface>;
  export default ChannelPreview;
}

declare module '@sendbird/uikit-react/ChannelList/components/ChannelPreviewAction' {
  type ChannelPreviewAction = React.FunctionComponent<ChannelPreviewActionInterface>;
  export default ChannelPreviewAction;
}

declare module '@sendbird/uikit-react/ChannelSettings' {
  type ChannelSettings = React.FunctionComponent<ChannelSettingsProps>;
  export default ChannelSettings;
}

declare module '@sendbird/uikit-react/ChannelSettings/context' {
  export type ChannelSettingsProvider = React.FC<ChannelSettingsContextProps>;
  export type UseChannelSettingsType = () => ChannelSettingsProviderInterface;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/AdminPanel' {
  type AdminPanel = React.VoidFunctionComponent;
  export default AdminPanel;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/ChannelProfile' {
  type ChannelProfile = React.VoidFunctionComponent;
  export default ChannelProfile;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI' {
  type ChannelSettingsUI = React.FC<ChannelSettingsUIProps>;
  export default ChannelSettingsUI;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/EditDetailsModal' {
  type EditDetailsModal = React.FC<ChannelSettingsEditDetailsProps>;
  export default EditDetailsModal;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/LeaveChannel' {
  type LeaveChannel = React.FC<LeaveChannelProps>;
  export default LeaveChannel;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/UserListItem' {
  type UserListItem = React.FC<UserListItemProps>;
  export default UserListItem;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/UserPanel' {
  type UserPanel = React.FC<Record<string, unknown>>;
  export default UserPanel;
}

/**
 * Channel
 */
interface RenderMessageProps {
  message: EveryMessage;
  chainTop: boolean;
  chainBottom: boolean;
}

type ChannelQueries = {
  messageListParams?: MessageListParams;
};

type ChannelContextProps = {
  children?: React.ReactElement;
  channelUrl: string;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  showSearchIcon?: boolean;
  highlightedMessage?: number;
  startingPoint?: number;
  onBeforeSendUserMessage?(text: string, quotedMessage?: UserMessage | FileMessage): UserMessageCreateParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: UserMessage | FileMessage): FileMessageCreateParams;
  onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onSearchClick?(): void;
  replyType?: ReplyType;
  queries?: ChannelQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  disableUserProfile?: boolean;
  disableMarkAsRead?: boolean;
};

interface ChannelUIProps {
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderChannelHeader?: () => React.ReactElement;
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderTypingIndicator?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
}

type CoreMessageType = AdminMessage | UserMessage | FileMessage;

interface MessageStoreInterface {
  allMessages: CoreMessageType[];
  loading: boolean;
  initialized: boolean;
  unreadSince: string;
  isInvalid: boolean;
  currentGroupChannel: GroupChannel;
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: any;
  readStatus: any;
}

interface ChannelProviderInterface extends ChannelContextProps, ChannelContextProps {
  scrollToMessage?(createdAt: number, messageId: number): void;
  messageActionTypes: Record<string ,string>;
  quoteMessage: UserMessage | FileMessage;
  setQuoteMessage: React.Dispatch<React.SetStateAction<UserMessage | FileMessage>>;
  initialTimeStamp: number;
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  animatedMessageId: number;
  highLightedMessageId: number;
  nicknamesMap: Map<string, string>;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageInputRef: React.MutableRefObject<HTMLInputElement>,
  toggleReaction(message: UserMessage | FileMessage, emojiKey: string, isReacted: boolean): void,
}

type FileViewerProps = {
  onCancel:() => void;
  message: ClientFileMessage;
}

type MessageUIProps = {
  message: EveryMessage;
  hasSeparator?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  handleScroll: () => void;
  // for extending
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderEditInput?: () => React.ReactElement;
  renderMessageContent?: () => React.ReactElement;
};

type MessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
};

type SuggestedMentionListProps = {
  targetNickname: string;
  memberListQuery?: Record<string, string>;
  onUserItemClick?: (member: User) => void;
  onFocusItemChange?: (member: User) => void;
  onFetchUsers?: (users: Array<User>) => void;
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
  ableAddMention: boolean;
  maxMentionCount?: number;
  maxSuggestionCount?: number;
  inputEvent?: React.KeyboardEvent<HTMLDivElement>;
};

type SuggestedUserMentionItemProps = {
  member: User;
  isFocused?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
};

interface UnreadCountProps {
  count: number;
  time: string;
  onClick(): void;
}

interface ChannelProps extends ChannelContextProps, ChannelUIProps {
}

interface RemoveMessageProps {
  onCancel: () => void;
  message: EveryMessage;
}

interface SendbirdUIKitUIEvent<> {
  event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>;
}
export interface MentionItemUIEvent extends SendbirdUIKitUIEvent {
  member: Member;
  itemRef: React.RefObject<HTMLDivElement>;
}

declare module '@sendbird/uikit-react/Channel' {
  type Channel = React.FC<ChannelProps>;
  export default Channel;
}

declare module '@sendbird/uikit-react/Channel/context' {
  export type ChannelProvider = React.FunctionComponent<ChannelContextProps>;
  export function useChannelContext(): ChannelProviderInterface;
}

declare module '@sendbird/uikit-react/Channel/components/ChannelHeader' {
  type ChannelHeader = React.VoidFunctionComponent;
  export default ChannelHeader;
}

declare module '@sendbird/uikit-react/Channel/components/ChannelUI' {
  type ChannelUI = React.FunctionComponent<ChannelUIProps>;
  export default ChannelUI;
}

declare module '@sendbird/uikit-react/Channel/components/FileViewer' {
  type FileViewer = React.FunctionComponent<FileViewerProps>;
  export default FileViewer;
}

declare module '@sendbird/uikit-react/Channel/components/FrozenNotification' {
  type FrozenNotification = React.VoidFunctionComponent;
  export default FrozenNotification;
}

declare module '@sendbird/uikit-react/Channel/components/Message' {
  type Message = React.FunctionComponent<MessageUIProps>;
  export default Message;
}

declare module '@sendbird/uikit-react/Channel/components/MessageInput' {
  type MessageInput = React.VoidFunctionComponent;
  export default MessageInput;
}

declare module '@sendbird/uikit-react/Channel/components/MessageList' {
  type MessageList = React.FunctionComponent<MessageListProps>;
  export default MessageList;
}

declare module '@sendbird/uikit-react/Channel/components/SuggestedMentionList' {
  type SuggestedMentionList = React.FunctionComponent<SuggestedMentionListProps>;
  export default SuggestedMentionList;
}

declare module '@sendbird/uikit-react/Channel/components/RemoveMessageModal' {
  type RemoveMessageModal = React.FunctionComponent<RemoveMessageProps>;
  export default RemoveMessageModal;
}

declare module '@sendbird/uikit-react/Channel/components/TypingIndicator' {
  type TypingIndicator = React.VoidFunctionComponent;
  export default TypingIndicator;
}

declare module '@sendbird/uikit-react/Channel/components/UnreadCount' {
  type UnreadCount = React.FunctionComponent<UnreadCountProps>;
  export default UnreadCount;
}

type OpenChannelQueries = {
  // https://sendbird.github.io/core-sdk-javascript/module-model_params_messageListParams-MessageListParams.html
  messageListParams?: {
    replyType?: string,
    messageType?: string,
    prevResultSize?: number,
    nextResultSize?: number,
    reverse?: boolean,
    isInclusive?: boolean,
    includeMetaArray?: boolean,
    // UIKit doesn't support emoji reaction in OpenChannel
    // includeReactions?: boolean,
    // UIKit doesn't support message threading in OpenChannel
    // includeThreadInfo?: boolean,
    includePollDetails?: boolean,
    includeParentMessageInfo?: boolean,
    showSubchannelMessagesOnly?: boolean,
    customTypes?: Array<string>,
    senderUserIds?: Array<string>,
  },
};

interface OpenChannelProviderProps {
  channelUrl: string;
  children?: React.ReactElement;
  isMessageGroupingEnabled?: boolean;
  queries?: OpenChannelQueries;
  messageLimit?: number;
  onBeforeSendUserMessage?(text: string): UserMessageCreateParams;
  onBeforeSendFileMessage?(file_: File): FileMessageCreateParams;
  onChatHeaderActionClick?(): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}

interface OpenChannelMessagesState {
  allMessages: Array<EveryMessage>;
  loading: boolean;
  initialized: boolean;
  currentOpenChannel: OpenChannel;
  isInvalid: boolean;
  hasMore: boolean;
  lastMessageTimestamp: number;
  frozen: boolean;
  operators: Array<User>;
  participants: Array<User>;
  bannedParticipantIds: Array<string>;
  mutedParticipantIds: Array<string>;
}

interface OpenChannelInterface extends OpenChannelProviderProps, OpenChannelMessagesState {
  // derived/utils
  messageInputRef: React.RefObject<HTMLInputElement>;
  conversationScrollRef: React.RefObject<HTMLDivElement>;
  disabled: boolean;
  amIBanned: boolean;
  amIMuted: boolean;
  amIOperator: boolean;
  fetchMore: boolean;
  checkScrollBottom: () => boolean;
  onScroll: (callback: () => void) => void;
}

interface OpenChannelUIProps {
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  renderInput?: () => React.ReactElement;
  renderPlaceHolderEmptyList?: () => React.ReactElement;
  renderPlaceHolderError?: () => React.ReactElement;
  renderPlaceHolderLoading?: () => React.ReactElement;
}

interface OpenChannelProps extends OpenChannelProviderProps, OpenChannelUIProps {
}

type OpenchannelMessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderPlaceHolderEmptyList?: () => React.ReactElement;
}

type OpenChannelMessageProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  message: EveryMessage;
  chainTop?: boolean;
  chainBottom?: boolean;
  hasSeparator?: boolean;
  editDisabled?: boolean;
};

declare module '@sendbird/uikit-react/OpenChannel' {
  type OpenChannel = React.FC<OpenChannelProps>;
  export default OpenChannel;
}

declare module '@sendbird/uikit-react/OpenChannel/context' {
  export type OpenChannelProvider = React.FunctionComponent<OpenChannelProviderProps>;
  export function useOpenChannelContext(): OpenChannelInterface;
}

declare module '@sendbird/uikit-react/OpenChannel/components/FrozenChannelNotification' {
  type FrozenChannelNotification = React.FC<Record<string, unknown>>;
  export default FrozenChannelNotification;
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelHeader' {
  type OpenChannelHeader = React.FC<Record<string, unknown>>;
  export default OpenChannelHeader;
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelInput' {
  type OpenChannelInput = React.FC<Record<string, unknown>>;
  export default OpenChannelInput;

}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelMessage' {
  type OpenChannelMessage = React.FC<OpenChannelMessageProps>;
  export default OpenChannelMessage;

}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelMessageList' {
  type OpenChannelMessageList = React.FC<OpenchannelMessageListProps>;
  export default OpenChannelMessageList;
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelUI' {
  type OpenChannelUI = React.FC<OpenChannelUIProps>;
  export default OpenChannelUI;
}

// OpenChannelList
interface UserFilledOpenChannelListQuery {
  customTypes?: Array<string>;
  includeFrozen?: boolean;
  includeMetaData?: boolean;
  limit?: number;
  nameKeyword?: string;
  urlKeyword?: string;
}

type OpenChannelListFetchingStatus = 'EMPTY' | 'FETCHING' | 'DONE' | 'ERROR';
type CustomUseReducerDispatcher = (props: { type: string, payload: any }) => void;
type OnOpenChannelSelected = (channel: OpenChannel, e?: React.MouseEvent<HTMLDivElement | unknown>) => void;
type FetchNextCallbackType = (callback: (channels?: Array<OpenChannel>, err?: SendbirdError) => void) => void

interface OpenChannelListProviderProps {
  className?: string;
  children?: React.ReactElement;
  queries?: { openChannelListQuery?: UserFilledOpenChannelListQuery };
  onChannelSelected?: OnOpenChannelSelected;
}

interface RenderOpenChannelPreviewProps {
  channel: OpenChannel;
  isSelected: boolean;
  onChannelSelected: OnOpenChannelSelected;
}

interface OpenChannelListUIProps {
  renderHeader?: () => React.ReactElement;
  renderChannelPreview?: (props: RenderOpenChannelPreviewProps) => React.ReactElement;
  renderPlaceHolderEmpty?: () => React.ReactElement;
  renderPlaceHolderError?: () => React.ReactElement;
  renderPlaceHolderLoading?: () => React.ReactElement;
}

interface OpenChannelListProviderInterface extends OpenChannelListProviderProps {
  logger: Logger;
  currentChannel: OpenChannel;
  allChannels: Array<OpenChannel>;
  fetchingStatus: OpenChannelListFetchingStatus;
  customOpenChannelListQuery?: UserFilledOpenChannelListQuery;
  fetchNextChannels: FetchNextCallbackType;
  refreshOpenChannelList: () => void;
  openChannelListDispatcher: CustomUseReducerDispatcher;
}

interface OpenChannelListProps extends OpenChannelListProviderProps, OpenChannelListUIProps { }

declare module '@sendbird/uikit-react/OpenChannelList' {
  type OpenChannelList = React.FC<OpenChannelListProps>;
  export default OpenChannelList;
}

declare module '@sendbird/uikit-react/OpenChannelList/context' {
  export type OpenChannelListProvider = React.FunctionComponent<OpenChannelListProviderProps>;
  export function useOpenChannelListContext(): OpenChannelListProviderInterface;
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelListUI' {
  interface OpenChannelListUIProps {
    renderHeader?: () => React.ReactElement;
    renderChannelPreview?: (props: RenderOpenChannelPreviewProps) => React.ReactElement;
    renderPlaceHolderEmpty?: () => React.ReactElement;
    renderPlaceHolderError?: () => React.ReactElement;
    renderPlaceHolderLoading?: () => React.ReactElement;
  }
  type OpenChannelListUI = React.FC<OpenChannelListUIProps>;
  export default OpenChannelListUI;
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelPreview' {
  interface OpenChannelPreviewProps {
    className?: string;
    isSelected?: boolean;
    channel: OpenChannel;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  }
  type OpenChannelPreview = React.FC<OpenChannelPreviewProps>;
  export default OpenChannelPreview;
}

// CreateOpenChannel
interface CreateOpenChannelProviderProps {
  className?: string;
  children?: React.ReactElement;
  onCreateChannel?: (channel: OpenChannel) => void;
  onBeforeCreateChannel?: (params: OpenChannelCreateParams) => OpenChannelCreateParams;
}
interface CreateOpenChannelUIProps {
  closeModal?: () => void;
  renderHeader?: () => React.ReactElement;
  renderProfileInput?: () => React.ReactElement;
}

interface CreateOpenChannelProps extends CreateOpenChannelProviderProps, CreateOpenChannelUIProps { }

interface CreateNewOpenChannelCallbackProps {
  name: string;
  coverUrlOrImage?: string;
}

interface CreateOpenChannelContextInterface extends CreateOpenChannelProviderProps {
  sdk: SendbirdOpenChat;
  sdkInitialized: boolean;
  logger: Logger;
  createNewOpenChannel: (props: CreateNewOpenChannelCallbackProps) => void;
}

declare module '@sendbird/uikit-react/CreateOpenChannel' {
  type CreateOpenChannel = React.FC<CreateOpenChannelProps>;
  export default CreateOpenChannel;
}

declare module '@sendbird/uikit-react/CreateOpenChannel/context' {
  export type CreateOpenChannelProvider = React.FunctionComponent<CreateOpenChannelProviderProps>;
  export function useCreateOpenChannelContext(): CreateOpenChannelContextInterface;
}

declare module '@sendbird/uikit-react/CreateOpenChannel/components/CreateOpenChannelUI' {
  interface CreateOpenChannelUIProps {
    closeModal?: () => void;
    renderHeader?: () => React.ReactElement;
    renderProfileInput?: () => React.ReactElement;
  }
  type CreateOpenChannelUI = React.FC<CreateOpenChannelUIProps>;
  export default CreateOpenChannelUI;
}

// OpenChannelSettings
interface OpenChannelSettingsContextProps {
  channelUrl: string;
  children?: React.ReactElement;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
  onChannelModified?(channel: OpenChannel): void;
  onDeleteChannel?(channel: OpenChannel): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}

interface OpenChannelSettingsUIProps {
  renderOperatorUI?: () => React.ReactElement;
  renderParticipantList?: () => React.ReactElement;
}

interface OpenChannelSettingsProps extends OpenChannelSettingsContextProps, OpenChannelSettingsUIProps {
}

interface OpenChannelSettingsContextType extends OpenChannelSettingsContextProps {
  channelUrl: string;
  channel?: OpenChannel;
  setChannel?: React.Dispatch<React.SetStateAction<OpenChannel>>;
}

interface OperatorUIProps {
  renderChannelProfile?: () => React.ReactElement;
}

interface OpenChannelEditDetailsProps {
  onCancel(): void;
}

declare module '@sendbird/uikit-react/OpenChannelSettings' {
  type OpenChannelSettings = React.FC<OpenChannelSettingsProps>;
  export default OpenChannelSettings;
}

declare module '@sendbird/uikit-react/OpenChannelSettings/context' {
  export type useOpenChannelSettings = () => OpenChannelSettingsContextType;
  export type OpenChannelSettingsProvider = React.FC<OpenChannelSettingsContextProps>;
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/EditDetailsModal' {
  type EditDetailsModal = React.FC<OpenChannelEditDetailsProps>;
  export default EditDetailsModal;
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/OpenChannelSettingsUI' {
  type OpenChannelSettingsUI = React.FC<OpenChannelSettingsUIProps>;
  export default OpenChannelSettingsUI;
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/OperatorUI' {
  type OperatorUI = React.FC<OperatorUIProps>;
  export default OperatorUI;
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/ParticipantUI' {
  type ParticipantUI = React.FC<Record<string, unknown>>;
  export default ParticipantUI;
}

export interface MessageSearchProviderProps {
  channelUrl: string;
  children?: React.ReactElement;
  searchString?: string;
  requestString?: string;
  messageSearchQuery?: MessageSearchQueryParams;
  onResultLoaded?(messages?: Array<ClientSentMessages>, error?: SendbirdError): void;
  onResultClick?(message: ClientSentMessages): void;
}

type MessageSearchScrollCallbackReturn = (
  callback: (
    messages: Array<UserMessage | FileMessage | AdminMessage>,
    /* eslint-disable @typescript-eslint/no-explicit-any*/
    error: any,
  ) => void
) => void;

interface MessageSearchProviderInterface extends MessageSearchProviderProps {
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  selectedMessageId: number;
  setSelectedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageSearchDispatcher: ({ type: string, payload: any }) => void;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  allMessages: Array<ClientFileMessage | ClientUserMessage>;
  loading: boolean;
  isInvalid: boolean;
  currentChannel: GroupChannel;
  currentMessageSearchQuery: MessageSearchQuery;
  hasMoreResult: boolean;
  onScroll: MessageSearchScrollCallbackReturn;
  handleRetryToConnect: () => void;
  handleOnScroll: (e: React.BaseSyntheticEvent) => void;
}

interface MessageSearchUIProps {
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderNoString?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
  renderSearchItem?(
    {
      message,
      onResultClick,
    }: {
      message: ClientSentMessages,
      onResultClick?: (message: ClientSentMessages) => void,
    }
  ): JSX.Element;
}

interface MessageSearchProps extends MessageSearchUIProps, MessageSearchProviderProps {
  onCloseClick?: () => void;
}

declare module '@sendbird/uikit-react/MessageSearch' {
  type MessageSearch = React.FC<MessageSearchProps>;
  export default MessageSearch;
}

declare module '@sendbird/uikit-react/MessageSearch/context' {
  export type MessageSearchProvider = React.FC<MessageSearchProviderProps>;
  export type useMessageSearchContext = () => MessageSearchProviderInterface;
}

declare module '@sendbird/uikit-react/MessageSearch/components/MessageSearchUI' {
  type MessageSearchUI = React.FC<MessageSearchUIProps>;
  export default MessageSearchUI;
}

interface CreateChannelProviderProps {
  children?: React.ReactElement;
  onCreateChannel(channel: GroupChannel): void;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  userListQuery?(): UserListQuery;
}


interface CreateChannelContextInterface {
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  createChannel: (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;
  sdk: SendbirdChat;
  userListQuery?(): UserListQuery;
  onCreateChannel?(channel: GroupChannel): void;
  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  type: 'group' | 'supergroup' | 'broadcast',
  setType: React.Dispatch<React.SetStateAction<'group' | 'supergroup' | 'broadcast'>>,
}

interface CreateChannelUIProps {
  onCancel?(): void;
  renderStepOne?:(props: void) => React.ReactElement;
}

interface CreateChannelProps extends CreateChannelProviderProps, CreateChannelUIProps {}

interface InviteUsersProps {
  onCancel?: () => void;
}

interface SelectChannelTypeProps {
  onCancel?(): void;
}

declare module '@sendbird/uikit-react/CreateChannel' {
  type CreateChannel = React.FC<CreateChannelProps>;
  export default CreateChannel;
}

declare module '@sendbird/uikit-react/CreateChannel/context' {
  export type CreateChannelProvider = React.FC<CreateChannelProviderProps>;
  export function useCreateChannelContext (): CreateChannelContextInterface;
}

declare module '@sendbird/uikit-react/CreateChannel/components/CreateChannelUI' {
  type CreateChannelUI = React.FC<CreateChannelUIProps>;
  export default CreateChannelUI;
}

declare module '@sendbird/uikit-react/CreateChannel/components/InviteUsers' {
  type InviteUsers = React.FC<InviteUsersProps>;
  export default InviteUsers;
}

declare module '@sendbird/uikit-react/CreateChannel/components/SelectChannelType' {
  type SelectChannelType = React.FC<SelectChannelTypeProps>;
  export default SelectChannelType;
}

interface EditUserProfileProps {
  children?: React.ReactElement;
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: User): void;
}

interface EditUserProfileProviderInterface {
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: User): void;
}

declare module '@sendbird/uikit-react/EditUserProfile' {
  type EditProfile = React.FC<EditUserProfileProps>;
  export default EditProfile;
}

declare module '@sendbird/uikit-react/EditUserProfile/context' {
  export type EditUserProfileProvider = React.FC<EditUserProfileProps>;
  export function useEditUserProfileContext (): EditUserProfileProviderInterface;
}

declare module '@sendbird/uikit-react/EditUserProfile/components/EditUserProfileUI' {
  type EditUserProfileUI = React.FC<Record<string, unknown>>;
  export default EditUserProfileUI;
}

declare module '@sendbird/uikit-react/ui/Accordion' {
  interface AccordionProps {
    className?: string | Array<string>;
    id: string;
    renderTitle(): React.ReactElement;
    renderContent(): React.ReactElement;
    renderFooter?(): React.ReactElement;
  }
  type Accordion = React.FC<AccordionProps>;
  export default Accordion;
}

declare module '@sendbird/uikit-react/ui/AccordionGroup' {
  interface AccordionTypeProps {
    children: Array<React.ReactElement> | React.ReactElement;
    defaultOpened?: string;
    className?: string;
  }
  type AccordionGroup = React.FC<AccordionTypeProps>;
  export default AccordionGroup;
}

declare module '@sendbird/uikit-react/ui/AdminMessage' {
  interface AdminMessageProps {
    className?: string,
    message: AdminMessage,
  }
  type AdminMessage = React.FC<AdminMessageProps>;
  export default AdminMessage;
}

declare module '@sendbird/uikit-react/ui/Avatar' {
  interface AvatarProps {
    className?: string | Array<string>,
    height?: string | number,
    width?: string | number,
    src?: string | Array<string>,
    alt?: string,
    onClick?(): void,
    customDefaultComponent?({ width, height }: { width: number | string, height: number | string }): ReactElement;
  }
  type Avatar = React.FC<AvatarProps>;
  export default Avatar;
}

declare module '@sendbird/uikit-react/ui/MutedAvatarOverlay' {
  interface MutedAvatarOverlayProps {
    height?: number;
    width?: number;
  }
  type MutedAvatarOverlay = React.FC<MutedAvatarOverlayProps>;
  export default MutedAvatarOverlay;
}

declare module '@sendbird/uikit-react/ui/Badge' {
  interface BadgeProps {
    count: number,
    maxLevel?: number,
    className?: string | string [],
  }
  type Badge = React.FC<BadgeProps>;
  export default Badge;
}

declare module '@sendbird/uikit-react/ui/Button' {
  interface ButtonProps {
    className?: string | string[];
    type?: 'PRIMARY' | 'SECONDARY' | 'DANGER' | 'DISABLED';
    size?: 'BIG' | 'SMALL';
    children?: string | React.ReactElement;
    disabled?: boolean;
    onClick?: () => void;
  }
  type Button = React.FC<ButtonProps>;
  export default Button;
}

declare module '@sendbird/uikit-react/ui/ChannelAvatar' {
  interface ChannelAvatarProps {
    channel: GroupChannel;
    userId: string;
    theme: string;
    width?: number,
    height?: number,
  }
  type ChannelAvatar = React.FC<ChannelAvatarProps>;
  export default ChannelAvatar;
}

declare module '@sendbird/uikit-react/ui/OpenChannelAvatar' {
  interface OpenChannelAvatarProps {
    channel: OpenChannel;
    theme: string;
    height?: number;
    width?: number;
  }
  type OpenChannelAvatar = React.FC<OpenChannelAvatarProps>;
  export default OpenChannelAvatar;
}

declare module '@sendbird/uikit-react/ui/Checkbox' {
  interface CheckboxProps {
    id?: string,
    checked?: boolean,
    onChange?: () => void,
  }
  type Checkbox = React.FC<CheckboxProps>;
  export default Checkbox;
}

declare module '@sendbird/uikit-react/ui/ConnectionStatus' {
  type ConnectionStatus = React.VoidFunctionComponent;
  export default ConnectionStatus;
}

declare module '@sendbird/uikit-react/ui/ContextMenu' {
  interface ContextMenuProps {
    menuTrigger: () => void;
    menuItems: () => void;
  }
  type ContextMenu = React.FC<ContextMenuProps>;
  export default ContextMenu;
}

declare module '@sendbird/uikit-react/ui/DateSeparator' {
  enum Colors {
    ONBACKGROUND_1 = 'ONBACKGROUND_1',
    ONBACKGROUND_2 = 'ONBACKGROUND_2',
    ONBACKGROUND_3 = 'ONBACKGROUND_3',
    ONBACKGROUND_4 = 'ONBACKGROUND_4',
    ONCONTENT_1 = 'ONCONTENT_1',
    PRIMARY = 'PRIMARY',
    ERROR = 'ERROR',
  }
  interface DateSeparatorProps {
    children: React.ReactElement,
    className?: string | Array<string>;
    separatorColor?: Colors,
  }
  const DateSeparator: React.FC<DateSeparatorProps>;
  export default DateSeparator;
}

declare module '@sendbird/uikit-react/ui/Dropdown' {
  interface DropdownProps {
    renderButton: () => React.ReactElement,
    renderItems: () => React.ReactElement,
  }
  type Dropdown = React.FC<DropdownProps>;
  export default Dropdown;
}

declare module '@sendbird/uikit-react/ui/EmojiReactions' {
  interface EmojiContainer {
    emojiCategories: Array<EmojiCategory>;
    emojiHash: string;
  }
  interface EmojiReactionsProps {
    className?: string | Array<string>;
    userId: string;
    message: UserMessage | FileMessage;
    emojiContainer: EmojiContainer;
    memberNicknamesMap: Map<string, string>;
    spaceFromTrigger?: Record<string, unknown>;
    isByMe?: boolean;
    toggleReaction?: (message: UserMessage | FileMessage, key: string, byMe: boolean) => void;
  }
  type EmojiReactions = React.FC<EmojiReactionsProps>;
  export default EmojiReactions;

}

declare module '@sendbird/uikit-react/ui/FileMessageItemBody' {
  interface FileMessageItemBodyProps {
    className?: string | Array<string>;
    message: FileMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
  }
  type FileMessageItemBody = React.FC<FileMessageItemBodyProps>;
  export default FileMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/FileViewer' {
  interface FileViewerBodyProps {
    message: FileMessage;
    isByMe?: boolean;
    onClose?: () => void,
    onDelete?: () => void,
  }
  type FileViewerBody = React.FC<FileViewerBodyProps>;
  export default FileViewerBody;
}

declare module '@sendbird/uikit-react/ui/Icon' {
  interface IconProps {
    className?: string,
    children?: string | React.ReactElement,
    fillColor?: string,
    width?: number,
    height?: number,
    onClick?: () => void,
  }
  type Icon = React.FC<IconProps>;
  export default Icon;
}

declare module '@sendbird/uikit-react/ui/IconButton' {
  interface IconButtonProps {
    className?: string | string[],
    children?: string | React.ReactElement,
    disabled?: boolean,
    width?: number,
    height?: number,
    type: string,
    onClick?: () => void,
    onBlur?: () => void,
  }
  type IconButton = React.FC<IconButtonProps>;
  export default IconButton;
}

declare module '@sendbird/uikit-react/ui/ImageRenderer' {
  interface ImageRendererProps {
    className?: string | string[],
    defaultComponent?: () => React.ReactElement,
    placeHolder?:  () => React.ReactElement,
    alt?: string,
    width?: number,
    height?: number,
    fixedSize?: boolean,
    circle?: boolean,
    onLoad?: () => void,
    onError?: () => void,
  }
  type ImageRenderer = React.FC<ImageRendererProps>;
  export default ImageRenderer;
}

declare module '@sendbird/uikit-react/ui/Input' {
  interface InputProps {
    name: string,
    required?: boolean,
    disabled?: boolean,
    placeHolder?: string,
    value?: string,
  }
  type Input = React.FC<InputProps>;
  export default Input;
}

declare module '@sendbird/uikit-react/ui/Label' {
  interface LabelProps {
    className: string[],
    type: string,
    color: string,
    children: React.ReactElement,
  }
  type Label = React.FC<LabelProps>;
  export default Label;
}

declare module '@sendbird/uikit-react/ui/LinkLabel' {
  interface LinkLabelProps {
    className?: string[],
    src: string,
    type?: string,
    color?: string,
    children: React.ReactElement | string,
  }
  type LinkLabel = React.FC<LinkLabelProps>;
  export default LinkLabel;
}

declare module '@sendbird/uikit-react/ui/Loader' {
  interface LoaderProps {
    className?: string[],
    width?: number,
    height?: number,
    children: React.ReactElement | string,
  }
  type Loader = React.FC<LoaderProps>;
  export default Loader;
}

declare module '@sendbird/uikit-react/ui/MentionUserLabel' {
  interface MentionUserLabelProps {
    className?: string
    children?: string;
    isReverse?: boolean;
    color?: string;
    userId?: string;
  }
  type MentionUserLabel = React.FC<MentionUserLabelProps>;
  export default MentionUserLabel;
}

declare module '@sendbird/uikit-react/ui/MessageContent' {
  interface MessageContentProps {
    className?: string | Array<string>;
    userId: string;
    channel: GroupChannel;
    message: CoreMessageType;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    isReactionEnabled?: boolean;
    replyType?: ReplyType;
    nicknamesMap?: Map<string, string>;
    emojiContainer?: EmojiContainer;
    scrollToMessage?: (createdAt: number, messageId: number) => void;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    showFileViewer?: (bool: boolean) => void;
    resendMessage?: (message: UserMessage | FileMessage) => void;
    toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
    setQuoteMessage?: (message: UserMessage | FileMessage) => void;
  }
  type MessageContent = React.FC<MessageContentProps>;
  export default MessageContent;
}

declare module '@sendbird/uikit-react/ui/MessageInput' {
  interface MessageInputProps {
    className?: string[],
    isEdit?: boolean,
    isMentionEnabled?: boolean;
    disabled?: boolean,
    message?: UserMessage;
    placeholder?: string,
    maxLength?: number,
    onFileUpload?: (file: File) => void,
    onSendMessage?: (props: { message: string, mentionTemplate?: string }) => void,
    onUpdateMessage?: (props: { messageId: number, message: string, mentionTemplate?: string }) => void,
    onCancelEdit?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onStartTyping?: () => void,
    channelUrl: string,
    mentionSelectedUser?: Array<User>,
    onUserMentioned?: (user: User) => void,
    onMentionStringChange?: (str: string) => void,
    onMentionedUserIdsUpdated?: (userIds: Array<string>) => void,
    onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void,
  }
  type MessageInput = React.FC<MessageInputProps>;
  export default MessageInput;

}

declare module '@sendbird/uikit-react/ui/MessageItemMenu' {
  interface MessageItemMenuProps {
    className?: string | Array<string>;
    message: UserMessage | FileMessage;
    channel: GroupChannel | OpenChannel;
    isByMe?: boolean;
    disabled?: boolean;
    replyType?: ReplyType;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    resendMessage?: (message: UserMessage | FileMessage) => void;
    setQuoteMessage?: (message: UserMessage | FileMessage) => void;
    setSupposedHover?: (bool: boolean) => void;
  }
  type MessageItemMenu = React.FC<MessageItemMenuProps>;
  export default MessageItemMenu;

}

declare module '@sendbird/uikit-react/ui/MessageItemReactionMenu' {
  interface MessageItemReactionMenuProps {
    className?: string | Array<string>;
    message: UserMessage | FileMessage;
    userId: string;
    spaceFromTrigger?: Record<string, unknown>;
    emojiContainer?: EmojiContainer;
    toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
    setSupposedHover?: (bool: boolean) => void;
  }
  type MessageItemReactionMenu = React.FC<MessageItemReactionMenuProps>;
  export default MessageItemReactionMenu;
}

declare module '@sendbird/uikit-react/ui/MessageSearchFileItem' {
  interface MessageSearchFileItemProps {
    className?: string | Array<string>;
    message: ClientFileMessage;
    selected?: boolean;
    onClick?: (message: ClientFileMessage) => void;
  }
  type MessageSearchFileItem = React.FC<MessageSearchFileItemProps>;
  export default MessageSearchFileItem;

}

declare module '@sendbird/uikit-react/ui/MessageSearchItem' {
  interface MessageSearchItemProps {
    className?: string | Array<string>;
    message: ClientUserMessage;
    selected?: boolean;
    onClick?: (message: ClientMessage) => void;
    }
  type MessageSearchItem = React.FC<MessageSearchItemProps>;
  export default MessageSearchItem;

}

declare module '@sendbird/uikit-react/ui/MessageStatus' {
  interface MessageStatusProps {
    className?: string;
    message: UserMessage | FileMessage;
    channel: GroupChannel;
  }
  type MessageStatus = React.FC<MessageStatusProps>;
  export default MessageStatus;

}

declare module '@sendbird/uikit-react/ui/Modal' {
  interface ModalProps {
    className?: string[],
    onCancel: () => void,
    onSubmit: () => void,
    hideFooter?: boolean,
    disabled?: boolean,
    type?: string,
    children: React.ReactElement | string,
    renderHeader?: () => React.ReactElement,
  }
  type Modal = React.FC<ModalProps>;
  export default Modal;

}

declare module '@sendbird/uikit-react/ui/OGMessageItemBody' {
  interface OGMessageItemBodyProps {
    className?: string | Array<string>;
    message: UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isMentionEnabled?: boolean;
    isReactionEnabled?: boolean;
  }
  type OGMessageItemBody = React.FC<OGMessageItemBodyProps>;
  export default OGMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/OpenChannelAdminMessage' {
  interface OpenChannelAdminMessageProps {
    className?: string | Array<string>;
    message: ClientAdminMessage;
  }
  type OpenChannelAdminMessage = React.FC<OpenChannelAdminMessageProps>;
  export default OpenChannelAdminMessage;
}

declare module '@sendbird/uikit-react/ui/OpenChannelConversationHeader' {
  interface OpenChannelConversationHeaderProps {
    coverImage?: string;
    title?: string;
    subTitle?: string;
    amIOperator?: boolean;
    onActionClick?(): void;
  }
  type OpenChannelConversationHeader = React.FC<OpenChannelConversationHeaderProps>;
  export default OpenChannelConversationHeader;

}

declare module '@sendbird/uikit-react/ui/OpenChannelFileMessage' {
  interface OpenChannelFileMessageProps {
    className?: string | Array<string>;
    message: ClientFileMessage;
    userId: string;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    showRemove(bool: boolean): void;
    resendMessage(message: ClientFileMessage): void;
  }
  type OpenChannelFileMessage = React.FC<OpenChannelFileMessageProps>;
  export default OpenChannelFileMessage;

}

declare module '@sendbird/uikit-react/ui/OpenChannelOGMessage' {
  interface OOpenChannelOGMessageProps {
    message: ClientUserMessage;
    className?: string | Array<string>;
    disabled?: boolean;
    showEdit(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: ClientUserMessage): void;
    chainTop?: boolean;
    chainBottom?: boolean;
    userId: string;
  }
  type OOpenChannelOGMessage = React.FC<OOpenChannelOGMessageProps>;
  export default OOpenChannelOGMessage;

}

declare module '@sendbird/uikit-react/ui/OpenChannelThumbnailMessage' {
  interface OpenChannelThumbnailMessageProps {
    className?: string | Array<string>;
    message: ClientFileMessage;
    disabled: boolean;
    userId: string;
    chainTop: boolean;
    chainBottom: boolean;
    onClick(bool: boolean): void,
    showRemove(bool: boolean): void,
    resendMessage(message: ClientFileMessage): void;
  }
  type OpenChannelThumbnailMessage = React.FC<OpenChannelThumbnailMessageProps>;
  export default OpenChannelThumbnailMessage;

}

declare module '@sendbird/uikit-react/ui/OpenChannelUserMessage' {
  interface OpenChannelUserMessageProps {
    className?: string | Array<string>;
    message: ClientUserMessage;
    userId: string;
    disabled?: boolean;
    showEdit(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: ClientUserMessage): void;
    chainTop?: boolean;
    chainBottom?: boolean;
  }
  type OpenChannelUserMessage = React.FC<OpenChannelUserMessageProps>;
  export default OpenChannelUserMessage;

}

declare module '@sendbird/uikit-react/ui/PlaceHolder' {
  interface PlaceHolderProps {
    className?: string | Array<string>;
    type?: 'LOADING' | 'NO_CHANNELS' | 'NO_MESSAGES' | 'WRONG' | 'SEARCH_IN' | 'SEARCHING' | 'NO_RESULT',
    iconSize?: string | number;
    retryToConnect?: () => void,
    searchInString?: string,
  }
  type PlaceHolder = React.FC<PlaceHolderProps>;
  export default PlaceHolder;

}

declare module '@sendbird/uikit-react/ui/QuoteMessage' {
  interface QuoteMessageProps {
    message?: UserMessage | FileMessage;
    userId?: string;
    isByMe?: boolean;
    className?: string | Array<string>;
    onClick?: () => void;
  }
  type QuoteMessage = React.FC<QuoteMessageProps>;
  export default QuoteMessage;

}

declare module '@sendbird/uikit-react/ui/QuoteMessageInput' {
  interface QuoteMessageInputProps {
    className?: string | Array<string>;
    replyingMessage: CoreMessageType;
    onClose?: (message: CoreMessageType) => void;
  }
  type QuoteMessageInput = React.FC<QuoteMessageInputProps>;
  export default QuoteMessageInput;

}

declare module '@sendbird/uikit-react/ui/ReactionBadge' {
  interface ReactionBadgeProps {
    className?: string | Array<string>;
    children?: React.ReactElement;
    count?: boolean,
    selected?: boolean,
    isAdd?: boolean,
    onClick?: () => void,
  }
  type ReactionBadge = React.FC<ReactionBadgeProps>;
  export default ReactionBadge;

}

declare module '@sendbird/uikit-react/ui/ReactionButton' {
  interface ReactionButtonProps {
    className?: string | Array<string>;
    width?: number,
    height?: number,
    selected: boolean,
    onClick?: () => void,
    children?: React.ReactElement;
  }
  type ReactionButton = React.FC<ReactionButtonProps>;
  export default ReactionButton;

}

declare module '@sendbird/uikit-react/ui/SortByRow' {
  interface SortByRowProps {
    maxItemCount?: number,
    itemWidth?: number,
    itemHeight?: number,
    children?: React.ReactElement;
    className?: string | Array<string>;
  }
  type SortByRow = React.FC<SortByRowProps>;
  export default SortByRow;

}

declare module '@sendbird/uikit-react/ui/TextButton' {
  enum Colors {
    ONBACKGROUND_1 = 'ONBACKGROUND_1',
    ONBACKGROUND_2 = 'ONBACKGROUND_2',
    ONBACKGROUND_3 = 'ONBACKGROUND_3',
    ONBACKGROUND_4 = 'ONBACKGROUND_4',
    ONCONTENT_1 = 'ONCONTENT_1',
    PRIMARY = 'PRIMARY',
    ERROR = 'ERROR',
  }
  interface TextButtonProps {
    children: React.ReactElement;
    className?: string | Array<string>;
    color?: Colors;
    disabled?: boolean;
    disableUnderline?: boolean;
    onClick?: (e: (React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>)) => void;
  }
  const TextButton: React.FC<TextButtonProps>;
  export default TextButton;
}

declare module '@sendbird/uikit-react/ui/TextMessageItemBody' {
  interface TextMessageItemBodyProps {
    className?: string | Array<string>;
    message: UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isMentionEnabled?: boolean;
    isReactionEnabled?: boolean;
  }
  type TextMessageItemBody = React.FC<TextMessageItemBodyProps>;
  export default TextMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/ThumbnailMessageItemBody' {
  interface ThumbnailMessageItemBodyProps {
    className?: string | Array<string>;
    message: FileMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
    showFileViewer?: (bool: boolean) => void;
  }
  type ThumbnailMessageItemBody = React.FC<ThumbnailMessageItemBodyProps>;
  export default ThumbnailMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/Tooltip' {
  interface TooltipProps {
    children?: React.ReactElement;
    className?: string | Array<string>;
  }
  type Tooltip = React.FC<TooltipProps>;
  export default Tooltip;

}

declare module '@sendbird/uikit-react/ui/TooltipWrapper' {
  interface OpenChannelFileMessageProps {
    hoverTooltip?: React.ReactElement;
    children?: React.ReactElement;
    className?: string | Array<string>;
  }
  type OpenChannelFileMessage = React.FC<OpenChannelFileMessageProps>;
  export default OpenChannelFileMessage;

}

declare module '@sendbird/uikit-react/ui/UnknownMessageItemBody' {
  interface UnknownMessageItemBodyProps {
    className?: string | Array<string>;
    isByMe?: boolean;
    message: CoreMessageType;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
  }
  type UnknownMessageItemBody = React.FC<UnknownMessageItemBodyProps>;
  export default UnknownMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/UserListItem' {
  interface UserListItemProps {
    className?: string | Array<string>;
    user?: User,
    checkBox?: boolean,
    disableMessaging?: boolean,
    currentUser?: string,
    checked?: boolean,
    onChange?: () => void,
    action?: () => React.ReactElement,
  }
  type UserListItem = React.FC<UserListItemProps>;
  export default UserListItem;

}

declare module '@sendbird/uikit-react/ui/UserProfile' {
  interface UserProfileProps {
    user: User;
    currentUserId?: string;
    sdk?: SendbirdChat;
    logger?: Logger;
    disableMessaging?: boolean;
    createChannel?(params: GroupChannelCreateParams): Promise<GroupChannel>;
    onSuccess?(): void;
  }
  type UserProfile = React.FC<UserProfileProps>;
  export default UserProfile;
}
