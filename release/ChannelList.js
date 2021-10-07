import { a as _objectSpread2, e as _toConsumableArray, c as LocalizationContext, w as withSendbirdContext, b as _slicedToArray, u as uuidv4 } from './LocalizationContext-2d4f87f4.js';
import React__default, { useContext, useRef, useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { U as UPDATE_USER_INFO } from './actionTypes-a6a317df.js';
import { i as filterChannelListParams, j as getChannelsWithUpsertedChannel, t as truncateString, I as IconButton, M as Modal, T as Type, a as TextButton, C as ContextMenu, b as MenuItems, c as MenuItem, k as CREATE_CHANNEL$1, l as UPDATE_USER_MESSAGE, L as LEAVE_CHANNEL, S as SEND_MESSAGE_START, h as UserProfileProvider } from './index-6583a6eb.js';
import { C as ChannelAvatar } from './index-e3cf037f.js';
import { B as Badge, i as isBroadcastChannelEnabled, a as isSuperGroupChannelEnabled, I as InviteMembers, c as createDefaultUserListQuery, b as createChannel, L as LeaveChannel } from './LeaveChannel-abc8ae2a.js';
import { g as format, h as LabelStringSet, I as Icon, c as IconTypes, d as IconColors, L as Label, a as LabelTypography, b as LabelColors, A as Avatar, P as PlaceHolder, f as PlaceHolderTypes } from './index-b0596939.js';
import { i as isToday, a as isYesterday } from './index-e2a8fee6.js';
import { I as InputLabel, a as Input, n as noop$1 } from './index-954a6f62.js';
import 'react-dom';
import './utils-26586e9d.js';
import './index-566f58f7.js';

var RESET_CHANNEL_LIST = 'RESET_CHANNEL_LIST';
var CREATE_CHANNEL = 'CREATE_CHANNEL';
var LEAVE_CHANNEL_SUCCESS = 'LEAVE_CHANNEL_SUCCESS';
var SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
var SHOW_CHANNEL_SETTINGS = 'SHOW_CHANNEL_SETTINGS';
var HIDE_CHANNEL_SETTINGS = 'HIDE_CHANNEL_SETTINGS';
var FETCH_CHANNELS_START = 'FETCH_CHANNELS_START';
var FETCH_CHANNELS_SUCCESS = 'FETCH_CHANNELS_SUCCESS';
var FETCH_CHANNELS_FAILURE = 'FETCH_CHANNELS_FAILURE';
var INIT_CHANNELS_START = 'INIT_CHANNELS_START';
var INIT_CHANNELS_SUCCESS = 'INIT_CHANNELS_SUCCESS';
var INIT_CHANNELS_FAILURE = 'INIT_CHANNELS_FAILURE';
var ON_USER_JOINED = 'ON_USER_JOINED';
var ON_CHANNEL_DELETED = 'ON_CHANNEL_DELETED';
var ON_LAST_MESSAGE_UPDATED = 'ON_LAST_MESSAGE_UPDATED';
var ON_USER_LEFT = 'ON_USER_LEFT';
var ON_CHANNEL_CHANGED = 'ON_CHANNEL_CHANGED';
var ON_CHANNEL_ARCHIVED = 'ON_CHANNEL_ARCHIVED';
var ON_CHANNEL_FROZEN = 'ON_CHANNEL_FROZEN';
var ON_CHANNEL_UNFROZEN = 'ON_CHANNEL_UNFROZEN';
var ON_READ_RECEIPT_UPDATED = 'ON_READ_RECEIPT_UPDATED';
var ON_DELIVERY_RECEIPT_UPDATED = 'ON_DELIVERY_RECEIPT_UPDATED';
var CHANNEL_REPLACED_TO_TOP = 'CHANNEL_REPLACED_TO_TOP';
var CHANNEL_LIST_PARAMS_UPDATED = 'CHANNEL_LIST_PARAMS_UPDATED';

var channelListInitialState = {
  // we might not need this initialized state -> should remove
  initialized: false,
  loading: false,
  allChannels: [],
  currentChannel: null,
  showSettings: false,
  channelListQuery: null,
  currentUserId: ''
};

function reducer(state, action) {
  switch (action.type) {
    case INIT_CHANNELS_START:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        loading: true
      });

    case RESET_CHANNEL_LIST:
      return channelListInitialState;

    case INIT_CHANNELS_SUCCESS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        initialized: true,
        loading: false,
        allChannels: action.payload,
        currentChannel: action.payload && action.payload.length && action.payload.length > 0 ? action.payload[0].url : null
      });

    case FETCH_CHANNELS_SUCCESS:
      {
        var currentChannels = state.allChannels.map(function (c) {
          return c.url;
        });
        var filteredChannels = action.payload.filter(function (_ref) {
          var url = _ref.url;
          return !currentChannels.find(function (c) {
            return c === url;
          });
        });
        return _objectSpread2(_objectSpread2({}, state), {}, {
          allChannels: [].concat(_toConsumableArray(state.allChannels), _toConsumableArray(filteredChannels))
        });
      }

    case CREATE_CHANNEL:
      {
        var channel = action.payload;

        if (state.channelListQuery) {
          if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
            return _objectSpread2(_objectSpread2({}, state), {}, {
              allChannels: getChannelsWithUpsertedChannel(state.allChannels, channel)
            });
          }

          return _objectSpread2(_objectSpread2({}, state), {}, {
            currentChannel: channel.url
          });
        }

        return _objectSpread2(_objectSpread2({}, state), {}, {
          currentChannel: channel.url,
          allChannels: [channel].concat(_toConsumableArray(state.allChannels.filter(function (ch) {
            return ch.url !== channel.url;
          })))
        });
      }

    case ON_CHANNEL_ARCHIVED:
      {
        var _channel = action.payload;

        if (state.channelListQuery) {
          if (filterChannelListParams(state.channelListQuery, _channel, state.currentUserId)) {
            return _objectSpread2(_objectSpread2({}, state), {}, {
              allChannels: getChannelsWithUpsertedChannel(state.allChannels, _channel)
            });
          }
        }

        return _objectSpread2(_objectSpread2({}, state), {}, {
          currentChannel: _channel.url === state.currentChannel ? state.allChannels[state.allChannels[0].url === _channel.url ? 1 : 0].url : state.currentChannel,
          allChannels: state.allChannels.filter(function (_ref2) {
            var url = _ref2.url;
            return url !== _channel.url;
          })
        });
      }

    case LEAVE_CHANNEL_SUCCESS:
    case ON_CHANNEL_DELETED:
      {
        var channelUrl = action.payload;
        return _objectSpread2(_objectSpread2({}, state), {}, {
          currentChannel: channelUrl === state.currentChannel ? state.allChannels[0].url : state.currentChannel,
          allChannels: state.allChannels.filter(function (_ref3) {
            var url = _ref3.url;
            return url !== channelUrl;
          })
        });
      }

    case ON_USER_LEFT:
      {
        var _action$payload = action.payload,
            _channel2 = _action$payload.channel,
            isMe = _action$payload.isMe;

        if (state.channelListQuery) {
          if (filterChannelListParams(state.channelListQuery, _channel2, state.currentUserId)) {
            var _filteredChannels2 = getChannelsWithUpsertedChannel(state.allChannels, _channel2);

            return _objectSpread2(_objectSpread2({}, state), {}, {
              currentChannel: isMe && _channel2.url === state.currentChannel ? _filteredChannels2[0].url : state.currentChannel,
              allChannels: _filteredChannels2
            });
          }

          return _objectSpread2(_objectSpread2({}, state), {}, {
            currentChannel: _channel2.url === state.currentChannel ? state.allChannels[0].url : state.currentChannel,
            allChannels: state.allChannels.filter(function (_ref4) {
              var url = _ref4.url;
              return url !== _channel2.url;
            })
          });
        }

        var _filteredChannels = state.allChannels.filter(function (c) {
          return c.url !== _channel2.url;
        });

        return _objectSpread2(_objectSpread2({}, state), {}, {
          currentChannel: isMe && _channel2.url === state.currentChannel ? _filteredChannels[0].url : state.currentChannel,
          allChannels: _filteredChannels
        });
      }

    case ON_USER_JOINED:
    case ON_CHANNEL_CHANGED:
    case ON_READ_RECEIPT_UPDATED:
    case ON_DELIVERY_RECEIPT_UPDATED:
      {
        var _state$allChannels = state.allChannels,
            allChannels = _state$allChannels === void 0 ? [] : _state$allChannels;
        var _channel3 = action.payload;
        var unreadMessageCount = _channel3.unreadMessageCount;
        if (!_channel3.lastMessage) return state;

        if (state.channelListQuery) {
          if (filterChannelListParams(state.channelListQuery, _channel3, state.currentUserId)) {
            return _objectSpread2(_objectSpread2({}, state), {}, {
              allChannels: getChannelsWithUpsertedChannel(allChannels, _channel3)
            });
          }

          return _objectSpread2(_objectSpread2({}, state), {}, {
            currentChannel: _channel3.url === state.currentChannel ? state.allChannels[state.allChannels[0].url === _channel3.url ? 1 : 0].url // if coming channel is first of channel list, current channel will be the next one
            : state.currentChannel,
            allChannels: state.allChannels.filter(function (_ref5) {
              var url = _ref5.url;
              return url !== _channel3.url;
            })
          });
        } // if its only an unread message count change, dont push to top


        if (unreadMessageCount === 0) {
          var currentChannel = allChannels.find(function (_ref6) {
            var url = _ref6.url;
            return url === _channel3.url;
          });
          var currentUnreadCount = currentChannel && currentChannel.unreadMessageCount;

          if (currentUnreadCount === 0) {
            return _objectSpread2(_objectSpread2({}, state), {}, {
              allChannels: state.allChannels.map(function (ch) {
                return ch.url === _channel3.url ? _channel3 : ch;
              })
            });
          }
        }

        return _objectSpread2(_objectSpread2({}, state), {}, {
          allChannels: [_channel3].concat(_toConsumableArray(state.allChannels.filter(function (_ref7) {
            var url = _ref7.url;
            return url !== action.payload.url;
          })))
        });
      }

    case SET_CURRENT_CHANNEL:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        currentChannel: action.payload
      });

    case SHOW_CHANNEL_SETTINGS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        showSettings: true
      });

    case HIDE_CHANNEL_SETTINGS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        showSettings: false
      });

    case ON_LAST_MESSAGE_UPDATED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        allChannels: state.allChannels.map(function (channel) {
          return channel.url === action.payload.url ? action.payload : channel;
        })
      });

    case ON_CHANNEL_FROZEN:
      {
        var _channel4 = action.payload;

        if (state.channelListQuery) {
          if (filterChannelListParams(state.channelListQuery, _channel4, state.currentUserId)) {
            return _objectSpread2(_objectSpread2({}, state), {}, {
              allChannels: getChannelsWithUpsertedChannel(state.allChannels, _channel4)
            });
          }

          return _objectSpread2(_objectSpread2({}, state), {}, {
            currentChannel: _channel4.url === state.currentChannel ? state.allChannels[state.allChannels[0].url === _channel4.url ? 1 : 0].url // if coming channel is first of channel list, current channel will be the next one
            : state.currentChannel,
            allChannels: state.allChannels.filter(function (_ref8) {
              var url = _ref8.url;
              return url !== _channel4.url;
            })
          });
        }

        return _objectSpread2(_objectSpread2({}, state), {}, {
          allChannels: state.allChannels.map(function (ch) {
            if (ch.url === _channel4.url) {
              // eslint-disable-next-line no-param-reassign
              ch.isFrozen = true;
              return ch;
            }

            return ch;
          })
        });
      }

    case ON_CHANNEL_UNFROZEN:
      {
        var _channel5 = action.payload;

        if (state.channelListQuery) {
          if (filterChannelListParams(state.channelListQuery, _channel5, state.currentUserId)) {
            return _objectSpread2(_objectSpread2({}, state), {}, {
              allChannels: getChannelsWithUpsertedChannel(state.allChannels, _channel5)
            });
          }

          return _objectSpread2(_objectSpread2({}, state), {}, {
            currentChannel: _channel5.url === state.currentChannel ? state.allChannels[state.allChannels[0].url === _channel5.url ? 1 : 0].url // if coming channel is first of channel list, current channel will be the next one
            : state.currentChannel,
            allChannels: state.allChannels.filter(function (_ref9) {
              var url = _ref9.url;
              return url !== _channel5.url;
            })
          });
        }

        return _objectSpread2(_objectSpread2({}, state), {}, {
          allChannels: state.allChannels.map(function (ch) {
            if (ch.url === _channel5.url) {
              // eslint-disable-next-line no-param-reassign
              ch.isFrozen = false;
              return ch;
            }

            return ch;
          })
        });
      }

    case CHANNEL_REPLACED_TO_TOP:
      {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          allChannels: [action.payload].concat(_toConsumableArray(state.allChannels.filter(function (channel) {
            return channel.url !== action.payload.url;
          })))
        });
      }

    case CHANNEL_LIST_PARAMS_UPDATED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        currentUserId: action.payload.currentUserId,
        channelListQuery: action.payload.channelListQuery
      });

    default:
      return state;
  }
}

