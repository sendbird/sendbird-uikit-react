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

import { UIKitConfigProvider } from './UIKitConfigProvider';
import { VoiceMessageProvider } from './VoiceMessageProvider';
import { LocalizationProvider } from './LocalizationContext';
import { MediaQueryProvider } from './MediaQueryContext';
import getStringSet from '../ui/Label/stringSet';
import { VOICE_RECORDER_DEFAULT_MAX, VOICE_RECORDER_DEFAULT_MIN } from '../utils/consts';
import { useMarkAsReadScheduler } from './hooks/useMarkAsReadScheduler';
import { useMarkAsDeliveredScheduler } from './hooks/useMarkAsDeliveredScheduler';
import { ConfigureSessionTypes } from './hooks/useConnect/types';
import { getIsReactionEnabled } from '../utils/getIsReactionEnabled';

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

export interface SendbirdProviderProps {
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
  replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
  dateLocale?: Locale;
  profileUrl?: string;
  voiceRecord?: VoiceRecordOptions;
  userListQuery?: UserListQueryType;
  imageCompression?: ImageCompressionOptions;
  allowProfileEdit?: boolean;
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  disableUserProfile?: boolean;
  isVoiceMessageEnabled?: boolean;
  disableMarkAsDelivered?: boolean;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  renderUserProfile?: () => React.ReactElement;
  onUserProfileMessage?: () => void;
}

const Sendbird = ({
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
  replyType = 'NONE',
  dateLocale = null,
  profileUrl = '',
  voiceRecord = { maxRecordingTime: VOICE_RECORDER_DEFAULT_MAX, minRecordingTime: VOICE_RECORDER_DEFAULT_MIN },
  userListQuery = null,
  imageCompression = {},
  allowProfileEdit = false,
  isMentionEnabled = false,
  isReactionEnabled = true,
  disableUserProfile = false,
  isVoiceMessageEnabled = true,
  disableMarkAsDelivered = false,
  isTypingIndicatorEnabledOnChannelList = false,
  isMessageReceiptStatusEnabledOnChannelList = false,
  renderUserProfile = null,
  onUserProfileMessage = null,
}: SendbirdProviderProps): React.ReactElement => {
  const mediaQueryBreakPoint = false;

  const {
    logLevel = '',
    userMention = {},
    isREMUnitEnabled = false,
  } = config;
  const [logger, setLogger] = useState(LoggerFactory(logLevel as LogLevel));
  const [pubSub] = useState(pubSubFactory());
  const [sdkStore, sdkDispatcher] = useReducer(sdkReducers, sdkInitialState);
  const [userStore, userDispatcher] = useReducer(userReducers, userInitialState);

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

  const uikitConfigurations = {
    // common.enable_using_default_user_profile
    disableUserProfile,
    // group_channel.enable_reactions
    isReactionEnabled: getIsReactionEnabled({
      appLevel: sdkStore?.sdk?.appInfo?.useReaction,
      globalLevel: isReactionEnabled,
    }),
    // group_channel.enable_mention
    isMentionEnabled: isMentionEnabled || false,
    // group_channel.enable_voice_message
    isVoiceMessageEnabled,
    // group_channel.reply_type
    replyType,
    // group_channel_list.enable_typing_indicator
    isTypingIndicatorEnabledOnChannelList,
    // group_channel_list.enable_message_receipt_status
    isMessageReceiptStatusEnabledOnChannelList,
  };
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
          markAsDeliveredScheduler,
          ...uikitConfigurations,
        },
      }}
    >
    <UIKitConfigProvider
      appConfigurations={{
        common: {
          enableUsingDefaultUserProfile: !uikitConfigurations.disableUserProfile,
        },
        groupChannel: {
          channel: {
            enableReactions: uikitConfigurations.isReactionEnabled,
            enableMention: uikitConfigurations.isMentionEnabled,
            enableVoiceMessage: uikitConfigurations.isVoiceMessageEnabled,
            /**
             * Since dashbord UIKit Configuration's replyType is consisted of all lowercase letters,
             * we convert it from here.
             * i.e. 'THREAD' -> 'thread'
             */
            replyType: uikitConfigurations.replyType.toLowerCase(),
          },
          channelList: {
            enableTypingIndicator: uikitConfigurations.isTypingIndicatorEnabledOnChannelList,
            enableMessageReceiptStatus: uikitConfigurations.isMessageReceiptStatusEnabledOnChannelList,
          },
        },
      }}
    >
      <MediaQueryProvider logger={logger} mediaQueryBreakPoint={mediaQueryBreakPoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
          <VoiceMessageProvider isVoiceMessageEnabled={isVoiceMessageEnabled}>
            {children}
          </VoiceMessageProvider>
        </LocalizationProvider>
      </MediaQueryProvider>
      </UIKitConfigProvider>
    </SendbirdSdkContext.Provider>
  );
};

export default Sendbird;
