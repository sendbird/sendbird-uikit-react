import './index.scss';
import './__experimental__typography.scss';

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UIKitConfigProvider, useUIKitConfig } from '@sendbird/uikit-tools';

import { SendbirdSdkContext } from './SendbirdSdkContext';

import useTheme from './hooks/useTheme';

import sdkReducers from './dux/sdk/reducers';
import userReducers from './dux/user/reducers';
import appInfoReducers from './dux/appInfo/reducers';

import sdkInitialState from './dux/sdk/initialState';
import userInitialState from './dux/user/initialState';
import appInfoInitialState from './dux/appInfo/initialState';

import useOnlineStatus from './hooks/useOnlineStatus';
import useConnect from './hooks/useConnect';
import { LoggerFactory, LogLevel } from './Logger';
import pubSubFactory from './pubSub/index';

import { VoiceMessageProvider } from './VoiceMessageProvider';
import { LocalizationProvider } from './LocalizationContext';
import { MediaQueryProvider, useMediaQueryContext } from './MediaQueryContext';
import getStringSet, { StringSet } from '../ui/Label/stringSet';
import {
  DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT,
  VOICE_RECORDER_DEFAULT_MAX,
  VOICE_RECORDER_DEFAULT_MIN,
} from '../utils/consts';
import { uikitConfigMapper } from './utils/uikitConfigMapper';

import { useMarkAsReadScheduler } from './hooks/useMarkAsReadScheduler';
import { ConfigureSessionTypes } from './hooks/useConnect/types';
import { useMarkAsDeliveredScheduler } from './hooks/useMarkAsDeliveredScheduler';
import { getCaseResolvedReplyType } from './utils/resolvedReplyType';
import { useUnmount } from '../hooks/useUnmount';
import { disconnectSdk } from './hooks/useConnect/disconnectSdk';
import {
  UIKitOptions,
  CommonUIKitConfigProps,
  SendbirdChatInitParams,
  CustomExtensionParams,
  SBUEventHandlers, SendbirdProviderUtils,
} from './types';
import { GlobalModalProvider, ModalRoot } from '../hooks/useModal';
import { RenderUserProfileProps, UserListQuery } from '../types';
import PUBSUB_TOPICS, { SBUGlobalPubSub, SBUGlobalPubSubTopicPayloadUnion } from './pubSub/topics';
import { EmojiManager } from './emojiManager';
import { uikitConfigStorage } from './utils/uikitConfigStorage';
import useMessageTemplateUtils from './hooks/useMessageTemplateUtils';
import { EmojiReactionListRoot, MenuRoot } from '../ui/ContextMenu';

export { useSendbirdStateContext } from '../hooks/useSendbirdStateContext';

interface VoiceRecordOptions {
  maxRecordingTime?: number;
  minRecordingTime?: number;
}

const DEFAULT_UPLOAD_SIZE_LIMIT = 25 * 1024 * 1024;

export type ImageCompressionOutputFormatType = 'preserve' | 'png' | 'jpeg';
export interface ImageCompressionOptions {
  compressionRate?: number;
  resizingWidth?: number | string;
  resizingHeight?: number | string;
  outputFormat?: ImageCompressionOutputFormatType;
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

export interface SendbirdProviderProps extends CommonUIKitConfigProps, React.PropsWithChildren<unknown> {
  appId: string;
  userId: string;
  accessToken?: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  configureSession?: ConfigureSessionTypes | null;
  theme?: 'light' | 'dark';
  config?: SendbirdConfig;
  nickname?: string;
  colorSet?: Record<string, string> | null;
  stringSet?: Partial<StringSet> | null;
  dateLocale?: Locale | null;
  profileUrl?: string;
  voiceRecord?: VoiceRecordOptions;
  userListQuery?: () => UserListQuery;
  imageCompression?: ImageCompressionOptions;
  allowProfileEdit?: boolean;
  disableMarkAsDelivered?: boolean;
  breakpoint?: string | boolean;
  renderUserProfile?: ((props: RenderUserProfileProps) => React.ReactElement) | null;
  onUserProfileMessage?: ((channel: GroupChannel) => void) | null;
  uikitOptions?: UIKitOptions;
  isUserIdUsedForNickname?: boolean;
  sdkInitParams?: SendbirdChatInitParams;
  customExtensionParams?: CustomExtensionParams;
  isMultipleFilesMessageEnabled?: boolean;

