import React__default, { useState, useContext, Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { _ as __assign, d as __spreadArray, b as _slicedToArray, e as _toConsumableArray, a as _objectSpread2, c as LocalizationContext, w as withSendbirdContext, h as _inherits, i as _createSuper, k as _classCallCheck, f as _defineProperty, l as _assertThisInitialized, j as _createClass } from './LocalizationContext-0bd08445.js';
import { g as format, L as Label, a as LabelTypography, b as LabelColors, I as Icon, c as IconTypes, d as IconColors, A as Avatar } from './index-f1fc6f50.js';

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */

var UserProfileContext = /*#__PURE__*/React__default.createContext({
  disableUserProfile: true,
  isOpenChannel: false,
  renderUserProfile: null
});

var UserProfileProvider = function UserProfileProvider(props) {
  var children = props.children,
      className = props.className;
  return /*#__PURE__*/React__default.createElement(UserProfileContext.Provider, {
    value: props
  }, /*#__PURE__*/React__default.createElement("div", {
    className: className
  }, children));
};

UserProfileProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element), PropTypes.any]).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isOpenChannel: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  disableUserProfile: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  renderUserProfile: PropTypes.func,
  className: PropTypes.string
};
UserProfileProvider.defaultProps = {
  className: null,
  isOpenChannel: false,
  disableUserProfile: false,
  renderUserProfile: null
};

var SUPPORTED_MIMES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp' // not supported in IE
  ],
  VIDEO: ['video/mpeg', 'video/ogg', 'video/webm', 'video/mp4'],
  AUDIO: ['audio/aac', 'audio/midi', 'audio/x-midi', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm', 'audio/3gpp', 'audio/3gpp2', 'audio/mp3']
};
var UIKitMessageTypes = {
  ADMIN: "ADMIN",
  TEXT: "TEXT",
  FILE: "FILE",
  THUMBNAIL: "THUMBNAIL",
  OG: "OG",
  UNKNOWN: "UNKNOWN"
};
var UIKitFileTypes = {
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  GIF: "GIF",
  OTHERS: "OTHERS"
};
var SendingMessageStatus = {
  NONE: 'none',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  PENDING: 'pending'
};
var OutgoingMessageStates = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DELIVERED: 'DELIVERED',
  READ: 'READ'
};
var isImage = function isImage(type) {
  return SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
};
var isVideo = function isVideo(type) {
  return SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0;
};
var isGif = function isGif(type) {
  return type === 'image/gif';
};
var isSupportedFileView = function isSupportedFileView(type) {
  return isImage(type) || isVideo(type);
};
var isAudio = function isAudio(type) {
  return SUPPORTED_MIMES.AUDIO.indexOf(type) >= 0;
};
var getUIKitFileType = function getUIKitFileType(type) {
  if (isGif(type)) return UIKitFileTypes.GIF;
  if (isImage(type)) return UIKitFileTypes.IMAGE;
  if (isVideo(type)) return UIKitFileTypes.VIDEO;
  if (isAudio(type)) return UIKitFileTypes.AUDIO;
  return UIKitFileTypes.OTHERS;
};
var getOutgoingMessageStates = function getOutgoingMessageStates() {
  return __assign({}, OutgoingMessageStates);
};
var getOutgoingMessageState = function getOutgoingMessageState(channel, message) {
  if (message.sendingStatus === 'pending') return OutgoingMessageStates.PENDING;
  if (message.sendingStatus === 'failed') return OutgoingMessageStates.FAILED;

  if (channel.isGroupChannel()) {
    /* GroupChannel only */
    if (channel.getUnreadMemberCount(message) === 0) {
      return OutgoingMessageStates.READ;
    } else if (channel.getUndeliveredMemberCount(message) === 0) {
      return OutgoingMessageStates.DELIVERED;
    }
  }

  if (message.sendingStatus === 'succeeded') return OutgoingMessageStates.SENT;
  return OutgoingMessageStates.NONE;
};
var isSentMessage = function isSentMessage(channel, message) {
  return getOutgoingMessageState(channel, message) === OutgoingMessageStates.SENT || getOutgoingMessageState(channel, message) === OutgoingMessageStates.DELIVERED || getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ;
};
var isFailedMessage = function isFailedMessage(channel, message) {
  return getOutgoingMessageState(channel, message) === OutgoingMessageStates.FAILED;
};
var isSentStatus = function isSentStatus(state) {
  return state === OutgoingMessageStates.SENT || state === OutgoingMessageStates.DELIVERED || state === OutgoingMessageStates.READ;
};
var isAdminMessage = function isAdminMessage(message) {
  var _a;

  return message && (((_a = message.isAdminMessage) === null || _a === void 0 ? void 0 : _a.call(message)) || message['messageType'] && message.messageType === 'admin');
};
var isUserMessage = function isUserMessage(message) {
  var _a;

  return message && (((_a = message.isUserMessage) === null || _a === void 0 ? void 0 : _a.call(message)) || message['messageType'] && message.messageType === 'user');
};
var isFileMessage = function isFileMessage(message) {
  var _a;

  return message && (((_a = message.isFileMessage) === null || _a === void 0 ? void 0 : _a.call(message)) || message['messageType'] && message.messageType === 'file');
};
var isOGMessage = function isOGMessage(message) {
  var _a;

  return !!(message && isUserMessage(message) && (message === null || message === void 0 ? void 0 : message.ogMetaData) && ((_a = message === null || message === void 0 ? void 0 : message.ogMetaData) === null || _a === void 0 ? void 0 : _a.url));
};
var isTextMessage = function isTextMessage(message) {
  return isUserMessage(message) && !isOGMessage(message);
};
var isThumbnailMessage = function isThumbnailMessage(message) {
  return message && isFileMessage(message) && isSupportedFileView(message.type);
};
var isVideoMessage = function isVideoMessage(message) {
  return message && isThumbnailMessage(message) && isVideo(message.type);
};
var isGifMessage = function isGifMessage(message) {
  return message && isThumbnailMessage(message) && isGif(message.type);
};
var isEditedMessage = function isEditedMessage(message) {
  return isUserMessage(message) && (message === null || message === void 0 ? void 0 : message.updatedAt) > 0;
};
var getUIKitMessageTypes = function getUIKitMessageTypes() {
  return __assign({}, UIKitMessageTypes);
};
var getUIKitMessageType = function getUIKitMessageType(message) {
  if (isAdminMessage(message)) return UIKitMessageTypes.ADMIN;

  if (isUserMessage(message)) {
    return isOGMessage(message) ? UIKitMessageTypes.OG : UIKitMessageTypes.TEXT;
  }

  if (isFileMessage(message)) {
    return isThumbnailMessage(message) ? UIKitMessageTypes.THUMBNAIL : UIKitMessageTypes.FILE;
  }

  return UIKitMessageTypes.UNKNOWN;
};
var getSendingMessageStatus = function getSendingMessageStatus() {
  return __assign({}, SendingMessageStatus);
};

var reducer = function reducer(accumulator, currentValue) {
  if (Array.isArray(currentValue)) {
    return __spreadArray(__spreadArray([], accumulator, true), currentValue, true);
  } else {
    accumulator.push(currentValue);
    return accumulator;
  }
};

