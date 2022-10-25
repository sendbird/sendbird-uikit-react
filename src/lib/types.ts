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

import type SendBirdTypes from '../types';
import { UikitMessageHandler } from './selectors';
import { Logger } from './SendbirdState';

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
  renderUserProfile?: (props: SendBirdTypes.RenderUserProfileProps) => React.ReactElement;
  allowProfileEdit?: boolean;
  userListQuery?(): SendBirdTypes.UserListQuery;
  config?: SendBirdTypes.SendBirdProviderConfig;
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

export interface SendBirdStateConfig {
  disableUserProfile: boolean;
  disableMarkAsDelivered: boolean;
  renderUserProfile?: (props: SendBirdTypes.RenderUserProfileProps) => React.ReactElement;
  allowProfileEdit: boolean;
  isOnline: boolean;
  userId: string;
  appId: string;
  accessToken: string;
  theme: string;
  pubSub: any;
  logger: Logger;
  setCurrenttheme: (theme: string) => void;
  userListQuery?(): SendBirdTypes.UserListQuery;
  isReactionEnabled: boolean;
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
