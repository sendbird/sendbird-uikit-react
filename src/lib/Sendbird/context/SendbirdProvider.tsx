/* External libraries */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useUIKitConfig } from '@sendbird/uikit-tools';

/* Types */
import type { SendbirdProviderProps, SendbirdProviderUtils, SendbirdState } from '../types';

/* Providers */
import VoiceMessageProvider from '../../VoiceMessageProvider';
import { MediaQueryProvider, useMediaQueryContext } from '../../MediaQueryContext';
import { LocalizationProvider } from '../../LocalizationContext';
import { GlobalModalProvider, ModalRoot } from '../../../hooks/useModal';

/* Managers */
import { LoggerFactory, type LogLevel } from '../../Logger';
import pubSubFactory from '../../pubSub';
import { EmojiManager } from '../../emojiManager';
import PUBSUB_TOPICS, { SBUGlobalPubSubTopicPayloadUnion } from '../../pubSub/topics';

/* Hooks */
import useTheme from '../../hooks/useTheme';
import useMessageTemplateUtils from '../../hooks/useMessageTemplateUtils';
import { useUnmount } from '../../../hooks/useUnmount';
import useHTMLTextDirection from '../../../hooks/useHTMLTextDirection';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { useMarkAsReadScheduler } from '../../hooks/useMarkAsReadScheduler';
import { useMarkAsDeliveredScheduler } from '../../hooks/useMarkAsDeliveredScheduler';

/* Utils */
import getStringSet from '../../../ui/Label/stringSet';
import { getCaseResolvedReplyType } from '../../utils/resolvedReplyType';
import { DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, DEFAULT_UPLOAD_SIZE_LIMIT, VOICE_RECORDER_DEFAULT_MAX, VOICE_RECORDER_DEFAULT_MIN } from '../../../utils/consts';
import { EmojiReactionListRoot, MenuRoot } from '../../../ui/ContextMenu';

// TODO: remove
import { createStore } from '../../../utils/storeManager';
import { initialState } from './initialState';
import useSendbird from './hooks/useSendbird';

/**
 * SendbirdContext
 */
export const SendbirdContext = React.createContext<ReturnType<typeof createStore<SendbirdState>> | null>(null);

/**
 * SendbirdContext - Manager
 */
