/* External libraries */
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useUIKitConfig } from '@sendbird/uikit-tools';

/* Types */
import {
  ImageCompressionOptions,
  Logger,
  SendbirdProviderProps,
  SendbirdState,
  SendbirdStateConfig,
} from '../types';

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

import useSendbird from './hooks/useSendbird';
import { createSendbirdContextStore, SendbirdContext, useSendbirdStore } from './SendbirdContext';
import useDeepCompareEffect from '../../../hooks/useDeepCompareEffect';
import { deleteNullish } from '../../../utils/utils';
import { TwoDepthPartial } from '../../../utils/typeHelpers/partialDeep';

/**
 * SendbirdContext - Manager
 */
const SendbirdContextManager = ({
  appId,
  userId,
  accessToken,
  customApiHost,
  customWebSocketHost,
  configureSession,
  theme = 'light',
  logger,
  config = {},
  nickname = '',
  colorSet,
  profileUrl = '',
  voiceRecord,
  userListQuery,
  imageCompression = {},
  allowProfileEdit = false,
  disableMarkAsDelivered = false,
  renderUserProfile,
  onUserProfileMessage: _onUserProfileMessage,
  onStartDirectMessage: _onStartDirectMessage,
  isUserIdUsedForNickname = true,
  sdkInitParams,
  customExtensionParams,
  isMultipleFilesMessageEnabled = false,
  autoscrollMessageOverflowToTop = false,
  eventHandlers,
  htmlTextDirection = 'ltr',
  forceLeftToRightMessageLayout = false,
}: SendbirdProviderProps & { logger: Logger }): ReactElement => {
  const onStartDirectMessage = _onStartDirectMessage ?? _onUserProfileMessage;
  const { userMention = {}, isREMUnitEnabled = false, pubSub: customPubSub } = config;
  const { isMobile } = useMediaQueryContext();
  const [pubSub] = useState(customPubSub ?? pubSubFactory<PUBSUB_TOPICS, SBUGlobalPubSubTopicPayloadUnion>());

  const { state, updateState } = useSendbirdStore();
  const { actions } = useSendbird();
  const { sdkStore, appInfoStore } = state.stores;

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

  // Reconnect when necessary
  useEffect(() => {
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
  }, [appId, userId]);

  // Disconnect on unmount
  useUnmount(() => {
    actions.disconnect({ logger });
  });

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

  /**
   * Feature Configuration - TODO
   * This will be moved into the UIKitConfigProvider, aftering Dashboard applies
   */
  const uikitMultipleFilesMessageLimit = useMemo(() => {
    return Math.min(DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, multipleFilesMessageFileCountLimit ?? Number.MAX_SAFE_INTEGER);
  }, [multipleFilesMessageFileCountLimit]);

  // Emoji Manager
  const emojiManager = useMemo(() => {
    if (sdkStore.initialized) {
      return new EmojiManager({
        sdk,
        logger,
      });
    }

    return undefined;
  }, [sdkStore.initialized]);

  const uikitConfigs = useMemo(() => ({
    common: {
      enableUsingDefaultUserProfile: configs.common.enableUsingDefaultUserProfile,
    },
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
      // Force-disable feedback regardless of dashboard/app configs.
      enableFeedback: false,
      enableSuggestedReplies: configs.groupChannel.channel.enableSuggestedReplies,
      showSuggestedRepliesFor: configs.groupChannel.channel.showSuggestedRepliesFor,
      suggestedRepliesDirection: configs.groupChannel.channel.suggestedRepliesDirection,
      enableMarkdownForUserMessage: configs.groupChannel.channel.enableMarkdownForUserMessage,
      enableFormTypeMessage: configs.groupChannel.channel.enableFormTypeMessage,
      enableMarkAsUnread: configs.groupChannel.channel.enableMarkAsUnread,
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
  }), [
    sdkInitialized,
    configs.common,
    configs.groupChannel.channel,
    configs.groupChannel.channelList,
    configs.groupChannel.setting,
    configs.openChannel.channel,
  ]);
  const uikitUploadSizeLimit = useMemo(() => (uploadSizeLimit ?? DEFAULT_UPLOAD_SIZE_LIMIT), [uploadSizeLimit, DEFAULT_UPLOAD_SIZE_LIMIT]);
  const configImageCompression = useMemo<ImageCompressionOptions>(() => ({
    compressionRate: 0.7,
    outputFormat: 'preserve',
    ...imageCompression,
  }), [imageCompression]);
  const configVoiceRecord = useMemo(() => ({
    maxRecordingTime: voiceRecord?.maxRecordingTime ?? VOICE_RECORDER_DEFAULT_MAX,
    minRecordingTime: voiceRecord?.minRecordingTime ?? VOICE_RECORDER_DEFAULT_MIN,
  }), [
    voiceRecord?.maxRecordingTime,
    voiceRecord?.minRecordingTime,
  ]);
  const configUserMention = useMemo(() => ({
    maxMentionCount: userMention?.maxMentionCount || 10,
    maxSuggestionCount: userMention?.maxSuggestionCount || 15,
  }), [
    userMention?.maxMentionCount,
    userMention?.maxSuggestionCount,
  ]);
  const deprecatedConfigs = useMemo(() => ({
    disableUserProfile: !configs.common.enableUsingDefaultUserProfile,
    isReactionEnabled: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
    isMentionEnabled: configs.groupChannel.channel.enableMention,
    isVoiceMessageEnabled: configs.groupChannel.channel.enableVoiceMessage,
    replyType: getCaseResolvedReplyType(configs.groupChannel.channel.replyType).upperCase,
    isTypingIndicatorEnabledOnChannelList: configs.groupChannel.channelList.enableTypingIndicator,
    isMessageReceiptStatusEnabledOnChannelList: configs.groupChannel.channelList.enableMessageReceiptStatus,
    showSearchIcon: sdkInitialized && configsWithAppAttr(sdk).groupChannel.setting.enableMessageSearch,
  }), [
    sdkInitialized,
    configsWithAppAttr,
    configs.common.enableUsingDefaultUserProfile,
    configs.groupChannel.channel.enableReactions,
    configs.groupChannel.channel.enableMention,
    configs.groupChannel.channel.enableVoiceMessage,
    configs.groupChannel.channel.replyType,
    configs.groupChannel.channelList.enableTypingIndicator,
    configs.groupChannel.channelList.enableMessageReceiptStatus,
    configs.groupChannel.setting.enableMessageSearch,
  ]);
  const configState = useMemo<Record<string, SendbirdStateConfig>>(() => ({
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
      autoscrollMessageOverflowToTop,
      uikitMultipleFilesMessageLimit,
      logger,
      pubSub,
      userListQuery,
      htmlTextDirection,
      forceLeftToRightMessageLayout,
      markAsReadScheduler,
      markAsDeliveredScheduler,
      uikitUploadSizeLimit,
      imageCompression: configImageCompression,
      voiceRecord: configVoiceRecord,
      userMention: configUserMention,
      // Remote configs set from dashboard by UIKit feature configuration
      ...uikitConfigs,
      ...deprecatedConfigs,
    },
  }), [
    disableMarkAsDelivered,
    renderUserProfile,
    onStartDirectMessage,
    allowProfileEdit,
    isOnline,
    userId,
    appId,
    accessToken,
    currentTheme,
    setCurrentTheme,
    isMultipleFilesMessageEnabled,
    autoscrollMessageOverflowToTop,
    uikitMultipleFilesMessageLimit,
    logger,
    pubSub,
    userListQuery,
    htmlTextDirection,
    forceLeftToRightMessageLayout,
    markAsReadScheduler,
    markAsDeliveredScheduler,
    uikitUploadSizeLimit,
    configImageCompression,
    configVoiceRecord,
    configUserMention,
    uikitConfigs,
    deprecatedConfigs,
  ]);
  const utilsState = useMemo(() => ({
    utils: {
      updateMessageTemplatesInfo,
      getCachedTemplate,
    },
  }), [
    updateMessageTemplatesInfo,
    getCachedTemplate,
  ]);

  useDeepCompareEffect(() => {
    updateState({
      ...utilsState,
      ...configState,
      eventHandlers,
      emojiManager,
    });
  }, [
    configState,
    eventHandlers,
    emojiManager,
    utilsState,
  ]);

  return null;
};

