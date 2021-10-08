import { _ as __assign, a as _objectSpread2, b as _slicedToArray, u as uuidv4, g as getStringSet, S as SendbirdSdkContext, L as LocalizationProvider } from './LocalizationContext-67c61679.js';
import React__default, { useLayoutEffect, useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import Sb from 'sendbird';
import { R as RESET_USER, I as INIT_USER, U as UPDATE_USER_INFO } from './actionTypes-5adc8175.js';
import cssVars from 'css-vars-ponyfill';

var INIT_SDK = 'INIT_SDK';
var SET_SDK_LOADING = 'SET_SDK_LOADING';
var RESET_SDK = 'RESET_SDK';
var SDK_ERROR = 'SDK_ERROR';

var APP_VERSION_STRING = '2.4.1';
var disconnectSdk = function disconnectSdk(_ref) {
  var sdkDispatcher = _ref.sdkDispatcher,
      userDispatcher = _ref.userDispatcher,
      sdk = _ref.sdk,
      onDisconnect = _ref.onDisconnect;
  sdkDispatcher({
    type: SET_SDK_LOADING,
    payload: true
  });

  if (sdk && sdk.disconnect) {
    sdk.disconnect().then(function () {
      sdkDispatcher({
        type: RESET_SDK
      });
      userDispatcher({
        type: RESET_USER
      });
    }).finally(function () {
      onDisconnect();
    });
  } else {
    onDisconnect();
  }
};
var handleConnection = function handleConnection(_ref2, dispatchers) {
  var userId = _ref2.userId,
      appId = _ref2.appId,
      nickname = _ref2.nickname,
      profileUrl = _ref2.profileUrl,
      accessToken = _ref2.accessToken,
      sdk = _ref2.sdk,
      logger = _ref2.logger;
  var sdkDispatcher = dispatchers.sdkDispatcher,
      userDispatcher = dispatchers.userDispatcher;
  disconnectSdk({
    sdkDispatcher: sdkDispatcher,
    userDispatcher: userDispatcher,
    sdk: sdk,
    logger: logger,
    onDisconnect: function onDisconnect() {
      logger.info('Setup connection');
      sdkDispatcher({
        type: SET_SDK_LOADING,
        payload: true
      });

      if (userId && appId) {
        var newSdk = new Sb({
          appId: appId
        }); // to check if code is released version from rollup and *not from storybook*
        // see rollup config file

        {
          newSdk.addExtension('sb_uikit', APP_VERSION_STRING);
        }

        var connectCbSucess = function connectCbSucess(user) {
          sdkDispatcher({
            type: INIT_SDK,
            payload: newSdk
          });
          userDispatcher({
            type: INIT_USER,
            payload: user
          }); // use nickname/profileUrl if provided
          // or set userID as nickname

          var newNickName = nickname || user.nickname;
          var newProfileUrl = profileUrl || user.profileUrl;
          newSdk.updateCurrentUserInfo(newNickName, newProfileUrl).then(function (namedUser) {
            userDispatcher({
              type: UPDATE_USER_INFO,
              payload: namedUser
            });
          });
        };

        var connectCbError = function connectCbError(e) {
          logger.error('Connection failed', "".concat(e));
          sdkDispatcher({
            type: RESET_SDK
          });
          sdkDispatcher({
            type: RESET_USER
          });
          sdkDispatcher({
            type: SDK_ERROR
          });
        };

        if (accessToken) {
          newSdk.connect(userId, accessToken).then(function (res) {
            return connectCbSucess(res);
          }).catch(function (err) {
            return connectCbError(err);
          });
        } else {
          newSdk.connect(userId).then(function (res) {
            return connectCbSucess(res);
          }).catch(function (err) {
            return connectCbError(err);
          });
        }
      } else {
        sdkDispatcher({
          type: SDK_ERROR
        });
        logger.warning('Connection failed', 'UserId or appId missing');
      }
    }
  });
};

var isEmpty = function isEmpty(obj) {
  if (obj === null || obj === undefined) {
    return true;
  }

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

var useTheme = function useTheme(overrides) {
  useLayoutEffect(function () {
    if (!isEmpty(overrides)) {
      cssVars({
        variables: __assign({
          '--sendbird-dark-primary-500': '#4d2aa6',
          '--sendbird-dark-primary-400': '#6440C4',
          '--sendbird-dark-primary-300': '#7B53EF',
          '--sendbird-dark-primary-200': '#9E8CF5',
          '--sendbird-dark-primary-100': '#E2DFFF',
          '--sendbird-dark-secondary-500': '#007A7A',
          '--sendbird-dark-secondary-400': '#189A8D',
          '--sendbird-dark-secondary-300': '#2EBA9F',
          '--sendbird-dark-secondary-200': '#6FD6BE',
          '--sendbird-dark-secondary-100': '#AEF2DC',
          '--sendbird-dark-information-100': '#b2d9ff',
          '--sendbird-dark-error-500': '#A30E2D',
          '--sendbird-dark-error-400': '#C11F41',
          '--sendbird-dark-error-300': '#E53157',
          '--sendbird-dark-error-200': '#FF6183',
          '--sendbird-dark-error-100': '#FFABBD',
          '--sendbird-dark-background-700': '#000000',
          '--sendbird-dark-background-600': '#161616',
          '--sendbird-dark-background-500': '#2C2C2C',
          '--sendbird-dark-background-400': '#393939',
          '--sendbird-dark-background-300': '#A8A8A8',
          '--sendbird-dark-background-200': '#D9D9D9',
          '--sendbird-dark-background-100': '#F0F0F0',
          '--sendbird-dark-background-50': '#FFFFFF',
          '--sendbird-dark-overlay': 'rgba(0, 0, 0, 0.32)',
          '--sendbird-dark-onlight-01': 'rgba(0, 0, 0, 0.88)',
          '--sendbird-dark-onlight-02': 'rgba(0, 0, 0, 0.50)',
          '--sendbird-dark-onlight-03': 'rgba(0, 0, 0, 0.38)',
          '--sendbird-dark-onlight-04': 'rgba(0, 0, 0, 0.12)',
          '--sendbird-dark-ondark-01': 'rgba(255, 255, 255, 0.88)',
          '--sendbird-dark-ondark-02': 'rgba(255, 255, 255, 0.50)',
          '--sendbird-dark-ondark-03': 'rgba(255, 255, 255, 0.38)',
          '--sendbird-dark-ondark-04': 'rgba(255, 255, 255, 0.12)',
          '--sendbird-dark-shadow-01': '0 1px 5px 0 rgba(33, 34, 66, 0.04), 0 0 3px 0 rgba(0, 0, 0, 0.08), 0 2px 1px 0 rgba(0, 0, 0, 0.12)',
          '--sendbird-dark-shadow-02': '0 3px 5px -3px rgba(33, 34, 66, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.08), 0 8px 10px 1px rgba(0, 0, 0, 0.12)',
          '--sendbird-dark-shadow-03': '0 6px 10px -5px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.08), 0 16px 24px 2px rgba(0, 0, 0, 0.12)',
          '--sendbird-dark-shadow-04': '0 9px 15px -7px rgba(0, 0, 0, 0.04), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 24px 38px 3px rgba(0, 0, 0, 0.12)',
          '--sendbird-dark-shadow-message-input': '0 1px 5px 0 rgba(33, 34, 66, 0.12), 0 0 1px 0 rgba(33, 34, 66, 0.16), 0 2px 1px 0 rgba(33, 34, 66, 0.08), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
          '--sendbird-light-primary-500': '#4d2aa6',
          '--sendbird-light-primary-400': '#6440C4',
          '--sendbird-light-primary-300': '#7B53EF',
          '--sendbird-light-primary-200': '#9E8CF5',
          '--sendbird-light-primary-100': '#E2DFFF',
          '--sendbird-light-secondary-500': '#007A7A',
          '--sendbird-light-secondary-400': '#189A8D',
          '--sendbird-light-secondary-300': '#2EBA9F',
          '--sendbird-light-secondary-200': '#6FD6BE',
          '--sendbird-light-secondary-100': '#AEF2DC',
          '--sendbird-light-information-100': '#b2d9ff',
          '--sendbird-light-error-500': '#A30E2D',
          '--sendbird-light-error-400': '#C11F41',
          '--sendbird-light-error-300': '#E53157',
          '--sendbird-light-error-200': '#FF6183',
          '--sendbird-light-error-100': '#FFABBD',
          '--sendbird-light-background-700': '#000000',
          '--sendbird-light-background-600': '#161616',
          '--sendbird-light-background-500': '#2C2C2C',
          '--sendbird-light-background-400': '#393939',
          '--sendbird-light-background-300': '#A8A8A8',
          '--sendbird-light-background-200': '#D9D9D9',
          '--sendbird-light-background-100': '#F0F0F0',
          '--sendbird-light-background-50': ' #FFFFFF',
          '--sendbird-light-overlay': 'rgba(0, 0, 0, 0.32)',
          '--sendbird-light-onlight-01': 'rgba(0, 0, 0, 0.88)',
          '--sendbird-light-onlight-02': 'rgba(0, 0, 0, 0.50)',
          '--sendbird-light-onlight-03': 'rgba(0, 0, 0, 0.38)',
          '--sendbird-light-onlight-04': 'rgba(0, 0, 0, 0.12)',
          '--sendbird-light-ondark-01': 'rgba(255, 255, 255, 0.88)',
          '--sendbird-light-ondark-02': 'rgba(255, 255, 255, 0.50)',
          '--sendbird-light-ondark-03': 'rgba(255, 255, 255, 0.38)',
          '--sendbird-light-ondark-04': 'rgba(255, 255, 255, 0.12)',
          '--sendbird-light-shadow-01': '0 1px 5px 0 rgba(33, 34, 66, 0.04), 0 0 3px 0 rgba(0, 0, 0, 0.08), 0 2px 1px 0 rgba(0, 0, 0, 0.12)',
          '--sendbird-light-shadow-02': '0 3px 5px -3px rgba(33, 34, 66, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.08), 0 8px 10px 1px rgba(0, 0, 0, 0.12)',
          '--sendbird-light-shadow-03': '0 6px 10px -5px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.08), 0 16px 24px 2px rgba(0, 0, 0, 0.12)',
          '--sendbird-light-shadow-04': '0 9px 15px -7px rgba(0, 0, 0, 0.04), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 24px 38px 3px rgba(0, 0, 0, 0.12)',
          '--sendbird-light-shadow-message-input': '0 1px 5px 0 rgba(33, 34, 66, 0.12), 0 0 1px 0 rgba(33, 34, 66, 0.16), 0 2px 1px 0 rgba(33, 34, 66, 0.08), 0 1px 5px 0 rgba(0, 0, 0, 0.12)'
        }, overrides)
      });
    }
  }, [overrides]);
};

var sdkInitialState = {
  initialized: false,
  loading: false,
  sdk: {},
  error: false
};

function reducer$1(state, action) {
  switch (action.type) {
    case SET_SDK_LOADING:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        initialized: false,
        loading: action.payload
      });

    case SDK_ERROR:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        initialized: false,
        loading: false,
        error: true
      });

    case INIT_SDK:
      return {
        sdk: action.payload,
        initialized: true,
        loading: false,
        error: false
      };

    case RESET_SDK:
      return sdkInitialState;

    default:
      return state;
  }
}

