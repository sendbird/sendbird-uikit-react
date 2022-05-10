/**
 * Type Definitions for SendbirdUIKit v3
 * homepage: https://sendbird.com/
 * git: https://github.com/sendbird/sendbird-uikit-react
 */
import type React from 'react';
import Sendbird, { FileMessage, UserMessage } from 'sendbird';
import type { Locale } from 'date-fns';
import SendBird from 'sendbird';

type ReplyType = "NONE" | "QUOTE_REPLY" | "THREAD";

type Logger = {
  info?(title?: unknown, description?: unknown): void;
  error?(title?: unknown, description?: unknown): void;
  warning?(title?: unknown, description?: unknown): void;
};

interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
}

interface RenderUserProfileProps {
  user: SendBird.User | SendBird.Member;
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
  _sender: SendBird.User;
}

interface RenderMessageProps {
  message: EveryMessage;
  chainTop: boolean;
  chainBottom: boolean;
}

interface ClientUserMessage extends SendBird.UserMessage, ClientMessage { }
interface ClientFileMessage extends SendBird.FileMessage, ClientMessage { }
interface ClientAdminMessage extends SendBird.AdminMessage, ClientMessage { }
type EveryMessage = ClientUserMessage | ClientFileMessage | ClientAdminMessage;
type ClientSentMessages = ClientUserMessage | ClientFileMessage;


interface SendBirdProviderProps {
  userId: string;
  appId: string;
  accessToken?: string;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
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
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}

interface SendBirdStateConfig {
  disableUserProfile: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  allowProfileEdit: boolean;
  isOnline: boolean;
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
  sdk: SendBird.SendBirdInstance;
}
interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: SendBird.User;
}
interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}

export interface MessageSearchQueryType extends Sendbird.MessageSearchQueryOptions {
  key: string;
  hasNext?: boolean;
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
  payload: SendBird.User
};

type UserDispatcher = (params: UserDispatcherParams) => void;

type GetSdk = SendBird.SendBirdInstance | undefined;
type GetConnect = (
  userId: string,
  accessToken?: string
) => Promise<SendBird.User>;
type GetDisconnect = () => Promise<void>;
type GetUpdateUserInfo = (
  nickName: string,
  profileUrl?: string
) => Promise<SendBird.User>;
type GetSendUserMessage = (
  channelUrl: string,
  userMessageParams: SendBird.UserMessageParams
) => Promise<SendBird.UserMessage>;
type GetSendFileMessage = (
  channelUrl: string,
  fileMessageParams: SendBird.FileMessageParams
) => Promise<SendBird.FileMessage>;
type GetUpdateUserMessage = (
  channelUrl: string,
  messageId: string | number,
  params: SendBird.UserMessageParams
) => Promise<SendBird.UserMessage>;
type GetDeleteMessage = (
  channelUrl: string,
  message: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage
) => Promise<void>;
type GetResendUserMessage = (
  channelUrl: string,
  failedMessage: SendBird.UserMessage
) => Promise<SendBird.UserMessage>;
type GetResendFileMessage = (
  channelUrl: string,
  failedMessage: SendBird.FileMessage
) => Promise<SendBird.FileMessage>;
type GetFreezeChannel = (channelUrl: string) => Promise<SendBird.GroupChannel>;
type GetUnFreezeChannel = (channelUrl: string) => Promise<SendBird.GroupChannel>;
type GetCreateChannel = (channelParams: SendBird.GroupChannelParams) => Promise<SendBird.GroupChannel>;
type GetLeaveChannel = (channelUrl: string) => Promise<SendBird.GroupChannel>;
type GetCreateOpenChannel = (channelParams: SendBird.OpenChannelParams) => Promise<SendBird.OpenChannel>;
type GetEnterOpenChannel = (channelUrl: string) => Promise<null>;
type GetExitOpenChannel = (channelUrl: string) => Promise<null>;
type GetOpenChannelSendUserMessage = (
  channelUrl: string,
  params: SendBird.UserMessageParams,
) => Promise<SendBird.UserMessage>;
type GetOpenChannelSendFileMessage = (
  channelUrl: string,
  params: SendBird.FileMessageParams,
) => Promise<SendBird.FileMessage>;
type GetOpenChannelUpdateUserMessage = (
  channelUrl: string,
  messageId: string,
  params: SendBird.UserMessageParams,
) => Promise<SendBird.UserMessage>;
type GetOpenChannelDeleteMessage = (
  channelUrl: string,
  message: SendBird.UserMessage | SendBird.FileMessage,
) => Promise<SendBird.UserMessage | SendBird.FileMessage>;
type GetOpenChannelResendUserMessage = (
  channelUrl: string,
  failedMessage: SendBird.UserMessage,
) => Promise<SendBird.UserMessage>;
type GetOpenChannelResendFileMessage = (
  channelUrl: string,
  failedMessage: SendBird.FileMessage,
) => Promise<SendBird.FileMessage>;