var getChannelTitle = function getChannelTitle() {
  var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var currentUserId = arguments.length > 1 ? arguments[1] : undefined;
  var stringSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LabelStringSet;

  if (!channel || !channel.name && !channel.members) {
    return stringSet.NO_TITLE;
  }

  if (channel.name && channel.name !== 'Group Channel') {
    return channel.name;
  }

  if (channel.members.length === 1) {
    return stringSet.NO_MEMBERS;
  }

  return channel.members.filter(function (_ref) {
    var userId = _ref.userId;
    return userId !== currentUserId;
  }).map(function (_ref2) {
    var nickname = _ref2.nickname;
    return nickname || stringSet.NO_NAME;
  }).join(', ');
};
var getLastMessageCreatedAt = function getLastMessageCreatedAt(channel) {
  if (!channel || !channel.lastMessage) {
    return '';
  }

  var date = channel.lastMessage.createdAt;

  if (isToday(date)) {
    return format(date, 'p');
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM dd');
};
var getTotalMembers = function getTotalMembers(channel) {
  return channel && channel.memberCount ? channel.memberCount : 0;
};

var getPrettyLastMessage = function getPrettyLastMessage() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var MAXLEN = 30;
  var messageType = message.messageType,
      name = message.name;

  if (messageType === 'file') {
    return truncateString(name, MAXLEN);
  }

  return message.message;
};