  // Customer provided callbacks
  eventHandlers?: SBUEventHandlers;
}

export function SendbirdProvider(props: SendbirdProviderProps) {
  const localConfigs: UIKitOptions = uikitConfigMapper({
    legacyConfig: {
      replyType: props.replyType,
      isMentionEnabled: props.isMentionEnabled,
      isReactionEnabled: props.isReactionEnabled,
      disableUserProfile: props.disableUserProfile,
      isVoiceMessageEnabled: props.isVoiceMessageEnabled,
      isTypingIndicatorEnabledOnChannelList:
        props.isTypingIndicatorEnabledOnChannelList,
      isMessageReceiptStatusEnabledOnChannelList:
        props.isMessageReceiptStatusEnabledOnChannelList,
      showSearchIcon: props.showSearchIcon,
    },
    uikitOptions: props.uikitOptions,
  });

  return (
    <UIKitConfigProvider
      storage={uikitConfigStorage}
      localConfigs={{
        common: localConfigs?.common,
        groupChannel: {
          channel: localConfigs?.groupChannel,
          channelList: localConfigs?.groupChannelList,
          setting: localConfigs?.groupChannelSettings,
        },
        openChannel: {
          channel: localConfigs?.openChannel,
        },
      }}
    >
      <SendbirdSDK {...props} />
    </UIKitConfigProvider>
  );
}
const SendbirdSDK = ({
  appId,
  userId,
  children,
  accessToken,
  customApiHost,
  customWebSocketHost,
  configureSession = null,
  theme = 'light',
  config = {},
  nickname = '',
  colorSet = null,
  stringSet = null,
  dateLocale = null,
  profileUrl = '',
  voiceRecord,
  userListQuery,
  imageCompression = {},
  allowProfileEdit = false,
  disableMarkAsDelivered = false,
  renderUserProfile = null,
  onUserProfileMessage = null,
  breakpoint = false,
  isUserIdUsedForNickname = true,
  sdkInitParams,
  customExtensionParams,
  isMultipleFilesMessageEnabled = false,
  eventHandlers,
}: SendbirdProviderProps): React.ReactElement => {
  const {
    logLevel = '',
    userMention = {},
    isREMUnitEnabled = false,
    pubSub: customPubSub,
  } = config;
  const { isMobile } = useMediaQueryContext();
  const [logger, setLogger] = useState(LoggerFactory(logLevel as LogLevel));
  const [pubSub] = useState(() => customPubSub ?? pubSubFactory<PUBSUB_TOPICS, SBUGlobalPubSubTopicPayloadUnion>());
  const [sdkStore, sdkDispatcher] = useReducer(sdkReducers, sdkInitialState);
  const [userStore, userDispatcher] = useReducer(userReducers, userInitialState);
  const [appInfoStore, appInfoDispatcher] = useReducer(appInfoReducers, appInfoInitialState);

  const { configs, configsWithAppAttr, initDashboardConfigs } = useUIKitConfig();
  const sdkInitialized = sdkStore.initialized;
  const sdk = sdkStore?.sdk;
  const {
    uploadSizeLimit,
    multipleFilesMessageFileCountLimit,
  } = sdk?.appInfo ?? {};

  useTheme(colorSet);

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
    initializeMessageTemplatesInfo,
  } = useMessageTemplateUtils({
    sdk, logger, appInfoStore, appInfoDispatcher,
  });

  const utils: SendbirdProviderUtils = {
    updateMessageTemplatesInfo,
    getCachedTemplate,
  };

