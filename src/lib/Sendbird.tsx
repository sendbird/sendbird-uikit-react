import './index.scss';
import './__experimental__typography.scss';

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UIKitConfigProvider, useUIKitConfig } from '@sendbird/uikit-tools';

import { SendbirdSdkContext } from './SendbirdSdkContext';

import useTheme from './hooks/useTheme';

import sdkReducers from './dux/sdk/reducers';
import userReducers from './dux/user/reducers';

import sdkInitialState from './dux/sdk/initialState';
import userInitialState from './dux/user/initialState';

import useOnlineStatus from './hooks/useOnlineStatus';
import useConnect from './hooks/useConnect';
import { LoggerFactory, LogLevel } from './Logger';
import pubSubFactory from './pubSub/index';
import useAppendDomNode from '../hooks/useAppendDomNode';

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
import { getCaseResolvedReplyType, getCaseResolvedThreadReplySelectType } from './utils/resolvedReplyType';
import { useUnmount } from '../hooks/useUnmount';
import { disconnectSdk } from './hooks/useConnect/disconnectSdk';
import {
  UIKitOptions,
  CommonUIKitConfigProps,
  SendbirdChatInitParams,
  CustomExtensionParams,
  SBUEventHandlers,
} from './types';
import { GlobalModalProvider } from '../hooks/useModal';
import { RenderUserProfileProps } from '../types';
import PUBSUB_TOPICS, { SBUGlobalPubSub, SBUGlobalPubSubTopicPayloadUnion } from './pubSub/topics';

export { useSendbirdStateContext } from '../hooks/useSendbirdStateContext';

export type UserListQueryType = {
  hasNext?: boolean;
  next: () => Promise<Array<User>>;
  get isLoading(): boolean;
};

interface VoiceRecordOptions {
  maxRecordingTime?: number;
  minRecordingTime?: number;
}

export interface ImageCompressionOptions {
  compressionRate?: number;
  resizingWidth?: number | string;
  resizingHeight?: number | string;
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

export interface SendbirdProviderProps extends CommonUIKitConfigProps, React.PropsWithChildren {
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
  userListQuery?(): UserListQueryType;
  imageCompression?: ImageCompressionOptions;
  allowProfileEdit?: boolean;
  disableMarkAsDelivered?: boolean;
  breakpoint?: string | boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onUserProfileMessage?: (channel: GroupChannel) => void;
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
  userListQuery = null,
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

  const { configs, configsWithAppAttr, initDashboardConfigs } = useUIKitConfig();
  const sdkInitialized = sdkStore.initialized;
  const sdk = sdkStore?.sdk;
  const {
    uploadSizeLimit,
    multipleFilesMessageFileCountLimit,
  } = sdk?.appInfo ?? {};

  useTheme(colorSet);

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
    configureSession,
    customApiHost,
    customWebSocketHost,
    sdkInitParams,
    customExtensionParams,
    sdk,
    sdkDispatcher,
    userDispatcher,
    initDashboardConfigs,
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

  useAppendDomNode([
    'sendbird-modal-root',
    'sendbird-dropdown-portal',
    'sendbird-emoji-list-portal',
  ], 'body');

  // should move to reducer
  const [currentTheme, setCurrentTheme] = useState(theme);
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector('body');
    body.classList.remove('sendbird-experimental__rem__units');
    if (isREMUnitEnabled) {
      body.classList.add('sendbird-experimental__rem__units');
    }
  }, [isREMUnitEnabled]);
  // add-remove theme from body
  useEffect(() => {
    logger.info('Setup theme', `Theme: ${currentTheme}`);
    try {
      const body = document.querySelector('body');
      body.classList.remove('sendbird-theme--light');
      body.classList.remove('sendbird-theme--dark');
      body.classList.add(`sendbird-theme--${currentTheme || 'light'}`);
      logger.info('Finish setup theme');
      // eslint-disable-next-line no-empty
    } catch (e) {
      logger.warning('Setup theme failed', `${e}`);
    }
    return () => {
      try {
        const body = document.querySelector('body');
        body.classList.remove('sendbird-theme--light');
        body.classList.remove('sendbird-theme--dark');
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

  return (
    <SendbirdSdkContext.Provider
      value={{
        stores: {
          sdkStore,
          userStore,
        },
        dispatchers: {
          sdkDispatcher,
          userDispatcher,
          reconnect,
        },
        config: {
          disableMarkAsDelivered,
          renderUserProfile,
          onUserProfileMessage,
          allowProfileEdit,
          isOnline,
          userId,
          appId,
          accessToken,
          theme: currentTheme,
          setCurrentTheme,
          setCurrenttheme: setCurrentTheme, // deprecated: typo
          isMultipleFilesMessageEnabled,
          uikitUploadSizeLimit,
          uikitMultipleFilesMessageLimit,
          userListQuery,
          logger,
          pubSub,
          imageCompression: {
            compressionRate: 0.7,
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
          // From UIKitConfigProvider.localConfigs
          disableUserProfile:
            !configs.common.enableUsingDefaultUserProfile,
          isReactionEnabled:
            sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
          isMentionEnabled:
            configs.groupChannel.channel.enableMention,
          isVoiceMessageEnabled:
            configs.groupChannel.channel.enableVoiceMessage,
          replyType:
            getCaseResolvedReplyType(configs.groupChannel.channel.replyType).upperCase,
          isTypingIndicatorEnabledOnChannelList:
            configs.groupChannel.channelList.enableTypingIndicator,
          isMessageReceiptStatusEnabledOnChannelList:
            configs.groupChannel.channelList.enableMessageReceiptStatus,
          showSearchIcon:
            sdkInitialized && configsWithAppAttr(sdk).groupChannel.setting.enableMessageSearch,
          // Remote configs set from dashboard by UIKit feature configuration
          groupChannel: {
            enableOgtag:
              sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableOgtag,
            enableTypingIndicator: configs.groupChannel.channel.enableTypingIndicator,
            enableDocument: configs.groupChannel.channel.input.enableDocument,
            threadReplySelectType: getCaseResolvedThreadReplySelectType(configs.groupChannel.channel.threadReplySelectType).lowerCase,
            typingIndicatorTypes: configs.groupChannel.channel.typingIndicatorTypes,
          },
          openChannel: {
            enableOgtag:
              sdkInitialized && configsWithAppAttr(sdk).openChannel.channel.enableOgtag,
            enableDocument: configs.openChannel.channel.input.enableDocument,
          },
        },
        eventHandlers,
      }}
    >
      <MediaQueryProvider logger={logger} breakpoint={breakpoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
          <VoiceMessageProvider isVoiceMessageEnabled={configs.groupChannel.channel.enableVoiceMessage}>
            <GlobalModalProvider>
              {children}
            </GlobalModalProvider>
          </VoiceMessageProvider>
        </LocalizationProvider>
      </MediaQueryProvider>
    </SendbirdSdkContext.Provider>
  );
};

export default SendbirdProvider;