var getLastMessage = function getLastMessage(channel) {
  return channel && channel.lastMessage ? getPrettyLastMessage(channel.lastMessage) : '';
};
var getChannelUnreadMessageCount = function getChannelUnreadMessageCount(channel) {
  return channel && channel.unreadMessageCount ? channel.unreadMessageCount : 0;
};

function ChannelPreview(_ref) {
  var channel = _ref.channel,
      currentUser = _ref.currentUser,
      isActive = _ref.isActive,
      ChannelAction = _ref.ChannelAction,
      theme = _ref.theme,
      onClick = _ref.onClick,
      tabIndex = _ref.tabIndex;
  var userId = currentUser.userId;
  var isBroadcast = channel.isBroadcast,
      isFrozen = channel.isFrozen;

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    className: ['sendbird-channel-preview', isActive ? 'sendbird-channel-preview--active' : ''].join(' '),
    role: "link",
    onClick: onClick,
    onKeyPress: onClick,
    tabIndex: tabIndex
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__avatar"
  }, /*#__PURE__*/React__default.createElement(ChannelAvatar, {
    channel: channel,
    userId: userId,
    theme: theme
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__content"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__content__upper"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__content__upper__header"
  }, isBroadcast && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__content__upper__header__broadcast-icon"
  }, /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.BROADCAST,
    fillColor: IconColors.SECONDARY,
    height: "16px",
    width: "16px"
  })), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-preview__content__upper__header__channel-name",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_1
  }, getChannelTitle(channel, userId, stringSet)), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-preview__content__upper__header__total-members",
    type: LabelTypography.CAPTION_2,
    color: LabelColors.ONBACKGROUND_2
  }, getTotalMembers(channel)), isFrozen && /*#__PURE__*/React__default.createElement("div", {
    title: "Frozen",
    className: "sendbird-channel-preview__content__upper__header__frozen-icon"
  }, /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.FREEZE,
    fillColor: IconColors.PRIMARY,
    height: 12,
    width: 12
  }))), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-preview__content__upper__last-message-at",
    type: LabelTypography.CAPTION_3,
    color: LabelColors.ONBACKGROUND_2
  }, getLastMessageCreatedAt(channel))), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__content__lower"
  }, /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-preview__content__lower__last-message",
    type: LabelTypography.BODY_2,
    color: LabelColors.ONBACKGROUND_3
  }, getLastMessage(channel)), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__content__lower__unread-message-count"
  }, getChannelUnreadMessageCount(channel) // return number
  ? /*#__PURE__*/React__default.createElement(Badge, {
    count: getChannelUnreadMessageCount(channel)
  }) : null))), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-preview__action"
  }, ChannelAction));
}
ChannelPreview.propTypes = {
  channel: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.shape({})),
    coverUrl: PropTypes.string,
    isBroadcast: PropTypes.bool,
    isFrozen: PropTypes.bool
  }),
  currentUser: PropTypes.shape({
    userId: PropTypes.string
  }),
  isActive: PropTypes.bool,
  ChannelAction: PropTypes.element.isRequired,
  theme: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number
};
ChannelPreview.defaultProps = {
  channel: {},
  currentUser: {},
  isActive: false,
  theme: 'light',
  onClick: function onClick() {},
  tabIndex: 0
};

function ChannelHeader(_ref) {
  var user = _ref.user,
      renderHeader = _ref.renderHeader,
      iconButton = _ref.iconButton,
      onEdit = _ref.onEdit,
      allowProfileEdit = _ref.allowProfileEdit;

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    className: ['sendbird-channel-header', allowProfileEdit ? 'sendbird-channel-header--allow-edit' : ''].join(' ')
  }, renderHeader ? renderHeader() : /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-header__title",
    role: "button",
    onClick: onEdit,
    onKeyDown: onEdit,
    tabIndex: "0"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-header__title__left"
  }, /*#__PURE__*/React__default.createElement(Avatar, {
    width: "32px",
    height: "32px",
    src: user.profileUrl,
    alt: user.nickname
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-header__title__right"
  }, /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-header__title__right__name",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_1
  }, user.nickname || stringSet.NO_NAME), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-header__title__right__user-id",
    type: LabelTypography.BODY_2,
    color: LabelColors.ONBACKGROUND_2
  }, user.userId))), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-header__right-icon"
  }, iconButton));
}
ChannelHeader.propTypes = {
  user: PropTypes.shape({
    profileUrl: PropTypes.string,
    nickname: PropTypes.string,
    userId: PropTypes.string
  }),
  renderHeader: PropTypes.func,
  iconButton: PropTypes.oneOfType([PropTypes.element, PropTypes.instanceOf(IconButton)]),
  onEdit: PropTypes.func.isRequired,
  allowProfileEdit: PropTypes.bool
};
ChannelHeader.defaultProps = {
  user: {},
  renderHeader: null,
  iconButton: null,
  allowProfileEdit: false
};