var getClassName = function getClassName(classNames) {
  return Array.isArray(classNames) ? classNames.reduce(reducer, []).join(' ') : classNames;
};
var isReactedBy = function isReactedBy(userId, reaction) {
  return reaction.userIds.some(function (reactorUserId) {
    return reactorUserId === userId;
  });
};
var getEmojiTooltipString = function getEmojiTooltipString(reaction, userId, memberNicknamesMap, stringSet) {
  var you = '';

  if (isReactedBy(userId, reaction)) {
    you = reaction.userIds.length === 1 ? stringSet.TOOLTIP__YOU : stringSet.TOOLTIP__AND_YOU;
  }

  return "" + reaction.userIds.filter(function (reactorUserId) {
    return reactorUserId !== userId;
  }).map(function (reactorUserId) {
    return memberNicknamesMap.get(reactorUserId) || stringSet.TOOLTIP__UNKNOWN_USER;
  }).join(', ') + you;
};
var URL_REG = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
var isUrl = function isUrl(text) {
  return URL_REG.test(text);
};
var truncateString = function truncateString(fullStr, strLen) {
  if (!strLen) strLen = 40;
  if (fullStr === null || fullStr === undefined) return '';
  if (fullStr.length <= strLen) return fullStr;
  var separator = '...';
  var sepLen = separator.length;
  var charsToShow = strLen - sepLen;
  var frontChars = Math.ceil(charsToShow / 2);
  var backChars = Math.floor(charsToShow / 2);
  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};
var copyToClipboard = function copyToClipboard(text) {
  // @ts-ignore: Unreachable code error
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    // @ts-ignore: Unreachable code error
    return window.clipboardData.setData('Text', text);
  }

  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.

    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  return false;
};
var getEmojiListAll = function getEmojiListAll(emojiContainer) {
  return emojiContainer.emojiCategories.map(function (emojiCategory) {
    return emojiCategory.emojis;
  }).reduce(function (prevArr, currArr) {
    return prevArr.concat(currArr);
  }, []);
};
var getEmojiMapAll = function getEmojiMapAll(emojiContainer) {
  var emojiMap = new Map();
  emojiContainer.emojiCategories.forEach(function (category) {
    return category.emojis.forEach(function (emoji) {
      emojiMap.set(emoji.key, emoji);
    });
  });
  return emojiMap;
};
var getUserName = function getUserName(user) {
  return (user === null || user === void 0 ? void 0 : user.friendName) || (user === null || user === void 0 ? void 0 : user.nickname) || (user === null || user === void 0 ? void 0 : user.userId);
};
var getSenderName = function getSenderName(message) {
  return message.sender && getUserName(message.sender);
};
var getMessageCreatedAt = function getMessageCreatedAt(message) {
  return format(message.createdAt || 0, 'p');
};
var hasSameMembers = function hasSameMembers(a, b) {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  var sortedA = __spreadArray([], a, true).sort();

  var sortedB = __spreadArray([], b, true).sort();

  for (var i = 0; i < sortedA.length; ++i) {
    if (sortedA[i] !== sortedB[i]) {
      return false;
    }
  }

  return true;
};
var isFriend = function isFriend(user) {
  return !!(user.friendDiscoveryKey || user.friendName);
};
var filterMessageListParams = function filterMessageListParams(params, message) {
  var _a, _b, _c;

  if ((params === null || params === void 0 ? void 0 : params.messageType) && params.messageType !== message.messageType) {
    return false;
  }

  if (((_a = params === null || params === void 0 ? void 0 : params.customTypes) === null || _a === void 0 ? void 0 : _a.length) > 0 && !params.customTypes.includes(message.customType)) {
    return false;
  }

  if ((params === null || params === void 0 ? void 0 : params.senderUserIds) && ((_b = params === null || params === void 0 ? void 0 : params.senderUserIds) === null || _b === void 0 ? void 0 : _b.length) > 0) {
    if ((message === null || message === void 0 ? void 0 : message.isUserMessage()) || message.isFileMessage()) {
      var messageSender = message.sender || message['_sender'];

      if (!((_c = params === null || params === void 0 ? void 0 : params.senderUserIds) === null || _c === void 0 ? void 0 : _c.includes(messageSender === null || messageSender === void 0 ? void 0 : messageSender.userId))) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
};
var filterChannelListParams = function filterChannelListParams(params, channel, currentUserId) {
  var _a, _b, _c, _d, _e, _f, _g, _h;

  if (!(params === null || params === void 0 ? void 0 : params.includeEmpty) && (channel === null || channel === void 0 ? void 0 : channel.lastMessage) && channel.lastMessage === null) {
    return false;
  }

  if (((_a = params === null || params === void 0 ? void 0 : params._searchFilter) === null || _a === void 0 ? void 0 : _a.search_query) && ((_b = params._searchFilter.search_fields) === null || _b === void 0 ? void 0 : _b.length) > 0) {
    var searchFilter = params._searchFilter;
    var searchQuery_1 = searchFilter.search_query;
    var searchFields = searchFilter.search_fields;

    if (searchQuery_1 && searchFields && searchFields.length > 0) {
      if (!searchFields.some(function (searchField) {
        switch (searchField) {
          case 'channel_name':
            {
              return channel.name.toLowerCase().includes(searchQuery_1.toLowerCase());
            }

          case 'member_nickname':
            {
              return channel.members.some(function (member) {
                return member.nickname.toLowerCase().includes(searchQuery_1.toLowerCase());
              });
            }

          default:
            {
              return true;
            }
        }
      })) {
        return false;
      }
    }
  }

  if (((_d = (_c = params === null || params === void 0 ? void 0 : params._userIdsFilter) === null || _c === void 0 ? void 0 : _c.userIds) === null || _d === void 0 ? void 0 : _d.length) > 0) {
    var userIdsFilter = params._userIdsFilter;
    var includeMode = userIdsFilter.includeMode,
        queryType = userIdsFilter.queryType;
    var userIds = userIdsFilter.userIds;
    var memberIds_1 = channel.members.map(function (member) {
      return member.userId;
    });

    if (!includeMode) {
      // exact match
      if (!userIds.includes(currentUserId)) {
        userIds.push(currentUserId); // add the caller's userId if not added already.
      }

      if (channel.members.length > userIds.length) {
        return false; // userIds may contain one or more non-member(s).
      }

      if (!hasSameMembers(userIds, memberIds_1)) {
        return false;
      }
    } else if (userIds.length > 0) {
      // inclusive
      switch (queryType) {
        case 'AND':
          {
            if (userIds.some(function (userId) {
              return !memberIds_1.includes(userId);
            })) {
              return false;
            }

            break;
          }

        case 'OR':
          {
            if (userIds.every(function (userId) {
              return !memberIds_1.includes(userId);
            })) {
              return false;
            }

            break;
          }
      }
    }
  }

  if ((params === null || params === void 0 ? void 0 : params.includeEmpty) === false && (channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null) {
    return false;
  }

  if ((params === null || params === void 0 ? void 0 : params.includeFrozen) === false && (channel === null || channel === void 0 ? void 0 : channel.isFrozen) === true) {
    return false;
  }

  if (((_e = params === null || params === void 0 ? void 0 : params.customTypesFilter) === null || _e === void 0 ? void 0 : _e.length) > 0 && !params.customTypesFilter.includes(channel === null || channel === void 0 ? void 0 : channel.customType)) {
    return false;
  }

  if ((params === null || params === void 0 ? void 0 : params.customTypeStartsWithFilter) && !new RegExp("^" + params.customTypeStartsWithFilter).test(channel === null || channel === void 0 ? void 0 : channel.customType)) {
    return false;
  }

  if ((params === null || params === void 0 ? void 0 : params.channelNameContainsFilter) && !((_f = channel === null || channel === void 0 ? void 0 : channel.name) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(params.channelNameContainsFilter.toLowerCase()))) {
    return false;
  }

  if (params === null || params === void 0 ? void 0 : params.nicknameContainsFilter) {
    var lowerCasedSubString_1 = params.nicknameContainsFilter.toLowerCase();

    if ((_g = channel === null || channel === void 0 ? void 0 : channel.members) === null || _g === void 0 ? void 0 : _g.every(function (member) {
      return !member.nickname.toLowerCase().includes(lowerCasedSubString_1);
    })) {
      return false;
    }
  }

  if (((_h = params === null || params === void 0 ? void 0 : params.channelUrlsFilter) === null || _h === void 0 ? void 0 : _h.length) > 0 && !params.channelUrlsFilter.includes(channel === null || channel === void 0 ? void 0 : channel.url)) {
    return false;
  }

  if (params === null || params === void 0 ? void 0 : params.memberStateFilter) {
    switch (params.memberStateFilter) {
      case 'joined_only':
        if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'joined') {
          return false;
        }

        break;

      case 'invited_only':
        if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'invited') {
          return false;
        }

        break;

      case 'invited_by_friend':
        if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'invited' || !isFriend(channel.inviter)) {
          return false;
        }

        break;

      case 'invited_by_non_friend':
        if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'invited' || isFriend(channel.inviter)) {
          return false;
        }

        break;
    }
  }

  if (params === null || params === void 0 ? void 0 : params.hiddenChannelFilter) {
    switch (params.hiddenChannelFilter) {
      case 'unhidden_only':
        if ((channel === null || channel === void 0 ? void 0 : channel.isHidden) || (channel === null || channel === void 0 ? void 0 : channel.hiddenState) !== 'unhidden') {
          return false;
        }

        break;

      case 'hidden_only':
        if (!(channel === null || channel === void 0 ? void 0 : channel.isHidden)) {
          return false;
        }

        break;

      case 'hidden_allow_auto_unhide':
        if (!(channel === null || channel === void 0 ? void 0 : channel.isHidden) || (channel === null || channel === void 0 ? void 0 : channel.hiddenState) !== 'hidden_allow_auto_unhide') {
          return false;
        }

        break;

      case 'hidden_prevent_auto_unhide':
        if (!(channel === null || channel === void 0 ? void 0 : channel.isHidden) || (channel === null || channel === void 0 ? void 0 : channel.hiddenState) !== 'hidden_prevent_auto_unhide') {
          return false;
        }

        break;
    }
  }

  if (params === null || params === void 0 ? void 0 : params.unreadChannelFilter) {
    switch (params.unreadChannelFilter) {
      case 'unread_message':
        if ((channel === null || channel === void 0 ? void 0 : channel.unreadMessageCount) === 0) {
          return false;
        }

        break;
    }
  }

  if (params === null || params === void 0 ? void 0 : params.publicChannelFilter) {
    switch (params.publicChannelFilter) {
      case 'public':
        if (!(channel === null || channel === void 0 ? void 0 : channel.isPublic)) {
          return false;
        }

        break;

      case 'private':
        if (channel === null || channel === void 0 ? void 0 : channel.isPublic) {
          return false;
        }

        break;
    }
  }

  if (params === null || params === void 0 ? void 0 : params.superChannelFilter) {
    switch (params.superChannelFilter) {
      case 'super':
        if (!(channel === null || channel === void 0 ? void 0 : channel.isSuper)) {
          return false;
        }

        break;

      case 'nonsuper':
        if (channel === null || channel === void 0 ? void 0 : channel.isSuper) {
          return false;
        }

        break;
    }
  }

  return true;
};
var binarySearch = function binarySearch(list, number) {
  var pivot = Math.floor(list.length / 2);

  if (list[pivot] === number) {
    return pivot;
  }

  var leftList = list.slice(0, pivot);
  var rightList = list.slice(pivot + 1, list.length);

  if (list[pivot] > number) {
    return pivot + 1 + (rightList.length === 0 ? 0 : binarySearch(rightList, number));
  } else {
    return leftList.length === 0 ? pivot : binarySearch(leftList, number);
  }
}; // This is required when channel is displayed on channel list by filter