const InternalSendbirdProvider = (props: SendbirdProviderProps & { logger: Logger }) => {
  const {
    children,
    stringSet,
    breakpoint,
    dateLocale,
  } = props;

  const defaultProps: TwoDepthPartial<SendbirdState> = deleteNullish({
    config: {
      renderUserProfile: props?.renderUserProfile,
      onStartDirectMessage: props?.onStartDirectMessage,
      allowProfileEdit: props?.allowProfileEdit,
      appId: props?.appId,
      userId: props?.userId,
      accessToken: props?.accessToken,
      theme: props?.theme,
      htmlTextDirection: props?.htmlTextDirection,
      forceLeftToRightMessageLayout: props?.forceLeftToRightMessageLayout,
      pubSub: props?.config?.pubSub,
      logger: props?.logger,
      userListQuery: props?.userListQuery,
      voiceRecord: {
        maxRecordingTime: props?.voiceRecord?.maxRecordingTime ?? VOICE_RECORDER_DEFAULT_MAX,
        minRecordingTime: props?.voiceRecord?.minRecordingTime ?? VOICE_RECORDER_DEFAULT_MIN,
      },
      userMention: {
        maxMentionCount: props?.config?.userMention?.maxMentionCount || 10,
        maxSuggestionCount: props?.config?.userMention?.maxSuggestionCount || 15,
      },
      imageCompression: {
        compressionRate: 0.7,
        outputFormat: 'preserve',
        ...props?.imageCompression,
      },
      disableMarkAsDelivered: props?.disableMarkAsDelivered,
      isMultipleFilesMessageEnabled: props?.isMultipleFilesMessageEnabled,
      autoscrollMessageOverflowToTop: props?.autoscrollMessageOverflowToTop,
    },
    eventHandlers: props?.eventHandlers,
  });

  const storeRef = useRef(createSendbirdContextStore(defaultProps));

  const localeStringSet = useMemo(() => {
    return { ...getStringSet('en'), ...stringSet };
  }, [stringSet]);

  return (
    <SendbirdContext.Provider value={storeRef.current}>
      <MediaQueryProvider logger={storeRef.current.getState().config.logger} breakpoint={breakpoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
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
    </SendbirdContext.Provider>
  );
};

export const SendbirdContextProvider = (props: SendbirdProviderProps) => {
  const { children, config } = props;
  const logLevel = config?.logLevel;

  const [logger, setLogger] = useState(LoggerFactory(logLevel as LogLevel));

  // to create a pubsub to communicate between parent and child
  useEffect(() => {
    setLogger(LoggerFactory(logLevel as LogLevel));
  }, [logLevel]);

  return (
    <InternalSendbirdProvider {...props} logger={logger} >
      <SendbirdContextManager {...props} logger={logger} />
      {children}
    </InternalSendbirdProvider>
  );
};

export default SendbirdContextProvider;