interface sendBirdSelectorsInterface {
  getSdk: (store: SendBirdState) => GetSdk;
  getConnect: (store: SendBirdState) => GetConnect
  getDisconnect: (store: SendBirdState) => GetDisconnect;
  getUpdateUserInfo: (store: SendBirdState) => GetUpdateUserInfo;
  getSendUserMessage: (store: SendBirdState) => GetSendUserMessage;
  getSendFileMessage: (store: SendBirdState) => GetSendFileMessage;
  getUpdateUserMessage: (store: SendBirdState) => GetUpdateUserMessage;
  getDeleteMessage: (store: SendBirdState) => GetDeleteMessage;
  getResendUserMessage: (store: SendBirdState) => GetResendUserMessage;
  getResendFileMessage: (store: SendBirdState) => GetResendFileMessage;
  getFreezeChannel: (store: SendBirdState) => GetFreezeChannel;
  getUnFreezeChannel: (store: SendBirdState) => GetUnFreezeChannel;
  getCreateChannel: (store: SendBirdState) => GetCreateChannel;
  getLeaveChannel: (store: SendBirdState) => GetLeaveChannel;
  getCreateOpenChannel: (store: SendBirdState) => GetCreateOpenChannel;
  getEnterOpenChannel: (store: SendBirdState) => GetEnterOpenChannel;
  getExitOpenChannel: (store: SendBirdState) => GetExitOpenChannel;
  enterOpenChannel: (store: SendBirdState) => GetEnterOpenChannel;
  exitOpenChannel: (store: SendBirdState) => GetExitOpenChannel;
  getOpenChannelSendUserMessage: (store: SendBirdState) => GetOpenChannelSendUserMessage;
  getOpenChannelSendFileMessage: (store: SendBirdState) => GetOpenChannelSendFileMessage;
  getOpenChannelUpdateUserMessage: (store: SendBirdState) => GetOpenChannelUpdateUserMessage;
  getOpenChannelDeleteMessage: (store: SendBirdState) => GetOpenChannelDeleteMessage;
  getOpenChannelResendUserMessage: (store: SendBirdState) => GetOpenChannelResendUserMessage;
  getOpenChannelResendFileMessage: (store: SendBirdState) => GetOpenChannelResendFileMessage;
}

interface AppProps {
  appId: string;
  userId: string;
  accessToken?: string;
  theme?: 'light' | 'dark';
  userListQuery?(): UserListQuery;
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  allowProfileEdit?: boolean;
  disableUserProfile?: boolean;
  showSearchIcon?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  onProfileEditSuccess?(user: SendBird.User): void;
  config?: SendBirdProviderConfig;
  useReaction?: boolean;
  useMessageGrouping?: boolean;
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
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

interface GroupChannelListQuery {
  limit?: number;
  includeEmpty?: boolean;
  order?: 'latest_last_message' | 'chronological' | 'channel_name_alphabetical' | 'metadata_value_alphabetical';
  userIdsExactFilter?: Array<string>;
  userIdsIncludeFilter?: Array<string>;
  userIdsIncludeFilterQueryType?: 'AND' | 'OR';
  nicknameContainsFilter?: string;
  channelNameContainsFilter?: string;
  customTypesFilter?: Array<string>;
  customTypeStartsWithFilter?: string;
  channelUrlsFilter?: Array<string>;
  superChannelFilter?: 'all' | 'super' | 'nonsuper';
  publicChannelFilter?: 'all' | 'public' | 'private';
  metadataOrderKeyFilter?: string;
  memberStateFilter?: 'all' | 'joined_only' | 'invited_only' | 'invited_by_friend' | 'invited_by_non_friend';
  hiddenChannelFilter?: 'unhidden_only' | 'hidden_only' | 'hidden_allow_auto_unhide' | 'hidden_prevent_auto_unhide';
  unreadChannelFilter?: 'all' | 'unread_message';
  includeFrozen?: boolean;
}
interface ChannelListQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
  channelListQuery?: GroupChannelListQuery;
}