var getChannelsWithUpsertedChannel = function getChannelsWithUpsertedChannel(channels, channel) {
  var _a;

  if (channels.some(function (ch) {
    return ch.url === channel.url;
  })) {
    return channels.map(function (ch) {
      return ch.url === channel.url ? channel : ch;
    });
  }

  var targetIndex = binarySearch(channels.map(function (channel) {
    var _a;

    return ((_a = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt) || (channel === null || channel === void 0 ? void 0 : channel.createdAt);
  }), ((_a = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt) || (channel === null || channel === void 0 ? void 0 : channel.createdAt));
  return __spreadArray(__spreadArray(__spreadArray([], channels.slice(0, targetIndex), true), [channel], false), channels.slice(targetIndex, channels.length), true);
};

var IconButton = /*#__PURE__*/React__default.forwardRef(function (props, ref) {
  var className = props.className,
      children = props.children,
      disabled = props.disabled,
      width = props.width,
      height = props.height,
      type = props.type,
      _onClick = props.onClick,
      _onBlur = props.onBlur,
      style = props.style;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      pressed = _useState2[0],
      setPressed = _useState2[1];

  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/button-has-type
    React__default.createElement("button", {
      className: [].concat(_toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-iconbutton', pressed]).join(' '),
      disabled: disabled,
      ref: ref,
      type: type // eslint-disable-line react/button-has-type
      ,
      style: _objectSpread2(_objectSpread2({}, style), {}, {
        height: height,
        width: width
      }),
      onClick: function onClick(e) {
        if (disabled) {
          return;
        }

        setPressed('sendbird-iconbutton--pressed');

        _onClick(e);
      },
      onBlur: function onBlur(e) {
        setPressed('');

        _onBlur(e);
      }
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "sendbird-iconbutton__inner"
    }, children))
  );
});
IconButton.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element), PropTypes.any]).isRequired,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.shape({})
};
IconButton.defaultProps = {
  className: '',
  disabled: false,
  width: '56px',
  height: '56px',
  type: 'button',
  onClick: function onClick() {},
  onBlur: function onBlur() {},
  style: {}
};

// simple component to be used as modal root
var MODAL_ROOT = 'sendbird-modal-root';

var Type = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  DANGER: 'DANGER',
  DISABLED: 'DISABLED'
};
var Size = {
  BIG: 'BIG',
  SMALL: 'SMALL'
};