const SendbirdContextManager = ({
  appId,
  userId,
  children,
  accessToken,
  customApiHost,
  customWebSocketHost,
  configureSession,
  theme = 'light',
  config = {},
  nickname = '',
  colorSet,
  stringSet,
  dateLocale,
  profileUrl = '',
  voiceRecord,
  userListQuery,
  imageCompression = {},
  allowProfileEdit = false,
  disableMarkAsDelivered = false,
  renderUserProfile,
  onUserProfileMessage: _onUserProfileMessage,
  onStartDirectMessage: _onStartDirectMessage,
  breakpoint = false,
  isUserIdUsedForNickname = true,
  sdkInitParams,
  customExtensionParams,
  isMultipleFilesMessageEnabled = false,
  eventHandlers,
  htmlTextDirection = 'ltr',
  forceLeftToRightMessageLayout = false,
}: SendbirdProviderProps): React.ReactElement => {
  const onStartDirectMessage = _onStartDirectMessage ?? _onUserProfileMessage;
  const { logLevel = '', userMention = {}, isREMUnitEnabled = false, pubSub: customPubSub } = config;
  const { isMobile } = useMediaQueryContext();
  const [logger, setLogger] = useState(LoggerFactory(logLevel as LogLevel));
  const [pubSub] = useState(() => customPubSub ?? pubSubFactory<PUBSUB_TOPICS, SBUGlobalPubSubTopicPayloadUnion>());

  const { state, actions } = useSendbird();
  const { sdkStore, userStore, appInfoStore } = state.stores;

  const { configs, configsWithAppAttr, initDashboardConfigs } = useUIKitConfig();

  const sdkInitialized = sdkStore.initialized;
  const sdk = sdkStore?.sdk;
  const { uploadSizeLimit, multipleFilesMessageFileCountLimit } = sdk?.appInfo ?? {};

  useTheme(colorSet);

  const { getCachedTemplate, updateMessageTemplatesInfo, initializeMessageTemplatesInfo } = useMessageTemplateUtils({
    sdk,
    logger,
    appInfoStore,
    actions,
  });

  const utils: SendbirdProviderUtils = {
    updateMessageTemplatesInfo,
    getCachedTemplate,
  };

  // Reconnect when necessary
  useEffect(() => {
    if (sdkStore.sdk) {
      actions.connect({
        appId,
        userId,
        accessToken,
        isUserIdUsedForNickname,
        isMobile,
        logger,
        nickname,
        profileUrl,
        configureSession,
        customApiHost,
        customWebSocketHost,
        sdkInitParams,
        customExtensionParams,
        initDashboardConfigs,
        eventHandlers,
        initializeMessageTemplatesInfo,
      });
    }
  }, [appId, userId]);

  // Disconnect on unmount
  useUnmount(() => {
    actions.disconnect({ logger });
  });

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

  useHTMLTextDirection(htmlTextDirection);

  const isOnline = useOnlineStatus(sdkStore.sdk, logger);

  const markAsReadScheduler = useMarkAsReadScheduler({ isConnected: isOnline }, { logger });
  const markAsDeliveredScheduler = useMarkAsDeliveredScheduler({ isConnected: isOnline }, { logger });

  const localeStringSet = React.useMemo(() => {
    return { ...getStringSet('en'), ...stringSet };
  }, [stringSet]);

  /**
   * Feature Configuration - TODO
   * This will be moved into the UIKitConfigProvider, aftering Dashboard applies
   */
  const uikitMultipleFilesMessageLimit = useMemo(() => {
    return Math.min(DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, multipleFilesMessageFileCountLimit ?? Number.MAX_SAFE_INTEGER);
  }, [multipleFilesMessageFileCountLimit]);

  // Emoji Manager
  const emojiManager = useMemo(() => {
    return new EmojiManager({
      sdk,
      logger,
    });
  }, [sdkStore.initialized]);

  return (
    <SendbirdContext.Provider
      value={{
        stores: state.stores,
        actions,
        // dispatchers: {
        //   sdkDispatcher,
        //   userDispatcher,
        //   appInfoDispatcher,
        //   reconnect, -> actions.connect
        // },
        config: {
          disableMarkAsDelivered,
          renderUserProfile,
          onStartDirectMessage,
          onUserProfileMessage: onStartDirectMessage, // legacy of onStartDirectMessage
          allowProfileEdit,
          isOnline,
          userId,
          appId,
          accessToken,
          theme: currentTheme,
          setCurrentTheme,
          setCurrenttheme: setCurrentTheme, // deprecated: typo
          isMultipleFilesMessageEnabled,
          uikitUploadSizeLimit: uploadSizeLimit ?? DEFAULT_UPLOAD_SIZE_LIMIT,
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
            enableMarkdownForUserMessage: configs.groupChannel.channel.enableMarkdownForUserMessage,
            enableFormTypeMessage: configs.groupChannel.channel.enableFormTypeMessage,
            enableReactionsSupergroup: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactionsSupergroup as never,
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
          htmlTextDirection,
          forceLeftToRightMessageLayout,
        },
        eventHandlers,
        emojiManager,
        utils,
      }}
    >
      <MediaQueryProvider logger={logger} breakpoint={breakpoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
          <VoiceMessageProvider>
            <GlobalModalProvider>{children}</GlobalModalProvider>
          </VoiceMessageProvider>
        </LocalizationProvider>
      </MediaQueryProvider>
      {/* Roots */}
      <EmojiReactionListRoot />
      <ModalRoot />
      <MenuRoot />
    </SendbirdContext.Provider>
  );
};

const createSendbirdContextStore = () => createStore(initialState);
export const SendbirdContextProvider = (props: SendbirdProviderProps) => {
  const { children } = props;
  const storeRef = useRef(createSendbirdContextStore());

  return (
    <SendbirdContext.Provider value={storeRef.current}>
      <SendbirdContextManager {...props}>
        {children}
      </SendbirdContextManager>
    </SendbirdContext.Provider>
  );
};

export default SendbirdContextProvider;
