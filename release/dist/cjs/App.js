'use strict';

var LocalizationContext = require('./LocalizationContext-abd404ea.js');
var React = require('react');
var PropTypes = require('prop-types');
var SendbirdProvider = require('./SendbirdProvider.js');
var ChannelList = require('./ChannelList.js');
var Channel = require('./Channel.js');
var ChannelSettings = require('./ChannelSettings.js');
var MessageSearch = require('./MessageSearch.js');
var index = require('./index-b6751523.js');
var index$1 = require('./index-5737cbcc.js');
require('sendbird');
require('./actionTypes-7b2029d9.js');
require('css-vars-ponyfill');
require('./index-33cabbb2.js');
require('./utils-74589c7a.js');
require('./LeaveChannel-cf1daceb.js');
require('./index-e3c0ff6b.js');
require('./index-5ce9cbed.js');
require('./index-45615779.js');
require('./index-efa0d835.js');
require('react-dom');
require('./index-4b10031b.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

var COMPONENT_CLASS_NAME = 'sendbird-message-search-pannel';

function MessageSearchPannel(props) {
  var channelUrl = props.channelUrl,
      onResultClick = props.onResultClick,
      onCloseClick = props.onCloseClick;

  var _a = React.useState(''),
      searchString = _a[0],
      setSearchString = _a[1];

  var _b = React.useState(''),
      inputString = _b[0],
      setInputString = _b[1];

  var _c = React.useState(false),
      loading = _c[0],
      setLoading = _c[1];

  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
  var timeout = null;
  React.useEffect(function () {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      setSearchString(inputString);
      setLoading(true);
      timeout = null;
    }, 500);
  }, [inputString]);

  var handleOnChangeInputString = function handleOnChangeInputString(e) {
    setInputString(e.target.value);
  };

  var handleOnResultLoaded = function handleOnResultLoaded() {
    setLoading(false);
  };

  var handleOnClickResetStringButton = function handleOnClickResetStringButton(e) {
    e.stopPropagation();
    setInputString('');
    setSearchString('');
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: COMPONENT_CLASS_NAME
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: COMPONENT_CLASS_NAME + "__header"
  }, /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: COMPONENT_CLASS_NAME + "__header__title",
    type: index.LabelTypography.H_2,
    color: index.LabelColors.ONBACKGROUND_1
  }, stringSet.SEARCH_IN_CHANNEL), /*#__PURE__*/React__default["default"].createElement(index$1.IconButton, {
    className: COMPONENT_CLASS_NAME + "__header__close-button",
    width: "32px",
    height: "32px",
    onClick: onCloseClick
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.CLOSE,
    fillColor: index.IconColors.ON_BACKGROUND_1,
    width: "22px",
    height: "22px"
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: COMPONENT_CLASS_NAME + "__input"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: COMPONENT_CLASS_NAME + "__input__container"
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    className: COMPONENT_CLASS_NAME + "__input__container__search-icon",
    type: index.IconTypes.SEARCH,
    fillColor: index.IconColors.ON_BACKGROUND_3,
    width: "24px",
    height: "24px"
  }), /*#__PURE__*/React__default["default"].createElement("input", {
    className: COMPONENT_CLASS_NAME + "__input__container__input-area",
    placeholder: stringSet.SEARCH,
    value: inputString,
    onChange: handleOnChangeInputString
  }), inputString && loading && /*#__PURE__*/React__default["default"].createElement(index.Loader, {
    className: COMPONENT_CLASS_NAME + "__input__container__spinner",
    width: "20px",
    height: "20px"
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.SPINNER,
    fillColor: index.IconColors.PRIMARY,
    width: "20px",
    height: "20px"
  })), !loading && inputString && /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    className: COMPONENT_CLASS_NAME + "__input__container__reset-input-button",
    type: index.IconTypes.REMOVE,
    fillColor: index.IconColors.ON_BACKGROUND_3,
    width: "20px",
    height: "20px",
    onClick: handleOnClickResetStringButton
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: COMPONENT_CLASS_NAME + "__message-search"
  }, /*#__PURE__*/React__default["default"].createElement(MessageSearch, {
    channelUrl: channelUrl,
    searchString: searchString,
    onResultClick: onResultClick,
    onResultLoaded: handleOnResultLoaded
  })));
}

