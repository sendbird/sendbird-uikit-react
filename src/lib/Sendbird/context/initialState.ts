import type { SendbirdState, SendbirdStateConfig, ReplyType, SendbirdStateStore, SdkStore } from '../types';
import {
  DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT,
  DEFAULT_UPLOAD_SIZE_LIMIT,
} from '../../../utils/consts';
import { User } from '@sendbird/chat';

/**
 * Config
 */
const deprecatedConfig = {
  onUserProfileMessage: undefined,
  disableUserProfile: false,
  isReactionEnabled: true,
  isMentionEnabled: false,
  isVoiceMessageEnabled: true,
  replyType: 'NONE' as ReplyType,
  showSearchIcon: true,
  isTypingIndicatorEnabledOnChannelList: false,
  isMessageReceiptStatusEnabledOnChannelList: false,
  setCurrenttheme: () => {},
};
const config: SendbirdStateConfig = {
  ...deprecatedConfig,
  // Connection
  appId: '',
  userId: '',
  accessToken: undefined,
  theme: 'light',
  isOnline: false,
  // High level options
  allowProfileEdit: true,
  forceLeftToRightMessageLayout: false,
  disableMarkAsDelivered: false,
  isMultipleFilesMessageEnabled: false,
  htmlTextDirection: 'ltr',
  uikitUploadSizeLimit: DEFAULT_UPLOAD_SIZE_LIMIT,
  uikitMultipleFilesMessageLimit: DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT,
  imageCompression: undefined,
  voiceRecord: undefined,
  userMention: undefined,
  // Functions
  renderUserProfile: undefined,
  onStartDirectMessage: undefined,
  setCurrentTheme: undefined,
  userListQuery: undefined,
  // Utils
  pubSub: undefined,
  logger: undefined,
  markAsReadScheduler: undefined,
  markAsDeliveredScheduler: undefined,
  // UIKit Configs
  common: {
    enableUsingDefaultUserProfile: false,
  },
  groupChannel: {
    enableOgtag: true,
    enableTypingIndicator: true,
    enableReactions: true,
    enableMention: false,
    replyType: 'none',
    threadReplySelectType: 'thread',
    enableVoiceMessage: true,
    typingIndicatorTypes: undefined,
    enableDocument: false,
    enableFeedback: false,
    enableSuggestedReplies: false,
    showSuggestedRepliesFor: 'all_messages',
    suggestedRepliesDirection: 'vertical',
    enableMarkdownForUserMessage: false,
    enableFormTypeMessage: false,
    enableMarkAsUnread: false,
    enableReactionsSupergroup: undefined as never, // @deprecated
  },
  groupChannelList: {
    enableTypingIndicator: false,
    enableMessageReceiptStatus: false,
  },
  groupChannelSettings: {
    enableMessageSearch: false,
  },
  openChannel: {
    enableOgtag: true,
    enableDocument: false,
  },
};

/**
 * Stores
 */
const stores: SendbirdStateStore = {
  sdkStore: {
    sdk: {} as SdkStore['sdk'],
    initialized: false,
    loading: false,
    error: undefined,
  },
  userStore: {
    user: {} as User,
    initialized: false,
    loading: false,
  },
  appInfoStore: {
    messageTemplatesInfo: undefined,
    waitingTemplateKeysMap: {},
  },
};

export const initialState: SendbirdState = {
  config,
  stores,
  emojiManager: undefined,
  eventHandlers: {
    reaction: {
      onPressUserProfile: () => {},
    },
    connection: {
      onConnected: () => {},
      onFailed: () => {},
    },
    modal: {
      onMounted: () => {},
    },
    message: {
      onSendMessageFailed: () => {},
      onUpdateMessageFailed: () => {},
      onFileUploadFailed: () => {},
    },
  },
  utils: {
    updateMessageTemplatesInfo: () => new Promise(() => {}),
    getCachedTemplate: () => null,
  },
};
