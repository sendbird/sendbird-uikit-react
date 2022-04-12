/**
 * Type Definitions for SendbirdUIKit v3
 * homepage: https://sendbird.com/
 * git: https://github.com/sendbird/sendbird-uikit-react
 */
import type React from 'react';
import Sendbird from 'sendbird';
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
}

interface SendBirdStateConfig {
  disableUserProfile: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  allowProfileEdit: boolean;
  isOnline: boolean;
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
  // export type Channel = React.FunctionComponent<ChannelProps>
  // export type OpenChannel = React.FunctionComponent<OpenChannelProps>
  // export type OpenChannelSettings = React.FunctionComponent<OpenChannelSettingsProps>
  // export type MessageSearch = React.FunctionComponent<MessageSearchProps>
  // export function withSendBird(
  //   ChildComp: React.Component | React.ElementType,
  //   mapStoreToProps?: (store: SendBirdState) => unknown
  // ): (props: unknown) => React.ReactNode;
  // export function useSendbirdStateContext(): SendBirdState;
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
  type AddChannel = React.FunctionComponent<{}>;
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
  type AdminPanel = React.FunctionComponent<{}>;
  export default AdminPanel;
}

declare module '@sendbird/uikit-react/ChannelSettings/components/ChannelProfile' {
  type ChannelProfile = React.FunctionComponent<{}>;
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
  type UserPanel = React.FC<{}>;
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

interface ChannelProps extends ChannelContextProps, ChannelUIProps {
}

declare module '@sendbird/uikit-react/Channel' {
  type Channel = React.FC<ChannelProps>;
  export default Channel;
}

declare module '@sendbird/uikit-react/Channel/context' {
}

declare module '@sendbird/uikit-react/Channel/components/ChannelHeader' {
}

declare module '@sendbird/uikit-react/Channel/components/ChannelUI' {
}

declare module '@sendbird/uikit-react/Channel/components/FileViewer' {
}

declare module '@sendbird/uikit-react/Channel/components/FrozenNotification' {
}

declare module '@sendbird/uikit-react/Channel/components/Message' {
}

declare module '@sendbird/uikit-react/Channel/components/MessageInput' {
}

declare module '@sendbird/uikit-react/Channel/components/MessageList' {
}

declare module '@sendbird/uikit-react/Channel/components/RemoveMessageModal' {
}

declare module '@sendbird/uikit-react/Channel/components/TypingIndicator' {
}

declare module '@sendbird/uikit-react/Channel/components/UnreadCount' {
}

declare module '@sendbird/uikit-react/OpenChannel' {
}

declare module '@sendbird/uikit-react/OpenChannel/context' {
}

declare module '@sendbird/uikit-react/OpenChannel/components/FrozenChannelNotification' {
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelHeader' {
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelInput' {
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelMessage' {
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelMessageList' {
}

declare module '@sendbird/uikit-react/OpenChannel/components/OpenChannelUI' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/context' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/DeleteOpenChannel' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/EditDetailsModal' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/InvalidChannel' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/OpenChannelProfile' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/OpenChannelSettingsUI' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/OperatorUI' {
}

declare module '@sendbird/uikit-react/OpenChannelSettings/components/ParticipantUI' {
}

declare module '@sendbird/uikit-react/MessageSearch' {
}

declare module '@sendbird/uikit-react/MessageSearch/context' {
}

declare module '@sendbird/uikit-react/MessageSearch/components/MessageSearchUI' {
}

declare module '@sendbird/uikit-react/CreateChannel' {
}

declare module '@sendbird/uikit-react/CreateChannel/context' {
}

declare module '@sendbird/uikit-react/CreateChannel/components/CreateChannelUI' {
}

declare module '@sendbird/uikit-react/CreateChannel/components/InviteMembers' {
}

declare module '@sendbird/uikit-react/CreateChannel/components/SelectChannelType' {
}

declare module '@sendbird/uikit-react/EditUserProfile' {
}

declare module '@sendbird/uikit-react/EditUserProfile/context' {
}

declare module '@sendbird/uikit-react/EditUserProfile/components/EditUserProfileUI' {
}

declare module '@sendbird/uikit-react/ui/Accordion' {
}

declare module '@sendbird/uikit-react/ui/AccordionGroup' {
}

