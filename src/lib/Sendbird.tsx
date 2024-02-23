import './index.scss';
import './__experimental__typography.scss';

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import SendbirdChat, { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UIKitConfigProvider, useUIKitConfig } from '@sendbird/uikit-tools';

import { SendbirdSdkContext } from './SendbirdSdkContext';

import useTheme from './hooks/useTheme';

import sdkReducers from './dux/sdk/reducers';
import userReducers from './dux/user/reducers';
import appInfoReducers from './dux/appInfo/reducers';

import sdkInitialState from './dux/sdk/initialState';
import userInitialState from './dux/user/initialState';
import appInfoInitialState, { MessageTemplatesInfo, ProcessedMessageTemplate } from './dux/appInfo/initialState';

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
  SBUEventHandlers, SendbirdProviderUtils,
} from './types';
import { GlobalModalProvider } from '../hooks/useModal';
import { RenderUserProfileProps } from '../types';
import PUBSUB_TOPICS, { SBUGlobalPubSub, SBUGlobalPubSubTopicPayloadUnion } from './pubSub/topics';
import { EmojiManager } from './emojiManager';
import { uikitConfigStorage } from './utils/uikitConfigStorage';
import { APP_INFO_ACTIONS } from './dux/appInfo/actionTypes';
import { SendbirdMessageTemplate } from '../ui/TemplateMessageItemBody/types';
import {
  getProcessedTemplate,
  getProcessedTemplates,
} from './dux/appInfo/utils';
import { CACHED_MESSAGE_TEMPLATES_KEY, CACHED_MESSAGE_TEMPLATES_TOKEN_KEY } from '../modules/App/types';

import { MessageTemplate, MessageTemplateListResult } from '@sendbird/chat/lib/__definition';