function EditUserProfile(_a) {
  var user = _a.user,
      _b = _a.theme,
      theme = _b === void 0 ? 'light' : _b,
      onCancel = _a.onCancel,
      _onSubmit = _a.onSubmit,
      _c = _a.changeTheme,
      changeTheme = _c === void 0 ? noop$1 : _c,
      _d = _a.onThemeChange,
      onThemeChange = _d === void 0 ? null : _d;
  var hiddenInputRef = useRef(null);
  var inputRef = useRef(null);
  var formRef = useRef(null);
  var stringSet = useContext(LocalizationContext).stringSet;

  var _e = useState(null),
      currentImg = _e[0],
      setCurrentImg = _e[1];

  var _f = useState(null),
      newFile = _f[0],
      setNewFile = _f[1];

  return /*#__PURE__*/React__default.createElement(Modal, {
    titleText: stringSet.EDIT_PROFILE__TITLE,
    submitText: stringSet.BUTTON__SAVE,
    type: Type.PRIMARY,
    onCancel: onCancel,
    onSubmit: function onSubmit() {
      if (user.nickname !== '' && !inputRef.current.value) {
        if (formRef.current.reportValidity) {
          // might not work in explorer
          formRef.current.reportValidity();
        }

        return;
      }

      _onSubmit(inputRef.current.value, newFile);

      onCancel();
    }
  }, /*#__PURE__*/React__default.createElement("form", {
    className: "sendbird-edit-user-profile",
    ref: formRef,
    onSubmit: function onSubmit(e) {
      e.preventDefault();
    }
  }, /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird-edit-user-profile__img"
  }, /*#__PURE__*/React__default.createElement(InputLabel, null, stringSet.EDIT_PROFILE__IMAGE_LABEL), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-edit-user-profile__img__avatar"
  }, /*#__PURE__*/React__default.createElement(Avatar, {
    width: "80px",
    height: "80px",
    src: currentImg || user.profileUrl
  })), /*#__PURE__*/React__default.createElement("input", {
    ref: hiddenInputRef,
    type: "file",
    accept: "image/gif, image/jpeg, image/png",
    style: {
      display: 'none'
    },
    onChange: function onChange(e) {
      setCurrentImg(URL.createObjectURL(e.target.files[0]));
      setNewFile(e.target.files[0]);
      hiddenInputRef.current.value = '';
    }
  }), /*#__PURE__*/React__default.createElement(TextButton, {
    className: "sendbird-edit-user-profile__img__avatar-button",
    notUnderline: true,
    onClick: function onClick() {
      return hiddenInputRef.current.click();
    }
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.BUTTON_1,
    color: LabelColors.PRIMARY
  }, stringSet.EDIT_PROFILE__IMAGE_UPLOAD))), /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird-edit-user-profile__name"
  }, /*#__PURE__*/React__default.createElement(InputLabel, null, stringSet.EDIT_PROFILE__NICKNAME_LABEL), /*#__PURE__*/React__default.createElement(Input, {
    required: user.nickname !== '',
    name: "sendbird-edit-user-profile__name__input",
    ref: inputRef,
    value: user.nickname,
    placeHolder: stringSet.EDIT_PROFILE__NICKNAME_PLACEHOLDER
  })), /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird-edit-user-profile__userid"
  }, /*#__PURE__*/React__default.createElement(InputLabel, null, stringSet.EDIT_PROFILE__USERID_LABEL), /*#__PURE__*/React__default.createElement(Input, {
    disabled: true,
    name: "sendbird-edit-user-profile__userid__input",
    value: user.userId
  })), /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird-edit-user-profile__theme"
  }, /*#__PURE__*/React__default.createElement(InputLabel, null, stringSet.EDIT_PROFILE__THEME_LABEL), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-edit-user-profile__theme__theme-icon"
  }, theme === 'dark' ? /*#__PURE__*/React__default.createElement(Icon, {
    onClick: function onClick() {
      changeTheme('light');

      if (onThemeChange && typeof onThemeChange === 'function') {
        onThemeChange('light');
      }
    },
    type: IconTypes.TOGGLE_ON,
    width: 44,
    height: 24
  }) : /*#__PURE__*/React__default.createElement(Icon, {
    onClick: function onClick() {
      changeTheme('dark');

      if (onThemeChange && typeof onThemeChange === 'function') {
        onThemeChange('dark');
      }
    },
    type: IconTypes.TOGGLE_OFF,
    width: 44,
    height: 24
  })))));
}

var mapStoreToProps = function mapStoreToProps(store) {
  return {
    theme: store.config.theme,
    changeTheme: store.config.setCurrenttheme
  };
};

var ConnectedEditUserProfile = withSendbirdContext(EditUserProfile, mapStoreToProps);