function App(props) {
  var appId = props.appId,
      userId = props.userId,
      accessToken = props.accessToken,
      theme = props.theme,
      userListQuery = props.userListQuery,
      nickname = props.nickname,
      profileUrl = props.profileUrl,
      _props$config = props.config,
      config = _props$config === void 0 ? {} : _props$config,
      useReaction = props.useReaction,
      useMessageGrouping = props.useMessageGrouping,
      colorSet = props.colorSet,
      stringSet = props.stringSet,
      allowProfileEdit = props.allowProfileEdit,
      disableUserProfile = props.disableUserProfile,
      renderUserProfile = props.renderUserProfile,
      showSearchIcon = props.showSearchIcon,
      onProfileEditSuccess = props.onProfileEditSuccess,
      imageCompression = props.imageCompression;

  var _useState = React.useState(null),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      currentChannelUrl = _useState2[0],
      setCurrentChannelUrl = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      showSettings = _useState4[0],
      setShowSettings = _useState4[1];

  var _useState5 = React.useState(false),
      _useState6 = LocalizationContext._slicedToArray(_useState5, 2),
      showSearch = _useState6[0],
      setShowSearch = _useState6[1];

  var _useState7 = React.useState(null),
      _useState8 = LocalizationContext._slicedToArray(_useState7, 2),
      highlightedMessage = _useState8[0],
      setHighlightedMessage = _useState8[1];

  var _useState9 = React.useState(null),
      _useState10 = LocalizationContext._slicedToArray(_useState9, 2),
      startingPoint = _useState10[0],
      setStartingPoint = _useState10[1];

  return /*#__PURE__*/React__default["default"].createElement(SendbirdProvider, {
    stringSet: stringSet,
    appId: appId,
    userId: userId,
    accessToken: accessToken,
    theme: theme,
    nickname: nickname,
    profileUrl: profileUrl,
    userListQuery: userListQuery,
    config: config,
    colorSet: colorSet,
    disableUserProfile: disableUserProfile,
    renderUserProfile: renderUserProfile,
    imageCompression: imageCompression,
    useReaction: useReaction
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-app__wrap"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-app__channellist-wrap"
  }, /*#__PURE__*/React__default["default"].createElement(ChannelList, {
    allowProfileEdit: allowProfileEdit,
    onProfileEditSuccess: onProfileEditSuccess,
    onChannelSelect: function onChannelSelect(channel) {
      setStartingPoint(null);
      setHighlightedMessage(null);

      if (channel && channel.url) {
        setCurrentChannelUrl(channel.url);
      } else {
        setCurrentChannelUrl('');
      }
    }
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "\n            ".concat(showSettings ? 'sendbird-app__conversation--settings-open' : '', "\n            ").concat(showSearch ? 'sendbird-app__conversation--search-open' : '', "\n            sendbird-app__conversation-wrap\n          ")
  }, /*#__PURE__*/React__default["default"].createElement(Channel["default"], {
    channelUrl: currentChannelUrl,
    onChatHeaderActionClick: function onChatHeaderActionClick() {
      setShowSearch(false);
      setShowSettings(!showSettings);
    },
    onSearchClick: function onSearchClick() {
      setShowSettings(false);
      setShowSearch(!showSearch);
    },
    showSearchIcon: showSearchIcon,
    startingPoint: startingPoint,
    highlightedMessage: highlightedMessage,
    useReaction: useReaction,
    useMessageGrouping: useMessageGrouping
  })), showSettings && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-app__settingspanel-wrap"
  }, /*#__PURE__*/React__default["default"].createElement(ChannelSettings, {
    className: "sendbird-channel-settings",
    channelUrl: currentChannelUrl,
    onCloseClick: function onCloseClick() {
      setShowSettings(false);
    }
  })), showSearch && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-app__searchpanel-wrap"
  }, /*#__PURE__*/React__default["default"].createElement(MessageSearchPannel, {
    channelUrl: currentChannelUrl,
    onResultClick: function onResultClick(message) {
      if (message.messageId === highlightedMessage) {
        setHighlightedMessage(null);
        setTimeout(function () {
          setHighlightedMessage(message.messageId);
        });
      } else {
        setStartingPoint(message.createdAt);
        setHighlightedMessage(message.messageId);
      }
    },
    onCloseClick: function onCloseClick() {
      setShowSearch(false);
    }
  }))));
}
App.propTypes = {
  appId: PropTypes__default["default"].string.isRequired,
  userId: PropTypes__default["default"].string.isRequired,
  accessToken: PropTypes__default["default"].string,
  theme: PropTypes__default["default"].string,
  userListQuery: PropTypes__default["default"].func,
  nickname: PropTypes__default["default"].string,
  profileUrl: PropTypes__default["default"].string,
  allowProfileEdit: PropTypes__default["default"].bool,
  disableUserProfile: PropTypes__default["default"].bool,
  renderUserProfile: PropTypes__default["default"].func,
  onProfileEditSuccess: PropTypes__default["default"].func,
  config: PropTypes__default["default"].shape({
    // None Error Warning Info 'All/Debug'
    logLevel: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)])
  }),
  useReaction: PropTypes__default["default"].bool,
  showSearchIcon: PropTypes__default["default"].bool,
  useMessageGrouping: PropTypes__default["default"].bool,
  stringSet: PropTypes__default["default"].objectOf(PropTypes__default["default"].string),
  colorSet: PropTypes__default["default"].objectOf(PropTypes__default["default"].string),
  imageCompression: PropTypes__default["default"].shape({
    compressionRate: PropTypes__default["default"].number,
    resizingWidth: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string]),
    resizingHeight: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string])
  })
};
App.defaultProps = {
  accessToken: '',
  theme: 'light',
  nickname: '',
  profileUrl: '',
  userListQuery: null,
  allowProfileEdit: false,
  onProfileEditSuccess: null,
  disableUserProfile: false,
  showSearchIcon: false,
  renderUserProfile: null,
  config: {},
  useReaction: true,
  useMessageGrouping: true,
  stringSet: null,
  colorSet: null,
  imageCompression: {}
};

module.exports = App;
//# sourceMappingURL=App.js.map