function changeTypeToClassName(type) {
  switch (type) {
    case Type.PRIMARY:
      return 'sendbird-button--primary';

    case Type.SECONDARY:
      return 'sendbird-button--secondary';

    case Type.DANGER:
      return 'sendbird-button--danger';

    case Type.DISABLED:
      return 'sendbird-button--disabled';

    default:
      return null;
  }
}
function changeSizeToClassName(size) {
  switch (size) {
    case Size.BIG:
      return 'sendbird-button--big';

    case Size.SMALL:
      return 'sendbird-button--small';

    default:
      return null;
  }
}

function Button(_ref) {
  var className = _ref.className,
      type = _ref.type,
      size = _ref.size,
      children = _ref.children,
      disabled = _ref.disabled,
      onClick = _ref.onClick;
  var injectingClassNames = [].concat(_toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-button', disabled ? 'sendbird-button__disabled' : '', changeTypeToClassName(type), changeSizeToClassName(size)]).join(' ');
  return /*#__PURE__*/React__default.createElement("button", {
    className: injectingClassNames,
    type: "button",
    onClick: onClick,
    disabled: disabled
  }, /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-button__text",
    type: LabelTypography.BUTTON_1,
    color: LabelColors.ONCONTENT_1
  }, children));
}
var ButtonTypes = Type;
var ButtonSizes = Size;
Button.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  type: PropTypes.oneOf(Object.keys(Type)),
  size: PropTypes.oneOf(Object.keys(Size)),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};
Button.defaultProps = {
  className: '',
  type: Type.PRIMARY,
  size: Size.BIG,
  children: 'Button',
  disabled: false,
  onClick: function onClick() {}
};

var ModalHeader = function ModalHeader(_ref) {
  var titleText = _ref.titleText;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal__header"
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.H_1,
    color: LabelColors.ONBACKGROUND_1
  }, titleText));
};
ModalHeader.propTypes = {
  titleText: PropTypes.string.isRequired
};
var ModalBody = function ModalBody(_ref2) {
  var children = _ref2.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal__body"
  }, children);
};
ModalBody.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.arrayOf(PropTypes.element.isRequired)])
};
ModalBody.defaultProps = {
  children: null
};
var ModalFooter = function ModalFooter(_ref3) {
  var onSubmit = _ref3.onSubmit,
      onCancel = _ref3.onCancel,
      _ref3$disabled = _ref3.disabled,
      disabled = _ref3$disabled === void 0 ? false : _ref3$disabled,
      submitText = _ref3.submitText,
      type = _ref3.type;

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal__footer"
  }, /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    onClick: onCancel
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.BUTTON_1,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.BUTTON__CANCEL)), /*#__PURE__*/React__default.createElement(Button, {
    type: type,
    disabled: disabled,
    onClick: onSubmit
  }, submitText));
};
ModalFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string
};
ModalFooter.defaultProps = {
  disabled: false,
  type: ButtonTypes.DANGER
};

function Modal(props) {
  var children = props.children,
      onCancel = props.onCancel,
      onSubmit = props.onSubmit,
      disabled = props.disabled,
      submitText = props.submitText,
      titleText = props.titleText,
      hideFooter = props.hideFooter,
      type = props.type;
  return /*#__PURE__*/createPortal( /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal__content"
  }, /*#__PURE__*/React__default.createElement(ModalHeader, {
    titleText: titleText
  }), /*#__PURE__*/React__default.createElement(ModalBody, null, children), !hideFooter && /*#__PURE__*/React__default.createElement(ModalFooter, {
    disabled: disabled,
    onCancel: onCancel,
    onSubmit: onSubmit,
    submitText: submitText,
    type: type
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal__close"
  }, /*#__PURE__*/React__default.createElement(IconButton, {
    width: "32px",
    height: "32px",
    onClick: onCancel
  }, /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.CLOSE,
    fillColor: IconColors.DEFAULT,
    width: "24px",
    height: "24px"
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-modal__backdrop"
  })), document.getElementById(MODAL_ROOT));
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  hideFooter: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string
};
Modal.defaultProps = {
  children: null,
  hideFooter: false,
  disabled: false,
  type: ButtonTypes.DANGER
};

var Colors = {
  ONBACKGROUND_1: 'ONBACKGROUND_1',
  ONBACKGROUND_2: 'ONBACKGROUND_2',
  ONBACKGROUND_3: 'ONBACKGROUND_3',
  ONBACKGROUND_4: 'ONBACKGROUND_4',
  ONCONTENT_1: 'ONCONTENT_1',
  PRIMARY: 'PRIMARY',
  ERROR: 'ERROR'
};
function changeColorToClassName(color) {
  switch (color) {
    case Colors.ONBACKGROUND_1:
      return 'sendbird-color--onbackground-1';

    case Colors.ONBACKGROUND_2:
      return 'sendbird-color--onbackground-2';

    case Colors.ONBACKGROUND_3:
      return 'sendbird-color--onbackground-3';

    case Colors.ONBACKGROUND_4:
      return 'sendbird-color--onbackground-4';

    case Colors.ONCONTENT_1:
      return 'sendbird-color--oncontent-1';

    case Colors.PRIMARY:
      return 'sendbird-color--primary';

    case Colors.ERROR:
      return 'sendbird-color--error';

    default:
      return null;
  }
}

function TextButton(_ref) {
  var className = _ref.className,
      color = _ref.color,
      disabled = _ref.disabled,
      notUnderline = _ref.notUnderline,
      onClick = _ref.onClick,
      children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: [].concat(_toConsumableArray(Array.isArray(className) ? className : [className]), [changeColorToClassName(color), notUnderline ? 'sendbird-textbutton--not-underline' : 'sendbird-textbutton', disabled ? 'sendbird-textbutton--disabled' : '']).join(' '),
    role: "button",
    tabIndex: 0,
    onClick: onClick,
    onKeyPress: onClick
  }, children);
}
TextButton.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  color: PropTypes.string,
  disabled: PropTypes.bool,
  notUnderline: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
};
TextButton.defaultProps = {
  className: '',
  color: Colors.ONBACKGROUND_1,
  disabled: false,
  notUnderline: false,
  onClick: function onClick() {}
};

var SEND_MESSAGE_START = 'SEND_MESSAGE_START';
var SEND_USER_MESSAGE = 'SEND_USER_MESSAGE';
var SEND_FILE_MESSAGE = 'SEND_FILE_MESSAGE';
var UPDATE_USER_MESSAGE = 'UPDATE_USER_MESSAGE';
var DELETE_MESSAGE = 'DELETE_MESSAGE';
var LEAVE_CHANNEL = 'LEAVE_CHANNEL';
var CREATE_CHANNEL = 'CREATE_CHANNEL';

var getSdk = function getSdk(store) {
  var _store$stores = store.stores,
      stores = _store$stores === void 0 ? {} : _store$stores;
  var _stores$sdkStore = stores.sdkStore,
      sdkStore = _stores$sdkStore === void 0 ? {} : _stores$sdkStore;
  var sdk = sdkStore.sdk;
  return sdk;
};
var getPubSub = function getPubSub(store) {
  var _store$config = store.config,
      config = _store$config === void 0 ? {} : _store$config;
  var pubSub = config.pubSub;
  return pubSub;
}; // SendBird disconnect. Invalidates currentUser
// eslint-disable-next-line max-len

