/**
 * Type Definitions for SendbirdUIKit 1.3.0-rc.3
 * homepage: https://sendbird.com/
 * git: https://github.com/sendbird/SendBird-UIKIT-JavaScript
 */
import React from 'react';
import Sendbird from 'sendbird';

export type OpenChannelType = Sendbird.OpenChannel;
export type GroupChannelType = Sendbird.GroupChannel;

export as namespace SendbirdUIKit;
export const App: React.FunctionComponent<AppProps>
export const SendBirdProvider: React.FunctionComponent<SendBirdProviderProps>
export const sendBirdSelectors: sendBirdSelectorsInterface;
export const ChannelSettings: React.FunctionComponent<ChannelSettingsProps>
export const ChannelList: React.FunctionComponent<ChannelListProps>
export const Channel: React.FunctionComponent<ChannelProps>
export const OpenChannel: React.FunctionComponent<OpenChannelProps>
export const OpenChannelSettings: React.FunctionComponent<OpenChannelSettingsProps>
export const MessageSearch: React.FunctionComponent<MessageSearchProps>
export function withSendBird(
  ChildComp: React.Component | React.ElementType,
  mapStoreToProps?: (store: SendBirdState) => unknown
): (props: unknown) => React.ReactNode;
export function useSendbirdStateContext(): SendBirdState;

export type SendBirdState = {
  config: SendBirdStateConfig;
  stores: SendBirdStateStore;
}
export namespace SendBirdSelectors {
  type GetSdk = Sendbird.SendBirdInstance | undefined;
  type GetConnect = (
    userId: string,
    accessToken?: string
  ) => Promise<Sendbird.User>;
  type GetDisconnect = () => Promise<void>;
  type GetUpdateUserInfo = (
    nickName: string,
    profileUrl?: string
  ) => Promise<Sendbird.User>;
  type GetSendUserMessage = (
    channelUrl: string,
    userMessageParams: Sendbird.UserMessageParams
  ) => Promise<Sendbird.UserMessage>;
  type GetSendFileMessage = (
    channelUrl: string,
    fileMessageParams: Sendbird.FileMessageParams
  ) => Promise<Sendbird.FileMessage>;
  type GetUpdateUserMessage = (
    channelUrl: string,
    messageId: string | number,
    params: Sendbird.UserMessageParams
  ) => Promise<Sendbird.UserMessage>;
  type GetDeleteMessage = (
    channelUrl: string,
    message: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage
  ) => Promise<void>;
  type GetResendUserMessage = (
    channelUrl: string,
    failedMessage: Sendbird.UserMessage
  ) => Promise<Sendbird.UserMessage>;
  type GetResendFileMessage = (
    channelUrl: string,
    failedMessage: Sendbird.FileMessage
  ) => Promise<Sendbird.FileMessage>;
  type GetFreezeChannel = (channelUrl: string) => Promise<Sendbird.GroupChannel>;
  type GetUnFreezeChannel = (channelUrl: string) => Promise<Sendbird.GroupChannel>;
  type GetCreateChannel = (channelParams: Sendbird.GroupChannelParams) => Promise<Sendbird.GroupChannel>;
  type GetLeaveChannel = (channelUrl: string) => Promise<Sendbird.GroupChannel>;
  type GetCreateOpenChannel = (channelParams: Sendbird.OpenChannelParams) => Promise<Sendbird.OpenChannel>;
  type GetEnterOpenChannel = (channelUrl: string) => Promise<null>;
  type GetExitOpenChannel = (channelUrl: string) => Promise<null>;
  type GetOpenChannelSendUserMessage = (
    channelUrl: string,
    params: Sendbird.UserMessageParams,
  ) => Promise<Sendbird.UserMessage>;
  type GetOpenChannelSendFileMessage = (
    channelUrl: string,
    params: Sendbird.FileMessageParams,
  ) => Promise<Sendbird.FileMessage>;
  type GetOpenChannelUpdateUserMessage = (
    channelUrl: string,
    messageId: string,
    params: Sendbird.UserMessageParams,
  ) => Promise<Sendbird.UserMessage>;
  type GetOpenChannelDeleteMessage = (
    channelUrl: string,
    message: Sendbird.UserMessage | Sendbird.FileMessage,
  ) => Promise<Sendbird.UserMessage | Sendbird.FileMessage>;
  type GetOpenChannelResendUserMessage = (
    channelUrl: string,
    failedMessage: Sendbird.UserMessage,
  ) => Promise<Sendbird.UserMessage>;
  type GetOpenChannelResendFileMessage = (
    channelUrl: string,
    failedMessage: Sendbird.FileMessage,
  ) => Promise<Sendbird.FileMessage>;
}

export function getStringSet(lang?: string): { [label: string]: string }

export type Logger = {
  info?(title?: unknown, description?: unknown): void;
  error?(title?: unknown, description?: unknown): void;
  warning?(title?: unknown, description?: unknown): void;
};

export type SendbirdError = Sendbird.SendBirdError;
export type ReplyType = "NONE" | "QUOTE_REPLY" | "THREAD";

