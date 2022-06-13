import type SendbirdChat from '@sendbird/chat';
import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import type { AdminMessage, FileMessage, FileMessageCreateParams, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import type { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';

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
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
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
type GetSendUserMessage = (
  channelUrl: string,
  userMessageParams: UserMessageCreateParams
) => Promise<UserMessage>;
type GetSendFileMessage = (
  channelUrl: string,
  fileMessageParams: FileMessageCreateParams
) => Promise<FileMessage>;
type GetUpdateUserMessage = (
  channelUrl: string,
  messageId: string | number,
  params: UserMessageUpdateParams
) => Promise<UserMessage>;
type GetDeleteMessage = (
  channelUrl: string,
  message: AdminMessage | UserMessage | FileMessage
) => Promise<void>;
type GetResendUserMessage = (
  channelUrl: string,
  failedMessage: UserMessage
) => Promise<UserMessage>;
type GetResendFileMessage = (
  channelUrl: string,
  failedMessage: FileMessage
) => Promise<FileMessage>;
type GetFreezeChannel = (channelUrl: string) => Promise<GroupChannel>;
type GetUnFreezeChannel = (channelUrl: string) => Promise<GroupChannel>;
type GetCreateChannel = (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;
type GetLeaveChannel = (channelUrl: string) => Promise<GroupChannel>;
type GetCreateOpenChannel = (channelParams: OpenChannelCreateParams) => Promise<OpenChannel>;
type GetEnterOpenChannel = (channelUrl: string) => Promise<null>;
type GetExitOpenChannel = (channelUrl: string) => Promise<null>;
type GetOpenChannelSendUserMessage = (
  channelUrl: string,
  params: UserMessageCreateParams,
) => Promise<UserMessage>;
type GetOpenChannelSendFileMessage = (
  channelUrl: string,
  params: FileMessageCreateParams,
) => Promise<FileMessage>;
type GetOpenChannelUpdateUserMessage = (
  channelUrl: string,
  messageId: string,
  params: UserMessageUpdateParams,
) => Promise<UserMessage>;
type GetOpenChannelDeleteMessage = (
  channelUrl: string,
  message: UserMessage | FileMessage,
) => Promise<UserMessage | FileMessage>;
type GetOpenChannelResendUserMessage = (
  channelUrl: string,
  failedMessage: UserMessage,
) => Promise<UserMessage>;
type GetOpenChannelResendFileMessage = (
  channelUrl: string,
  failedMessage: FileMessage,
) => Promise<FileMessage>;


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