export interface ChannelListProviderProps {
  allowProfileEdit?: boolean;
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  onThemeChange?(theme: string): void;
  onProfileEditSuccess?(user: Sendbird.User): void;
  onChannelSelect?(channel: Sendbird.GroupChannel): void;
  sortChannelList?: (channels: Sendbird.GroupChannel[]) => Sendbird.GroupChannel[];
  queries?: ChannelListQueries;
  children?: React.ReactNode;
  className?: string | string[];
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
  disableAutoSelect?: boolean;
  typingChannels?: Array<Sendbird.GroupChannel>;
  isTypingIndicatorEnabled?: boolean;
  isMessageReceiptStatusEnabled?: boolean;
}

export interface ChannelListProviderInterface extends ChannelListProviderProps {
  initialized: boolean;
  loading: boolean;
  allChannels: Sendbird.GroupChannel[];
  currentChannel: Sendbird.GroupChannel;
  showSettings: boolean;
  channelListQuery: GroupChannelListQuery;
  currentUserId: string;
  // channelListDispatcher: CustomUseReducerDispatcher;
  channelSource: Sendbird.GroupChannelListQuery;
}

interface RenderChannelPreviewProps {
  channel: SendBird.GroupChannel;
  onLeaveChannel(
    channel: SendBird.GroupChannel,
    onLeaveChannelCb?: (c: SendBird.GroupChannel) => void,
  );
}

interface ChannelListUIProps {
  renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactNode;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  renderHeader?: (props: void) => React.ReactNode;
  renderPlaceHolderError?: (props: void) => React.ReactNode;
  renderPlaceHolderLoading?: (props: void) => React.ReactNode;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactNode;
}

interface ChannelListProps extends ChannelListProviderInterface, ChannelListUIProps {}

interface ChannelListHeaderInterface {
  renderHeader?: (props: void) => React.ReactNode;
  renderIconButton?: (props: void) => React.ReactNode;
  onEdit?: (props: void) => void;
  allowProfileEdit?: boolean;
}

interface ChannelPreviewInterface {
  channel: SendBird.GroupChannel;
  isActive?: boolean;
  isTyping?: boolean;
  onClick: () => void;
  renderChannelAction: (props: { channel: SendBird.GroupChannel }) => React.ReactNode;
  tabIndex: number;
}

interface ChannelPreviewActionInterface {
  disabled?: boolean;
  onLeaveChannel?: () => void;
}