var userInitialState = {
  initialized: false,
  loading: false,
  user: {}
};

function reducer(state, action) {
  switch (action.type) {
    case INIT_USER:
      return {
        initialized: true,
        loading: false,
        user: action.payload
      };

    case RESET_USER:
      return userInitialState;

    case UPDATE_USER_INFO:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        user: action.payload
      });

    default:
      return state;
  }
}

function useConnectionStatus(sdk, logger) {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      isOnline = _useState2[0],
      setIsOnline = _useState2[1];

  useEffect(function () {
    var uniqueHandlerId = uuidv4();
    logger.warning('sdk changed', uniqueHandlerId);
    var handler;

    if (sdk && sdk.ConnectionHandler) {
      handler = new sdk.ConnectionHandler();

      handler.onReconnectStarted = function () {
        setIsOnline(false);
        logger.warning('onReconnectStarted', {
          isOnline: isOnline
        });
      };

      handler.onReconnectSucceeded = function () {
        setIsOnline(true);
        logger.warning('onReconnectSucceeded', {
          isOnline: isOnline
        });
      };

      handler.onReconnectFailed = function () {
        sdk.reconnect();
        logger.warning('onReconnectFailed');
      };

      logger.info('Added ConnectionHandler', uniqueHandlerId);
      sdk.addConnectionHandler(uniqueHandlerId, handler);
    }

    return function () {
      try {
        sdk.removeConnectionHandler(uniqueHandlerId);
        logger.info('Removed ConnectionHandler', uniqueHandlerId);
      } catch (_unused) {//
      }
    };
  }, [sdk]);
  useEffect(function () {
    var tryReconnect = function tryReconnect() {
      try {
        logger.warning('Try reconnecting SDK');

        if (sdk.getConnectionState() !== 'OPEN') {
          // connection is not broken yet
          sdk.reconnect();
        }
      } catch (_unused2) {//
      }
    }; // addEventListener version


    window.addEventListener('online', tryReconnect);
    return function () {
      window.removeEventListener('online', tryReconnect);
    };
  }, [sdk]); // add offline-class to body

  useEffect(function () {
    var body = document.querySelector('body');

    if (!isOnline) {
      try {
        body.classList.add('sendbird__offline');
        logger.info('Added class sendbird__offline to body');
      } catch (e) {//
      }
    } else {
      try {
        body.classList.remove('sendbird__offline');
        logger.info('Removed class sendbird__offline from body');
      } catch (e) {//
      }
    }
  }, [isOnline]);
  return isOnline;
}