  const reconnect = useConnect({
    appId,
    userId,
    accessToken,
    isUserIdUsedForNickname,
    isMobile,
  }, {
    logger,
    nickname,
    profileUrl,
    configureSession: configureSession ?? undefined,
    customApiHost,
    customWebSocketHost,
    sdkInitParams,
    customExtensionParams,
    sdk,
    sdkDispatcher,
    userDispatcher,
    appInfoDispatcher,
    initDashboardConfigs,
    eventHandlers,
    initializeMessageTemplatesInfo,
  });

  useUnmount(() => {
    if (typeof sdk.disconnect === 'function') {
      disconnectSdk({
        logger,
        sdkDispatcher,
        userDispatcher,
        sdk,
      });
    }
  }, [sdk.disconnect]);

  // to create a pubsub to communicate between parent and child
  useEffect(() => {
    setLogger(LoggerFactory(logLevel as LogLevel));
  }, [logLevel]);

  // should move to reducer
  const [currentTheme, setCurrentTheme] = useState(theme);
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector('body');
    body?.classList.remove('sendbird-experimental__rem__units');
    if (isREMUnitEnabled) {
      body?.classList.add('sendbird-experimental__rem__units');
    }
  }, [isREMUnitEnabled]);
  // add-remove theme from body
  useEffect(() => {
    logger.info('Setup theme', `Theme: ${currentTheme}`);
    try {
      const body = document.querySelector('body');
      body?.classList.remove('sendbird-theme--light');
      body?.classList.remove('sendbird-theme--dark');
      body?.classList.add(`sendbird-theme--${currentTheme || 'light'}`);
      logger.info('Finish setup theme');
      // eslint-disable-next-line no-empty
    } catch (e) {
      logger.warning('Setup theme failed', `${e}`);
    }
    return () => {
      try {
        const body = document.querySelector('body');
        body?.classList.remove('sendbird-theme--light');
        body?.classList.remove('sendbird-theme--dark');
        // eslint-disable-next-line no-empty
      } catch { }
    };
  }, [currentTheme]);

  const isOnline = useOnlineStatus(sdkStore.sdk, logger);

  const markAsReadScheduler = useMarkAsReadScheduler({ isConnected: isOnline }, { logger });
  const markAsDeliveredScheduler = useMarkAsDeliveredScheduler({ isConnected: isOnline }, { logger });

  const localeStringSet = React.useMemo(() => {
    if (!stringSet) {
      return getStringSet('en');
    }
    return {
      ...getStringSet('en'),
      ...stringSet,
    };
  }, [stringSet]);

  /**
   * Feature Configuration - TODO
   * This will be moved into the UIKitConfigProvider, aftering Dashboard applies
   */
  const uikitMultipleFilesMessageLimit = useMemo(() => {
    return Math.min(DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, multipleFilesMessageFileCountLimit ?? Number.MAX_SAFE_INTEGER);
  }, [multipleFilesMessageFileCountLimit]);
  const uikitUploadSizeLimit = useMemo(() => {
    return uploadSizeLimit;
  }, [uploadSizeLimit]);

  // Emoji Manager
  const emojiManager = useMemo(() => {
    return new EmojiManager({
      sdk,
      logger,
    });
  }, [sdkStore.initialized]);

  return (
    <SendbirdSdkContext.Provider
      value={{
        stores: {
          sdkStore,
          userStore,
          appInfoStore,
        },
        dispatchers: {
          sdkDispatcher,
          userDispatcher,
          appInfoDispatcher,
          reconnect,
        },
        config: {
          disableMarkAsDelivered,
          renderUserProfile: renderUserProfile ?? undefined,
          onUserProfileMessage: onUserProfileMessage ?? undefined,
          allowProfileEdit,
          isOnline,
          userId,
          appId,
          accessToken,
          theme: currentTheme,
          setCurrentTheme,
          setCurrenttheme: setCurrentTheme, // deprecated: typo
          isMultipleFilesMessageEnabled,
          uikitUploadSizeLimit: uikitUploadSizeLimit ?? DEFAULT_UPLOAD_SIZE_LIMIT,
          uikitMultipleFilesMessageLimit,
          userListQuery,
          logger,
          pubSub,
          imageCompression: {
            compressionRate: 0.7,
            outputFormat: 'preserve',
            ...imageCompression,
          },
          voiceRecord: {
            maxRecordingTime: voiceRecord?.maxRecordingTime ?? VOICE_RECORDER_DEFAULT_MAX,
            minRecordingTime: voiceRecord?.minRecordingTime ?? VOICE_RECORDER_DEFAULT_MIN,
          },
          userMention: {
            maxMentionCount: userMention?.maxMentionCount || 10,
            maxSuggestionCount: userMention?.maxSuggestionCount || 15,
          },
          markAsReadScheduler,
          markAsDeliveredScheduler,
          // Remote configs set from dashboard by UIKit feature configuration
          common: configs.common,
          groupChannel: {
            enableOgtag: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableOgtag,
            enableTypingIndicator: configs.groupChannel.channel.enableTypingIndicator,
            enableReactions: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
            enableReactionsSupergroup: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactionsSupergroup,
            enableMention: configs.groupChannel.channel.enableMention,
            replyType: configs.groupChannel.channel.replyType,
            threadReplySelectType: configs.groupChannel.channel.threadReplySelectType,
            enableVoiceMessage: configs.groupChannel.channel.enableVoiceMessage,
            enableDocument: configs.groupChannel.channel.input.enableDocument,
            typingIndicatorTypes: configs.groupChannel.channel.typingIndicatorTypes,
            enableFeedback: configs.groupChannel.channel.enableFeedback,
            enableSuggestedReplies: configs.groupChannel.channel.enableSuggestedReplies,
            showSuggestedRepliesFor: configs.groupChannel.channel.showSuggestedRepliesFor,
            suggestedRepliesDirection: configs.groupChannel.channel.suggestedRepliesDirection,
          },
          groupChannelList: {
            enableTypingIndicator: configs.groupChannel.channelList.enableTypingIndicator,
            enableMessageReceiptStatus: configs.groupChannel.channelList.enableMessageReceiptStatus,
          },
          groupChannelSettings: {
            enableMessageSearch: sdkInitialized && configsWithAppAttr(sdk).groupChannel.setting.enableMessageSearch,
          },
          openChannel: {
            enableOgtag: sdkInitialized && configsWithAppAttr(sdk).openChannel.channel.enableOgtag,
            enableDocument: configs.openChannel.channel.input.enableDocument,
          },
          // deprecated configs
          disableUserProfile: !configs.common.enableUsingDefaultUserProfile,
          isReactionEnabled: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
          isMentionEnabled: configs.groupChannel.channel.enableMention,
          isVoiceMessageEnabled: configs.groupChannel.channel.enableVoiceMessage,
          replyType: getCaseResolvedReplyType(configs.groupChannel.channel.replyType).upperCase,
          isTypingIndicatorEnabledOnChannelList: configs.groupChannel.channelList.enableTypingIndicator,
          isMessageReceiptStatusEnabledOnChannelList: configs.groupChannel.channelList.enableMessageReceiptStatus,
          showSearchIcon: sdkInitialized && configsWithAppAttr(sdk).groupChannel.setting.enableMessageSearch,
        },
        eventHandlers,
        emojiManager,
        utils,
      }}
    >
      <MediaQueryProvider logger={logger} breakpoint={breakpoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale ?? undefined}>
          <VoiceMessageProvider>
            <GlobalModalProvider>
              {children}
            </GlobalModalProvider>
          </VoiceMessageProvider>
        </LocalizationProvider>
      </MediaQueryProvider>
      {/* Roots */}
      <EmojiReactionListRoot />
      <ModalRoot />
      <MenuRoot />
    </SendbirdSdkContext.Provider>
  );
};

export default SendbirdProvider;