function AddChannel(_ref) {
  var sdk = _ref.sdk,
      disabled = _ref.disabled,
      channelListDispatcher = _ref.channelListDispatcher,
      onBeforeCreateChannel = _ref.onBeforeCreateChannel,
      userId = _ref.userId,
      userFilledApplicationUserListQuery = _ref.userFilledApplicationUserListQuery,
      userListQuery = _ref.userListQuery;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showModal = _useState2[0],
      setShowModal = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      step = _useState4[0],
      setStep = _useState4[1];

  var _useState5 = useState('group'),
      _useState6 = _slicedToArray(_useState5, 2),
      type = _useState6[0],
      setType = _useState6[1];

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  if (!sdk || !sdk.createApplicationUserListQuery) {
    return null;
  }

  var isBroadcastAvailable = isBroadcastChannelEnabled(sdk);
  var isSupergroupAvailable = isSuperGroupChannelEnabled(sdk);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(IconButton, {
    height: "32px",
    width: "32px",
    onClick: function onClick() {
      setShowModal(true);
    },
    disabled: disabled
  }, /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.CREATE,
    fillColor: IconColors.PRIMARY,
    width: "24px",
    height: "24px"
  })), showModal && step === 0 && /*#__PURE__*/React__default.createElement(Modal, {
    titleText: "New channel",
    hideFooter: true,
    onCancel: function onCancel() {
      setShowModal(false);
    },
    onSubmit: function onSubmit() {}
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-add-channel__rectangle-wrap"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-add-channel__rectangle",
    onClick: function onClick() {
      setType('group');
      setStep(1);
    },
    role: "button",
    tabIndex: 0,
    onKeyDown: function onKeyDown() {
      setType('group');
      setStep(1);
    }
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-add-channel__rectangle__chat-icon",
    type: IconTypes.CHAT,
    fillColor: IconColors.PRIMARY,
    width: "28px",
    height: "28px"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, "Group")), isSupergroupAvailable && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-add-channel__rectangle",
    onClick: function onClick() {
      setType('supergroup');
      setStep(1);
    },
    role: "button",
    tabIndex: 0,
    onKeyDown: function onKeyDown() {
      setType('supergroup');
      setStep(1);
    }
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-add-channel__rectangle__supergroup-icon",
    type: IconTypes.SUPERGROUP,
    fillColor: IconColors.PRIMARY,
    width: "28px",
    height: "28px"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, "Super group")), isBroadcastAvailable && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-add-channel__rectangle",
    onClick: function onClick() {
      setType('broadcast');
      setStep(1);
    },
    role: "button",
    tabIndex: 0,
    onKeyDown: function onKeyDown() {
      setType('broadcast');
      setStep(1);
    }
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-add-channel__rectangle__broadcast-icon",
    type: IconTypes.BROADCAST,
    fillColor: IconColors.PRIMARY,
    width: "28px",
    height: "28px"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, "Broadcast")))), showModal && step === 1 && /*#__PURE__*/React__default.createElement(InviteMembers, {
    swapParams: sdk && sdk.getErrorFirstCallback && sdk.getErrorFirstCallback(),
    titleText: stringSet.MODAL__CREATE_CHANNEL__TITLE,
    submitText: stringSet.BUTTON__CREATE,
    closeModal: function closeModal() {
      setStep(0);
      setShowModal(false);
    },
    idsToFilter: [userId],
    userQueryCreator: function userQueryCreator() {
      return userListQuery && typeof userListQuery === 'function' ? userListQuery() : createDefaultUserListQuery({
        sdk: sdk,
        userFilledApplicationUserListQuery: userFilledApplicationUserListQuery
      });
    },
    onSubmit: function onSubmit(selectedUsers) {
      return createChannel(sdk, selectedUsers, onBeforeCreateChannel, userId, type).then(function (channel) {
        // maybe - do this in event listener
        channelListDispatcher({
          type: CREATE_CHANNEL,
          payload: channel
        });
      });
    }
  }));
}
AddChannel.propTypes = {
  sdk: PropTypes.shape({
    getErrorFirstCallback: PropTypes.func,
    createApplicationUserListQuery: PropTypes.func
  }).isRequired,
  disabled: PropTypes.bool,
  channelListDispatcher: PropTypes.func.isRequired,
  userFilledApplicationUserListQuery: PropTypes.shape({}),
  onBeforeCreateChannel: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userListQuery: PropTypes.func
};
AddChannel.defaultProps = {
  disabled: false,
  userFilledApplicationUserListQuery: {},
  onBeforeCreateChannel: null,
  userListQuery: null
};

function ChannelPreviewAction(_ref) {
  var disabled = _ref.disabled,
      onLeaveChannel = _ref.onLeaveChannel;
  var parentRef = useRef(null);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showModal = _useState2[0],
      setShowModal = _useState2[1];

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    role: "button",
    style: {
      display: 'inline-block'
    },
    onKeyDown: function onKeyDown(e) {
      e.stopPropagation();
    },
    tabIndex: 0,
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React__default.createElement(ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default.createElement(IconButton, {
        ref: parentRef,
        onClick: toggleDropdown,
        height: "32px",
        width: "32px"
      }, /*#__PURE__*/React__default.createElement(Icon, {
        type: IconTypes.MORE,
        fillColor: IconColors.PRIMARY,
        width: "24px",
        height: "24px"
      }));
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default.createElement(MenuItems, {
        parentRef: parentRef,
        parentContainRef: parentRef,
        closeDropdown: closeDropdown
      }, /*#__PURE__*/React__default.createElement(MenuItem, {
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          setShowModal(true);
          closeDropdown();
        }
      }, stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE));
    }
  }), showModal && /*#__PURE__*/React__default.createElement(LeaveChannel, {
    onCloseModal: function onCloseModal() {
      return setShowModal(false);
    },
    onLeaveChannel: onLeaveChannel
  }));
}
ChannelPreviewAction.propTypes = {
  disabled: PropTypes.bool,
  onLeaveChannel: PropTypes.func.isRequired
};
ChannelPreviewAction.defaultProps = {
  disabled: false
};

function ChannelsPlaceholder(_ref) {
  var type = _ref.type;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-list"
  }, /*#__PURE__*/React__default.createElement(PlaceHolder, {
    type: type
  }));
}
ChannelsPlaceholder.propTypes = {
  type: PropTypes.string.isRequired
};

var createEventHandler = function createEventHandler(_ref) {
  var sdk = _ref.sdk,
      sdkChannelHandlerId = _ref.sdkChannelHandlerId,
      channelListDispatcher = _ref.channelListDispatcher,
      logger = _ref.logger;
  var ChannelHandler = new sdk.ChannelHandler();

  ChannelHandler.onChannelChanged = function (channel) {
    logger.info('ChannelList: onChannelChanged', channel);
    channelListDispatcher({
      type: ON_CHANNEL_CHANGED,
      payload: channel
    });
  };

  ChannelHandler.onChannelDeleted = function (channelUrl) {
    logger.info('ChannelList: onChannelDeleted', channelUrl);
    channelListDispatcher({
      type: ON_CHANNEL_DELETED,
      payload: channelUrl
    });
  };

  ChannelHandler.onUserJoined = function (channel) {
    logger.info('ChannelList: onUserJoined', channel);

    if (channel.lastMessage) {
      channelListDispatcher({
        type: ON_USER_JOINED,
        payload: channel
      });
    }
  };

  ChannelHandler.onUserBanned = function (channel, user) {
    var currentUser = sdk.currentUser;
    logger.info('Channel | useHandleChannelEvents: onUserBanned', channel);

    if (user.userId === currentUser.userId) {
      channelListDispatcher({
        type: ON_USER_LEFT,
        payload: {
          channel: channel,
          isMe: true
        }
      });
    } else {
      channelListDispatcher({
        type: ON_USER_LEFT,
        payload: {
          channel: channel,
          isMe: false
        }
      });
    }
  };

  ChannelHandler.onUserLeft = function (channel, leftUser) {
    var currentUser = sdk.currentUser;
    var isMe = currentUser.userId === leftUser.userId;
    logger.info('ChannelList: onUserLeft', channel);
    channelListDispatcher({
      type: ON_USER_LEFT,
      payload: {
        channel: channel,
        isMe: isMe
      }
    });
  };

  ChannelHandler.onReadStatus = function (channel) {
    logger.info('ChannelList: onReadStatus', channel);
    channelListDispatcher({
      type: ON_READ_RECEIPT_UPDATED,
      payload: channel
    });
  };

  ChannelHandler.onDeliveryReceiptUpdated = function (channel) {
    logger.info('ChannelList: onDeliveryReceiptUpdated', channel);

    if (channel.lastMessage) {
      channelListDispatcher({
        type: ON_DELIVERY_RECEIPT_UPDATED,
        payload: channel
      });
    }
  };

  ChannelHandler.onMessageUpdated = function (channel, message) {
    if (channel.lastMessage.isEqual(message)) {
      logger.info('ChannelList: onMessageUpdated', channel);
      channelListDispatcher({
        type: ON_LAST_MESSAGE_UPDATED,
        payload: channel
      });
    }
  };

  ChannelHandler.onChannelHidden = function (channel) {
    logger.info('ChannelList: onChannelHidden', channel);
    channelListDispatcher({
      type: ON_CHANNEL_ARCHIVED,
      payload: channel
    });
  };

  ChannelHandler.onChannelFrozen = function (channel) {
    logger.info('ChannelList: onChannelFrozen', channel);
    channelListDispatcher({
      type: ON_CHANNEL_FROZEN,
      payload: channel
    });
  };

  ChannelHandler.onChannelUnfrozen = function (channel) {
    logger.info('ChannelList: onChannelUnfrozen', channel);
    channelListDispatcher({
      type: ON_CHANNEL_UNFROZEN,
      payload: channel
    });
  };

  logger.info('ChannelList: Added channelHandler');
  sdk.addChannelHandler(sdkChannelHandlerId, ChannelHandler);
};