// Logger, pretty much explains it
// in SendbirdProvider
// const [logger, setLogger] = useState(LoggerFactory(logLevel));
var LOG_LEVELS = {
  DEBUG: 'debug',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  ALL: 'all'
};

var colorLog = function colorLog(level) {
  switch (level) {
    case LOG_LEVELS.WARNING:
      return 'color: Orange';

    case LOG_LEVELS.ERROR:
      return 'color: Red';

    default:
      return 'color: Gray';
  }
};

var printLog = function printLog(_ref) {
  var level = _ref.level,
      title = _ref.title,
      _ref$description = _ref.description,
      description = _ref$description === void 0 ? '' : _ref$description;
  // eslint-disable-next-line no-console
  console.log("%c SendbirdUIKit | ".concat(level, " | ").concat(new Date().toISOString(), " | ").concat(title, " ").concat(description && '|'), colorLog(level), description);
};
var getDefaultLogger = function getDefaultLogger() {
  return {
    info: function info() {},
    error: function error() {},
    warning: function warning() {}
  };
};
var LoggerFactory = function LoggerFactory(lvl, customInterface) {
  var logInterface = customInterface || printLog;
  var lvlArray = Array.isArray(lvl) ? lvl : [lvl];

  var applyLog = function applyLog(lgLvl) {
    return function (title, description) {
      return logInterface({
        level: lgLvl,
        title: title,
        description: description
      });
    };
  };

  var logger = lvlArray.reduce(function (accumulator, currentLvl) {
    if (currentLvl === LOG_LEVELS.DEBUG || currentLvl === LOG_LEVELS.ALL) {
      return _objectSpread2(_objectSpread2({}, accumulator), {}, {
        info: applyLog(LOG_LEVELS.INFO),
        error: applyLog(LOG_LEVELS.ERROR),
        warning: applyLog(LOG_LEVELS.WARNING)
      });
    }

    if (currentLvl === LOG_LEVELS.INFO) {
      return _objectSpread2(_objectSpread2({}, accumulator), {}, {
        info: applyLog(LOG_LEVELS.INFO)
      });
    }

    if (currentLvl === LOG_LEVELS.ERROR) {
      return _objectSpread2(_objectSpread2({}, accumulator), {}, {
        error: applyLog(LOG_LEVELS.ERROR)
      });
    }

    if (currentLvl === LOG_LEVELS.WARNING) {
      return _objectSpread2(_objectSpread2({}, accumulator), {}, {
        warning: applyLog(LOG_LEVELS.WARNING)
      });
    }

    return _objectSpread2({}, accumulator);
  }, getDefaultLogger());
  return logger;
};

