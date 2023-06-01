import './index.scss';
import './__experimental__typography.scss';

import React, { useEffect, useReducer, useState } from 'react';
import { User } from '@sendbird/chat';

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

import { UIKitConfigProvider, useUIKitConfig } from './UIKitConfigProvider';
import { VoiceMessageProvider } from './VoiceMessageProvider';
import { LocalizationProvider } from './LocalizationContext';
import { MediaQueryProvider } from './MediaQueryContext';
import getStringSet from '../ui/Label/stringSet';
import { VOICE_RECORDER_DEFAULT_MAX, VOICE_RECORDER_DEFAULT_MIN } from '../utils/consts';
import { useMarkAsReadScheduler } from './hooks/useMarkAsReadScheduler';
import { ConfigureSessionTypes } from './hooks/useConnect/types';

export type UserListQueryType = {
  hasNext?: boolean;
  next: () => Promise<Array<User>>;
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
  pubSub?: () => void;// TODO: Define pubSub type and apply it here
  userMention?: {
    maxMentionCount?: number;
    maxSuggestionCount?: number;
  };
  isREMUnitEnabled?: boolean;
}

interface CommonUIKitConfigProps {
  replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  disableUserProfile?: boolean;
  isVoiceMessageEnabled?: boolean;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}
export interface SendbirdProviderProps extends CommonUIKitConfigProps {
  appId: string;
  userId: string;
  children: React.ReactElement;
  accessToken?: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  configureSession?: ConfigureSessionTypes;
  theme?: 'light' | 'dark';
  config?: SendbirdConfig;
  nickname?: string;
  colorSet?: Record<string, string>;
  stringSet?: Record<string, string>;
  dateLocale?: Locale;
  profileUrl?: string;
  voiceRecord?: VoiceRecordOptions;
  userListQuery?: UserListQueryType;
  imageCompression?: ImageCompressionOptions;
  allowProfileEdit?: boolean;
  disableMarkAsDelivered?: boolean;
  renderUserProfile?: () => React.ReactElement;
  onUserProfileMessage?: () => void;
}

function Sendbird(props: SendbirdProviderProps) {
  const {
    replyType = 'NONE',
    isMentionEnabled = false,
    isReactionEnabled = true,
    disableUserProfile = false,
    isVoiceMessageEnabled = true,
    isTypingIndicatorEnabledOnChannelList = false,
    isMessageReceiptStatusEnabledOnChannelList = false,
  } = props;

  return (
    <UIKitConfigProvider
      localConfigs={{
        common: {
          enableUsingDefaultUserProfile: !disableUserProfile,
        },
        groupChannel: {
          channel: {
            enableReactions: isReactionEnabled,
            enableMention: isMentionEnabled,
            enableVoiceMessage: isVoiceMessageEnabled,
            /**
             * Since dashbord UIKit Configuration's replyType is consisted of all lowercase letters,
             * we convert it from here.
             * i.e. 'THREAD' -> 'thread'
             */
            replyType: replyType.toLowerCase(),
          },
          channelList: {
            enableTypingIndicator: isTypingIndicatorEnabledOnChannelList,
            enableMessageReceiptStatus: isMessageReceiptStatusEnabledOnChannelList,
          },
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
  accessToken = '',
  customApiHost = '',
  customWebSocketHost = '',
  configureSession = null,
  theme = 'light',
  config = {},
  nickname = '',
  colorSet = null,
  stringSet = null,
  dateLocale = null,
  profileUrl = '',
  voiceRecord = { maxRecordingTime: VOICE_RECORDER_DEFAULT_MAX, minRecordingTime: VOICE_RECORDER_DEFAULT_MIN },
  userListQuery = null,
  imageCompression = {},
  allowProfileEdit = false,
  disableMarkAsDelivered = false,
  renderUserProfile = null,
  onUserProfileMessage = null,
}: SendbirdProviderProps): React.ReactElement => {
  const breakpoint = false;

  const {
    logLevel = '',
    userMention = {},
    isREMUnitEnabled = false,
  } = config;
  const [logger, setLogger] = useState(LoggerFactory(logLevel as LogLevel));
  const [pubSub] = useState(pubSubFactory());
  const [sdkStore, sdkDispatcher] = useReducer(sdkReducers, sdkInitialState);
  const [userStore, userDispatcher] = useReducer(userReducers, userInitialState);

  const { configs, initDashboardConfigs } = useUIKitConfig();

  useTheme(colorSet);

  const reconnect = useConnect({
    appId,
    userId,
    accessToken,
  }, {
    logger,
    nickname,
    profileUrl,
    configureSession,
    customApiHost,
    customWebSocketHost,
    sdk: sdkStore?.sdk,
    sdkDispatcher,
    userDispatcher,
    initDashboardConfigs,
  });

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
  const [currenttheme, setCurrenttheme] = useState(theme);
  useEffect(() => {
    setCurrenttheme(theme);
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
    logger.info('Setup theme', `Theme: ${currenttheme}`);
    try {
      const body = document.querySelector('body');
      body.classList.remove('sendbird-theme--light');
      body.classList.remove('sendbird-theme--dark');
      body.classList.add(`sendbird-theme--${currenttheme || 'light'}`);
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
  }, [currenttheme]);

  const isOnline = useOnlineStatus(sdkStore.sdk, logger);

  const markAsReadScheduler = useMarkAsReadScheduler({ isConnected: isOnline }, { logger });

  const localeStringSet = React.useMemo(() => {
    if (!stringSet) {
      return getStringSet('en');
    }
    return {
      ...getStringSet('en'),
      ...stringSet,
    };
  }, [stringSet]);

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
          theme: currenttheme,
          setCurrenttheme,
          userListQuery,
          logger,
          pubSub,
          imageCompression: {
            compressionRate: 0.7,
            ...imageCompression,
          },
          voiceRecord,
          userMention: {
            maxMentionCount: userMention?.maxMentionCount || 10,
            maxSuggestionCount: userMention?.maxSuggestionCount || 15,
          },
          markAsReadScheduler,
          // From UIKitConfigProvider.localConfigs
          disableUserProfile:
            !configs.common.enableUsingDefaultUserProfile,
          isReactionEnabled:
            configs.groupChannel.channel.enableReactions,
          isMentionEnabled:
            configs.groupChannel.channel.enableMention,
          isVoiceMessageEnabled:
            configs.groupChannel.channel.enableVoiceMessage,
          replyType:
            /**
             * Since UIKitConfigContext's replyType is consisted of all lowercase letters,
             * we need to convert it into all uppercase ones like
             *  - 'thread' -> 'THREAD'
             *  - 'quote_reply' -> 'QUOTE_REPLY'
             */
            configs.groupChannel.channel.replyType.toUpperCase(),
          isTypingIndicatorEnabledOnChannelList:
            configs.groupChannel.channelList.enableTypingIndicator,
          isMessageReceiptStatusEnabledOnChannelList:
            configs.groupChannel.channelList.enableMessageReceiptStatus,
          // TODO(Ahyoung): add more configs from UIKitConfigProvider.remoteConfigs
        },
      }}
    >
      <MediaQueryProvider logger={logger} breakpoint={breakpoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
          <VoiceMessageProvider isVoiceMessageEnabled={configs.groupChannel.channel.enableVoiceMessage}>
            {children}
          </VoiceMessageProvider>
        </LocalizationProvider>
      </MediaQueryProvider>
    </SendbirdSdkContext.Provider>
  );
};

export default Sendbird;