var createChannelListQuery = function createChannelListQuery(_ref2) {
  var sdk = _ref2.sdk,
      _ref2$userFilledChann = _ref2.userFilledChannelListQuery,
      userFilledChannelListQuery = _ref2$userFilledChann === void 0 ? {} : _ref2$userFilledChann;
  var channelListQuery = sdk.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.includeEmpty = false;
  channelListQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'

  channelListQuery.limit = 20; // The value of pagination limit could be set up to 100.

  if (userFilledChannelListQuery) {
    Object.keys(userFilledChannelListQuery).forEach(function (key) {
      channelListQuery[key] = userFilledChannelListQuery[key];
    });
  }

  return channelListQuery;
};
/**
 * Setup event listener
 * create channel source query
 * addloading screen
 */


function setupChannelList(_ref3) {
  var sdk = _ref3.sdk,
      sdkChannelHandlerId = _ref3.sdkChannelHandlerId,
      channelListDispatcher = _ref3.channelListDispatcher,
      setChannelSource = _ref3.setChannelSource,
      onChannelSelect = _ref3.onChannelSelect,
      userFilledChannelListQuery = _ref3.userFilledChannelListQuery,
      logger = _ref3.logger,
      sortChannelList = _ref3.sortChannelList;

  if (sdk && sdk.ChannelHandler) {
    createEventHandler({
      sdk: sdk,
      channelListDispatcher: channelListDispatcher,
      sdkChannelHandlerId: sdkChannelHandlerId,
      logger: logger
    });
  } else {
    logger.console.warning('ChannelList - createEventHandler: sdk or sdk.ChannelHandler does not exist', sdk);
  }

  logger.info('ChannelList - creating query', {
    userFilledChannelListQuery: userFilledChannelListQuery
  });
  var channelListQuery = createChannelListQuery({
    sdk: sdk,
    userFilledChannelListQuery: userFilledChannelListQuery
  });
  logger.info('ChannelList - created query', channelListQuery);
  setChannelSource(channelListQuery);
  channelListDispatcher({
    type: INIT_CHANNELS_START
  });

  if (userFilledChannelListQuery) {
    logger.info('ChannelList - setting up channelListQuery', channelListQuery);
    channelListDispatcher({
      type: CHANNEL_LIST_PARAMS_UPDATED,
      payload: {
        channelListQuery: channelListQuery,
        currentUserId: sdk && sdk.currentUser && sdk.currentUser.userId
      }
    });
  }

  logger.info('ChannelList - fetching channels');

  if (channelListQuery.hasNext) {
    channelListQuery.next(function (response, error) {
      var swapParams = sdk.getErrorFirstCallback();
      var channelList = response;
      var err = error;

      if (swapParams) {
        channelList = error;
        err = response;
      }

      logger.info('ChannelList - fetched channels', channelList);

      if (err) {
        logger.error('ChannelList - couldnt fetch channels', err);
        channelListDispatcher({
          type: INIT_CHANNELS_FAILURE
        });
        return;
      } // select first channel


      logger.info('ChannelList - highlight channel', channelList[0]);
      var sorted = channelList;

      if (sortChannelList && typeof sortChannelList === 'function') {
        sorted = sortChannelList(channelList);
        logger.info('ChannelList - channel list sorted', sorted);
      }

      onChannelSelect(sorted[0]);
      channelListDispatcher({
        type: INIT_CHANNELS_SUCCESS,
        payload: sorted
      });

      if (channelList && typeof channelList.forEach === 'function') {
        logger.info('ChannelList - mark all channels as delivered');
        channelList.forEach(function (c) {
          return c.markAsDelivered();
        });
      }
    });
  } else {
    logger.warning('ChannelList - there are no more channels');
  }
}

var pubSubHandleRemover = function pubSubHandleRemover(subscriber) {
  subscriber.forEach(function (s) {
    try {
      s.remove();
    } catch (_unused) {//
    }
  });
};
var pubSubHandler = function pubSubHandler(pubSub, channelListDispatcher) {
  var subScriber = new Map();
  if (!pubSub) return subScriber;
  subScriber.set(CREATE_CHANNEL$1, pubSub.subscribe(CREATE_CHANNEL$1, function (msg) {
    var channel = msg.channel;
    channelListDispatcher({
      type: 'CREATE_CHANNEL',
      payload: channel
    });
  }));
  subScriber.set(UPDATE_USER_MESSAGE, pubSub.subscribe(UPDATE_USER_MESSAGE, function (msg) {
    var channel = msg.channel,
        message = msg.message;
    var updatedChannel = channel;
    updatedChannel.lastMessage = message;

    if (channel) {
      channelListDispatcher({
        type: ON_LAST_MESSAGE_UPDATED,
        payload: updatedChannel
      });
    }
  }));
  subScriber.set(LEAVE_CHANNEL, pubSub.subscribe(LEAVE_CHANNEL, function (msg) {
    var channel = msg.channel;
    channelListDispatcher({
      type: LEAVE_CHANNEL_SUCCESS,
      payload: channel.url
    });
  }));
  subScriber.set(SEND_MESSAGE_START, pubSub.subscribe(SEND_MESSAGE_START, function (msg) {
    var channel = msg.channel;
    channelListDispatcher({
      type: CHANNEL_REPLACED_TO_TOP,
      payload: channel
    });
  }));
  return subScriber;
};