// https://davidwalsh.name/pubsub-javascript
// we use pubsub to sync events between multiple components(example - ChannelList, Channel)
// for example, if customer sends a message from their custom component
// without pubsub,we would not be able to listen to it
// in our ChannelList or Conversation
var pubSubFactory = (function () {
  var topics = {};
  var hOP = topics.hasOwnProperty;
  return {
    __getTopics: function __getTopics() {
      return topics;
    },
    subscribe: function subscribe(topic, listener) {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) {
        topics[topic] = [];
      } // Add the listener to queue


      var index = topics[topic].push(listener) - 1; // Provide handle back for removal of topic

      return {
        remove: function remove() {
          delete topics[topic][index];
        }
      };
    },
    publish: function publish(topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) {
        return;
      } // Cycle through topics queue, fire!


      topics[topic].forEach(function (item) {
        item(info !== undefined ? info : {});
      });
    }
  };
});

function useAppendDomNode() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var rootSelector = arguments.length > 1 ? arguments[1] : undefined;
  useEffect(function () {
    var root = document.querySelector(rootSelector);
    ids.forEach(function (id) {
      var elem = document.createElement('div');
      elem.setAttribute('id', id);
      root.appendChild(elem);
    });
    return function () {
      ids.forEach(function (id) {
        var target = document.getElementById(id);

        if (target) {
          root.removeChild(target);
        }
      });
    };
  }, []);
}

