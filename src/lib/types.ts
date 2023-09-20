import type SendbirdChat from '@sendbird/chat';
import type { User, SendbirdChatParams } from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelCreateParams,
  SendbirdGroupChat,
} from '@sendbird/chat/groupChannel';
import type {
  OpenChannel,
  OpenChannelCreateParams,
  SendbirdOpenChat,
} from '@sendbird/chat/openChannel';
import type {
  FileMessage,
  FileMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import { SBUConfig } from '@sendbird/uikit-tools';
import { Module } from '@sendbird/chat/lib/__definition';

import type {
  RenderUserProfileProps,
  ReplyType,
  SendBirdProviderConfig,
  UserListQuery,
} from '../types';
import { UikitMessageHandler } from './selectors';
import { Logger } from './SendbirdState';
import { MarkAsReadSchedulerType } from './hooks/useMarkAsReadScheduler';
import { MarkAsDeliveredSchedulerType } from './hooks/useMarkAsDeliveredScheduler';
import { PartialDeep } from '../utils/typeHelpers/partialDeep';
import { CoreMessageType } from '../utils';

// note to SDK team:
// using enum inside .d.ts won’t work for jest, but const enum will work.
export const Role = {
  OPERATOR: 'operator',
  NONE: 'none',
} as const;

export interface SendBirdProviderProps {
  userId: string;
  appId: string;
  accessToken?: string;
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
  isMentionEnabled?: boolean;
  isVoiceMessageEnabled?: boolean;
  voiceRecord?: {
    maxRecordingTime: number;
    minRecordingTime: number;
  };
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}

export interface SendBirdStateConfig {
  disableUserProfile: boolean;
  disableMarkAsDelivered: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onUserProfileMessage?: (props: GroupChannel) => void;
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
  isReactionEnabled: boolean;
  isMentionEnabled: boolean;
  isVoiceMessageEnabled?: boolean;
  uikitUploadSizeLimit: number;
  uikitMultipleFilesMessageLimit: number;
  voiceRecord?: {
    maxRecordingTime: number;
    minRecordingTime: number;
  };
  userMention: {
    maxMentionCount: number,
    maxSuggestionCount: number,
  };
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  markAsReadScheduler: MarkAsReadSchedulerType;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  replyType: ReplyType;
  showSearchIcon?: boolean;
  // Remote configs set from dashboard by UIKit feature configuration
  groupChannel: {
    enableOgtag: SBUConfig['groupChannel']['channel']['enableOgtag'];
    enableTypingIndicator: SBUConfig['groupChannel']['channel']['enableTypingIndicator'];
    enableDocument: SBUConfig['groupChannel']['channel']['input']['enableDocument'];
    threadReplySelectType: SBUConfig['groupChannel']['channel']['threadReplySelectType'];
  },
  openChannel: {
    enableOgtag: SBUConfig['openChannel']['channel']['enableOgtag'];
    enableDocument: SBUConfig['openChannel']['channel']['input']['enableDocument'];
  },
}
export interface SdkStore {
  error: boolean;
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChat & SendbirdGroupChat & SendbirdOpenChat;
}
export interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: User;
}
export interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}

export type SendBirdState = {
  config: SendBirdStateConfig;
  stores: SendBirdStateStore;
  dispatchers: {
    userDispatcher: UserDispatcher,
  },
};

type UserDispatcherParams = {
  type: string,
  payload: User,
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
type GetLeaveGroupChannel = (channel: GroupChannel) => Promise<void>;
type GetEnterOpenChannel = (channel: OpenChannel) => Promise<OpenChannel>;
type GetExitOpenChannel = (channel: OpenChannel) => Promise<void>;
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
  message: CoreMessageType
) => Promise<void>;
type GetResendUserMessage = (
  channel: GroupChannel | OpenChannel,
  failedMessage: UserMessage
) => Promise<UserMessage>;
type GetResendFileMessage = (
  channel: GroupChannel | OpenChannel,
  failedMessage: FileMessage
) => Promise<FileMessage>;

export interface sendbirdSelectorsInterface {
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

export interface CommonUIKitConfigProps {
  replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  disableUserProfile?: boolean;
  isVoiceMessageEnabled?: boolean;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  showSearchIcon?: boolean;
}

export type UIKitOptions = PartialDeep<{
  common: SBUConfig['common'];
  groupChannel: SBUConfig['groupChannel']['channel'];
  groupChannelList: SBUConfig['groupChannel']['channelList'];
  groupChannelSettings: SBUConfig['groupChannel']['setting'];
  openChannel: SBUConfig['openChannel']['channel'];
}>;

export type SendbirdChatInitParams = Omit<SendbirdChatParams<Module[]>, 'appId'>;
export type CustomExtensionParams = Record<string, string>;