var noop = function noop() {};

function ChannelList(props) {
  var _props$stores = props.stores,
      _props$stores$sdkStor = _props$stores.sdkStore,
      sdkStore = _props$stores$sdkStor === void 0 ? {} : _props$stores$sdkStor,
      _props$stores$userSto = _props$stores.userStore,
      userStore = _props$stores$userSto === void 0 ? {} : _props$stores$userSto,
      _props$config = props.config,
      userId = _props$config.userId,
      isOnline = _props$config.isOnline,
      userListQuery = _props$config.userListQuery,
      logger = _props$config.logger,
      pubSub = _props$config.pubSub,
      theme = _props$config.theme,
      userDispatcher = props.dispatchers.userDispatcher,
      _props$queries = props.queries,
      queries = _props$queries === void 0 ? {} : _props$queries,
      renderChannelPreview = props.renderChannelPreview,
      renderHeader = props.renderHeader,
      renderUserProfile = props.renderUserProfile,
      disableUserProfile = props.disableUserProfile,
      allowProfileEdit = props.allowProfileEdit,
      sortChannelList = props.sortChannelList,
      onProfileEditSuccess = props.onProfileEditSuccess,
      onThemeChange = props.onThemeChange,
      onBeforeCreateChannel = props.onBeforeCreateChannel,
      onChannelSelect = props.onChannelSelect;
  var _props$config2 = props.config,
      config = _props$config2 === void 0 ? {} : _props$config2; // enable if it is true atleast once(both are flase by default)

  var enableEditProfile = allowProfileEdit || config.allowProfileEdit;
  var userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  var userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;
  var _sdkStore$sdk = sdkStore.sdk,
      sdk = _sdkStore$sdk === void 0 ? {} : _sdkStore$sdk;
  var userFilledChannelListQuery = queries.channelListQuery;
  var userFilledApplicationUserListQuery = queries.applicationUserListQuery;
  var sdkError = sdkStore.error;
  var sdkIntialized = sdkStore.initialized;

  var _useReducer = useReducer(reducer, channelListInitialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      channelListStore = _useReducer2[0],
      channelListDispatcher = _useReducer2[1];

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      user = _useState2[0],
      setUser = _useState2[1];

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      channelSource = _useState4[0],
      setChannelSource = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      showProfileEdit = _useState6[0],
      setShowProfileEdit = _useState6[1];

  var _useState7 = useState(null),
      _useState8 = _slicedToArray(_useState7, 2),
      sdkChannelHandlerId = _useState8[0],
      setSdkChannelHandlerId = _useState8[1];

  var loading = channelListStore.loading,
      currentChannel = channelListStore.currentChannel;
  useEffect(function () {
    setUser(userStore.user);
  }, [userStore.user]);
  useEffect(function () {
    var subscriber = pubSubHandler(pubSub, channelListDispatcher);
    return function () {
      pubSubHandleRemover(subscriber);
    };
  }, [sdkIntialized]);
  useEffect(function () {
    setSdkChannelHandlerId(uuidv4);

    if (sdkIntialized) {
      logger.info('ChannelList: Setup channelHandlers');
      setupChannelList({
        sdk: sdk,
        sdkChannelHandlerId: sdkChannelHandlerId,
        channelListDispatcher: channelListDispatcher,
        setChannelSource: setChannelSource,
        onChannelSelect: onChannelSelect,
        userFilledChannelListQuery: userFilledChannelListQuery,
        logger: logger,
        sortChannelList: sortChannelList
      });
    } else {
      logger.info('ChannelList: Removing channelHandlers'); // remove previous channelHandlers

      if (sdk && sdk.removeChannelHandler) {
        sdk.removeChannelHandler(sdkChannelHandlerId);
      } // remove channelSource


      setChannelSource({}); // cleanup

      channelListDispatcher({
        type: RESET_CHANNEL_LIST
      });
    }

    return function () {
      logger.info('ChannelList: Removing channelHandlers');

      if (sdk && sdk.removeChannelHandler) {
        sdk.removeChannelHandler(sdkChannelHandlerId);
      }
    };
  }, [sdkIntialized, userFilledChannelListQuery, sortChannelList]);
  var allChannels = channelListStore.allChannels;
  var sortedChannels = sortChannelList && typeof sortChannelList === 'function' ? sortChannelList(allChannels) : allChannels;

  if (sortedChannels.length !== allChannels.length) {
    var warning = "ChannelList: You have removed/added extra channels on sortChannelList\n      this could cause unexpected problems"; // eslint-disable-next-line no-console

    console.warn(warning, {
      before: allChannels,
      after: sortedChannels
    });
    logger.warning(warning, {
      before: allChannels,
      after: sortedChannels
    });
  }

  useEffect(function () {
    if (!sdk || !sdk.GroupChannel || !currentChannel) {
      return;
    }

    sdk.GroupChannel.getChannel(currentChannel, function (groupChannel) {
      if (groupChannel) {
        onChannelSelect(groupChannel);
      } else {
        onChannelSelect(null);
      }
    });
  }, [currentChannel]);
  return /*#__PURE__*/React__default.createElement(UserProfileProvider, {
    className: "sendbird-channel-list",
    disableUserProfile: userDefinedDisableUserProfile,
    renderUserProfile: userDefinedRenderProfile
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-list__header"
  }, /*#__PURE__*/React__default.createElement(ChannelHeader, {
    renderHeader: renderHeader,
    user: user,
    onEdit: function onEdit() {
      if (enableEditProfile) {
        setShowProfileEdit(true);
      }
    },
    allowProfileEdit: enableEditProfile,
    iconButton: /*#__PURE__*/React__default.createElement(AddChannel, {
      disabled: !isOnline,
      userListQuery: userListQuery,
      sdk: sdk,
      channelListDispatcher: channelListDispatcher,
      userId: userId,
      userFilledApplicationUserListQuery: userFilledApplicationUserListQuery,
      onBeforeCreateChannel: onBeforeCreateChannel
    })
  })), showProfileEdit && /*#__PURE__*/React__default.createElement(ConnectedEditUserProfile, {
    onThemeChange: onThemeChange,
    user: user,
    onCancel: function onCancel() {
      setShowProfileEdit(false);
    },
    onSubmit: function onSubmit(newName, newFile) {
      sdk.updateCurrentUserInfoWithProfileImage(newName, newFile, function (updatedUser) {
        userDispatcher({
          type: UPDATE_USER_INFO,
          payload: updatedUser
        });

        if (onProfileEditSuccess && typeof onProfileEditSuccess === 'function') {
          onProfileEditSuccess(updatedUser);
        }
      });
    }
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-list__body",
    onScroll: function onScroll(e) {
      var fetchMore = e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight;

      if (fetchMore && channelSource.hasNext) {
        logger.info('ChannelList: Fetching more channels');
        channelListDispatcher({
          type: FETCH_CHANNELS_START
        });
        channelSource.next(function (response, error) {
          var swapParams = sdk.getErrorFirstCallback();
          var channelList = response;
          var err = error;

          if (swapParams) {
            channelList = error;
            err = response;
          }

          if (err) {
            logger.info('ChannelList: Fetching channels failed', err);
            channelListDispatcher({
              type: FETCH_CHANNELS_FAILURE,
              payload: channelList
            });
            return;
          }

          logger.info('ChannelList: Fetching channels successful', channelList);
          channelListDispatcher({
            type: FETCH_CHANNELS_SUCCESS,
            payload: channelList
          });

          if (channelList && typeof channelList.forEach === 'function') {
            logger.info('ChannelList: Marking all channels as read');
            channelList.forEach(function (c) {
              return c.markAsDelivered();
            });
          }
        });
      }
    }
  }, sdkError && /*#__PURE__*/React__default.createElement(ChannelsPlaceholder, {
    type: PlaceHolderTypes.WRONG
  }), /*#__PURE__*/React__default.createElement("div", null, sortedChannels && sortedChannels.map(function (channel, idx) {
    var _onLeaveChannel = function onLeaveChannel(c, cb) {
      logger.info('ChannelList: Leaving channel', c);
      c.leave().then(function (res) {
        logger.info('ChannelList: Leaving channel success', res);

        if (cb && typeof cb === 'function') {
          cb(res, null);
        }

        channelListDispatcher({
          type: LEAVE_CHANNEL_SUCCESS,
          payload: channel.url
        });
      }).catch(function (err) {
        logger.error('ChannelList: Leaving channel failed', err);

        if (cb && typeof cb === 'function') {
          cb(null, err);
        }
      });
    };

    var onClick = function onClick() {
      if (!isOnline) {
        return;
      }

      logger.info('ChannelList: Clicked on channel:', channel);
      channelListDispatcher({
        type: SET_CURRENT_CHANNEL,
        payload: channel.url
      });
    };

    return renderChannelPreview ?
    /*#__PURE__*/
    // eslint-disable-next-line
    React__default.createElement("div", {
      key: channel.url,
      onClick: onClick
    }, renderChannelPreview({
      channel: channel,
      onLeaveChannel: _onLeaveChannel
    })) : /*#__PURE__*/React__default.createElement(ChannelPreview, {
      key: channel.url,
      tabIndex: idx,
      onClick: onClick,
      channel: channel,
      currentUser: user,
      theme: theme,
      isActive: channel.url === currentChannel // todo - potential performance hit refactor
      ,
      ChannelAction: /*#__PURE__*/React__default.createElement(ChannelPreviewAction, {
        disabled: !isOnline,
        onLeaveChannel: function onLeaveChannel() {
          return _onLeaveChannel(channel);
        }
      })
    });
  })), (!sdkIntialized || loading) && /*#__PURE__*/React__default.createElement(ChannelsPlaceholder, {
    type: PlaceHolderTypes.LOADING
  }), //  placeholder
  (!allChannels || allChannels.length === 0) && /*#__PURE__*/React__default.createElement(ChannelsPlaceholder, {
    type: PlaceHolderTypes.NO_CHANNELS
  })));
}