export interface RenderOpenChannelTitleProps {
  channel: Sendbird.OpenChannel;
  user: Sendbird.User;
}

export interface MessageSearchProps {
  // message search props
  channelUrl: string;
  searchString?: string;
  messageSearchQuery?: SendbirdUIKit.MessageSearchQueryType;
  renderSearchItem?(
    {
      message,
      onResultClick,
    }: {
      message: ClientSentMessages,
      onResultClick?: (message: ClientSentMessages) => void,
    }
  ): JSX.Element;
  onResultLoaded?(messages?: Array<ClientSentMessages>, error?: SendbirdError): void;
  onResultClick?(message: ClientSentMessages): void;
}

export interface OpenChannelProps {
  channelUrl: string;
  useMessageGrouping?: boolean;
  queries?: {
    messageListParams?: Sendbird.MessageListParams,
  };
  disableUserProfile?: boolean;
  fetchingParticipants: boolean;
  renderCustomMessage?: RenderCustomMessage;
  renderUserProfile?(): JSX.Element;
  renderChannelTitle?(renderProps: RenderOpenChannelTitleProps): JSX.Element;
  renderMessageInput?(renderProps: RenderOpenChannelMessageInputProps): JSX.Element;
  onBeforeSendUserMessage?(text: string): Sendbird.UserMessageParams;
  onBeforeSendFileMessage?(file_: File): Sendbird.FileMessageParams;
  onChatHeaderActionClick?(): void;
}

interface OpenChannelSettingsProps {
  channelUrl: string,
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.OpenChannelParams;
  onChannelModified?(channel: Sendbird.OpenChannel): void;
  onDeleteChannel?(channel: Sendbird.OpenChannel): void;
  renderChannelProfile?: (props: SendbirdUIKit.RenderOpenChannelProfileProps) => React.ReactNode;
  renderUserProfile?: (props: SendbirdUIKit.RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
}

// to be used with Conversation.renderMessageInput
export interface RenderGroupChannelMessageInputProps {
  channel: Sendbird.GroupChannel;
  user: Sendbird.User;
  disabled: boolean;
}

export interface ClientMessageSearchQuery extends SendBird.MessageSearchQuery {
  key?(): string;
  channelUrl?(): string;
}

// to be used with OpenChannel.renderMessageInput
export interface RenderOpenChannelMessageInputProps {
  channel: Sendbird.OpenChannel;
  user: Sendbird.User;
  disabled: boolean;
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
  sdk: Sendbird.SendBirdInstance;
}
interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: Sendbird.User;
}
interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}

export type MessageSearchQueryType = Sendbird.MessageSearchQueryOptions;

export type Sdk = Sendbird.SendBirdInstance;

interface RenderUserProfileProps {
  user: Sendbird.Member | Sendbird.User;
  currentUserId: string;
  close(): void;
}
interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
}
interface SendBirdProviderConfig {
  logLevel?: 'debug' | 'warning' | 'error' | 'info' | 'all' | Array<string>;
}
interface RenderChannelProfileProps {
  channel: Sendbird.GroupChannel;
}