declare module '@sendbird/uikit-react/ui/AdminMessage' {
}

declare module '@sendbird/uikit-react/ui/Avatar' {
}

declare module '@sendbird/uikit-react/ui/MutedAvatarOverlay' {
}

declare module '@sendbird/uikit-react/ui/Badge' {
}

declare module '@sendbird/uikit-react/ui/Button' {
}

declare module '@sendbird/uikit-react/ui/ChannelAvatar' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelAvatar' {
}

declare module '@sendbird/uikit-react/ui/ChannelPreview' {
}

declare module '@sendbird/uikit-react/ui/ChatHeader' {
}

declare module '@sendbird/uikit-react/ui/Checkbox' {
}

declare module '@sendbird/uikit-react/ui/ConnectionStatus' {
}

declare module '@sendbird/uikit-react/ui/ContextMenu' {
}

declare module '@sendbird/uikit-react/ui/DateSeparator' {
}

declare module '@sendbird/uikit-react/ui/Dropdown' {
}

declare module '@sendbird/uikit-react/ui/EmojiReactions' {
}

declare module '@sendbird/uikit-react/ui/FileMessageItemBody' {
}

declare module '@sendbird/uikit-react/ui/FileViewer' {
}

declare module '@sendbird/uikit-react/ui/Icon' {
}

declare module '@sendbird/uikit-react/ui/IconButton' {
}

declare module '@sendbird/uikit-react/ui/ImageRenderer' {
}

declare module '@sendbird/uikit-react/ui/Input' {
}

declare module '@sendbird/uikit-react/ui/Label' {
}

declare module '@sendbird/uikit-react/ui/LinkLabel' {
}

declare module '@sendbird/uikit-react/ui/Loader' {
}

declare module '@sendbird/uikit-react/ui/MessageContent' {
}

declare module '@sendbird/uikit-react/ui/MessageInput' {
}

declare module '@sendbird/uikit-react/ui/MessageItemMenu' {
}

declare module '@sendbird/uikit-react/ui/MessageItemReactionMenu' {
}

declare module '@sendbird/uikit-react/ui/MessageSearchFileItem' {
}

declare module '@sendbird/uikit-react/ui/MessageSearchItem' {
}

declare module '@sendbird/uikit-react/ui/MessageStatus' {
}

declare module '@sendbird/uikit-react/ui/Modal' {
}

declare module '@sendbird/uikit-react/ui/OGMessageItemBody' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelAdminMessage' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelMessageContent' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelConversationHeader' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelFileMessage' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelOGMessage' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelThumbnailMessage' {
}

declare module '@sendbird/uikit-react/ui/OpenChannelUserMessage' {
}

declare module '@sendbird/uikit-react/ui/PlaceHolder' {
}

declare module '@sendbird/uikit-react/ui/QuoteMessage' {
}

declare module '@sendbird/uikit-react/ui/QuoteMessageInput' {
}

declare module '@sendbird/uikit-react/ui/ReactionBadge' {
}

declare module '@sendbird/uikit-react/ui/ReactionButton' {
}

declare module '@sendbird/uikit-react/ui/SortByRow' {
}

declare module '@sendbird/uikit-react/ui/TextButton' {
}

declare module '@sendbird/uikit-react/ui/TextMessageItemBody' {
}

declare module '@sendbird/uikit-react/ui/ThumbnailMessageItemBody' {
}

declare module '@sendbird/uikit-react/ui/Tooltip' {
}

declare module '@sendbird/uikit-react/ui/TooltipWrapper' {
}

declare module '@sendbird/uikit-react/ui/UnknownMessageItemBody' {
}

declare module '@sendbird/uikit-react/ui/UserListItem' {
}

declare module '@sendbird/uikit-react/ui/UserProfile' {
}


// export type UserListQuery = SendbirdTypes.UserListQuery;
// export type RenderUserProfileProps = SendbirdTypes.RenderUserProfileProps;
// export type SendBirdProviderConfig = SendbirdTypes.SendBirdProviderConfig;

// export type OpenChannelType = Sendbird.OpenChannel;
// export type GroupChannelType = Sendbird.GroupChannel;