var getConnect = function getConnect(store) {
  return function (userId, accessToken) {
    return new Promise(function (resolve, reject) {
      var sdk = getSdk(store);

      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      if (!accessToken) {
        sdk.connect(userId).then(function (res) {
          return resolve(res);
        }).catch(function (err) {
          return reject(err);
        });
      } else {
        sdk.connect(userId, accessToken).then(function (res) {
          return resolve(res);
        }).catch(function (err) {
          return reject(err);
        });
      }
    });
  };
}; // SendBird disconnect. Invalidates currentUser

var getDisconnect = function getDisconnect(store) {
  return function () {
    return new Promise(function (resolve, reject) {
      var sdk = getSdk(store);

      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.disconnect().then(function (res) {
        return resolve(res);
      }).catch(function (err) {
        return reject(err);
      });
    });
  };
}; // Using the updateCurrentUserInfo() method
// you can update a user's nickname and profile image with a URL
// eslint-disable-next-line max-len

var getUpdateUserInfo = function getUpdateUserInfo(store) {
  return function (nickName, profileUrl) {
    return new Promise(function (resolve, reject) {
      var sdk = getSdk(store);

      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.updateCurrentUserInfo(nickName, profileUrl).then(function (res) {
        return resolve(res);
      }).catch(function (err) {
        return reject(err);
      });
    });
  };
};
var getSendUserMessage = function getSendUserMessage(store) {
  return function (channelUrl, userMessageParams) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        var promisify = function promisify() {
          var pendingMsg = null;
          var pendingPromise = new Promise(function (resolve_, reject_) {
            pendingMsg = channel.sendUserMessage(userMessageParams, function (res, err) {
              var swapParams = sdk.getErrorFirstCallback();
              var message = res;
              var error = err;

              if (swapParams) {
                message = err;
                error = res;
              }

              if (error) {
                reject_(error);
                return;
              }

              resolve_(message);
              pubsub.publish(SEND_USER_MESSAGE, {
                message: message,
                channel: channel
              });
            });
            pubsub.publish(SEND_MESSAGE_START, {
              message: pendingMsg,
              channel: channel
            });
          });

          pendingPromise.get = function () {
            return pendingMsg;
          };

          return pendingPromise;
        };

        resolve(promisify());
      }).catch(reject);
    });
  };
};
var getSendFileMessage = function getSendFileMessage(store) {
  return function (channelUrl, fileMessageParams) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        var promisify = function promisify() {
          var pendingMsg = null;
          var pendingPromise = new Promise(function (resolve_, reject_) {
            pendingMsg = channel.sendFileMessage(fileMessageParams, function (res, err) {
              var swapParams = sdk.getErrorFirstCallback();
              var message = res;
              var error = err;

              if (swapParams) {
                message = err;
                error = res;
              }

              if (error) {
                reject_(error);
                return;
              }

              resolve_(message);
              pubsub.publish(SEND_FILE_MESSAGE, {
                message: message,
                channel: channel
              });
            });
          });

          if (fileMessageParams.file) {
            // keep the file's local version in pendingMsg.localUrl
            // because promise doesnt allow overriding of pendingMsg.url
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = URL.createObjectURL(fileMessageParams.file);
          }

          if (fileMessageParams.fileUrl) {
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = fileMessageParams.fileUrl;
          } // eslint-disable-next-line no-param-reassign


          pendingMsg.requestState = 'pending';
          pubsub.publish(SEND_MESSAGE_START, {
            message: pendingMsg,
            channel: channel
          });

          pendingPromise.get = function () {
            return pendingMsg;
          };

          return pendingPromise;
        };

        resolve(promisify());
      }).catch(reject);
    });
  };
};
var getUpdateUserMessage = function getUpdateUserMessage(store) {
  return function (channelUrl, messageId, params) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        channel.updateUserMessage(messageId, params, function (res, err) {
          var swapParams = sdk.getErrorFirstCallback();
          var message = res;
          var error = err;

          if (swapParams) {
            message = err;
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }

          resolve(message);
          pubsub.publish(UPDATE_USER_MESSAGE, {
            message: message,
            channel: channel,
            // workaround for updating channelPreview on message-edit
            // https://sendbird.atlassian.net/browse/UIKIT-268
            fromSelector: true
          });
        });
      }).catch(reject);
    });
  };
};
var getDeleteMessage = function getDeleteMessage(store) {
  return function (channelUrl, message) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        var messageId = message.messageId;
        channel.deleteMessage(message, function (res, err) {
          var swapParams = sdk.getErrorFirstCallback();
          var error = err;

          if (swapParams) {
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }

          resolve(message);
          pubsub.publish(DELETE_MESSAGE, {
            messageId: messageId,
            channel: channel
          });
        });
      }).catch(reject);
    });
  };
};
var getResendUserMessage = function getResendUserMessage(store) {
  return function (channelUrl, failedMessage) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        channel.resendUserMessage(failedMessage).then(function (message) {
          resolve(message);
          pubsub.publish(SEND_USER_MESSAGE, {
            message: message,
            channel: channel
          });
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var getResendFileMessage = function getResendFileMessage(store) {
  return function (channelUrl, failedMessage) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        channel.resendFileMessage(failedMessage).then(function (message) {
          resolve(message);
          pubsub.publish(SEND_FILE_MESSAGE, {
            message: message,
            channel: channel
          });
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var getCreateChannel = function getCreateChannel(store) {
  return function (params) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.createChannel(params).then(function (channel) {
        resolve(channel);
        pubsub.publish(CREATE_CHANNEL, {
          channel: channel
        });
      }).catch(reject);
    });
  };
};
var getLeaveChannel = function getLeaveChannel(store) {
  return function (channelUrl) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        channel.leave().then(function () {
          resolve(channel);
          pubsub.publish(LEAVE_CHANNEL, {
            channel: channel
          });
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var getFreezeChannel = function getFreezeChannel(store) {
  return function (channelUrl) {
    var sdk = getSdk(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        channel.freeze().then(function () {
          // do not need pubsub here - event listener works
          resolve(channel);
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var getUnFreezeChannel = function getUnFreezeChannel(store) {
  return function (channelUrl) {
    var sdk = getSdk(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        channel.unfreeze().then(function () {
          // do not need pubsub here - event listener works
          resolve(channel);
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var getCreateOpenChannel = function getCreateOpenChannel(store) {
  return function (params) {
    var sdk = getSdk(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.createChannel(params).then(function (channel) {
        resolve(channel);
      }).catch(reject);
    });
  };
};
var enterOpenChannel = function enterOpenChannel(store) {
  return function (channelUrl) {
    var sdk = getSdk(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl, function (openChannel, error) {
        if (error) {
          reject(new Error(error));
          return;
        }

        openChannel.enter(function (response, enterError) {
          if (error) {
            reject(new Error(enterError));
            return;
          }

          resolve(response);
        });
      });
    });
  };
};
var exitOpenChannel = function exitOpenChannel(store) {
  return function (channelUrl) {
    var sdk = getSdk(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl, function (openChannel, error) {
        if (error) {
          reject(new Error(error));
          return;
        }

        openChannel.exit(function (response, exitError) {
          if (error) {
            reject(new Error(exitError));
            return;
          }

          resolve(response);
        });
      });
    });
  };
};
var getOpenChannelSendUserMessage = function getOpenChannelSendUserMessage(store) {
  return function (channelUrl, userMessageParams) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl).then(function (channel) {
        var promisify = function promisify() {
          var pendingMsg = null;
          var pendingPromise = new Promise(function (resolve_, reject_) {
            pendingMsg = channel.sendUserMessage(userMessageParams, function (res, err) {
              var swapParams = sdk.getErrorFirstCallback();
              var message = res;
              var error = err;

              if (swapParams) {
                message = err;
                error = res;
              }

              if (error) {
                reject_(error);
                return;
              }

              resolve_(message);
              pubsub.publish(SEND_USER_MESSAGE, {
                message: message,
                channel: channel
              });
            });
            pubsub.publish(SEND_MESSAGE_START, {
              message: pendingMsg,
              channel: channel
            });
          });

          pendingPromise.get = function () {
            return pendingMsg;
          };

          return pendingPromise;
        };

        resolve(promisify());
      }).catch(reject);
    });
  };
};
var getOpenChannelSendFileMessage = function getOpenChannelSendFileMessage(store) {
  return function (channelUrl, fileMessageParams) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl).then(function (channel) {
        var promisify = function promisify() {
          var pendingMsg = null;
          var pendingPromise = new Promise(function (resolve_, reject_) {
            pendingMsg = channel.sendFileMessage(fileMessageParams, function (res, err) {
              var swapParams = sdk.getErrorFirstCallback();
              var message = res;
              var error = err;

              if (swapParams) {
                message = err;
                error = res;
              }

              if (error) {
                reject_(error);
                return;
              }

              resolve_(message);
              pubsub.publish(SEND_FILE_MESSAGE, {
                message: message,
                channel: channel
              });
            });
          });

          if (fileMessageParams.file) {
            // keep the file's local version in pendingMsg.localUrl
            // because promise doesnt allow overriding of pendingMsg.url
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = URL.createObjectURL(fileMessageParams.file);
          }

          if (fileMessageParams.fileUrl) {
            // eslint-disable-next-line no-param-reassign
            pendingMsg.localUrl = fileMessageParams.fileUrl;
          } // eslint-disable-next-line no-param-reassign


          pendingMsg.requestState = 'pending';
          pubsub.publish(SEND_MESSAGE_START, {
            message: pendingMsg,
            channel: channel
          });

          pendingPromise.get = function () {
            return pendingMsg;
          };

          return pendingPromise;
        };

        resolve(promisify());
      }).catch(reject);
    });
  };
};
var getOpenChannelUpdateUserMessage = function getOpenChannelUpdateUserMessage(store) {
  return function (channelUrl, messageId, params) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl).then(function (channel) {
        channel.updateUserMessage(messageId, params, function (res, err) {
          var swapParams = sdk.getErrorFirstCallback();
          var message = res;
          var error = err;

          if (swapParams) {
            message = err;
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }

          resolve(message);
          pubsub.publish(UPDATE_USER_MESSAGE, {
            message: message,
            channel: channel,
            // workaround for updating channelPreview on message-edit
            // https://sendbird.atlassian.net/browse/UIKIT-268
            fromSelector: true
          });
        });
      }).catch(reject);
    });
  };
};
var getOpenChannelDeleteMessage = function getOpenChannelDeleteMessage(store) {
  return function (channelUrl, message) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.GroupChannel.getChannel(channelUrl).then(function (channel) {
        var messageId = message.messageId;
        channel.deleteMessage(message, function (res, err) {
          var swapParams = sdk.getErrorFirstCallback();
          var error = err;

          if (swapParams) {
            error = res;
          }

          if (error) {
            reject(error);
            return;
          }

          resolve(message);
          pubsub.publish(DELETE_MESSAGE, {
            messageId: messageId,
            channel: channel
          });
        });
      }).catch(reject);
    });
  };
};
var getOpenChannelResendUserMessage = function getOpenChannelResendUserMessage(store) {
  return function (channelUrl, failedMessage) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl).then(function (channel) {
        channel.resendUserMessage(failedMessage).then(function (message) {
          resolve(message);
          pubsub.publish(SEND_USER_MESSAGE, {
            message: message,
            channel: channel
          });
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var getOpenChannelResendFileMessage = function getOpenChannelResendFileMessage(store) {
  return function (channelUrl, failedMessage) {
    var sdk = getSdk(store);
    var pubsub = getPubSub(store);
    return new Promise(function (resolve, reject) {
      if (!sdk) {
        reject(new Error('Sdk not found'));
      }

      sdk.OpenChannel.getChannel(channelUrl).then(function (channel) {
        channel.resendFileMessage(failedMessage).then(function (message) {
          resolve(message);
          pubsub.publish(SEND_FILE_MESSAGE, {
            message: message,
            channel: channel
          });
        }).catch(reject);
      }).catch(reject);
    });
  };
};
var selectors = {
  getSdk: getSdk,
  getConnect: getConnect,
  getDisconnect: getDisconnect,
  getUpdateUserInfo: getUpdateUserInfo,
  getSendUserMessage: getSendUserMessage,
  getSendFileMessage: getSendFileMessage,
  getUpdateUserMessage: getUpdateUserMessage,
  getDeleteMessage: getDeleteMessage,
  getResendUserMessage: getResendUserMessage,
  getResendFileMessage: getResendFileMessage,
  getFreezeChannel: getFreezeChannel,
  getUnFreezeChannel: getUnFreezeChannel,
  getCreateChannel: getCreateChannel,
  getLeaveChannel: getLeaveChannel,
  getCreateOpenChannel: getCreateOpenChannel,
  getEnterOpenChannel: enterOpenChannel,
  getExitOpenChannel: exitOpenChannel,
  getOpenChannelSendUserMessage: getOpenChannelSendUserMessage,
  getOpenChannelSendFileMessage: getOpenChannelSendFileMessage,
  getOpenChannelUpdateUserMessage: getOpenChannelUpdateUserMessage,
  getOpenChannelDeleteMessage: getOpenChannelDeleteMessage,
  getOpenChannelResendUserMessage: getOpenChannelResendUserMessage,
  getOpenChannelResendFileMessage: getOpenChannelResendFileMessage
};

function UserProfile(_a) {
  var user = _a.user,
      currentUserId = _a.currentUserId,
      sdk = _a.sdk,
      logger = _a.logger,
      _b = _a.disableMessaging,
      disableMessaging = _b === void 0 ? false : _b,
      createChannel = _a.createChannel,
      onSuccess = _a.onSuccess;
  var stringSet = useContext(LocalizationContext).stringSet;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird__user-profile"
  }, /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird__user-profile-avatar"
  }, /*#__PURE__*/React__default.createElement(Avatar, {
    height: "80px",
    width: "80px",
    src: user.profileUrl
  })), /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird__user-profile-name"
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.H_2,
    color: LabelColors.ONBACKGROUND_1
  }, user.nickname || stringSet.NO_NAME)), user.userId !== currentUserId && !disableMessaging && /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird__user-profile-message"
  }, /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    onClick: function onClick() {
      var params = new sdk.GroupChannelParams();
      params.isDistinct = true;
      params.addUserIds([user.userId]);
      onSuccess();
      createChannel(params).then(function (groupChannel) {
        logger.info('UserProfile, channel create', groupChannel);
      });
    }
  }, stringSet.USER_PROFILE__MESSAGE)), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird__user-profile-separator"
  }), /*#__PURE__*/React__default.createElement("section", {
    className: "sendbird__user-profile-userId"
  }, /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird__user-profile-userId--label",
    type: LabelTypography.CAPTION_2,
    color: LabelColors.ONBACKGROUND_2
  }, stringSet.USER_PROFILE__USER_ID), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird__user-profile-userId--value",
    type: LabelTypography.BODY_1,
    color: LabelColors.ONBACKGROUND_1
  }, user.userId)));
}