interface RenderOpenChannelProfileProps {
  channel: Sendbird.OpenChannel;
  user: Sendbird.User;
}
interface RenderUserProfileProps {
  user: Sendbird.User | Sendbird.Member;
  currentUserId: string;
  close(): void;
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
interface MessageListParams {
  prevResultSize?: number;
  nextResultSize?: number;
  isInclusive?: boolean;
  shouldReverse?: boolean;
  messageType?: string;
  customType?: string;
  senderUserIds?: Array<string>;
  includeMetaArray?: boolean;
  includeReactions?: boolean;
  includeReplies?: boolean;
  includeParentMessageText?: boolean;
  includeThreadInfo?: boolean;
}
interface ChannelListQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
  channelListQuery?: GroupChannelListQuery;
}
interface ChannelQueries {
  messageListParams?: MessageListParams;
}
interface RenderChannelPreviewProps {
  channel: Sendbird.GroupChannel;
  onLeaveChannel(
    channel: Sendbird.GroupChannel,
    onLeaveChannelCb?: (c: Sendbird.GroupChannel) => void,
  );
}
interface EmojiContainer {
  emojiCategories: Array<Sendbird.EmojiCategory>;
  emojiHash: string;
}
interface RenderChatItemProps {
  message: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage;
  channel: Sendbird.GroupChannel;
  onDeleteMessage(
    message: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage,
    onDeleteCb: () => void,
  );
  onUpdateMessage(
    messageId: string | number,
    text: string,
    onUpdateCb: (
      err: Sendbird.SendBirdError,
      message: Sendbird.UserMessage
    ) => void,
  );
  onScrollToMessage(
    createdAt: number,
    messageId: number,
  );
  onResendMessage: (
    failedMessage: SendBird.AdminMessage | SendBird.UserMessage | SendBird.FileMessage
  ) => void;
  emojiContainer: EmojiContainer;
  chainTop: boolean;
  chainBottom: boolean;
  hasSeparator: boolean;
  menuDisabled: boolean;
}
interface RenderChatHeaderProps {
  channel: Sendbird.GroupChannel;
  user: Sendbird.User;
}
interface SendBirdProviderProps {
  userId: string;
  appId: string;
  accessToken?: string;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  nickname?: string;
  profileUrl?: string;
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
interface ChannelListProps {
  disableUserProfile?: boolean;
  allowProfileEdit?: boolean;
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  onThemeChange?(theme: string): void;
  onProfileEditSuccess?(user: Sendbird.User): void;
  onChannelSelect?(channel: Sendbird.GroupChannel): void;
  renderChannelPreview?: (props: RenderChannelPreviewProps) => React.ReactNode;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  renderHeader?: (props: void) => React.ReactNode;
  queries?: ChannelListQueries;
}
interface ChannelProps {
  channelUrl: string;
  disableUserProfile?: boolean;
  useMessageGrouping?: boolean;
  useReaction?: boolean;
  showSearchIcon?: boolean;
  onSearchClick?(): void;
  highlightedMessage?: string | number;
  startingPoint?: number;
  onBeforeSendUserMessage?(text: string): Sendbird.UserMessageParams;
  onBeforeSendFileMessage?(file: File): Sendbird.FileMessageParams;
  onBeforeUpdateUserMessage?(text: string): Sendbird.UserMessageParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  renderCustomMessage?: RenderCustomMessage;
  renderChatItem?: (props: RenderChatItemProps) => React.ReactNode;
  renderMessageInput?: (props: RenderGroupChannelMessageInputProps) => React.ReactNode;
  renderChatHeader?: (props: RenderChatHeaderProps) => React.ReactNode;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  queries?: ChannelQueries;
}
interface sendBirdSelectorsInterface {
  getSdk: (store: SendBirdState) => SendBirdSelectors.GetSdk;
  getConnect: (store: SendBirdState) => SendBirdSelectors.GetConnect
  getDisconnect: (store: SendBirdState) => SendBirdSelectors.GetDisconnect;
  getUpdateUserInfo: (store: SendBirdState) => SendBirdSelectors.GetUpdateUserInfo;
  getSendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetSendUserMessage;
  getSendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetSendFileMessage;
  getUpdateUserMessage: (store: SendBirdState) => SendBirdSelectors.GetUpdateUserMessage;
  getDeleteMessage: (store: SendBirdState) => SendBirdSelectors.GetDeleteMessage;
  getResendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetResendUserMessage;
  getResendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetResendFileMessage;
  getFreezeChannel: (store: SendBirdState) => SendBirdSelectors.GetFreezeChannel;
  getUnFreezeChannel: (store: SendBirdState) => SendBirdSelectors.GetUnFreezeChannel;
  getCreateChannel: (store: SendBirdState) => SendBirdSelectors.GetCreateChannel;
  getLeaveChannel: (store: SendBirdState) => SendBirdSelectors.GetLeaveChannel;
  getCreateOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetCreateOpenChannel;
  getEnterOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetEnterOpenChannel;
  getExitOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetExitOpenChannel;
  enterOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetEnterOpenChannel;
  exitOpenChannel: (store: SendBirdState) => SendBirdSelectors.GetExitOpenChannel;
  getOpenChannelSendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelSendUserMessage;
  getOpenChannelSendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelSendFileMessage;
  getOpenChannelUpdateUserMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelUpdateUserMessage;
  getOpenChannelDeleteMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelDeleteMessage;
  getOpenChannelResendUserMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelResendUserMessage;
  getOpenChannelResendFileMessage: (store: SendBirdState) => SendBirdSelectors.GetOpenChannelResendFileMessage;
}
interface ChannelSettingsProps {
  channelUrl: string;
  disableUserProfile?: boolean;
  onCloseClick?(): void;
  onChannelModified?(channel: Sendbird.GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.GroupChannelParams;
  renderChannelProfile?: (props: RenderChannelProfileProps) => React.ReactNode;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  queries?: ChannelSettingsQueries;
}
interface AppProps {
  appId: string;
  userId: string;
  accessToken?: string;
  theme?: 'light' | 'dark';
  userListQuery?(): UserListQuery;
  nickname?: string;
  profileUrl?: string;
  allowProfileEdit?: boolean;
  disableUserProfile?: boolean;
  showSearchIcon?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  onProfileEditSuccess?(user: Sendbird.User): void;
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
}

interface ClientMessage {
  reqId: string;
  file?: File;
  localUrl?: string;
  _sender: Sendbird.User;
}
export interface ClientUserMessage extends Sendbird.UserMessage, ClientMessage { }
export interface ClientFileMessage extends Sendbird.FileMessage, ClientMessage { }
export interface ClientAdminMessage extends Sendbird.AdminMessage, ClientMessage { }
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientAdminMessage;
export type ClientSentMessages = ClientUserMessage | ClientFileMessage;

export type RenderCustomMessage = (
  message: EveryMessage,
  channel: Sendbird.OpenChannel | Sendbird.GroupChannel,
  chainTop: boolean,
  chainBottom: boolean,
) => RenderCustomMessageProps;

type RenderCustomMessageProps = ({ message: EveryMessage }) => React.ReactElement;