// export as namespace SendbirdUIKit;
// export const App: React.FunctionComponent<AppProps>
// export const SendBirdProvider: React.FunctionComponent<SendBirdProviderProps>
// export const sendBirdSelectors: sendBirdSelectorsInterface;
// export const ChannelSettings: React.FunctionComponent<ChannelSettingsProps>
// export const ChannelList: React.FunctionComponent<ChannelListProps>
// export const Channel: React.FunctionComponent<ChannelProps>
// export const OpenChannel: React.FunctionComponent<OpenChannelProps>
// export const OpenChannelSettings: React.FunctionComponent<OpenChannelSettingsProps>
// export const MessageSearch: React.FunctionComponent<MessageSearchProps>
// export function withSendBird(
//   ChildComp: React.Component | React.ElementType,
//   mapStoreToProps?: (store: SendBirdState) => unknown
// ): (props: unknown) => React.ReactNode;
// export function useSendbirdStateContext(): SendBirdState;

// export type SendBirdState = {
//   config: SendBirdStateConfig;
//   stores: SendBirdStateStore;
//   dispatchers: {
//     userDispatcher: UserDispatcher,
//   },
// }

// type UserDispatcherParams = {
//   type: string,
//   payload: Sendbird.User
// };

// type UserDispatcher = (params: UserDispatcherParams) => void;

// export namespace SendBirdSelectors {
//   type GetSdk = Sendbird.SendBirdInstance | undefined;
//   type GetConnect = (
//     userId: string,
//     accessToken?: string
//   ) => Promise<Sendbird.User>;
//   type GetDisconnect = () => Promise<void>;
//   type GetUpdateUserInfo = (
//     nickName: string,
//     profileUrl?: string
//   ) => Promise<Sendbird.User>;
//   type GetSendUserMessage = (
//     channelUrl: string,
//     userMessageParams: Sendbird.UserMessageParams
//   ) => Promise<Sendbird.UserMessage>;
//   type GetSendFileMessage = (
//     channelUrl: string,
//     fileMessageParams: Sendbird.FileMessageParams
//   ) => Promise<Sendbird.FileMessage>;
//   type GetUpdateUserMessage = (
//     channelUrl: string,
//     messageId: string | number,
//     params: Sendbird.UserMessageParams
//   ) => Promise<Sendbird.UserMessage>;
//   type GetDeleteMessage = (
//     channelUrl: string,
//     message: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage
//   ) => Promise<void>;
//   type GetResendUserMessage = (
//     channelUrl: string,
//     failedMessage: Sendbird.UserMessage
//   ) => Promise<Sendbird.UserMessage>;
//   type GetResendFileMessage = (
//     channelUrl: string,
//     failedMessage: Sendbird.FileMessage
//   ) => Promise<Sendbird.FileMessage>;
//   type GetFreezeChannel = (channelUrl: string) => Promise<Sendbird.GroupChannel>;
//   type GetUnFreezeChannel = (channelUrl: string) => Promise<Sendbird.GroupChannel>;
//   type GetCreateChannel = (channelParams: Sendbird.GroupChannelParams) => Promise<Sendbird.GroupChannel>;
//   type GetLeaveChannel = (channelUrl: string) => Promise<Sendbird.GroupChannel>;
//   type GetCreateOpenChannel = (channelParams: Sendbird.OpenChannelParams) => Promise<Sendbird.OpenChannel>;
//   type GetEnterOpenChannel = (channelUrl: string) => Promise<null>;
//   type GetExitOpenChannel = (channelUrl: string) => Promise<null>;
//   type GetOpenChannelSendUserMessage = (
//     channelUrl: string,
//     params: Sendbird.UserMessageParams,
//   ) => Promise<Sendbird.UserMessage>;
//   type GetOpenChannelSendFileMessage = (
//     channelUrl: string,
//     params: Sendbird.FileMessageParams,
//   ) => Promise<Sendbird.FileMessage>;
//   type GetOpenChannelUpdateUserMessage = (
//     channelUrl: string,
//     messageId: string,
//     params: Sendbird.UserMessageParams,
//   ) => Promise<Sendbird.UserMessage>;
//   type GetOpenChannelDeleteMessage = (
//     channelUrl: string,
//     message: Sendbird.UserMessage | Sendbird.FileMessage,
//   ) => Promise<Sendbird.UserMessage | Sendbird.FileMessage>;
//   type GetOpenChannelResendUserMessage = (
//     channelUrl: string,
//     failedMessage: Sendbird.UserMessage,
//   ) => Promise<Sendbird.UserMessage>;
//   type GetOpenChannelResendFileMessage = (
//     channelUrl: string,
//     failedMessage: Sendbird.FileMessage,
//   ) => Promise<Sendbird.FileMessage>;
// }