function Sendbird(props) {
  var userId = props.userId,
      appId = props.appId,
      accessToken = props.accessToken,
      children = props.children,
      disableUserProfile = props.disableUserProfile,
      renderUserProfile = props.renderUserProfile,
      allowProfileEdit = props.allowProfileEdit,
      theme = props.theme,
      nickname = props.nickname,
      profileUrl = props.profileUrl,
      userListQuery = props.userListQuery,
      _props$config = props.config,
      config = _props$config === void 0 ? {} : _props$config,
      colorSet = props.colorSet,
      stringSet = props.stringSet,
      imageCompression = props.imageCompression,
      useReaction = props.useReaction;
  var _config$logLevel = config.logLevel,
      logLevel = _config$logLevel === void 0 ? '' : _config$logLevel;

  var _useState = useState(LoggerFactory(logLevel)),
      _useState2 = _slicedToArray(_useState, 2),
      logger = _useState2[0],
      setLogger = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      pubSub = _useState4[0],
      setPubSub = _useState4[1];

  var _useReducer = useReducer(reducer$1, sdkInitialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      sdkStore = _useReducer2[0],
      sdkDispatcher = _useReducer2[1];

  var _useReducer3 = useReducer(reducer, userInitialState),
      _useReducer4 = _slicedToArray(_useReducer3, 2),
      userStore = _useReducer4[0],
      userDispatcher = _useReducer4[1];

  useTheme(colorSet);
  useEffect(function () {
    setPubSub(pubSubFactory());
  }, []);
  useEffect(function () {
    logger.info('App Init'); // dispatch action

    handleConnection({
      userId: userId,
      appId: appId,
      accessToken: accessToken,
      sdkStore: sdkStore,
      nickname: nickname,
      profileUrl: profileUrl,
      sdk: sdkStore.sdk,
      logger: logger
    }, {
      sdkDispatcher: sdkDispatcher,
      userDispatcher: userDispatcher
    });
  }, [userId, appId, accessToken]); // to create a pubsub to communicate between parent and child

  useEffect(function () {
    setLogger(LoggerFactory(logLevel));
  }, [logLevel]);
  useAppendDomNode(['sendbird-modal-root', 'sendbird-dropdown-portal', 'sendbird-emoji-list-portal'], 'body'); // should move to reducer

  var _useState5 = useState(theme),
      _useState6 = _slicedToArray(_useState5, 2),
      currenttheme = _useState6[0],
      setCurrenttheme = _useState6[1];

  useEffect(function () {
    setCurrenttheme(theme);
  }, [theme]); // add-remove theme from body

  useEffect(function () {
    logger.info('Setup theme', "Theme: ".concat(currenttheme));

    try {
      var body = document.querySelector('body');
      body.classList.remove('sendbird-theme--light');
      body.classList.remove('sendbird-theme--dark');
      body.classList.add("sendbird-theme--".concat(currenttheme || 'light'));
      logger.info('Finish setup theme'); // eslint-disable-next-line no-empty
    } catch (e) {
      logger.warning('Setup theme failed', "".concat(e));
    }

    return function () {
      try {
        var _body = document.querySelector('body');

        _body.classList.remove('sendbird-theme--light');

        _body.classList.remove('sendbird-theme--dark'); // eslint-disable-next-line no-empty

      } catch (_unused) {}
    };
  }, [currenttheme]);
  var isOnline = useConnectionStatus(sdkStore.sdk, logger);
  var localeStringSet = React__default.useMemo(function () {
    if (!stringSet) {
      return getStringSet('en');
    }

    return _objectSpread2(_objectSpread2({}, getStringSet('en')), stringSet);
  }, [stringSet]);
  return /*#__PURE__*/React__default.createElement(SendbirdSdkContext.Provider, {
    value: {
      stores: {
        sdkStore: sdkStore,
        userStore: userStore
      },
      dispatchers: {
        sdkDispatcher: sdkDispatcher,
        userDispatcher: userDispatcher,
        reconnect: function reconnect() {
          handleConnection({
            userId: userId,
            appId: appId,
            accessToken: accessToken,
            sdkStore: sdkStore,
            nickname: nickname,
            profileUrl: profileUrl,
            logger: logger,
            sdk: sdkStore.sdk
          }, {
            sdkDispatcher: sdkDispatcher,
            userDispatcher: userDispatcher
          });
        }
      },
      config: {
        disableUserProfile: disableUserProfile,
        renderUserProfile: renderUserProfile,
        allowProfileEdit: allowProfileEdit,
        isOnline: isOnline,
        userId: userId,
        appId: appId,
        accessToken: accessToken,
        theme: currenttheme,
        setCurrenttheme: setCurrenttheme,
        userListQuery: userListQuery,
        logger: logger,
        pubSub: pubSub,
        imageCompression: imageCompression,
        useReaction: useReaction
      }
    }
  }, /*#__PURE__*/React__default.createElement(LocalizationProvider, {
    stringSet: localeStringSet
  }, children));
}
Sendbird.propTypes = {
  userId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  accessToken: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element), PropTypes.any]).isRequired,
  theme: PropTypes.string,
  nickname: PropTypes.string,
  profileUrl: PropTypes.string,
  disableUserProfile: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  allowProfileEdit: PropTypes.bool,
  userListQuery: PropTypes.func,
  config: PropTypes.shape({
    // None Error Warning Info 'All/Debug'
    logLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    pubSub: PropTypes.shape({
      subscribe: PropTypes.func,
      publish: PropTypes.func
    })
  }),
  stringSet: PropTypes.objectOf(PropTypes.string),
  colorSet: PropTypes.objectOf(PropTypes.string),
  useReaction: PropTypes.bool,
  imageCompression: PropTypes.shape({
    compressionRate: PropTypes.number,
    resizingWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    resizingHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  })
};
Sendbird.defaultProps = {
  accessToken: '',
  theme: 'light',
  nickname: '',
  profileUrl: '',
  disableUserProfile: false,
  renderUserProfile: null,
  allowProfileEdit: false,
  userListQuery: null,
  config: {},
  stringSet: null,
  colorSet: null,
  imageCompression: {},
  useReaction: true
};

export { Sendbird as default };
//# sourceMappingURL=SendbirdProvider.js.map