ChannelList.propTypes = {
  stores: PropTypes.shape({
    sdkStore: PropTypes.shape({
      initialized: PropTypes.bool
    }),
    userStore: PropTypes.shape({
      user: PropTypes.shape({})
    })
  }).isRequired,
  dispatchers: PropTypes.shape({
    userDispatcher: PropTypes.func
  }).isRequired,
  config: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userListQuery: PropTypes.func,
    theme: PropTypes.string,
    isOnline: PropTypes.bool,
    logger: PropTypes.shape({
      info: PropTypes.func,
      error: PropTypes.func,
      warning: PropTypes.func
    }),
    pubSub: PropTypes.shape({
      subscribe: PropTypes.func,
      publish: PropTypes.func
    })
  }).isRequired,
  queries: PropTypes.shape({
    channelListQuery: PropTypes.shape({
      channelNameContainsFilter: PropTypes.string,
      channelUrlsFilter: PropTypes.arrayOf(PropTypes.string),
      customTypesFilter: PropTypes.arrayOf(PropTypes.string),
      customTypeStartsWithFilter: PropTypes.string,
      hiddenChannelFilter: PropTypes.string,
      includeEmpty: PropTypes.bool,
      limit: PropTypes.number,
      memberStateFilter: PropTypes.string,
      metadataOrderKeyFilter: PropTypes.string,
      nicknameContainsFilter: PropTypes.string,
      order: PropTypes.string,
      publicChannelFilter: PropTypes.string,
      superChannelFilter: PropTypes.string,
      unreadChannelFilter: PropTypes.string,
      userIdsExactFilter: PropTypes.arrayOf(PropTypes.string),
      userIdsIncludeFilter: PropTypes.arrayOf(PropTypes.string),
      userIdsIncludeFilterQueryType: PropTypes.string
    }),
    applicationUserListQuery: PropTypes.shape({
      limit: PropTypes.number,
      userIdsFilter: PropTypes.arrayOf(PropTypes.string),
      metaDataKeyFilter: PropTypes.string,
      metaDataValuesFilter: PropTypes.arrayOf(PropTypes.string)
    })
  }),
  onBeforeCreateChannel: PropTypes.func,
  renderChannelPreview: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  disableUserProfile: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  allowProfileEdit: PropTypes.bool,
  sortChannelList: PropTypes.func,
  onThemeChange: PropTypes.func,
  onProfileEditSuccess: PropTypes.func,
  renderHeader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  onChannelSelect: PropTypes.func
};
ChannelList.defaultProps = {
  onBeforeCreateChannel: null,
  renderChannelPreview: null,
  renderHeader: null,
  disableUserProfile: false,
  renderUserProfile: null,
  allowProfileEdit: false,
  onThemeChange: null,
  sortChannelList: null,
  onProfileEditSuccess: null,
  queries: {},
  onChannelSelect: noop
};
var ChannelList$1 = withSendbirdContext(ChannelList);

export { ChannelList$1 as default };
//# sourceMappingURL=ChannelList.js.map