interface ChannelSettingsProviderInterface {
  channelUrl: string;
  onCloseClick?(): void;
  onChannelModified?(channel: Sendbird.GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.GroupChannelParams;
  queries?: ChannelSettingsQueries;
  forceUpdateUI(): void;
  channel: Sendbird.GroupChannel;
  invalidChannel: boolean;
}

interface ChannelSettingsUIProps {
  renderPlaceholderError?: () => React.ReactNode;
  renderChannelProfile?: () => React.ReactNode;
  renderModerationPanel?: () => React.ReactNode;
  renderLeaveChannel?: () => React.ReactNode;
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
  children: React.ReactNode;
  channelUrl: string;
  className?: string;
  onCloseClick?(): void;
  onChannelModified?(channel: Sendbird.GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.GroupChannelParams;
  queries?: ChannelSettingsQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
}

interface ChannelSettingsProps extends ChannelSettingsUIProps, ChannelSettingsContextProps {
}

type ChannelSettingsEditDetailsProps = {
  onSubmit: () => void;
  onCancel: () => void;
}

type CustomUser = SendBird.User & {
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
  export type sendBirdSelectors = sendBirdSelectorsInterface;
  export type ChannelList = React.FunctionComponent<ChannelListProps>;
  export type ChannelSettings = React.FunctionComponent<ChannelSettingsProps>;
  export type Channel = React.FunctionComponent<ChannelProps>
  export type OpenChannel = React.FunctionComponent<OpenChannelProps>
  export type OpenChannelSettings = React.FunctionComponent<OpenChannelSettingsProps>
  export type MessageSearch = React.FunctionComponent<MessageSearchProps>
  export function withSendBird(
    ChildComp: React.Component | React.ElementType,
    mapStoreToProps?: (store: SendBirdState) => unknown
  ): (props: unknown) => React.ReactNode;
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

declare module '@sendbird/uikit-react/sendBirdSelectors' {
  type sendBirdSelectors = sendBirdSelectorsInterface;
  export default sendBirdSelectors;
}

declare module '@sendbird/uikit-react/useSendbirdStateContext' {
  function useSendbirdStateContext(): SendBirdState;
  export default useSendbirdStateContext;
}

declare module '@sendbird/uikit-react/withSendBird' {
  function withSendBird(
    ChildComp: React.Component | React.ElementType,
    mapStoreToProps?: (store: SendBirdState) => unknown
  ): (props: unknown) => React.ReactNode;
  export default withSendBird;
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
  messageListParams?: SendBird.MessageListParams;
};

type ChannelContextProps = {
  channelUrl: string;
  children?: React.ReactNode;
  useMessageGrouping?: boolean;
  useReaction?: boolean;
  showSearchIcon?: boolean;
  highlightedMessage?: number;
  startingPoint?: number;
  onBeforeSendUserMessage?(text: string, quotedMessage?: SendBird.UserMessage | SendBird.FileMessage): SendBird.UserMessageParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: SendBird.UserMessage | SendBird.FileMessage): SendBird.FileMessageParams;
  onBeforeUpdateUserMessage?(text: string): SendBird.UserMessageParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onSearchClick?(): void;
  replyType?: ReplyType;
  queries?: ChannelQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
};

interface ChannelUIProps {
  renderPlaceholderLoader?: () => React.ReactNode;
  renderPlaceholderInvalid?: () => React.ReactNode;
  renderPlaceholderEmpty?: () => React.ReactNode;
  renderChannelHeader?: () => React.ReactNode;
  renderMessage?: (props: RenderMessageProps) => React.ComponentType;
  renderMessageInput?: () => React.ReactNode;
  renderTypingIndicator?: () => React.ReactNode;
  renderCustomSeperator?: () => React.ReactNode;
}

type CoreMessageType = Sendbird.AdminMessage | Sendbird.UserMessage | Sendbird.FileMessage;

interface MessageStoreInterface {
  allMessages: CoreMessageType[];
  loading: boolean;
  initialized: boolean;
  unreadSince: string;
  isInvalid: boolean;
  currentGroupChannel: SendBird.GroupChannel;
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
  toggleReaction(message: SendBird.UserMessage | SendBird.FileMessage, emojiKey: string, isReacted: boolean): void,
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
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderCustomSeperator?: () => React.ReactNode;
  renderEditInput?: () => React.ReactNode;
  renderMessageContent?: () => React.ReactNode;
};

type MessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderPlaceholderEmpty?: () => React.ReactNode;
  renderCustomSeperator?: () => React.ReactNode;
};

type SuggestedMentionListProps = {
  targetNickname: string;
  memberListQuery?: Record<string, string>;
  onUserItemClick?: (member: SendBird.User) => void;
  onFocusItemChange?: (member: SendBird.User) => void;
  onFetchUsers?: (users: Array<SendBird.User>) => void;
  renderUserMentionItem?: (props: { user: SendBird.User }) => JSX.Element;
  ableAddMention: boolean;
  maxMentionCount?: number;
  maxSuggestionCount?: number;
  inputEvent?: React.KeyboardEvent<HTMLDivElement>;
};

type SuggestedUserMentionItemProps = {
  member: SendBird.User;
  isFocused?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  renderUserMentionItem?: (props: { user: SendBird.User }) => JSX.Element;
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

declare module '@sendbird/uikit-react/Channel' {
  type Channel = React.FC<ChannelProps>;
  export default Channel;
}

declare module '@sendbird/uikit-react/Channel/context' {
  export type ChannelProvider = React.FunctionComponent<ChannelContextProps>;
  export function useChannel(): ChannelProviderInterface;
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
  children?: React.ReactNode;
  useMessageGrouping?: boolean;
  queries?: OpenChannelQueries;
  messageLimit?: number;
  onBeforeSendUserMessage?(text: string): SendBird.UserMessageParams;
  onBeforeSendFileMessage?(file_: File): SendBird.FileMessageParams;
  onChatHeaderActionClick?(): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
}

interface OpenChannelMessagesState {
  allMessages: Array<EveryMessage>;
  loading: boolean;
  initialized: boolean;
  currentOpenChannel: Sendbird.OpenChannel;
  isInvalid: boolean;
  hasMore: boolean;
  lastMessageTimestamp: number;
  frozen: boolean;
  operators: Array<Sendbird.User>;
  participants: Array<Sendbird.User>;
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
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderInput?: () => React.ReactNode;
  renderPlaceHolderEmptyList?: () => React.ReactNode;
  renderPlaceHolderError?: () => React.ReactNode;
  renderPlaceHolderLoading?: () => React.ReactNode;
}

interface OpenChannelProps extends OpenChannelProviderProps, OpenChannelUIProps {
}

type OpenchannelMessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderPlaceHolderEmptyList?: () => React.ReactNode;
}

type OpenChannelMessageProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
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
  export function useOpenChannel(): OpenChannelInterface;
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

interface OpenChannelSettingsContextProps {
  channelUrl: string;
  children?: React.ReactNode;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.OpenChannelParams;
  onChannelModified?(channel: Sendbird.OpenChannel): void;
  onDeleteChannel?(channel: Sendbird.OpenChannel): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
}

interface OpenChannelSettingsUIProps {
  renderOperatorUI?: () => React.ReactNode;
  renderParticipantList?: () => React.ReactNode;
}

interface OpenChannelSettingsProps extends OpenChannelSettingsContextProps, OpenChannelSettingsUIProps {
}

interface OpenChannelSettingsContextType extends OpenChannelSettingsContextProps {
  channelUrl: string;
  channel?: Sendbird.OpenChannel;
  setChannel?: React.Dispatch<React.SetStateAction<Sendbird.OpenChannel>>;
}

interface OperatorUIProps {
  renderChannelProfile?: () => React.ReactNode;
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
  children?: React.ReactNode;
  searchString?: string;
  requestString?: string;
  messageSearchQuery?: SendBird.MessageSearchQueryOptions;
  onResultLoaded?(messages?: Array<ClientSentMessages>, error?: SendBird.SendBirdError): void;
  onResultClick?(message: ClientSentMessages): void;
}

type MessageSearchScrollCallbackReturn = (
  callback: (
    messages: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
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
  currentChannel: SendBird.GroupChannel;
  currentMessageSearchQuery: SendBird.MessageSearchQuery;
  hasMoreResult: boolean;
  onScroll: MessageSearchScrollCallbackReturn;
  handleRetryToConnect: () => void;
  handleOnScroll: (e: React.BaseSyntheticEvent) => void;
}

interface MessageSearchUIProps {
  renderPlaceHolderError?: (props: void) => React.ReactNode;
  renderPlaceHolderLoading?: (props: void) => React.ReactNode;
  renderPlaceHolderNoString?: (props: void) => React.ReactNode;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactNode;
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

interface MessageSearchProps extends MessageSearchUIProps, MessageSearchProviderProps {}

declare module '@sendbird/uikit-react/MessageSearch' {
  type MessageSearch = React.FC<MessageSearchProps>;
  export default MessageSearch;
}

declare module '@sendbird/uikit-react/MessageSearch/context' {
  export type useMessageSearch = () => MessageSearchProviderInterface;
  export type MessageSearchProvider = React.FC<MessageSearchProviderProps>;
}

declare module '@sendbird/uikit-react/MessageSearch/components/MessageSearchUI' {
  type MessageSearchUI = React.FC<MessageSearchUIProps>;
  export default MessageSearchUI;
}

interface CreateChannelProviderProps {
  children?: React.ReactNode;
  onCreateChannel(channel: Sendbird.GroupChannel): void;
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  userListQuery?(): UserListQuery;
}


interface CreateChannelContextInterface {
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  createChannel: (channelParams: Sendbird.GroupChannelParams) => Promise<Sendbird.GroupChannel>;
  sdk: Sendbird.SendBirdInstance;
  userListQuery?(): UserListQuery;
  onCreateChannel?(channel: Sendbird.GroupChannel): void;
  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  type: 'group' | 'supergroup' | 'broadcast',
  setType: React.Dispatch<React.SetStateAction<'group' | 'supergroup' | 'broadcast'>>,
}

interface CreateChannelUIProps {
  onCancel?(): void;
  renderStepOne?:(props: void) => React.ReactNode;
}

interface CreateChannelProps extends CreateChannelProviderProps, CreateChannelUIProps {}

interface InviteMembersProps {
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

declare module '@sendbird/uikit-react/CreateChannel/components/InviteMembers' {
  type InviteMembers = React.FC<InviteMembersProps>;
  export default InviteMembers;
}

declare module '@sendbird/uikit-react/CreateChannel/components/SelectChannelType' {
  type SelectChannelType = React.FC<SelectChannelTypeProps>;
  export default SelectChannelType;
}

interface EditUserProfileProps {
  children?: React.ReactNode;
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: Sendbird.User): void;
}

interface EditUserProfileProviderInterface {
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: Sendbird.User): void;
}

declare module '@sendbird/uikit-react/EditUserProfile' {
  type EditProfile = React.FC<EditUserProfileProps>;
  export default EditProfile;
}

declare module '@sendbird/uikit-react/EditUserProfile/context' {
  export type EditUserProfileProvider = React.FC<EditUserProfileProps>;
  export function useEditUserProfileProvider (): EditUserProfileProviderInterface;
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
    message: SendBird.AdminMessage,
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
    channel: SendBird.GroupChannel;
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
    channel: SendBird.OpenChannel;
    theme: string;
    height?: number;
    width?: number;
  }
  type OpenChannelAvatar = React.FC<OpenChannelAvatarProps>;
  export default OpenChannelAvatar;
}

declare module '@sendbird/uikit-react/ui/ChannelPreview' {
  interface ChannelPreviewProps {
    channel?: SendBird.GroupChannel,
    currentUser?: SendBird.User,
    isActive?: boolean,
    ChannelAction: React.ReactElement,
    theme?: 'light' | 'dark',
    onClick?: () => void,
    tabIndex?: number,
  }
  type ChannelPreview = React.FC<ChannelPreviewProps>;
  export default ChannelPreview;
}

declare module '@sendbird/uikit-react/ui/ChatHeader' {
  interface ChatHeaderProps {
    currentGroupChannel?: SendBird.GroupChannel;
    currentUser?: SendBird.User;
    title?: string;
    subTitle?: string;
    isMuted?: boolean;
    theme?: 'light' | 'dark';
    showSearchIcon?: false;
    onSearchClick?: () => void;
    onActionClick?: () => void;
  }
  type ChatHeader = React.FC<ChatHeaderProps>;
  export default ChatHeader;
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
  enum COLORS {
    ONBACKGROUND_1 ='ONBACKGROUND_1',
    ONBACKGROUND_2 ='ONBACKGROUND_2',
    ONBACKGROUND_3 ='ONBACKGROUND_3',
    ONBACKGROUND_4 ='ONBACKGROUND_4',
    ONCONTENT_1 ='ONCONTENT_1',
    ONCONTENT_2 ='ONCONTENT_2',
    PRIMARY ='PRIMARY',
    ERROR ='ERROR',
    SECONDARY_3 ='SECONDARY_3',
  }
  interface DateSeparatorProps {
    className?: string | string[];
    children?: string | React.ReactElement,
    separatorColor: COLORS,
  }
  type DateSeparator = React.FC<DateSeparatorProps>;
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
    emojiCategories: Array<Sendbird.EmojiCategory>;
    emojiHash: string;
  }
  interface EmojiReactionsProps {
    className?: string | Array<string>;
    userId: string;
    message: SendBird.UserMessage | SendBird.FileMessage;
    emojiContainer: EmojiContainer;
    memberNicknamesMap: Map<string, string>;
    spaceFromTrigger?: Record<string, unknown>;
    isByMe?: boolean;
    toggleReaction?: (message: SendBird.UserMessage | SendBird.FileMessage, key: string, byMe: boolean) => void;
  }
  type EmojiReactions = React.FC<EmojiReactionsProps>;
  export default EmojiReactions;

}