// export function getStringSet(lang?: string): { [label: string]: string }

// export type Logger = {
//   info?(title?: unknown, description?: unknown): void;
//   error?(title?: unknown, description?: unknown): void;
//   warning?(title?: unknown, description?: unknown): void;
// };

// export type SendbirdError = Sendbird.SendBirdError;
// export type ReplyType = "NONE" | "QUOTE_REPLY" | "THREAD";

// export interface RenderOpenChannelTitleProps {
//   channel: Sendbird.OpenChannel;
//   user: Sendbird.User;
// }

// export interface MessageSearchProps {
//   // message search props
//   channelUrl: string;
//   searchString?: string;
//   messageSearchQuery?: SendbirdUIKit.MessageSearchQueryType;
//   renderSearchItem?(
//     {
//       message,
//       onResultClick,
//     }: {
//       message: ClientSentMessages,
//       onResultClick?: (message: ClientSentMessages) => void,
//     }
//   ): JSX.Element;
//   onResultLoaded?(messages?: Array<ClientSentMessages>, error?: SendbirdError): void;
//   onResultClick?(message: ClientSentMessages): void;
// }

// export interface OpenChannelProps {
//   channelUrl: string;
//   useMessageGrouping?: boolean;
//   queries?: {
//     messageListParams?: Sendbird.MessageListParams,
//   };
//   disableUserProfile?: boolean;
//   fetchingParticipants: boolean;
//   renderCustomMessage?: RenderCustomMessage;
//   experimentalMessageLimit?: number;
//   renderUserProfile?(): JSX.Element;
//   renderChannelTitle?(renderProps: RenderOpenChannelTitleProps): JSX.Element;
//   renderMessageInput?(renderProps: RenderOpenChannelMessageInputProps): JSX.Element;
//   onBeforeSendUserMessage?(text: string): Sendbird.UserMessageParams;
//   onBeforeSendFileMessage?(file_: File): Sendbird.FileMessageParams;
//   onChatHeaderActionClick?(): void;
// }

// interface OpenChannelSettingsProps {
//   channelUrl: string,
//   onCloseClick?(): void;
//   onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.OpenChannelParams;
//   onChannelModified?(channel: Sendbird.OpenChannel): void;
//   onDeleteChannel?(channel: Sendbird.OpenChannel): void;
//   renderChannelProfile?: (props: SendbirdUIKit.RenderOpenChannelProfileProps) => React.ReactNode;
//   renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
//   disableUserProfile?: boolean;
// }

// // to be used with Conversation.renderMessageInput
// export interface RenderGroupChannelMessageInputProps {
//   channel: Sendbird.GroupChannel;
//   user: Sendbird.User;
//   disabled: boolean;
//   quoteMessage?: Sendbird.UserMessage | Sendbird.FileMessage;
// }

// export interface ClientMessageSearchQuery extends SendBird.MessageSearchQuery {
//   key?(): string;
//   channelUrl?(): string;
// }

// // to be used with OpenChannel.renderMessageInput
// export interface RenderOpenChannelMessageInputProps {
//   channel: Sendbird.OpenChannel;
//   user: Sendbird.User;
//   disabled: boolean;
// }
// interface SendBirdStateConfig {
//   disableUserProfile: boolean;
//   renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
//   allowProfileEdit: boolean;
//   isOnline: boolean;
//   userId: string;
//   appId: string;
//   accessToken: string;
//   theme: string;
//   pubSub: any;
//   logger: Logger;
//   setCurrenttheme: (theme: string) => void;
//   userListQuery?(): SendbirdTypes.UserListQuery;
//   imageCompression?: {
//     compressionRate?: number,
//     resizingWidth?: number | string,
//     resizingHeight?: number | string,
//   };
// }
// export interface SdkStore {
//   error: boolean;
//   initialized: boolean;
//   loading: boolean;
//   sdk: Sendbird.SendBirdInstance;
// }
// interface UserStore {
//   initialized: boolean;
//   loading: boolean;
//   user: Sendbird.User;
// }
// interface SendBirdStateStore {
//   sdkStore: SdkStore;
//   userStore: UserStore;
// }