var mapStoreToProps = function mapStoreToProps(store) {
  return {
    sdk: getSdk(store),
    createChannel: getCreateChannel(store),
    logger: store.config.logger,
    pubsub: store.config.pubSub
  };
};

var ConnectedUserProfile = withSendbirdContext(UserProfile, mapStoreToProps);

var MenuItems$1 = /*#__PURE__*/function (_Component) {
  _inherits(MenuItems, _Component);

  var _super = _createSuper(MenuItems);

  function MenuItems(props) {
    var _this;

    _classCallCheck(this, MenuItems);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "showParent", function () {
      var _this$props$parentCon = _this.props.parentContainRef,
          parentContainRef = _this$props$parentCon === void 0 ? {} : _this$props$parentCon;
      var current = parentContainRef.current;

      if (parentContainRef && current) {
        current.classList.add('sendbird-icon--pressed');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "hideParent", function () {
      var _this$props$parentCon2 = _this.props.parentContainRef,
          parentContainRef = _this$props$parentCon2 === void 0 ? {} : _this$props$parentCon2;
      var current = parentContainRef.current;

      if (parentContainRef && current) {
        current.classList.remove('sendbird-icon--pressed');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setupEvents", function () {
      var closeDropdown = _this.props.closeDropdown;

      var _assertThisInitialize = _assertThisInitialized(_this),
          menuRef = _assertThisInitialize.menuRef;

      var handleClickOutside = function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          closeDropdown();
        }
      };

      _this.setState({
        handleClickOutside: handleClickOutside
      });

      document.addEventListener('mousedown', handleClickOutside);
    });

    _defineProperty(_assertThisInitialized(_this), "cleanUpEvents", function () {
      var handleClickOutside = _this.state.handleClickOutside;
      document.removeEventListener('mousedown', handleClickOutside);
    });

    _defineProperty(_assertThisInitialized(_this), "getMenuPosition", function () {
      var _this$props = _this.props,
          parentRef = _this$props.parentRef,
          openLeft = _this$props.openLeft;
      var parentRect = parentRef.current.getBoundingClientRect();
      var x = parentRect.x || parentRect.left;
      var y = parentRect.y || parentRect.top;
      var menuStyle = {
        top: y,
        left: x
      };
      if (!_this.menuRef.current) return menuStyle;
      var _window = window,
          innerWidth = _window.innerWidth,
          innerHeight = _window.innerHeight;

      var rect = _this.menuRef.current.getBoundingClientRect();

      if (y + rect.height > innerHeight) {
        menuStyle.top -= rect.height;
      }

      if (x + rect.width > innerWidth && !openLeft) {
        menuStyle.left -= rect.width;
      }

      if (menuStyle.top < 0) {
        menuStyle.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
      }

      if (menuStyle.left < 0) {
        menuStyle.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
      }

      menuStyle.top += 32;

      if (openLeft) {
        var padding = Number.isNaN(rect.width - 30) ? 108 // default
        : rect.width - 30;
        menuStyle.left -= padding;
      }

      return _this.setState({
        menuStyle: menuStyle
      });
    });

    _this.menuRef = /*#__PURE__*/React__default.createRef();
    _this.state = {
      menuStyle: {},
      handleClickOutside: function handleClickOutside() {}
    };
    return _this;
  }

  _createClass(MenuItems, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setupEvents();
      this.getMenuPosition();
      this.showParent();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cleanUpEvents();
      this.hideParent();
    }
  }, {
    key: "render",
    value: function render() {
      var menuStyle = this.state.menuStyle;
      var _this$props2 = this.props,
          children = _this$props2.children,
          style = _this$props2.style;
      return /*#__PURE__*/createPortal( /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
        className: "sendbird-dropdown__menu-backdrop"
      }), /*#__PURE__*/React__default.createElement("ul", {
        className: "sendbird-dropdown__menu",
        ref: this.menuRef,
        style: _objectSpread2({
          display: 'inline-block',
          position: 'fixed',
          left: "".concat(Math.round(menuStyle.left), "px"),
          top: "".concat(Math.round(menuStyle.top), "px")
        }, style)
      }, children)), document.getElementById('sendbird-dropdown-portal'));
    }
  }]);

  return MenuItems;
}(Component);
MenuItems$1.propTypes = {
  closeDropdown: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
  style: PropTypes.shape({}),
  // https://stackoverflow.com/a/51127130
  parentRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })]).isRequired,
  parentContainRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })]).isRequired,
  openLeft: PropTypes.bool
};
MenuItems$1.defaultProps = {
  style: {},
  openLeft: false
};