declare module '@sendbird/uikit-react/ui/FileMessageItemBody' {
  interface FileMessageItemBodyProps {
    className?: string | Array<string>;
    message: SendBird.FileMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
  }
  type FileMessageItemBody = React.FC<FileMessageItemBodyProps>;
  export default FileMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/FileViewer' {
  interface FileViewerBodyProps {
    message: SendBird.FileMessage;
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
    channel: Sendbird.GroupChannel;
    message: CoreMessageType;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    useReaction?: boolean;
    replyType?: ReplyType;
    nicknamesMap?: Map<string, string>;
    emojiContainer?: Sendbird.EmojiContainer;
    scrollToMessage?: (createdAt: number, messageId: number) => void;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    showFileViewer?: (bool: boolean) => void;
    resendMessage?: (message: Sendbird.UserMessage | Sendbird.FileMessage) => void;
    toggleReaction?: (message: Sendbird.UserMessage | Sendbird.FileMessage, reactionKey: string, isReacted: boolean) => void;
    setQuoteMessage?: (message: Sendbird.UserMessage | Sendbird.FileMessage) => void;
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
    message?: SendBird.UserMessage;
    placeholder?: string,
    maxLength?: number,
    onFileUpload?: (file: File) => void,
    onSendMessage?: (props: { message: string, mentionTemplate?: string }) => void,
    onUpdateMessage?: (props: { messageId: number, message: string, mentionTemplate?: string }) => void,
    onCancelEdit?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onStartTyping?: () => void,
    channelUrl: string,
    mentionSelectedUser?: Array<SendBird.User>,
    onUserMentioned?: (user: SendBird.User) => void,
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
    message: Sendbird.UserMessage | Sendbird.FileMessage;
    channel: Sendbird.GroupChannel | Sendbird.OpenChannel;
    isByMe?: boolean;
    disabled?: boolean;
    replyType?: ReplyType;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    resendMessage?: (message: Sendbird.UserMessage | Sendbird.FileMessage) => void;
    setQuoteMessage?: (message: Sendbird.UserMessage | Sendbird.FileMessage) => void;
    setSupposedHover?: (bool: boolean) => void;
  }
  type MessageItemMenu = React.FC<MessageItemMenuProps>;
  export default MessageItemMenu;

}