// export type MessageSearchQueryType = Sendbird.MessageSearchQueryOptions;

// export type Sdk = Sendbird.SendBirdInstance;

// interface RenderChannelProfileProps {
//   channel: Sendbird.GroupChannel;
// }

// interface RenderOpenChannelProfileProps {
//   channel: Sendbird.OpenChannel;
//   user: Sendbird.User;
// }

// interface ApplicationUserListQuery {
//   limit?: number;
//   userIdsFilter?: Array<string>;
//   metaDataKeyFilter?: string;
//   metaDataValuesFilter?: Array<string>;
// }
// interface ChannelSettingsQueries {
//   applicationUserListQuery?: ApplicationUserListQuery;
// }
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
// interface MessageListParams {
//   prevResultSize?: number;
//   nextResultSize?: number;
//   isInclusive?: boolean;
//   shouldReverse?: boolean;
//   messageType?: string;
//   customType?: string;
//   senderUserIds?: Array<string>;
//   includeMetaArray?: boolean;
//   includeReactions?: boolean;
//   includeReplies?: boolean;
//   includeParentMessageText?: boolean;
//   includeThreadInfo?: boolean;
// }
// interface ChannelQueries {
//   messageListParams?: MessageListParams;
// }
// interface RenderChannelPreviewProps {
//   channel: Sendbird.GroupChannel;
//   onLeaveChannel(
//     channel: Sendbird.GroupChannel,
//     onLeaveChannelCb?: (c: Sendbird.GroupChannel) => void,
//   );
// }
// interface EmojiContainer {
//   emojiCategories: Array<Sendbird.EmojiCategory>;
//   emojiHash: string;
// }
// interface RenderChatItemProps {
//   message: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage;
//   channel: Sendbird.GroupChannel;
//   onDeleteMessage(
//     message: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage,
//     onDeleteCb: () => void,
//   );
//   onUpdateMessage(
//     messageId: string | number,
//     text: string,
//     onUpdateCb: (
//       err: Sendbird.SendBirdError,
//       message: Sendbird.UserMessage
//     ) => void,
//   );
//   onScrollToMessage(
//     createdAt: number,
//     messageId: number,
//   );
//   onResendMessage: (
//     failedMessage: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage
//   ) => void;
//   emojiContainer: EmojiContainer;
//   chainTop: boolean;
//   chainBottom: boolean;
//   hasSeparator: boolean;
//   menuDisabled: boolean;
// }
// interface RenderChatHeaderProps {
//   channel: Sendbird.GroupChannel;
//   user: Sendbird.User;
// }
// interface SendBirdProviderProps {
//   userId: string;
//   appId: string;
//   accessToken?: string;
//   children?: React.ReactNode;
//   theme?: 'light' | 'dark';
//   nickname?: string;
//   profileUrl?: string;
//   dateLocale?: Locale;
//   disableUserProfile?: boolean;
//   renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
//   allowProfileEdit?: boolean;
//   userListQuery?(): SendbirdTypes.UserListQuery;
//   config?: SendbirdTypes.SendBirdProviderConfig;
//   stringSet?: Record<string, string>;
//   colorSet?: Record<string, string>;
//   imageCompression?: {
//     compressionRate?: number,
//     resizingWidth?: number | string,
//     resizingHeight?: number | string,
//   };
// }
// interface ChannelListProps {
//   disableUserProfile?: boolean;
//   allowProfileEdit?: boolean;
//   onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
//   onThemeChange?(theme: string): void;
//   onProfileEditSuccess?(user: Sendbird.User): void;
//   onChannelSelect?(channel: Sendbird.GroupChannel): void;
//   sortChannelList?: (channels: Sendbird.GroupChannel[]) => Sendbird.GroupChannel[];
//   renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactNode;
//   renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
//   renderHeader?: (props: void) => React.ReactNode;
//   queries?: ChannelListQueries;
//   disableAutoSelect?: boolean;
// }
// interface ChannelProps {
//   channelUrl: string;
//   disableUserProfile?: boolean;
//   useMessageGrouping?: boolean;
//   useReaction?: boolean;
//   showSearchIcon?: boolean;
//   onSearchClick?(): void;
//   highlightedMessage?: string | number;
//   startingPoint?: number;
//   onBeforeSendUserMessage?(text: string, quotedMessage?: Sendbird.UserMessage | Sendbird.FileMessage): Sendbird.UserMessageParams;
//   onBeforeSendFileMessage?(file: File, quotedMessage?: Sendbird.UserMessage | Sendbird.FileMessage): Sendbird.FileMessageParams;
//   onBeforeUpdateUserMessage?(text: string): Sendbird.UserMessageParams;
//   onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
//   renderCustomMessage?: RenderCustomMessage;
//   renderChatItem?: (props: RenderChatItemProps) => React.ReactNode;
//   renderMessageInput?: (props: RenderGroupChannelMessageInputProps) => React.ReactNode;
//   renderChatHeader?: (props: RenderChatHeaderProps) => React.ReactNode;
//   renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
//   queries?: ChannelQueries;
//   replyType?: ReplyType;
// }
// interface sendBirdSelectorsInterface {
//   getSdk: (store: SendBirdState) => SendBirdSelectors.GetSdk;
//   getConnect: (store: SendBirdState) => SendBirdSelectors.GetConnect
//   getDisconnect: (store: SendBirdState) => SendBirdSelectors.GetDisconnect;
//   getUpdateUserInfo: (store: SendBirdState) => SendBirdSelectors.GetUpdateUserInfo;
//   getSendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetSendUserMessage;
//   getSendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetSendFileMessage;
//   getUpdateUserMessage: (store: SendBirdState) => SendBirdSelectors.GetUpdateUserMessage;
//   getDeleteMessage: (store: SendBirdState) => SendBirdSelectors.GetDeleteMessage;
//   getResendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetResendUserMessage;
//   getResendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetResendFileMessage;
//   getFreezeChannel: (store: SendBirdState) => SendBirdSelectors.GetFreezeChannel;
//   getUnFreezeChannel: (store: SendBirdState) => SendBirdSelectors.GetUnFreezeChannel;
//   getCreateChannel: (store: SendBirdState) => SendBirdSelectors.GetCreateChannel;
//   getLeaveChannel: (store: SendBirdState) => SendBirdSelectors.GetLeaveChannel;
//   getCreateOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetCreateOpenChannel;
//   getEnterOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetEnterOpenChannel;
//   getExitOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetExitOpenChannel;
//   enterOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetEnterOpenChannel;
//   exitOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetExitOpenChannel;
//   getOpenChannelSendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelSendUserMessage;
//   getOpenChannelSendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelSendFileMessage;
//   getOpenChannelUpdateUserMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelUpdateUserMessage;
//   getOpenChannelDeleteMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelDeleteMessage;
//   getOpenChannelResendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelResendUserMessage;
//   getOpenChannelResendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelResendFileMessage;
// }
// interface ChannelSettingsProps {
//   channelUrl: string;
//   disableUserProfile?: boolean;
//   onCloseClick?(): void;
//   onChannelModified?(channel: Sendbird.GroupChannel): void;
//   onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.GroupChannelParams;
//   renderChannelProfile?: (props: RenderChannelProfileProps) => React.ReactNode;
//   renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
//   queries?: ChannelSettingsQueries;
// }

// interface ClientMessage {
//   reqId: string;
//   file?: File;
//   localUrl?: string;
//   _sender: Sendbird.User;
// }
// export interface ClientUserMessage extends Sendbird.UserMessage, ClientMessage { }
// export interface ClientFileMessage extends Sendbird.FileMessage, ClientMessage { }
// export interface ClientAdminMessage extends Sendbird.AdminMessage, ClientMessage { }
// export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientAdminMessage;
// export type ClientSentMessages = ClientUserMessage | ClientFileMessage;

// export type RenderCustomMessage = (
//   message: EveryMessage,
//   channel: Sendbird.OpenChannel | Sendbird.GroupChannel,
//   chainTop: boolean,
//   chainBottom: boolean,
// ) => RenderCustomMessageProps;

// type RenderCustomMessageProps = ({ message: EveryMessage }) => React.ReactElement;
