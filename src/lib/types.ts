import SendBird from 'sendbird';
import type SendBirdTypes from '../types';
import { Logger } from './SendbirdState';

export interface SendBirdProviderProps {
  userId: string;
  appId: string;
  accessToken?: string;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: SendBirdTypes.RenderUserProfileProps) => React.ReactNode;
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
}

interface SendBirdStateConfig {
  disableUserProfile: boolean;
  renderUserProfile?: (props: SendBirdTypes.RenderUserProfileProps) => React.ReactNode;
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


export interface sendBirdSelectorsInterface {
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