const MESSAGE_TEMPLATES_FETCH_LIMIT = 20;
const TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES = 150;

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
  const [appInfoStore, appInfoDispatcher] = useReducer(appInfoReducers, appInfoInitialState);

  const { configs, configsWithAppAttr, initDashboardConfigs } = useUIKitConfig();
  const sdkInitialized = sdkStore.initialized;
  const sdk = sdkStore?.sdk;
  const {
    uploadSizeLimit,
    multipleFilesMessageFileCountLimit,
  } = sdk?.appInfo ?? {};

  const messageTemplatesInfo: MessageTemplatesInfo | undefined = appInfoStore?.messageTemplatesInfo;
  const {
    INITIALIZE_MESSAGE_TEMPLATES_INFO,
    UPSERT_MESSAGE_TEMPLATE,
    UPSERT_WAITING_TEMPLATE_KEY,
  } = APP_INFO_ACTIONS;

  useTheme(colorSet);

  const getCachedTemplate = (key: string): ProcessedMessageTemplate | null => {
    if (!messageTemplatesInfo) return null;

    let cachedTemplate: ProcessedMessageTemplate | null = null;
    const cachedMessageTemplates: Record<string, ProcessedMessageTemplate> | null = messageTemplatesInfo?.templatesMap ?? null;
    if (cachedMessageTemplates) {
      cachedTemplate = cachedMessageTemplates[key] ?? null;
    }
    return cachedTemplate;
  };

  /**
   * Fetches a single message template by given key and then
   * returns processed template for updating templates info in global state.
   * WARNING: If no such templates exists or any error occurs in response, return null.
   */
  const fetchProcessedMessageTemplate = async (
    key: string,
  ): Promise<ProcessedMessageTemplate | null> => {
    try {
      const newTemplate: MessageTemplate = await sdk.message.getMessageTemplate(key);
      const parsedTemplate: SendbirdMessageTemplate = JSON.parse(newTemplate.template);
      return getProcessedTemplate(parsedTemplate);
    } catch (e) {
      logger?.error?.('Sendbird | fetchProcessedMessageTemplate failed', e);
      return null;
    }
  };

  const fetchAllMessageTemplates = async (readySdk: SendbirdChat): Promise<SendbirdMessageTemplate[]> => {
    let hasMore = true;
    let paginationToken = null;
    const fetchedTemplates: SendbirdMessageTemplate[] = [];

    while (hasMore) {
      /**
       * RFC doc:
       * https://sendbird.atlassian.net/wiki/spaces/PLAT/pages/2254405651/RFC+Message+Template#%5BAPI%5D-List-message-templates
       */
      const res: MessageTemplateListResult = await readySdk!.message.getMessageTemplatesByToken(
        paginationToken,
        { limit: MESSAGE_TEMPLATES_FETCH_LIMIT },
      );
      hasMore = res.hasMore;
      paginationToken = res.token;
      res.templates.forEach((messageTemplate) => {
        fetchedTemplates.push(JSON.parse(messageTemplate.template));
      });
    }
    return fetchedTemplates;
  };

  const initializeMessageTemplatesInfo = async (readySdk: SendbirdChat): Promise<void> => {
    const sdkMessageTemplateToken = readySdk!.appInfo?.messageTemplateInfo.token;

    /**
     * no sdkMessageTemplateToken => no templates => clear cached
     */
    if (!sdkMessageTemplateToken) {
      localStorage.removeItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY);
      localStorage.removeItem(CACHED_MESSAGE_TEMPLATES_KEY);
      return;
    }
    /**
     * Given the following cases:
     * 1. non-null sdkMessageTemplateToken => templates exist
     * 2. no cached token or cached token is outdated => first fetch or outdated cache
     *
     * If both 1 and 2, fetch all templates and upsert to cache.
     * If cached token is not outdated, use cached templates.
     */
    const cachedMessageTemplatesToken: string | null = localStorage.getItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY);
    const cachedMessageTemplates: string | null = localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY);
    if (
      !cachedMessageTemplatesToken
      || cachedMessageTemplatesToken !== sdkMessageTemplateToken!
    ) {
      const parsedTemplates: SendbirdMessageTemplate[] = await fetchAllMessageTemplates(readySdk);
      const newMessageTemplatesInfo: MessageTemplatesInfo = {
        token: sdkMessageTemplateToken,
        templatesMap: getProcessedTemplates(parsedTemplates),
      };
      appInfoDispatcher({ type: INITIALIZE_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
      localStorage.setItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY, JSON.stringify(sdkMessageTemplateToken));
      localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify(parsedTemplates));
    } else if (
      cachedMessageTemplatesToken
      && cachedMessageTemplatesToken === sdkMessageTemplateToken
      && cachedMessageTemplates
    ) {
      const parsedTemplates: SendbirdMessageTemplate[] = JSON.parse(cachedMessageTemplates);
      const newMessageTemplatesInfo: MessageTemplatesInfo = {
        token: sdkMessageTemplateToken,
        templatesMap: getProcessedTemplates(parsedTemplates),
      };
      appInfoDispatcher({ type: INITIALIZE_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
    }
  };

  /**
   * If given message is a template message with template key and if the key does not exist in the cache,
   * update the cache by fetching the template.
   */
  const updateMessageTemplatesInfo = async (templateKey: string, requestedAt: number): Promise<void> => {
    const keyPreviouslyWaitedTimestamp: number | undefined = appInfoStore!.waitingTemplateKeysMap[templateKey];
    if (
      (
        !keyPreviouslyWaitedTimestamp
        || requestedAt > keyPreviouslyWaitedTimestamp + TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES
      ) && appInfoDispatcher
    ) {
      appInfoDispatcher({
        type: UPSERT_WAITING_TEMPLATE_KEY,
        payload: {
          key: templateKey,
          requestedAt,
        },
      });
      const processedTemplate: ProcessedMessageTemplate | null = await fetchProcessedMessageTemplate(templateKey);
      if (processedTemplate) {
        appInfoDispatcher({
          type: UPSERT_MESSAGE_TEMPLATE,
          payload: {
            key: templateKey,
            template: processedTemplate,
          },
        });
      }
    }
  };

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
    configureSession,
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
            enableOgtag: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableOgtag,
            enableTypingIndicator: configs.groupChannel.channel.enableTypingIndicator,
            enableDocument: configs.groupChannel.channel.input.enableDocument,
            enableReactions: sdkInitialized && configsWithAppAttr(sdk).groupChannel.channel.enableReactions,
            replyType: configs.groupChannel.channel.replyType,
            threadReplySelectType: getCaseResolvedThreadReplySelectType(configs.groupChannel.channel.threadReplySelectType).lowerCase,
            typingIndicatorTypes: configs.groupChannel.channel.typingIndicatorTypes,
            enableFeedback: configs.groupChannel.channel.enableFeedback,
            enableSuggestedReplies: configs.groupChannel.channel.enableSuggestedReplies,
          },
          openChannel: {
            enableOgtag:
              sdkInitialized && configsWithAppAttr(sdk).openChannel.channel.enableOgtag,
            enableDocument: configs.openChannel.channel.input.enableDocument,
          },
        },
        eventHandlers,
        emojiManager,
        utils,
      }}
    >
      <MediaQueryProvider logger={logger} breakpoint={breakpoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
          <VoiceMessageProvider>
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