declare module '@sendbird/uikit-react/ui/MessageItemReactionMenu' {
  interface MessageItemReactionMenuProps {
    className?: string | Array<string>;
    message: Sendbird.UserMessage | Sendbird.FileMessage;
    userId: string;
    spaceFromTrigger?: Record<string, unknown>;
    emojiContainer?: Sendbird.EmojiContainer;
    toggleReaction?: (message: Sendbird.UserMessage | Sendbird.FileMessage, reactionKey: string, isReacted: boolean) => void;
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
    message: Sendbird.UserMessage | Sendbird.FileMessage;
    channel: Sendbird.GroupChannel;
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
  }
  type Modal = React.FC<ModalProps>;
  export default Modal;

}

declare module '@sendbird/uikit-react/ui/OGMessageItemBody' {
  interface OGMessageItemBodyProps {
    className?: string | Array<string>;
    message: Sendbird.UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
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
    retryToConnect?: () => void,
    searchInString?: string,
  }
  type PlaceHolder = React.FC<PlaceHolderProps>;
  export default PlaceHolder;

}

declare module '@sendbird/uikit-react/ui/QuoteMessage' {
  interface QuoteMessageProps {
    message?: Sendbird.UserMessage | Sendbird.FileMessage;
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
  interface TextButtonProps {
    children?: React.ReactElement;
    className?: string | Array<string>;
    color?: 'ONBACKGROUND_1' | 'ONBACKGROUND_2' | 'ONBACKGROUND_3' | 'ONBACKGROUND_4' | 'ONCONTENT_1' | 'PRIMARY' | 'ERROR',
    disabled?: boolean,
    notUnderline?: boolean,
    onClick?: () => void,
  }
  type TextButton = React.FC<TextButtonProps>;
  export default TextButton;

}

declare module '@sendbird/uikit-react/ui/TextMessageItemBody' {
  interface TextMessageItemBodyProps {
    className?: string | Array<string>;
    message: Sendbird.UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
  }
  type TextMessageItemBody = React.FC<TextMessageItemBodyProps>;
  export default TextMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/ThumbnailMessageItemBody' {
  interface ThumbnailMessageItemBodyProps {
    className?: string | Array<string>;
    message: Sendbird.FileMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
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
  }
  type UnknownMessageItemBody = React.FC<UnknownMessageItemBodyProps>;
  export default UnknownMessageItemBody;

}

declare module '@sendbird/uikit-react/ui/UserListItem' {
  interface UserListItemProps {
    className?: string | Array<string>;
    user?: Sendbird.User,
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
    user: Sendbird.User;
    currentUserId?: string;
    sdk?: Sendbird.SendBirdInstance;
    logger?: Logger;
    disableMessaging?: boolean;
    createChannel?(params: Sendbird.GroupChannelParams): Promise<Sendbird.GroupChannel>;
    onSuccess?(): void;
  }
  type UserProfile = React.FC<UserProfileProps>;
  export default UserProfile;
}
