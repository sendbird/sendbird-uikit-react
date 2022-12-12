import './index.scss';
import './__experimental__typography.scss';

import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';

import { SendbirdSdkContext } from './SendbirdSdkContext';
import { handleConnection } from './dux/sdk/thunks';

import useTheme from './hooks/useTheme';

import sdkReducers from './dux/sdk/reducers';
import userReducers from './dux/user/reducers';
import sdkInitialState from './dux/sdk/initialState';
import userInitialState from './dux/user/initialState';

import useOnlineStatus from './hooks/useOnlineStatus';

import { LoggerFactory } from './Logger';
import pubSubFactory from './pubSub/index';
import useAppendDomNode from '../hooks/useAppendDomNode';

import { LocalizationProvider } from './LocalizationContext';
import { MediaQueryProvider } from './MediaQueryContext';
import getStringSet from '../ui/Label/stringSet';

export default function Sendbird(props) {
  const {
    userId,
    dateLocale,
    appId,
    accessToken,
    configureSession,
    // mediaQueryBreakPoint,
    customApiHost,
    customWebSocketHost,
    children,
    disableUserProfile,
    disableMarkAsDelivered,
    renderUserProfile,
    onUserProfileMessage,
    allowProfileEdit,
    theme,
    nickname,
    profileUrl,
    userListQuery,
    config = {},
    colorSet,
    stringSet,
    imageCompression,
    isReactionEnabled,
    isMentionEnabled,
    isTypingIndicatorEnabledOnChannelList,
    isMessageReceiptStatusEnabledOnChannelList,
    replyType,
  } = props;

  const mediaQueryBreakPoint = false;

  const {
    logLevel = '',
    userMention = {},
    isREMUnitEnabled = false,
  } = config;
  const [logger, setLogger] = useState(LoggerFactory(logLevel));
  const [pubSub, setPubSub] = useState();
  const [sdkStore, sdkDispatcher] = useReducer(sdkReducers, sdkInitialState);
  const [userStore, userDispatcher] = useReducer(userReducers, userInitialState);

  useTheme(colorSet);

  useEffect(() => {
    setPubSub(pubSubFactory());
  }, []);

  useEffect(() => {
    logger.info('App Init');
    // dispatch action
    handleConnection({
      userId,
      appId,
      accessToken,
      sdkStore,
      nickname,
      profileUrl,
      configureSession,
      customApiHost,
      customWebSocketHost,
      sdk: sdkStore.sdk,
      logger,
    }, {
      sdkDispatcher,
      userDispatcher,
    });
  }, [userId, appId, accessToken]);

  // to create a pubsub to communicate between parent and child
  useEffect(() => {
    setLogger(LoggerFactory(logLevel));
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
          reconnect: () => {
            handleConnection({
              userId,
              appId,
              accessToken,
              sdkStore,
              nickname,
              profileUrl,
              logger,
              sdk: sdkStore.sdk,
            }, {
              sdkDispatcher,
              userDispatcher,
            });
          },
        },
        config: {
          disableUserProfile,
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
          isReactionEnabled,
          isMentionEnabled: isMentionEnabled || false,
          userMention: {
            maxMentionCount: userMention?.maxMentionCount || 10,
            maxSuggestionCount: userMention?.maxSuggestionCount || 15,
          },
          isTypingIndicatorEnabledOnChannelList,
          isMessageReceiptStatusEnabledOnChannelList,
          replyType,
        },
      }}
    >
      <MediaQueryProvider logger={logger} mediaQueryBreakPoint={mediaQueryBreakPoint}>
        <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
          {children}
        </LocalizationProvider>
      </MediaQueryProvider>
    </SendbirdSdkContext.Provider>
  );
}

Sendbird.propTypes = {
  userId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  accessToken: PropTypes.string,
  customApiHost: PropTypes.string,
  customWebSocketHost: PropTypes.string,
  // mediaQueryBreakPoint: PropTypes.string,
  configureSession: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.any,
  ]).isRequired,
  theme: PropTypes.string,
  nickname: PropTypes.string,
  dateLocale: PropTypes.shape({}),
  profileUrl: PropTypes.string,
  disableUserProfile: PropTypes.bool,
  disableMarkAsDelivered: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  onUserProfileMessage: PropTypes.func,
  allowProfileEdit: PropTypes.bool,
  userListQuery: PropTypes.func,
  config: PropTypes.shape({
    // None Error Warning Info 'All/Debug'
    logLevel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    pubSub: PropTypes.shape({
      subscribe: PropTypes.func,
      publish: PropTypes.func,
    }),
    userMention: PropTypes.shape({
      maxMentionCount: PropTypes.number,
      maxSuggestionCount: PropTypes.number,
    }),
    isREMUnitEnabled: PropTypes.bool,
  }),
  stringSet: PropTypes.objectOf(PropTypes.string),
  colorSet: PropTypes.objectOf(PropTypes.string),
  isReactionEnabled: PropTypes.bool,
  isMentionEnabled: PropTypes.bool,
  imageCompression: PropTypes.shape({
    compressionRate: PropTypes.number,
    resizingWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    resizingHeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  isTypingIndicatorEnabledOnChannelList: PropTypes.bool,
  isMessageReceiptStatusEnabledOnChannelList: PropTypes.bool,
  replyType: PropTypes.oneOf(['NONE', 'QUOTE_REPLY', 'THREAD']),
};

Sendbird.defaultProps = {
  accessToken: '',
  customApiHost: null,
  customWebSocketHost: null,
  configureSession: null,
  theme: 'light',
  // mediaQueryBreakPoint: null,
  nickname: '',
  dateLocale: null,
  profileUrl: '',
  disableUserProfile: false,
  disableMarkAsDelivered: false,
  renderUserProfile: null,
  onUserProfileMessage: null,
  allowProfileEdit: false,
  userListQuery: null,
  config: {},
  stringSet: null,
  colorSet: null,
  imageCompression: {},
  isReactionEnabled: true,
  isMentionEnabled: false,
  isTypingIndicatorEnabledOnChannelList: false,
  isMessageReceiptStatusEnabledOnChannelList: false,
  replyType: 'NONE',
};
