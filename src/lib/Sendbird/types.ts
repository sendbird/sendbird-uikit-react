// src/lib/Sendbird/types.ts

import React, { MutableRefObject } from 'react';
import type SendbirdChat from '@sendbird/chat';
import type {
  User,
  SendbirdChatParams,
  SendbirdError,
  SessionHandler,
} from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelModule,
  Member,
  SendbirdGroupChat,
} from '@sendbird/chat/groupChannel';
import type {
  OpenChannel,
  OpenChannelCreateParams,
  OpenChannelModule,
  SendbirdOpenChat,
} from '@sendbird/chat/openChannel';
import type {
  FileMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import { Module, ModuleNamespaces } from '@sendbird/chat/lib/__definition';
import { SBUConfig } from '@sendbird/uikit-tools';

import { PartialDeep } from '../../utils/typeHelpers/partialDeep';
import { CoreMessageType } from '../../utils';
import { LoggerInterface } from '../Logger';
import { MarkAsReadSchedulerType } from '../hooks/useMarkAsReadScheduler';
import { MarkAsDeliveredSchedulerType } from '../hooks/useMarkAsDeliveredScheduler';
import { SBUGlobalPubSub } from '../pubSub/topics';
import { EmojiManager } from '../emojiManager';
import { StringSet } from '../../ui/Label/stringSet';

/* -------------------------------------------------------------------------- */
/*                               Legacy                                       */
/* -------------------------------------------------------------------------- */

export type ReplyType = 'NONE' | 'QUOTE_REPLY' | 'THREAD';
export type ConfigureSessionTypes = (sdk: SendbirdChat | SendbirdGroupChat | SendbirdOpenChat) => SessionHandler;
// Sendbird state dispatcher
export type CustomUseReducerDispatcher = React.Dispatch<{
  type: string;
  payload: any;
}>;

/* -------------------------------------------------------------------------- */
/*                            Common Types                                    */
/* -------------------------------------------------------------------------- */

// Image compression settings
export type ImageCompressionOutputFormatType = 'preserve' | 'png' | 'jpeg';

export interface ImageCompressionOptions {
  compressionRate?: number;
  resizingWidth?: number | string;
  resizingHeight?: number | string;
  outputFormat?: ImageCompressionOutputFormatType;
}

// Logger type
export type Logger = LoggerInterface;

// Roles for a user in a channel
export const Role = {
  OPERATOR: 'operator',
  NONE: 'none',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export type HTMLTextDirection = 'ltr' | 'rtl';

export interface RenderUserProfileProps {
  user: User | Member;
  currentUserId: string;
  close(): void;
  avatarRef: MutableRefObject<any>;
}

export interface UserListQuery {
  hasNext?: boolean;
  next(): Promise<Array<User>>;
  get isLoading(): boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 Stores                                     */
/* -------------------------------------------------------------------------- */

// AppInfo
export interface MessageTemplatesInfo {
  token: string; // This server-side token gets updated on every CRUD operation on message template table.
  templatesMap: Record<string, ProcessedMessageTemplate>;
}

export interface WaitingTemplateKeyData {
  requestedAt: number;
  erroredMessageIds: number[];
}

export type ProcessedMessageTemplate = {
  version: number;
  uiTemplate: string; // This is stringified ui_template.body.items
  colorVariables?: Record<string, string>;
};

export interface AppInfoStateType {
  messageTemplatesInfo?: MessageTemplatesInfo;
  /**
   * This represents template keys that are currently waiting for its fetch response.
   * Whenever initialized, request succeeds or fails, it needs to be updated.
   */
  waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}

/* -------------------------------------------------------------------------- */
/*                          Event Handlers Types                              */
/* -------------------------------------------------------------------------- */

export interface SBUEventHandlers {
  reaction?: {
    onPressUserProfile?(member: User): void;
  };
  connection?: {
    onConnected?(user: User): void;
    onFailed?(error: SendbirdError): void;
  };
  modal?: {
    onMounted?(params: { id: string; close(): void }): void | (() => void);
  };
  message?: {
    onSendMessageFailed?: (message: CoreMessageType, error: unknown) => void;
    onUpdateMessageFailed?: (message: CoreMessageType, error: unknown) => void;
    onFileUploadFailed?: (error: unknown) => void;
  };
}

/* -------------------------------------------------------------------------- */
/*                           Sendbird State Types                             */
/* -------------------------------------------------------------------------- */

interface VoiceRecordOptions {
  maxRecordingTime?: number;
  minRecordingTime?: number;
}

export interface SendbirdConfig {
  logLevel?: string | Array<string>;
  pubSub?: SBUGlobalPubSub;
  userMention?: {
    maxMentionCount?: number;
    maxSuggestionCount?: number;
  };
  isREMUnitEnabled?: boolean;
}

export interface CommonUIKitConfigProps {
  /** @deprecated Please use `uikitOptions.common.enableUsingDefaultUserProfile` instead * */
  disableUserProfile?: boolean;
  /** @deprecated Please use `uikitOptions.groupChannel.replyType` instead * */
  replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
  /** @deprecated Please use `uikitOptions.groupChannel.enableReactions` instead * */
  isReactionEnabled?: boolean;
  /** @deprecated Please use `uikitOptions.groupChannel.enableMention` instead * */
  isMentionEnabled?: boolean;
  /** @deprecated Please use `uikitOptions.groupChannel.enableVoiceMessage` instead * */
  isVoiceMessageEnabled?: boolean;
  /** @deprecated Please use `uikitOptions.groupChannelList.enableTypingIndicator` instead * */
  isTypingIndicatorEnabledOnChannelList?: boolean;
  /** @deprecated Please use `uikitOptions.groupChannelList.enableMessageReceiptStatus` instead * */
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  /** @deprecated Please use `uikitOptions.groupChannelSettings.enableMessageSearch` instead * */
  showSearchIcon?: boolean;
}
export type SendbirdChatInitParams = Omit<SendbirdChatParams<Module[]>, 'appId'>;
export type CustomExtensionParams = Record<string, string>;

export type UIKitOptions = PartialDeep<{
  common: SBUConfig['common'];
  groupChannel: SBUConfig['groupChannel']['channel'];
  groupChannelList: SBUConfig['groupChannel']['channelList'];
  groupChannelSettings: SBUConfig['groupChannel']['setting'];
  openChannel: SBUConfig['openChannel']['channel'];
}>;

export interface SendbirdProviderProps extends CommonUIKitConfigProps, React.PropsWithChildren<unknown> {
  appId: string;
  userId: string;
  accessToken?: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  configureSession?: ConfigureSessionTypes;
  theme?: 'light' | 'dark';
  config?: SendbirdConfig;
  nickname?: string;
  colorSet?: Record<string, string>;
  stringSet?: Partial<StringSet>;
  dateLocale?: Locale;
  profileUrl?: string;
  voiceRecord?: VoiceRecordOptions;
  userListQuery?: () => UserListQuery;
  imageCompression?: ImageCompressionOptions;
  allowProfileEdit?: boolean;
  disableMarkAsDelivered?: boolean;
  breakpoint?: string | boolean;
  htmlTextDirection?: HTMLTextDirection;
  forceLeftToRightMessageLayout?: boolean;
  uikitOptions?: UIKitOptions;
  isUserIdUsedForNickname?: boolean;
  sdkInitParams?: SendbirdChatInitParams;
  customExtensionParams?: CustomExtensionParams;
  isMultipleFilesMessageEnabled?: boolean;
  // UserProfile
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onStartDirectMessage?: (channel: GroupChannel) => void;
  /**
   * @deprecated Please use `onStartDirectMessage` instead. It's renamed.
   */
  onUserProfileMessage?: (channel: GroupChannel) => void;

  // Customer provided callbacks
  eventHandlers?: SBUEventHandlers;
}

export interface SendbirdStateConfig {
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onStartDirectMessage?: (props: GroupChannel) => void;
  allowProfileEdit: boolean;
  isOnline: boolean;
  userId: string;
  appId: string;
  accessToken?: string;
  theme: string;
  htmlTextDirection: HTMLTextDirection;
  forceLeftToRightMessageLayout: boolean;
  pubSub: SBUGlobalPubSub;
  logger: Logger;
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  userListQuery?: () => UserListQuery;
  uikitUploadSizeLimit: number;
  uikitMultipleFilesMessageLimit: number;
  voiceRecord: {
    maxRecordingTime: number;
    minRecordingTime: number;
  };
  userMention: {
    maxMentionCount: number,
    maxSuggestionCount: number,
  };
  imageCompression: ImageCompressionOptions;
  markAsReadScheduler: MarkAsReadSchedulerType;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
  disableMarkAsDelivered: boolean;
  isMultipleFilesMessageEnabled: boolean;
  // Remote configs set from dashboard by UIKit feature configuration
  common: {
    enableUsingDefaultUserProfile: SBUConfig['common']['enableUsingDefaultUserProfile'];
  },
  groupChannel: {
    enableOgtag: SBUConfig['groupChannel']['channel']['enableOgtag'];
    enableTypingIndicator: SBUConfig['groupChannel']['channel']['enableTypingIndicator'];
    enableReactions: SBUConfig['groupChannel']['channel']['enableReactions'];
    enableMention: SBUConfig['groupChannel']['channel']['enableMention'];
    replyType: SBUConfig['groupChannel']['channel']['replyType'];
    threadReplySelectType: SBUConfig['groupChannel']['channel']['threadReplySelectType'];
    enableVoiceMessage: SBUConfig['groupChannel']['channel']['enableVoiceMessage'];
    typingIndicatorTypes: SBUConfig['groupChannel']['channel']['typingIndicatorTypes'];
    enableDocument: SBUConfig['groupChannel']['channel']['input']['enableDocument'];
    enableFeedback: SBUConfig['groupChannel']['channel']['enableFeedback'];
    enableSuggestedReplies: SBUConfig['groupChannel']['channel']['enableSuggestedReplies'];
    showSuggestedRepliesFor: SBUConfig['groupChannel']['channel']['showSuggestedRepliesFor'];
    suggestedRepliesDirection: SBUConfig['groupChannel']['channel']['suggestedRepliesDirection'];
    enableMarkdownForUserMessage: SBUConfig['groupChannel']['channel']['enableMarkdownForUserMessage'];
    enableFormTypeMessage: SBUConfig['groupChannel']['channel']['enableFormTypeMessage'];
    /**
     * @deprecated Currently, this feature is turned off by default. If you wish to use this feature, contact us: {@link https://dashboard.sendbird.com/settings/contact_us?category=feedback_and_feature_requests&product=UIKit}
     */
    enableReactionsSupergroup: never;
  },
  groupChannelList: {
    enableTypingIndicator: SBUConfig['groupChannel']['channelList']['enableTypingIndicator'];
    enableMessageReceiptStatus: SBUConfig['groupChannel']['channelList']['enableMessageReceiptStatus'];
  },
  groupChannelSettings: {
    enableMessageSearch: SBUConfig['groupChannel']['setting']['enableMessageSearch'];
  },
  openChannel: {
    enableOgtag: SBUConfig['openChannel']['channel']['enableOgtag'];
    enableDocument: SBUConfig['openChannel']['channel']['input']['enableDocument'];
  },
  /**
   * @deprecated Please use `onStartDirectMessage` instead. It's renamed.
   */
  onUserProfileMessage?: (props: GroupChannel) => void;
  /**
   * @deprecated Please use `!config.common.enableUsingDefaultUserProfile` instead.
   * Note that you should use the negation of `config.common.enableUsingDefaultUserProfile`
   * to replace `disableUserProfile`.
   */
  disableUserProfile: boolean;
  /** @deprecated Please use `config.groupChannel.enableReactions` instead * */
  isReactionEnabled: boolean;
  /** @deprecated Please use `config.groupChannel.enableMention` instead * */
  isMentionEnabled: boolean;
  /** @deprecated Please use `config.groupChannel.enableVoiceMessage` instead * */
  isVoiceMessageEnabled?: boolean;
  /** @deprecated Please use `config.groupChannel.replyType` instead * */
  replyType: ReplyType;
  /** @deprecated Please use `config.groupChannelSettings.enableMessageSearch` instead * */
  showSearchIcon?: boolean;
  /** @deprecated Please use `config.groupChannelList.enableTypingIndicator` instead * */
  isTypingIndicatorEnabledOnChannelList?: boolean;
  /** @deprecated Please use `config.groupChannelList.enableMessageReceiptStatus` instead * */
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  /** @deprecated Please use setCurrentTheme instead * */
  setCurrenttheme: (theme: 'light' | 'dark') => void;
}

export type SendbirdChatType = SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;

export interface SdkStore {
  error: boolean;
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
}

export interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: User;
}

export interface AppInfoStore {
  messageTemplatesInfo?: MessageTemplatesInfo;
  /**
   * This represents template keys that are currently waiting for its fetch response.
   * Whenever initialized, request succeeds or fails, it needs to be updated.
   */
  waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}

export interface SendbirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
  appInfoStore: AppInfoStore;
}

export type SendbirdState = {
  config: SendbirdStateConfig;
  stores: SendbirdStateStore;
  // dispatchers: {
  //   sdkDispatcher: React.Dispatch<SdkActionTypes>,
  //   userDispatcher: React.Dispatch<UserActionTypes>,
  //   appInfoDispatcher: React.Dispatch<AppInfoActionTypes>,
  //   reconnect: ReconnectType,
  // },
  // Customer provided callbacks
  eventHandlers?: SBUEventHandlers;
  emojiManager: EmojiManager;
  utils: SendbirdProviderUtils;
};

/* -------------------------------------------------------------------------- */
/*                            Utility Types                                   */
/* -------------------------------------------------------------------------- */

export interface SendbirdProviderUtils {
  updateMessageTemplatesInfo: (
    templateKeys: string[],
    messageId: number,
    createdAt: number
  ) => Promise<void>;
  getCachedTemplate: (key: string) => ProcessedMessageTemplate | null;
}

// Selectors for state access
export interface sendbirdSelectorsInterface {
  getSdk: (store: SendbirdState) => SendbirdChat | undefined;
  getConnect: (store: SendbirdState) => (userId: string, accessToken?: string) => Promise<User>;
  getDisconnect: (store: SendbirdState) => () => Promise<void>;
  getUpdateUserInfo: (
    store: SendbirdState
  ) => (nickName: string, profileUrl?: string) => Promise<User>;
  getCreateGroupChannel: (
    store: SendbirdState
  ) => (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;
  getCreateOpenChannel: (
    store: SendbirdState
  ) => (channelParams: OpenChannelCreateParams) => Promise<OpenChannel>;
  getGetGroupChannel: (
    store: SendbirdState
  ) => (channelUrl: string, isSelected?: boolean) => Promise<GroupChannel>;
  getGetOpenChannel: (
    store: SendbirdState
  ) => (channelUrl: string) => Promise<OpenChannel>;
  getLeaveGroupChannel: (
    store: SendbirdState
  ) => (channel: GroupChannel) => Promise<void>;
  getEnterOpenChannel: (
    store: SendbirdState
  ) => (channel: OpenChannel) => Promise<OpenChannel>;
  getExitOpenChannel: (
    store: SendbirdState
  ) => (channel: OpenChannel) => Promise<void>;
  getFreezeChannel: (
    store: SendbirdState
  ) => (channel: GroupChannel | OpenChannel) => Promise<void>;
  getUnFreezeChannel: (
    store: SendbirdState
  ) => (channel: GroupChannel | OpenChannel) => Promise<void>;
  getSendUserMessage: (
    store: SendbirdState
  ) => (
    channel: GroupChannel | OpenChannel,
    userMessageParams: UserMessageCreateParams
  ) => any; // Replace with specific type
  getSendFileMessage: (
    store: SendbirdState
  ) => (
    channel: GroupChannel | OpenChannel,
    fileMessageParams: FileMessageCreateParams
  ) => any; // Replace with specific type
  getUpdateUserMessage: (
    store: SendbirdState
  ) => (
    channel: GroupChannel | OpenChannel,
    messageId: string | number,
    params: UserMessageUpdateParams
  ) => Promise<UserMessage>;
}
