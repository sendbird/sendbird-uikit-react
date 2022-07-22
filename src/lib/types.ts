import type SendbirdChat from '@sendbird/chat';
import type { User } from '@sendbird/chat';
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
  AdminMessage,
  FileMessage,
  FileMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';

import type SendbirdTypes from '../types';
import { UikitMessageHandler } from './selectors';
import { Logger } from './SendbirdState';

export interface SendbirdProviderProps {
  userId: string;
  appId: string;
  accessToken?: string;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
  allowProfileEdit?: boolean;
  userListQuery?(): SendbirdTypes.UserListQuery;
  config?: SendbirdTypes.SendbirdProviderConfig;
  stringSet?: Record<string, string>;
  colorSet?: Record<string, string>;
  isMentionEnabled?: boolean;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}

export interface SendbirdStateConfig {
  disableUserProfile: boolean;
  renderUserProfile?: (props: SendbirdTypes.RenderUserProfileProps) => React.ReactNode;
  allowProfileEdit: boolean;
  isOnline: boolean;
  userId: string;
  appId: string;
  accessToken: string;
  theme: string;
  pubSub: any;
  logger: Logger;
  setCurrenttheme: (theme: string) => void;
  userListQuery?(): SendbirdTypes.UserListQuery;
  isMentionEnabled: boolean;
  userMention: {
    maxMentionCount: number,
    maxSuggestionCount: number,
  };
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
  sdk: SendbirdChat & SendbirdGroupChat & SendbirdOpenChat;
}
export interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: User;
}
export interface SendbirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}


export type SendbirdState = {
  config: SendbirdStateConfig;
  stores: SendbirdStateStore;
  dispatchers: {
    userDispatcher: UserDispatcher,
  },
}

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

export interface sendbirdSelectorsInterface {
  getSdk: (store: SendbirdState) => GetSdk;
  getConnect: (store: SendbirdState) => GetConnect
  getDisconnect: (store: SendbirdState) => GetDisconnect;
  getUpdateUserInfo: (store: SendbirdState) => GetUpdateUserInfo;
  getCreateGroupChannel: (store: SendbirdState) => GetCreateGroupChannel;
  getCreateOpenChannel: (store: SendbirdState) => GetCreateOpenChannel;
  getGetGroupChannel: (store: SendbirdState) => GetGetGroupChannel;
  getGetOpenChannel: (store: SendbirdState) => GetGetOpenChannel;
  getLeaveChannel: (store: SendbirdState) => GetLeaveGroupChannel;
  getEnterOpenChannel: (store: SendbirdState) => GetEnterOpenChannel;
  getExitOpenChannel: (store: SendbirdState) => GetExitOpenChannel;
  getFreezeChannel: (store: SendbirdState) => GetFreezeChannel;
  getUnFreezeChannel: (store: SendbirdState) => GetUnFreezeChannel;
  getSendUserMessage: (store: SendbirdState) => GetSendUserMessage;
  getSendFileMessage: (store: SendbirdState) => GetSendFileMessage;
  getUpdateUserMessage: (store: SendbirdState) => GetUpdateUserMessage;
  // getUpdateFileMessage: (store: SendbirdState) => GetUpdateFileMessage;
  getDeleteMessage: (store: SendbirdState) => GetDeleteMessage;
  getResendUserMessage: (store: SendbirdState) => GetResendUserMessage;
  getResendFileMessage: (store: SendbirdState) => GetResendFileMessage;
}