var componentClassName = 'sendbird-sort-by-row';
function SortByRow(_ref) {
  var className = _ref.className,
      maxItemCount = _ref.maxItemCount,
      itemWidth = _ref.itemWidth,
      itemHeight = _ref.itemHeight,
      children = _ref.children;

  if (children.length > maxItemCount) {
    var result = [];

    for (var i = 0; i < children.length; i += maxItemCount) {
      result.push( /*#__PURE__*/React__default.createElement("div", {
        className: [].concat(_toConsumableArray(Array.isArray(className) ? className : [className]), [componentClassName]).join(' '),
        key: className + i,
        style: {
          width: itemWidth * maxItemCount,
          height: itemHeight
        }
      }, children.slice(i, i + maxItemCount)));
    }

    return result;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: [].concat(_toConsumableArray(Array.isArray(className) ? className : [className]), [componentClassName]).join(' '),
    style: {
      width: itemWidth * children.length,
      height: itemHeight
    }
  }, children);
}
SortByRow.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  maxItemCount: PropTypes.number.isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
};
SortByRow.defaultProps = {
  className: ''
};

var EmojiListItems$1 = /*#__PURE__*/function (_Component) {
  _inherits(EmojiListItems, _Component);

  var _super = _createSuper(EmojiListItems);

  function EmojiListItems(props) {
    var _this;

    _classCallCheck(this, EmojiListItems);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "showParent", function () {
      var _this$props$parentCon = _this.props.parentContainRef,
          parentContainRef = _this$props$parentCon === void 0 ? {} : _this$props$parentCon;
      var current = parentContainRef.current;

      if (parentContainRef && current) {
        current.classList.add('sendbird-reactions--pressed');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "hideParent", function () {
      var _this$props$parentCon2 = _this.props.parentContainRef,
          parentContainRef = _this$props$parentCon2 === void 0 ? {} : _this$props$parentCon2;
      var current = parentContainRef.current;

      if (parentContainRef && current) {
        current.classList.remove('sendbird-reactions--pressed');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setupEvents", function () {
      var closeDropdown = _this.props.closeDropdown;

      var _assertThisInitialize = _assertThisInitialized(_this),
          reactionRef = _assertThisInitialize.reactionRef;

      var handleClickOutside = function handleClickOutside(event) {
        if (reactionRef.current && !reactionRef.current.contains(event.target)) {
          closeDropdown();
        }
      };

      _this.setState({
        handleClickOutside: handleClickOutside
      });

      document.addEventListener('mousedown', handleClickOutside);
    });

    _defineProperty(_assertThisInitialized(_this), "cleanUpEvents", function () {
      var handleClickOutside = _this.state.handleClickOutside;
      document.removeEventListener('mousedown', handleClickOutside);
    });

    _defineProperty(_assertThisInitialized(_this), "getBarPosition", function () {
      // calculate the location that the context menu should be
      var _this$props = _this.props,
          parentRef = _this$props.parentRef,
          spaceFromTrigger = _this$props.spaceFromTrigger;
      var spaceFromTriggerX = spaceFromTrigger.x || 0;
      var spaceFromTriggerY = spaceFromTrigger.y || 0;
      var parentRect = parentRef.current.getBoundingClientRect();
      var x = parentRect.x || parentRect.left;
      var y = parentRect.y || parentRect.top;
      var reactionStyle = {
        top: y,
        left: x
      };
      if (!_this.reactionRef.current) return reactionStyle;

      var rect = _this.reactionRef.current.getBoundingClientRect();

      if (reactionStyle.top < rect.height) {
        reactionStyle.top += parentRect.height;
        reactionStyle.top += spaceFromTriggerY;
      } else {
        reactionStyle.top -= rect.height;
        reactionStyle.top -= spaceFromTriggerY;
      }

      reactionStyle.left -= rect.width / 2;
      reactionStyle.left += parentRect.height / 2 - 2;
      reactionStyle.left += spaceFromTriggerX;
      var maximumLeft = window.innerWidth - rect.width;

      if (maximumLeft < reactionStyle.left) {
        reactionStyle.left = maximumLeft;
      }

      if (reactionStyle.left < 0) {
        reactionStyle.left = 0;
      }

      return _this.setState({
        reactionStyle: reactionStyle
      });
    });

    _this.reactionRef = /*#__PURE__*/React__default.createRef();
    _this.state = {
      reactionStyle: {},
      handleClickOutside: function handleClickOutside() {}
    };
    return _this;
  }

  _createClass(EmojiListItems, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setupEvents();
      this.getBarPosition();
      this.showParent();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cleanUpEvents();
      this.hideParent();
    }
  }, {
    key: "render",
    value: function render() {
      var reactionStyle = this.state.reactionStyle;
      var children = this.props.children;
      return /*#__PURE__*/createPortal( /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
        className: "sendbird-dropdown__menu-backdrop"
      }), /*#__PURE__*/React__default.createElement("ul", {
        className: "sendbird-dropdown__reaction-bar",
        ref: this.reactionRef,
        style: {
          display: 'inline-block',
          position: 'fixed',
          left: "".concat(Math.round(reactionStyle.left), "px"),
          top: "".concat(Math.round(reactionStyle.top), "px")
        }
      }, /*#__PURE__*/React__default.createElement(SortByRow, {
        className: "sendbird-dropdown__reaction-bar__row",
        maxItemCount: 8,
        itemWidth: 44,
        itemHeight: 40
      }, children))), document.getElementById('sendbird-emoji-list-portal'));
    }
  }]);

  return EmojiListItems;
}(Component);
EmojiListItems$1.propTypes = {
  closeDropdown: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
  parentRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })]).isRequired,
  parentContainRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })]).isRequired,
  spaceFromTrigger: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
};
EmojiListItems$1.defaultProps = {
  spaceFromTrigger: {}
};

