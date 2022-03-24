import './index.scss';

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
import getStringSet from '../ui/Label/stringSet';

export default function Sendbird(props) {
  const {
    userId,
    dateLocale,
    appId,
    accessToken,
    children,
    disableUserProfile,
    renderUserProfile,
    allowProfileEdit,
    theme,
    nickname,
    profileUrl,
    userListQuery,
    config = {},
    colorSet,
    stringSet,
    imageCompression,
    useReaction,
  } = props;

  const {
    logLevel = '',
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
          renderUserProfile,
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
          imageCompression,
          useReaction,
        },
      }}
    >
      <LocalizationProvider stringSet={localeStringSet} dateLocale={dateLocale}>
        {children}
      </LocalizationProvider>
    </SendbirdSdkContext.Provider>
  );
}

Sendbird.propTypes = {
  userId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  accessToken: PropTypes.string,
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
  renderUserProfile: PropTypes.func,
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
  }),
  stringSet: PropTypes.objectOf(PropTypes.string),
  colorSet: PropTypes.objectOf(PropTypes.string),
  useReaction: PropTypes.bool,
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
};

Sendbird.defaultProps = {
  accessToken: '',
  theme: 'light',
  nickname: '',
  dateLocale: null,
  profileUrl: '',
  disableUserProfile: false,
  renderUserProfile: null,
  allowProfileEdit: false,
  userListQuery: null,
  config: {},
  stringSet: null,
  colorSet: null,
  imageCompression: {},
  useReaction: true,
};