var ENTER = 13;
var MenuItems = MenuItems$1;
var EmojiListItems = EmojiListItems$1;
var MenuItem = function MenuItem(_ref) {
  var className = _ref.className,
      children = _ref.children,
      onClick = _ref.onClick,
      disable = _ref.disable;

  var handleClickEvent = function handleClickEvent(e) {
    if (!disable) onClick(e);
  };

  return /*#__PURE__*/React__default.createElement("li", {
    className: getClassName([className, 'sendbird-dropdown__menu-item', disable ? 'disable' : '']),
    role: "menuitem",
    onClick: handleClickEvent,
    onKeyPress: function onKeyPress(e) {
      if (e.keyCode === ENTER) handleClickEvent(e);
    },
    tabIndex: 0
  }, /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-dropdown__menu-item__text",
    type: LabelTypography.SUBTITLE_2,
    color: disable ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1
  }, children));
};
MenuItem.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onClick: PropTypes.func.isRequired,
  disable: PropTypes.func
};
MenuItem.defaultProps = {
  className: '',
  disable: false
}; // Root components should be appended before ContextMenu is rendered
function ContextMenu(_ref2) {
  var menuTrigger = _ref2.menuTrigger,
      menuItems = _ref2.menuItems;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showMenu = _useState2[0],
      setShowMenu = _useState2[1];

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-context-menu",
    style: {
      display: 'inline'
    }
  }, menuTrigger(function () {
    return setShowMenu(!showMenu);
  }), showMenu && menuItems(function () {
    return setShowMenu(false);
  }));
}
ContextMenu.propTypes = {
  menuTrigger: PropTypes.func.isRequired,
  menuItems: PropTypes.func.isRequired
};

export { changeColorToClassName as $, getEmojiListAll as A, Button as B, ContextMenu as C, DELETE_MESSAGE as D, EmojiListItems as E, getEmojiMapAll as F, isReactedBy as G, getEmojiTooltipString as H, IconButton as I, isEditedMessage as J, getUIKitFileType as K, LEAVE_CHANNEL as L, Modal as M, isVideoMessage as N, isGifMessage as O, isUrl as P, getUIKitMessageTypes as Q, getOutgoingMessageState as R, SEND_MESSAGE_START as S, Type as T, UserProfileContext as U, getSenderName as V, isTextMessage as W, isOGMessage as X, getUIKitMessageType as Y, isThumbnailMessage as Z, Colors as _, TextButton as a, MODAL_ROOT as a0, isSupportedFileView as a1, isVideo as a2, isImage as a3, MenuItems as b, MenuItem as c, ButtonTypes as d, ButtonSizes as e, ConnectedUserProfile as f, getSdk as g, UserProfileProvider as h, filterChannelListParams as i, getChannelsWithUpsertedChannel as j, CREATE_CHANNEL as k, UPDATE_USER_MESSAGE as l, getOutgoingMessageStates as m, getSendingMessageStatus as n, SEND_USER_MESSAGE as o, SEND_FILE_MESSAGE as p, filterMessageListParams as q, isSentStatus as r, selectors as s, truncateString as t, getMessageCreatedAt as u, isUserMessage as v, isSentMessage as w, isFailedMessage as x, getClassName as y, copyToClipboard as z };
//# sourceMappingURL=index-1e7efcaa.js.map
