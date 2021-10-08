'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var index$1 = require('./index-7a50d030.js');
var LocalizationContext = require('./LocalizationContext-ff33ac65.js');
var index$2 = require('./index-ced0f21b.js');
var index$3 = require('./index-c43fe0b0.js');
var index$4 = require('./index-1d2a7f85.js');
require('prop-types');
require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var getMessageCreatedAt = function getMessageCreatedAt(message) {
  return index$1.format(message.createdAt, 'p');
};
var scrollIntoLast = function scrollIntoLast(intialTry) {
  if (intialTry === void 0) {
    intialTry = 0;
  }

  var MAX_TRIES = 10;
  var currentTry = intialTry;

  if (currentTry > MAX_TRIES) {
    return;
  }

  try {
    var scrollDOM = document.querySelector('.sendbird-openchannel-conversation-scroll'); // eslint-disable-next-line no-multi-assign

    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(function () {
      scrollIntoLast(currentTry + 1);
    }, 500 * currentTry);
  }
};
var isSameGroup = function isSameGroup(message, comparingMessage) {
  if (!message || !comparingMessage || message.messageType === 'admin' || comparingMessage.messageType === 'admin' || !message.sender || !comparingMessage.sender || !message.createdAt || !comparingMessage.createdAt || !message.sender.userId || !comparingMessage.sender.userId) {
    return false;
  }

  return message.sendingStatus === comparingMessage.sendingStatus && message.sender.userId === comparingMessage.sender.userId && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage);
};
var compareMessagesForGrouping = function compareMessagesForGrouping(prevMessage, currMessage, nextMessage) {
  return [isSameGroup(prevMessage, currMessage), isSameGroup(currMessage, nextMessage)];
};
var kFormatter = function kFormatter(num) {
  if (Math.abs(num) > 999999) {
    return (Math.abs(num) / 1000000).toFixed(1) + "M";
  }

  if (Math.abs(num) > 999) {
    return (Math.abs(num) / 1000).toFixed(1) + "K";
  }

  return "" + num;
};
var isOperator = function isOperator(openChannel, userId) {
  var operators = openChannel.operators;

  if (operators.map(function (operator) {
    return operator.userId;
  }).indexOf(userId) < 0) {
    return false;
  }

  return true;
};
var isDisabledBecauseFrozen = function isDisabledBecauseFrozen(openChannel, userId) {
  var isFrozen = openChannel.isFrozen;
  return isFrozen && !isOperator(openChannel, userId);
};
var fetchWithListQuery = function fetchWithListQuery(listQuery, logger, eachQueryNextCallback) {
  var fetchList = function fetchList(query) {
    var hasNext = query.hasNext;

    if (hasNext) {
      query.next(function (error, users) {
        if (!error) {
          eachQueryNextCallback(users);
          fetchList(query);
        } else {
          logger.warning('OpenChannel | FetchUserList failed', error);
        }
      });
    } else {
      logger.info('OpenChannel | FetchUserList finished');
    }
  };

  logger.info('OpenChannel | FetchUserList start', listQuery);
  fetchList(listQuery);
};
var pxToNumber = function pxToNumber(px) {
  if (typeof px === 'number') {
    return px;
  }

  if (typeof px === 'string') {
    var parsed = Number.parseFloat(px);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
};

var MessageInputWrapper = function MessageInputWrapper(_a, ref) {
  var channel = _a.channel,
      user = _a.user,
      disabled = _a.disabled,
      onSendMessage = _a.onSendMessage,
      onFileUpload = _a.onFileUpload,
      renderMessageInput = _a.renderMessageInput;

  if (!channel) {
    return;
  }

  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;

  if (renderMessageInput) {
    return renderMessageInput({
      channel: channel,
      user: user,
      disabled: disabled
    });
  }

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-footer"
  }, /*#__PURE__*/React__default["default"].createElement(index$2.MessageInput, {
    ref: ref,
    disabled: disabled,
    onSendMessage: onSendMessage,
    onFileUpload: onFileUpload,
    placeholder: disabled && stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__DISABLED // add disabled because of muted state

  }));
};

var MessageInputWrapper$1 = /*#__PURE__*/React__default["default"].forwardRef(MessageInputWrapper);

var FrozenNotification = function FrozenNotification() {
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-frozen-channel-notification"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-frozen-channel-notification__text",
    type: index$1.LabelTypography.CAPTION_2
  }, stringSet.CHANNEL_FROZEN));
};

function OpenchannelConversationHeader(_a) {
  var coverImage = _a.coverImage,
      title = _a.title,
      subTitle = _a.subTitle,
      amIOperator = _a.amIOperator,
      onActionClick = _a.onActionClick;
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-header"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-header__left"
  }, coverImage ? /*#__PURE__*/React__default["default"].createElement(index$1.Avatar, {
    className: "sendbird-openchannel-conversation-header__left__cover-image",
    src: coverImage,
    alt: "channel cover image",
    width: "32px",
    height: "32px"
  }) : /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-header__left__cover-image--icon",
    style: {
      width: 32,
      height: 32
    }
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    type: index$1.IconTypes.CHANNELS,
    fillColor: index$1.IconColors.CONTENT,
    width: "18px",
    height: "18px"
  })), /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-conversation-header__left__title",
    type: index$1.LabelTypography.H_2,
    color: index$1.LabelColors.ONBACKGROUND_1
  }, title || stringSet.NO_TITLE), /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-conversation-header__left__sub-title",
    type: index$1.LabelTypography.BODY_2,
    color: index$1.LabelColors.ONBACKGROUND_2
  }, subTitle || stringSet.NO_TITLE)), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-header__right"
  }, /*#__PURE__*/React__default["default"].createElement(index$3.IconButton, {
    className: "sendbird-openchannel-conversation-header__right__trigger",
    width: "32px",
    height: "32px",
    onClick: onActionClick
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    type: amIOperator ? index$1.IconTypes.INFO : index$1.IconTypes.MEMBERS,
    fillColor: index$1.IconColors.PRIMARY,
    width: "24px",
    height: "24px"
  }))));
}

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

var OpenChannelMessageStatusTypes = {
  NONE: 'none',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELED: 'canceled',
  SUCCEEDED: 'succeeded'
};
var getSenderFromMessage = function getSenderFromMessage(message) {
  return message.sender || message._sender;
};
var checkIsSent = function checkIsSent(status) {
  return status === OpenChannelMessageStatusTypes.SUCCEEDED;
};
var checkIsPending = function checkIsPending(status) {
  return status === OpenChannelMessageStatusTypes.PENDING;
};
var checkIsFailed = function checkIsFailed(status) {
  return status === OpenChannelMessageStatusTypes.FAILED;
};
var checkIsByMe = function checkIsByMe(message, userId) {
  return getSenderFromMessage(message).userId === userId;
};
var isFineCopy = function isFineCopy(_a) {
  var message = _a.message;
  return message.messageType === 'user' && message.message.length > 0;
};
var isFineResend = function isFineResend(_a) {
  var message = _a.message,
      status = _a.status,
      userId = _a.userId;
  return checkIsByMe(message, userId) && checkIsFailed(status) && message.isResendable && message.isResendable();
};
var isFineEdit = function isFineEdit(_a) {
  var message = _a.message,
      status = _a.status,
      userId = _a.userId;
  return checkIsByMe(message, userId) && checkIsSent(status);
};
var isFineDelete = function isFineDelete(_a) {
  var message = _a.message,
      userId = _a.userId;
  return checkIsByMe(message, userId);
};
var showMenuTrigger = function showMenuTrigger(props) {
  var message = props.message,
      status = props.status,
      userId = props.userId;

  if (message.messageType === 'user') {
    return isFineDelete({
      message: message,
      status: status,
      userId: userId
    }) || isFineEdit({
      message: message,
      status: status,
      userId: userId
    }) || isFineCopy({
      message: message,
      status: status,
      userId: userId
    }) || isFineResend({
      message: message,
      status: status,
      userId: userId
    });
  } else {
    return isFineDelete({
      message: message,
      status: status,
      userId: userId
    }) || isFineResend({
      message: message,
      status: status,
      userId: userId
    });
  }
};

function OpenchannelUserMessage(_a) {
  var className = _a.className,
      message = _a.message,
      userId = _a.userId,
      resendMessage = _a.resendMessage,
      disabled = _a.disabled,
      showEdit = _a.showEdit,
      showRemove = _a.showRemove,
      chainTop = _a.chainTop,
      status = _a.status;

  if (!message || message.messageType !== 'user') {
    return null;
  } // hooks


  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;

  var _b = React.useContext(index$3.UserProfileContext),
      disableUserProfile = _b.disableUserProfile,
      renderUserProfile = _b.renderUserProfile;

  var messageRef = React.useRef(null);
  var avatarRef = React.useRef(null);
  var contextMenuRef = React.useRef(null);

  var _c = React.useState({}),
      contextStyle = _c[0],
      setContextStyle = _c[1]; // consts


  var isByMe = checkIsByMe(message, userId);
  var isPending = checkIsPending(status);
  var isFailed = checkIsFailed(status);
  var sender = getSenderFromMessage(message);
  var MemoizedMessageText = React.useMemo(function () {
    return function () {
      var splitMessage = message.message.split(/\r/);
      var matchedMessage = splitMessage.map(function (word) {
        return word !== '' ? word : /*#__PURE__*/React__default["default"].createElement("br", null);
      });

      if (message.updatedAt > 0) {
        matchedMessage.push( /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
          key: LocalizationContext.uuidv4(),
          type: index$1.LabelTypography.BODY_1,
          color: index$1.LabelColors.ONBACKGROUND_2,
          calssName: "sendbird-openchannel-user-message-word"
        }, " " + stringSet.MESSAGE_EDITED + " "));
      }

      return matchedMessage;
    };
  }, [message, message.updatedAt]); // place context menu top depending clientHeight of message component

  React.useEffect(function () {
    var _a;

    if (((_a = messageRef === null || messageRef === void 0 ? void 0 : messageRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) > 36) {
      setContextStyle({
        top: '8px '
      });
    } else {
      setContextStyle({
        top: '2px'
      });
    }
  }, [window.innerWidth]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-openchannel-user-message'], false).join(' '),
    ref: messageRef
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-user-message__left"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$1.Avatar, {
        className: "sendbird-openchannel-user-message__left__avatar",
        src: sender.profileUrl || '',
        ref: avatarRef,
        width: "28px",
        height: "28px",
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        }
      });
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: avatarRef,
        parentContainRef: avatarRef,
        closeDropdown: closeDropdown,
        style: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }, renderUserProfile ? renderUserProfile({
        user: sender,
        close: closeDropdown
      }) : /*#__PURE__*/React__default["default"].createElement(index$3.ConnectedUserProfile, {
        user: sender,
        onSuccess: closeDropdown,
        disableMessaging: true
      }));
    }
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-user-message__right"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-user-message__right__top"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-user-message__right__top__sender-name",
    type: index$1.LabelTypography.CAPTION_2,
    color: isByMe ? index$1.LabelColors.SECONDARY_3 : index$1.LabelColors.ONBACKGROUND_2
  }, sender && (sender.friendName || sender.nickname || sender.userId)), /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-user-message__right__top__sent-at",
    type: index$1.LabelTypography.CAPTION_3,
    color: index$1.LabelColors.ONBACKGROUND_3
  }, message.createdAt && index$1.format(message.createdAt, 'p'))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-user-message__right__bottom"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-user-message__right__bottom__message",
    type: index$1.LabelTypography.BODY_1,
    color: index$1.LabelColors.ONBACKGROUND_1
  }, MemoizedMessageText())), (isPending || isFailed) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-user-message__right__tail"
  }, isPending && /*#__PURE__*/React__default["default"].createElement(index$1.Loader, {
    width: "16px",
    height: "16px"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-user-message__right__tail__pending",
    type: index$1.IconTypes.SPINNER,
    fillColor: index$1.IconColors.PRIMARY,
    width: "16px",
    height: "16px"
  })), isFailed && /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-user-message__right__tail__failed",
    type: index$1.IconTypes.ERROR,
    width: "16px",
    height: "16px"
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-user-message__context-menu",
    ref: contextMenuRef,
    style: contextStyle
  }, /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return showMenuTrigger({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.IconButton, {
        className: "sendbird-openchannel-user-message__context-menu--icon",
        width: "32px",
        height: "32px",
        onClick: function onClick() {
          toggleDropdown();
        }
      }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
        type: index$1.IconTypes.MORE,
        fillColor: index$1.IconColors.CONTENT_INVERSE,
        width: "24px",
        height: "24px"
      }));
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: contextMenuRef,
        parentContainRef: contextMenuRef,
        closeDropdown: closeDropdown,
        openLeft: true
      }, isFineCopy({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-user-message__context-menu__copy",
        onClick: function onClick() {
          copyToClipboard(message.message);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__COPY), isFineEdit({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-user-message__context-menu__edit",
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          showEdit(true);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__EDIT), isFineResend({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-user-message__context-menu__resend",
        onClick: function onClick() {
          resendMessage(message);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND), isFineDelete({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-user-message__context-menu__delete",
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          showRemove(true);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE));
    }
  })));
}

function OpenChannelAdminMessage(_a) {
  var className = _a.className,
      message = _a.message;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-openchannel-admin-message'], false).join(' ')
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-admin-message__text",
    type: index$1.LabelTypography.CAPTION_2,
    color: index$1.LabelColors.ONBACKGROUND_2
  }, message.message || ''));
}

var URL_REG = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
var createUrlTester = function createUrlTester(regexp) {
  return function (text) {
    return regexp.test(text);
  };
};
var checkOGIsEnalbed = function checkOGIsEnalbed(message) {
  var ogMetaData = message.ogMetaData;

  if (!ogMetaData) {
    return false;
  }

  var url = ogMetaData.url;

  if (!url) {
    return false;
  }

  return true;
};

function OpenchannelOGMessage(_a) {
  var message = _a.message,
      className = _a.className,
      disabled = _a.disabled,
      showEdit = _a.showEdit,
      showRemove = _a.showRemove,
      resendMessage = _a.resendMessage,
      chainTop = _a.chainTop,
      status = _a.status,
      userId = _a.userId;

  if (!message || message.messageType !== 'user') {
    return null;
  }

  var ogMetaData = message.ogMetaData;
  var defaultImage = ogMetaData.defaultImage;
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;

  var _b = React.useContext(index$3.UserProfileContext),
      disableUserProfile = _b.disableUserProfile,
      renderUserProfile = _b.renderUserProfile;

  var _c = React.useState({}),
      contextStyle = _c[0],
      setContextStyle = _c[1];

  var messageComponentRef = React.useRef(null);
  var contextMenuRef = React.useRef(null);
  var avatarRef = React.useRef(null);
  var isUrl = createUrlTester(URL_REG);
  var isByMe = checkIsByMe(message, userId);
  var isPending = checkIsPending(status);
  var isFailed = checkIsFailed(status);
  var sender = getSenderFromMessage(message);
  var MemoizedMessageText = React.useMemo(function () {
    return function () {
      var wordClassName = 'sendbird-openchannel-og-message--word';
      var splitMessage = message.message.split(' ');
      var matchedMessage = splitMessage.map(function (word) {
        return isUrl(word) ? /*#__PURE__*/React__default["default"].createElement(index$2.LinkLabel, {
          key: LocalizationContext.uuidv4(),
          className: [wordClassName, 'sendbird-openchannel-og-message--word--link'],
          src: word,
          type: index$1.LabelTypography.BODY_1,
          color: index$1.LabelColors.PRIMARY
        }, word) : /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
          key: LocalizationContext.uuidv4(),
          className: wordClassName,
          type: index$1.LabelTypography.BODY_1,
          color: index$1.LabelColors.ONBACKGROUND_1
        }, word);
      });

      if (message.updatedAt > 0) {
        matchedMessage.push( /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
          key: LocalizationContext.uuidv4(),
          className: wordClassName,
          type: index$1.LabelTypography.BODY_1,
          color: index$1.LabelColors.ONBACKGROUND_2
        }, stringSet.MESSAGE_EDITED));
      }

      return matchedMessage;
    };
  }, [message, message.updatedAt]);

  var openLink = function openLink() {
    if (checkOGIsEnalbed(message)) {
      var url = ogMetaData.url;
      window.open(url);
    }
  }; // place conxt menu top depending clientHeight of message component


  React.useEffect(function () {
    var _a;

    if (((_a = messageComponentRef === null || messageComponentRef === void 0 ? void 0 : messageComponentRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) > 36) {
      setContextStyle({
        top: '8px '
      });
    } else {
      setContextStyle({
        top: '2px'
      });
    }
  }, [window.innerWidth]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-openchannel-og-message'], false).join(' '),
    ref: messageComponentRef
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top__left"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$1.Avatar, {
        className: "sendbird-openchannel-og-message__top__left__avatar",
        src: sender.profileUrl || '',
        ref: avatarRef,
        width: "28px",
        height: "28px",
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        }
      });
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: avatarRef,
        parentContainRef: avatarRef,
        closeDropdown: closeDropdown,
        style: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }, renderUserProfile ? renderUserProfile({
        user: sender,
        close: closeDropdown
      }) : /*#__PURE__*/React__default["default"].createElement(index$3.ConnectedUserProfile, {
        user: sender,
        onSuccess: closeDropdown,
        disableMessaging: true
      }));
    }
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top__right"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top__right__title"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-og-message__top__right__title__sender-name",
    type: index$1.LabelTypography.CAPTION_2,
    color: isByMe ? index$1.LabelColors.SECONDARY_3 : index$1.LabelColors.ONBACKGROUND_2
  }, sender && (sender.friendName || sender.nickname || sender.userId)), /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-og-message__top__right__title__sent-at",
    type: index$1.LabelTypography.CAPTION_3,
    color: index$1.LabelColors.ONBACKGROUND_3
  }, message.createdAt && index$1.format(message.createdAt, 'p'))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top__right__description"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-og-message__top__right__description__message",
    type: index$1.LabelTypography.BODY_1,
    color: index$1.LabelColors.ONBACKGROUND_1
  }, MemoizedMessageText()))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top__context-menu",
    ref: contextMenuRef,
    style: contextStyle
  }, /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return showMenuTrigger({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.IconButton, {
        className: "sendbird-openchannel-og-message__top__context-menu--icon",
        width: "32px",
        height: "32px",
        onClick: function onClick() {
          toggleDropdown();
        }
      }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
        type: index$1.IconTypes.MORE,
        fillColor: index$1.IconColors.CONTENT_INVERSE,
        width: "24px",
        height: "24px"
      }));
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: contextMenuRef,
        parentContainRef: contextMenuRef,
        closeDropdown: closeDropdown,
        openLeft: true
      }, isFineCopy({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-og-message__top__context-menu__copy",
        onClick: function onClick() {
          copyToClipboard(message.message);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__COPY), isFineEdit({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-og-message__top__context-menu__edit",
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          showEdit(true);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__EDIT), isFineResend({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-og-message__top__context-menu__resend",
        onClick: function onClick() {
          resendMessage(message);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND), isFineDelete({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        className: "sendbird-openchannel-og-message__top__context-menu__delete",
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          showRemove(true);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE));
    }
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__bottom"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__bottom__og-tag"
  }, ogMetaData.url && /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-og-message__bottom__og-tag__url",
    type: index$1.LabelTypography.CAPTION_3,
    color: index$1.LabelColors.ONBACKGROUND_2
  }, ogMetaData.url), ogMetaData.title && /*#__PURE__*/React__default["default"].createElement(index$2.LinkLabel, {
    className: "sendbird-openchannel-og-message__bottom__og-tag__title",
    src: ogMetaData.url,
    type: index$1.LabelTypography.SUBTITLE_2,
    color: index$1.LabelColors.PRIMARY
  }, ogMetaData.title), ogMetaData.description && /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-og-message__bottom__og-tag__description",
    type: index$1.LabelTypography.BODY_2,
    color: index$1.LabelColors.ONBACKGROUND_1
  }, ogMetaData.description), ogMetaData.url && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail",
    role: "button",
    onClick: openLink,
    onKeyDown: openLink,
    tabIndex: 0
  }, defaultImage && /*#__PURE__*/React__default["default"].createElement(index$1.ImageRenderer, {
    className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image",
    url: defaultImage.url || '',
    alt: defaultImage.alt || '',
    height: "189px",
    defaultComponent: /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image--placeholder"
    }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
      type: index$1.IconTypes.THUMBNAIL_NONE,
      width: "56px",
      height: "56px"
    }))
  }))), (isPending || isFailed) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-og-message__top__right__tail"
  }, isPending && /*#__PURE__*/React__default["default"].createElement(index$1.Loader, {
    width: "16px",
    height: "16px"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-og-message__top__right__tail__pending",
    type: index$1.IconTypes.SPINNER,
    fillColor: index$1.IconColors.PRIMARY,
    width: "16px",
    height: "16px"
  })), isFailed && /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-og-message__top__right__tail__failed",
    type: index$1.IconTypes.ERROR,
    width: "16px",
    height: "16px"
  }))));
}

var SUPPORTING_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  UNSUPPORTED: 'UNSUPPORTED'
};
var SUPPORTED_MIMES$1 = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mpeg', 'video/ogg', 'video/webm', 'video/mp4']
};
var getSupportingFileType = function getSupportingFileType(type) {
  if (SUPPORTED_MIMES$1.IMAGE.indexOf(type) >= 0) {
    return SUPPORTING_TYPES.IMAGE;
  }

  if (SUPPORTED_MIMES$1.VIDEO.indexOf(type) >= 0) {
    return SUPPORTING_TYPES.VIDEO;
  }

  return SUPPORTING_TYPES.UNSUPPORTED;
};

function OpenchannelThumbnailMessage(_a) {
  var _b;

  var className = _a.className,
      message = _a.message,
      disabled = _a.disabled,
      userId = _a.userId,
      status = _a.status,
      chainTop = _a.chainTop,
      _onClick = _a.onClick,
      showRemove = _a.showRemove,
      resendMessage = _a.resendMessage;
  var type = message.type,
      url = message.url,
      localUrl = message.localUrl,
      thumbnails = message.thumbnails;
  var thumbnailUrl = thumbnails && thumbnails.length > 0 && thumbnails[0].url || null;
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;

  var _c = React.useContext(index$3.UserProfileContext),
      disableUserProfile = _c.disableUserProfile,
      renderUserProfile = _c.renderUserProfile;

  var _d = React.useState(360),
      messageWidth = _d[0],
      setMessageWidth = _d[1];

  var messageRef = React.useRef(null);
  var contextMenuRef = React.useRef(null);
  var avatarRef = React.useRef(null);
  var memorizedThumbnailPlaceHolder = React.useMemo(function () {
    return function (type) {
      return function (_a) {
        var style = _a.style;
        return (
          /*#__PURE__*/
          // eslint-disable-line
          React__default["default"].createElement("div", {
            style: style
          }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
            type: type,
            fillColor: index$1.IconColors.ON_BACKGROUND_2,
            width: "56px",
            height: "56px"
          }))
        );
      };
    };
  }, []);
  var isByMe = checkIsByMe(message, userId);
  var isMessageSent = checkIsSent(status);
  var isPending = checkIsPending(status);
  var isFailed = checkIsFailed(status);
  var sender = getSenderFromMessage(message);
  React.useEffect(function () {
    var _a;

    var thumbnailWidth = ((_a = messageRef === null || messageRef === void 0 ? void 0 : messageRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) - 80;
    setMessageWidth(thumbnailWidth > 360 ? 360 : thumbnailWidth);
  }, []);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-openchannel-thumbnail-message'], false).join(' '),
    ref: messageRef
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__left"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$1.Avatar, {
        className: "sendbird-openchannel-thumbnail-message__left__avatar",
        src: sender.profileUrl || '',
        ref: avatarRef,
        width: "28px",
        height: "28px",
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        }
      });
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: avatarRef,
        parentContainRef: avatarRef,
        closeDropdown: closeDropdown,
        style: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }, renderUserProfile ? renderUserProfile({
        user: sender,
        close: closeDropdown
      }) : /*#__PURE__*/React__default["default"].createElement(index$3.ConnectedUserProfile, {
        user: sender,
        onSuccess: closeDropdown,
        disableMessaging: true
      }));
    }
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right__title"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-thumbnail-message__right__title__sender-name",
    type: index$1.LabelTypography.CAPTION_2,
    color: isByMe ? index$1.LabelColors.SECONDARY_3 : index$1.LabelColors.ONBACKGROUND_2
  }, sender && (sender.friendName || sender.nickname || sender.userId)), /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-thumbnail-message__right__title__sent-at",
    type: index$1.LabelTypography.CAPTION_3,
    color: index$1.LabelColors.ONBACKGROUND_3
  }, message.createdAt && index$1.format(message.createdAt, 'p'))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right__body"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap",
    role: "button",
    onClick: function onClick() {
      if (isMessageSent) {
        _onClick(true);
      }
    },
    onKeyDown: function onKeyDown() {
      if (isMessageSent) {
        _onClick(true);
      }
    },
    tabIndex: 0
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__overlay"
  }), (_b = {}, _b[SUPPORTING_TYPES.VIDEO] = url || localUrl ? /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video"
  }, thumbnailUrl ? /*#__PURE__*/React__default["default"].createElement(index$1.ImageRenderer, {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video",
    url: thumbnailUrl,
    width: messageWidth,
    height: "270px",
    alt: "image",
    placeHolder: memorizedThumbnailPlaceHolder(index$1.IconTypes.PLAY)
  }) : /*#__PURE__*/React__default["default"].createElement("video", {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video__video"
  }, /*#__PURE__*/React__default["default"].createElement("source", {
    src: url || localUrl,
    type: type
  })), /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon",
    type: index$1.IconTypes.PLAY,
    fillColor: index$1.IconColors.ON_BACKGROUND_2,
    width: "56px",
    height: "56px"
  })) : /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video--icon",
    type: index$1.IconTypes.PHOTO,
    fillColor: index$1.IconColors.ON_BACKGROUND_2,
    width: "56px",
    height: "56px"
  }), _b[SUPPORTING_TYPES.IMAGE] = url || localUrl ? /*#__PURE__*/React__default["default"].createElement(index$1.ImageRenderer, {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__image",
    url: thumbnailUrl || url || localUrl,
    alt: "image",
    width: messageWidth,
    height: "270px",
    placeHolder: memorizedThumbnailPlaceHolder(index$1.IconTypes.PHOTO)
  }) : /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon",
    type: index$1.IconTypes.PHOTO,
    fillColor: index$1.IconColors.ON_BACKGROUND_2,
    width: "56px",
    height: "56px"
  }), _b[SUPPORTING_TYPES.UNSUPPORTED] = /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-thumbnail-message__right__body__wrap__unknown",
    type: index$1.IconTypes.PHOTO,
    fillColor: index$1.IconColors.ON_BACKGROUND_2,
    width: "56px",
    height: "56px"
  }), _b)[getSupportingFileType(type)])), (isPending || isFailed) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__right__tail"
  }, isPending && /*#__PURE__*/React__default["default"].createElement(index$1.Loader, {
    width: "16px",
    height: "16px"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-thumbnail-message__right__tail__pending",
    type: index$1.IconTypes.SPINNER,
    fillColor: index$1.IconColors.PRIMARY,
    width: "16px",
    height: "16px"
  })), isFailed && /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-thumbnail-message__right__tail__failed",
    type: index$1.IconTypes.ERROR,
    width: "16px",
    height: "16px"
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-thumbnail-message__context-menu",
    ref: contextMenuRef
  }, /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return showMenuTrigger({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.IconButton, {
        className: "sendbird-openchannel-thumbnail-message__context-menu--icon",
        width: "32px",
        height: "32px",
        onClick: toggleDropdown
      }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
        type: index$1.IconTypes.MORE,
        fillColor: index$1.IconColors.CONTENT_INVERSE,
        width: "24px",
        height: "24px"
      }));
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: contextMenuRef,
        parentContainRef: contextMenuRef,
        closeDropdown: closeDropdown,
        openLeft: true
      }, isFineResend({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        onClick: function onClick() {
          resendMessage(message);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND), isFineDelete({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          showRemove(true);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE));
    }
  })));
}

var checkFileType = function checkFileType(fileUrl) {
  var audioFile = /(\.mp3)$/i;
  var gifFile = /(\.gif)$/i;

  if (audioFile.test(fileUrl)) {
    return index$1.IconTypes.FILE_AUDIO;
  }

  if (gifFile.test(fileUrl)) {
    return index$1.IconTypes.GIF;
  }

  return index$1.IconTypes.FILE_DOCUMENT;
};
var truncate = function truncate(fullStr, strLen) {
  if (fullStr === null || fullStr === undefined) return '';
  if (fullStr.length <= strLen) return fullStr;
  var separator = '...';
  var sepLen = separator.length;
  var charsToShow = strLen - sepLen;
  var frontChars = Math.ceil(charsToShow / 2);
  var backChars = Math.floor(charsToShow / 2);
  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

function OpenchannelFileMessage(_a) {
  var className = _a.className,
      message = _a.message,
      userId = _a.userId,
      disabled = _a.disabled,
      chainTop = _a.chainTop,
      status = _a.status,
      showRemove = _a.showRemove,
      resendMessage = _a.resendMessage;
  var contextMenuRef = React.useRef(null);
  var avatarRef = React.useRef(null);
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;

  var _b = React.useContext(index$3.UserProfileContext),
      disableUserProfile = _b.disableUserProfile,
      renderUserProfile = _b.renderUserProfile;

  var openFileUrl = function openFileUrl() {
    window.open(message.url);
  };

  var isByMe = checkIsByMe(message, userId);
  var isPending = checkIsPending(status);
  var isFailed = checkIsFailed(status);
  var sender = getSenderFromMessage(message);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-openchannel-file-message'], false).join(' ')
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-file-message__left"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$1.Avatar, {
        className: "sendbird-openchannel-file-message__left__avatar",
        src: sender.profileUrl || '',
        ref: avatarRef,
        width: "28px",
        height: "28px",
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        }
      });
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: avatarRef,
        parentContainRef: avatarRef,
        closeDropdown: closeDropdown,
        style: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }, renderUserProfile ? renderUserProfile({
        user: sender,
        close: closeDropdown
      }) : /*#__PURE__*/React__default["default"].createElement(index$3.ConnectedUserProfile, {
        user: sender,
        onSuccess: closeDropdown,
        disableMessaging: true
      }));
    }
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-file-message__right"
  }, !chainTop && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-file-message__right__title"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-file-message__right__title__sender-name",
    type: index$1.LabelTypography.CAPTION_2,
    color: isByMe ? index$1.LabelColors.SECONDARY_3 : index$1.LabelColors.ONBACKGROUND_2
  }, sender && (sender.friendName || sender.nickname || sender.userId)), /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    className: "sendbird-openchannel-file-message__right__title__sent-at",
    type: index$1.LabelTypography.CAPTION_3,
    color: index$1.LabelColors.ONBACKGROUND_3
  }, message.createdAt && index$1.format(message.createdAt, 'p'))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-file-message__right__body"
  }, checkFileType(message.url) && /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-file-message__right__body__icon",
    type: checkFileType(message.url),
    fillColor: index$1.IconColors.PRIMARY,
    width: "48px",
    height: "48px"
  }), /*#__PURE__*/React__default["default"].createElement(index$3.TextButton, {
    className: "sendbird-openchannel-file-message__right__body__file-name",
    onClick: openFileUrl
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    type: index$1.LabelTypography.BODY_1,
    color: index$1.LabelColors.ONBACKGROUND_1
  }, truncate(message.name || message.url, 40)))), (isPending || isFailed) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-file-message__right__tail"
  }, isPending && /*#__PURE__*/React__default["default"].createElement(index$1.Loader, {
    width: "16px",
    height: "16px"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-file-message__right__tail__pending",
    type: index$1.IconTypes.SPINNER,
    fillColor: index$1.IconColors.PRIMARY,
    width: "16px",
    height: "16px"
  })), isFailed && /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    className: "sendbird-openchannel-file-message__right__tail__failed",
    type: index$1.IconTypes.ERROR,
    width: "16px",
    height: "16px"
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-file-message__context-menu",
    ref: contextMenuRef
  }, /*#__PURE__*/React__default["default"].createElement(index$3.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return showMenuTrigger({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.IconButton, {
        className: "sendbird-openchannel-file-message__context-menu__icon",
        width: "32px",
        height: "32px",
        onClick: toggleDropdown
      }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
        type: index$1.IconTypes.MORE,
        width: "24px",
        height: "24px"
      }));
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$3.MenuItems, {
        parentRef: contextMenuRef,
        parentContainRef: contextMenuRef,
        closeDropdown: closeDropdown,
        openLeft: true
      }, isFineResend({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          resendMessage(message);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND), isFineDelete({
        message: message,
        userId: userId,
        status: status
      }) && /*#__PURE__*/React__default["default"].createElement(index$3.MenuItem, {
        onClick: function onClick() {
          if (disabled) {
            return;
          }

          showRemove(true);
          closeDropdown();
        }
      }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE));
    }
  })));
}

function RemoveMessageModal(_a) {
  var onCloseModal = _a.onCloseModal,
      onDeleteMessage = _a.onDeleteMessage;
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
  return /*#__PURE__*/React__default["default"].createElement(index$3.Modal, {
    onCancel: onCloseModal,
    onSubmit: onDeleteMessage,
    submitText: "Delete",
    titleText: stringSet.MODAL__DELETE_MESSAGE__TITLE
  });
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
var SUPPORTED_MIMES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp' // not supported in IE
  ],
  VIDEO: ['video/mpeg', 'video/ogg', 'video/webm', 'video/mp4']
};
var isImage = function isImage(type) {
  return SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
};
var isVideo = function isVideo(type) {
  return SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0;
};

var MessageTypes = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  FILE: 'FILE',
  THUMBNAIL: 'THUMBNAIL',
  OG: 'OG',
  UNKNOWN: 'UNKNOWN'
};
var SendingMessageStatus = {
  NONE: 'none',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  PENDING: 'pending'
};
var getMessageType = function getMessageType(message) {
  if (message.isUserMessage && message.isUserMessage() || message.messageType === 'user') {
    return message.ogMetaData ? MessageTypes.OG : MessageTypes.USER;
  }

  if (message.isAdminMessage && message.isAdminMessage()) {
    return MessageTypes.ADMIN;
  }

  if (message.messageType === 'file') {
    return isImage(message.type) || isVideo(message.type) ? MessageTypes.THUMBNAIL : MessageTypes.FILE;
  }

  return MessageTypes.UNKNOWN;
};

function MessageHoc(_a) {
  var _b;

  var message = _a.message,
      userId = _a.userId,
      disabled = _a.disabled,
      editDisabled = _a.editDisabled,
      hasSeparator = _a.hasSeparator,
      channel = _a.channel,
      renderCustomMessage = _a.renderCustomMessage,
      deleteMessage = _a.deleteMessage,
      updateMessage = _a.updateMessage,
      resendMessage = _a.resendMessage,
      status = _a.status,
      chainTop = _a.chainTop,
      chainBottom = _a.chainBottom;
  var sender = null;

  if (message.messageType !== 'admin') {
    sender = message.sender;
  }

  var RenderedMessage = React.useMemo(function () {
    if (renderCustomMessage) {
      return renderCustomMessage(message, channel, chainTop, chainBottom);
    }

    return null;
  }, [message, renderCustomMessage]);

  var _c = React.useState(false),
      showEdit = _c[0],
      setShowEdit = _c[1];

  var _d = React.useState(false),
      showRemove = _d[0],
      setShowRemove = _d[1];

  var _e = React.useState(false),
      showFileViewer = _e[0],
      setShowFileViewer = _e[1];

  var editMessageInputRef = React.useRef(null);
  var isByMe = false;

  if (sender && message.messageType !== 'admin') {
    // pending and failed messages are by me
    isByMe = userId === sender.userId || message.requestState === SendingMessageStatus.PENDING || message.requestState === SendingMessageStatus.FAILED;
  }

  if (RenderedMessage) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-msg-hoc sendbird-msg--scroll-ref"
    }, /*#__PURE__*/React__default["default"].createElement(RenderedMessage, {
      message: message
    }));
  }

  if (message.messageType === 'user' && showEdit) {
    return /*#__PURE__*/React__default["default"].createElement(index$2.MessageInput, {
      isEdit: true,
      disabled: editDisabled,
      ref: editMessageInputRef,
      name: message.messageId,
      onSendMessage: updateMessage,
      onCancelEdit: function onCancelEdit() {
        setShowEdit(false);
      },
      value: message.message
    });
  }

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-msg-hoc sendbird-msg--scroll-ref"
  }, hasSeparator && /*#__PURE__*/React__default["default"].createElement(index$2.DateSeparator, null, /*#__PURE__*/React__default["default"].createElement(index$1.Label, {
    type: index$1.LabelTypography.CAPTION_2,
    color: index$1.LabelColors.ONBACKGROUND_2
  }, index$1.format(message.createdAt, 'MMMM dd, yyyy'))), (_b = {}, _b[MessageTypes.ADMIN] = function () {
    if (message.messageType === 'admin') {
      return /*#__PURE__*/React__default["default"].createElement(OpenChannelAdminMessage, {
        message: message
      });
    }
  }(), _b[MessageTypes.FILE] = function () {
    if (message.messageType === 'file') {
      return /*#__PURE__*/React__default["default"].createElement(OpenchannelFileMessage, {
        message: message,
        disabled: disabled,
        userId: userId,
        showRemove: setShowRemove,
        resendMessage: resendMessage,
        status: status,
        chainTop: chainTop,
        chainBottom: chainBottom
      });
    }

    return;
  }(), _b[MessageTypes.OG] = function () {
    if (message.messageType === 'user') {
      return /*#__PURE__*/React__default["default"].createElement(OpenchannelOGMessage, {
        message: message,
        status: status,
        userId: userId,
        showEdit: setShowEdit,
        disabled: disabled,
        showRemove: setShowRemove,
        resendMessage: resendMessage,
        chainTop: chainTop,
        chainBottom: chainBottom
      });
    }

    return;
  }(), _b[MessageTypes.THUMBNAIL] = function () {
    if (message.messageType === 'file') {
      return /*#__PURE__*/React__default["default"].createElement(OpenchannelThumbnailMessage, {
        message: message,
        disabled: disabled,
        userId: userId,
        showRemove: setShowRemove,
        resendMessage: resendMessage,
        onClick: setShowFileViewer,
        status: status,
        chainTop: chainTop,
        chainBottom: chainBottom
      });
    }

    return;
  }(), _b[MessageTypes.USER] = function () {
    if (message.messageType === 'user') {
      return /*#__PURE__*/React__default["default"].createElement(OpenchannelUserMessage, {
        message: message,
        userId: userId,
        disabled: disabled,
        showEdit: setShowEdit,
        showRemove: setShowRemove,
        resendMessage: resendMessage,
        status: status,
        chainTop: chainTop,
        chainBottom: chainBottom
      });
    }

    return;
  }(), _b[MessageTypes.UNKNOWN] = function () {
    return; // return (
    //   <OpenChannelUnknownMessage message={message} />
    // );
  }(), _b)[getMessageType(message)], showRemove && /*#__PURE__*/React__default["default"].createElement(RemoveMessageModal, {
    onCloseModal: function onCloseModal() {
      return setShowRemove(false);
    },
    onDeleteMessage: function onDeleteMessage() {
      if (message.messageType !== 'admin') {
        deleteMessage(message);
      }
    }
  }), showFileViewer && message.messageType === 'file' && /*#__PURE__*/React__default["default"].createElement(index$2.FileViewer, {
    onClose: function onClose() {
      return setShowFileViewer(false);
    },
    message: message,
    onDelete: function onDelete() {
      return deleteMessage(message);
    },
    isByMe: isByMe
  }));
}

function OpenchannelConversationScroll(_a, ref) {
  var _b = _a.useMessageGrouping,
      useMessageGrouping = _b === void 0 ? true : _b,
      openchannel = _a.openchannel,
      user = _a.user,
      allMessages = _a.allMessages,
      _c = _a.isOnline,
      isOnline = _c === void 0 ? true : _c,
      hasMore = _a.hasMore,
      onScroll = _a.onScroll,
      renderCustomMessage = _a.renderCustomMessage,
      updateMessage = _a.updateMessage,
      deleteMessage = _a.deleteMessage,
      resendMessage = _a.resendMessage;
  var scrollRef = ref || React.useRef(null);

  var _d = React.useState(false),
      showScrollDownButton = _d[0],
      setShowScrollDownButton = _d[1];

  var handleOnScroll = function handleOnScroll(e) {
    var element = e.target;
    var scrollTop = element.scrollTop,
        scrollHeight = element.scrollHeight,
        clientHeight = element.clientHeight;

    if (scrollHeight > scrollTop + clientHeight && window.navigator.userAgent.indexOf('MSIE ') < 0 // don't show button in IE
    ) {
      setShowScrollDownButton(true);
    } else {
      setShowScrollDownButton(false);
    }

    if (!hasMore) {
      return;
    }

    if (scrollTop === 0) {
      var nodes = scrollRef.current.querySelectorAll('.sendbird-msg--scroll-ref');
      var first_1 = nodes && nodes[0];
      onScroll(function () {
        try {
          first_1.scrollIntoView();
        } catch (error) {}
      });
    }
  };

  var scrollToBottom = function scrollToBottom() {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
      setShowScrollDownButton(false);
    }
  };

  var hasMessage = React.useMemo(function () {
    return allMessages.length > 0;
  }, [allMessages.length]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-scroll",
    onScroll: handleOnScroll,
    ref: scrollRef
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-scroll__container"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-scroll__container__padding"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-scroll__container__item-container" + (hasMessage ? '' : '--no-messages')
  }, hasMessage ? allMessages.map(function (message, index) {
    var status;

    if (message.messageType !== 'admin') {
      status = message.sendingStatus;
    }

    var previousMessage = allMessages[index - 1];
    var nextMessage = allMessages[index - 1];
    var previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
    var currentCreatedAt = message.createdAt; // https://stackoverflow.com/a/41855608

    var hasSeparator = !(previousMessageCreatedAt && index$4.isSameDay(currentCreatedAt, previousMessageCreatedAt));

    var _a = useMessageGrouping ? compareMessagesForGrouping(previousMessage, message, nextMessage) : [false, false],
        chainTop = _a[0],
        chainBottom = _a[1];

    return /*#__PURE__*/React__default["default"].createElement(MessageHoc, {
      renderCustomMessage: renderCustomMessage,
      channel: openchannel,
      key: message.messageId,
      message: message,
      status: status,
      userId: user.userId,
      disabled: !isOnline,
      editDisabled: openchannel.isFrozen,
      hasSeparator: hasSeparator,
      chainTop: chainTop,
      chainBottom: chainBottom,
      deleteMessage: deleteMessage,
      updateMessage: updateMessage,
      resendMessage: resendMessage
    });
  }) : /*#__PURE__*/React__default["default"].createElement(index$1.PlaceHolder, {
    className: "sendbird-openchannel-conversation-scroll__container__place-holder",
    type: index$1.PlaceHolderTypes$1.NO_MESSAGES
  })), showScrollDownButton && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-openchannel-conversation-scroll__container__scroll-bottom-button",
    onClick: scrollToBottom,
    onKeyDown: scrollToBottom,
    tabIndex: 0,
    role: "button"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Icon, {
    width: "24px",
    height: "24px",
    type: index$1.IconTypes.CHEVRON_DOWN,
    fillColor: index$1.IconColors.CONTENT
  }))));
}

var OpenchannelConversationScroll$1 = /*#__PURE__*/React__default["default"].forwardRef(OpenchannelConversationScroll);

var SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
var SET_CHANNEL_INVALID = 'SET_CHANNEL_INVALID';
var RESET_MESSAGES = 'RESET_MESSAGES';
var GET_PREV_MESSAGES_START = 'GET_PREV_MESSAGES_START';
var GET_PREV_MESSAGES_SUCESS = 'GET_PREV_MESSAGES_SUCESS';
var GET_PREV_MESSAGES_FAIL = 'GET_PREV_MESSAGES_FAIL';
var SENDING_MESSAGE_FAILED = 'SENDING_MESSAGE_FAILED';
var SENDING_MESSAGE_SUCCEEDED = 'SENDING_MESSAGE_SUCCEEDED';
var SENDING_MESSAGE_START = 'SENDING_MESSAGE_START';
var RESENDING_MESSAGE_START = 'RESENDING_MESSAGE_START';
var FETCH_PARTICIPANT_LIST = 'FETCH_PARTICIPANT_LIST';
var FETCH_BANNED_USER_LIST = 'FETCH_BANNED_USER_LIST';
var FETCH_MUTED_USER_LIST = 'FETCH_MUTED_USER_LIST'; // event handlers

var ON_MESSAGE_RECEIVED = 'ON_MESSAGE_RECEIVED';
var ON_MESSAGE_UPDATED = 'ON_MESSAGE_UPDATED';
var ON_MESSAGE_DELETED = 'ON_MESSAGE_DELETED';
var ON_MESSAGE_DELETED_BY_REQ_ID = 'ON_MESSAGE_DELETED_BY_REQ_ID';
var ON_OPERATOR_UPDATED = 'ON_OPERATOR_UPDATED';
var ON_USER_ENTERED = 'ON_USER_ENTERED';
var ON_USER_EXITED = 'ON_USER_EXITED';
var ON_USER_MUTED = 'ON_USER_MUTED';
var ON_USER_UNMUTED = 'ON_USER_UNMUTED';
var ON_USER_BANNED = 'ON_USER_BANNED';
var ON_USER_UNBANNED = 'ON_USER_UNBANNED';
var ON_CHANNEL_FROZEN = 'ON_CHANNEL_FROZEN';
var ON_CHANNEL_UNFROZEN = 'ON_CHANNEL_UNFROZEN';
var ON_CHANNEL_CHANGED = 'ON_CHANNEL_CHANGED';
var ON_META_DATA_CREATED = 'ON_META_DATA_CREATED';
var ON_META_DATA_UPDATED = 'ON_META_DATA_UPDATED';
var ON_META_DATA_DELETED = 'ON_META_DATA_DELETED';
var ON_META_COUNTERS_CREATED = 'ON_META_COUNTERS_CREATED';
var ON_META_COUNTERS_UPDATED = 'ON_META_COUNTERS_UPDATED';
var ON_META_COUNTERS_DELETED = 'ON_META_COUNTERS_DELETED';
var ON_MENTION_RECEIVED = 'ON_MENTION_RECEIVED';

var messageActionTypes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SET_CURRENT_CHANNEL: SET_CURRENT_CHANNEL,
    SET_CHANNEL_INVALID: SET_CHANNEL_INVALID,
    RESET_MESSAGES: RESET_MESSAGES,
    GET_PREV_MESSAGES_START: GET_PREV_MESSAGES_START,
    GET_PREV_MESSAGES_SUCESS: GET_PREV_MESSAGES_SUCESS,
    GET_PREV_MESSAGES_FAIL: GET_PREV_MESSAGES_FAIL,
    SENDING_MESSAGE_FAILED: SENDING_MESSAGE_FAILED,
    SENDING_MESSAGE_SUCCEEDED: SENDING_MESSAGE_SUCCEEDED,
    SENDING_MESSAGE_START: SENDING_MESSAGE_START,
    RESENDING_MESSAGE_START: RESENDING_MESSAGE_START,
    FETCH_PARTICIPANT_LIST: FETCH_PARTICIPANT_LIST,
    FETCH_BANNED_USER_LIST: FETCH_BANNED_USER_LIST,
    FETCH_MUTED_USER_LIST: FETCH_MUTED_USER_LIST,
    ON_MESSAGE_RECEIVED: ON_MESSAGE_RECEIVED,
    ON_MESSAGE_UPDATED: ON_MESSAGE_UPDATED,
    ON_MESSAGE_DELETED: ON_MESSAGE_DELETED,
    ON_MESSAGE_DELETED_BY_REQ_ID: ON_MESSAGE_DELETED_BY_REQ_ID,
    ON_OPERATOR_UPDATED: ON_OPERATOR_UPDATED,
    ON_USER_ENTERED: ON_USER_ENTERED,
    ON_USER_EXITED: ON_USER_EXITED,
    ON_USER_MUTED: ON_USER_MUTED,
    ON_USER_UNMUTED: ON_USER_UNMUTED,
    ON_USER_BANNED: ON_USER_BANNED,
    ON_USER_UNBANNED: ON_USER_UNBANNED,
    ON_CHANNEL_FROZEN: ON_CHANNEL_FROZEN,
    ON_CHANNEL_UNFROZEN: ON_CHANNEL_UNFROZEN,
    ON_CHANNEL_CHANGED: ON_CHANNEL_CHANGED,
    ON_META_DATA_CREATED: ON_META_DATA_CREATED,
    ON_META_DATA_UPDATED: ON_META_DATA_UPDATED,
    ON_META_DATA_DELETED: ON_META_DATA_DELETED,
    ON_META_COUNTERS_CREATED: ON_META_COUNTERS_CREATED,
    ON_META_COUNTERS_UPDATED: ON_META_COUNTERS_UPDATED,
    ON_META_COUNTERS_DELETED: ON_META_COUNTERS_DELETED,
    ON_MENTION_RECEIVED: ON_MENTION_RECEIVED
});

function reducer(state, action) {
  switch (action.type) {
    case RESET_MESSAGES:
      {
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: []
        });
      }

    case SET_CURRENT_CHANNEL:
      {
        var gottenChannel = action.payload;
        var operators = gottenChannel.operators;

        if (!state.isInvalid && state.currentOpenChannel && state.currentOpenChannel.url && state.currentOpenChannel.url === gottenChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          currentOpenChannel: gottenChannel,
          isInvalid: false,
          operators: operators,
          participants: operators,
          bannedParticipantIds: [],
          mutedParticipantIds: []
        });
      }

    case SET_CHANNEL_INVALID:
      {
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          isInvalid: true
        });
      }

    case GET_PREV_MESSAGES_START:
      {
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          loading: true
        });
      }

    case GET_PREV_MESSAGES_SUCESS:
    case GET_PREV_MESSAGES_FAIL:
      {
        var isFailed = action.type === GET_PREV_MESSAGES_FAIL;
        var _a = action.payload,
            _b = _a.currentOpenChannel,
            currentOpenChannel = _b === void 0 ? {} : _b,
            _c = _a.messages,
            messages = _c === void 0 ? [] : _c,
            hasMore = _a.hasMore,
            lastMessageTimestamp = _a.lastMessageTimestamp;
        var actionChannelUrl = currentOpenChannel.url;
        var receivedMessages_1 = isFailed ? [] : messages;

        var _hasMore = isFailed ? false : hasMore;

        var _lastMessageTimestamp = isFailed ? 0 : lastMessageTimestamp;

        var stateChannel = state.currentOpenChannel;
        var stateChannelUrl = stateChannel.url;

        if (actionChannelUrl !== stateChannelUrl) {
          return state;
        }

        var filteredAllMessages = state.allMessages.filter(function (message) {
          return !receivedMessages_1.find(function (_a) {
            var messageId = _a.messageId;
            return index$2.compareIds(messageId, message.messageId);
          });
        });
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          loading: false,
          initialized: true,
          hasMore: _hasMore,
          lastMessageTimestamp: _lastMessageTimestamp,
          allMessages: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], receivedMessages_1, true), filteredAllMessages, true)
        });
      }

    case SENDING_MESSAGE_START:
      {
        var _d = action.payload,
            message = _d.message,
            channel = _d.channel;

        if (channel.url !== state.currentOpenChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.allMessages, true), [LocalizationContext.__assign({}, message)], false)
        });
      }

    case SENDING_MESSAGE_SUCCEEDED:
      {
        var sentMessage_1 = action.payload;
        var newMessages = state.allMessages.map(function (m) {
          return index$2.compareIds(m.reqId, sentMessage_1.reqId) ? sentMessage_1 : m;
        });
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: newMessages
        });
      }

    case SENDING_MESSAGE_FAILED:
      {
        var sentMessage_2 = action.payload;
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: state.allMessages.map(function (m) {
            return index$2.compareIds(m.reqId, sentMessage_2.reqId) ? sentMessage_2 : m;
          })
        });
      }

    case RESENDING_MESSAGE_START:
      {
        var eventedChannel = action.payload.channel;
        var resentMessage_1 = action.payload.message;

        if (eventedChannel.url !== state.currentOpenChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: state.allMessages.map(function (m) {
            return index$2.compareIds(m.reqId, resentMessage_1.reqId) ? resentMessage_1 : m;
          })
        });
      }

    case FETCH_PARTICIPANT_LIST:
      {
        var eventedChannel = action.payload.channel;
        var fetchedParticipantList = action.payload.users;

        if (eventedChannel.url !== state.currentOpenChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          participants: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.participants, true), fetchedParticipantList, true)
        });
      }

    case FETCH_BANNED_USER_LIST:
      {
        var eventedChannel = action.payload.channel;
        var fetchedBannedUserList = action.payload.users;

        if (eventedChannel.url !== state.currentOpenChannel.url || !fetchedBannedUserList.every(function (user) {
          return typeof user.userId === 'string';
        })) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          bannedParticipantIds: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.bannedParticipantIds, true), fetchedBannedUserList.map(function (user) {
            return user.userId;
          }), true)
        });
      }

    case FETCH_MUTED_USER_LIST:
      {
        var eventedChannel = action.payload.channel;
        var fetchedMutedUserList = action.payload.users;

        if (eventedChannel.url !== state.currentOpenChannel.url || !fetchedMutedUserList.every(function (user) {
          return typeof user.userId === 'string';
        })) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          mutedParticipantIds: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.bannedParticipantIds, true), fetchedMutedUserList.map(function (user) {
            return user.userId;
          }), true)
        });
      }
    // events

    case ON_MESSAGE_RECEIVED:
      {
        var eventedChannel = action.payload.channel;
        var receivedMessage = action.payload.message;
        var currentOpenChannel = state.currentOpenChannel;

        if (!index$2.compareIds(eventedChannel.url, currentOpenChannel.url) || !(state.allMessages.map(function (message) {
          return message.messageId;
        }).indexOf(receivedMessage.messageId) < 0)) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.allMessages, true), [receivedMessage], false)
        });
      }

    case ON_MESSAGE_UPDATED:
      {
        var eventedChannel = action.payload.channel;
        var updatedMessage_1 = action.payload.message;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: state.allMessages.map(function (message) {
            return message.isIdentical(updatedMessage_1) ? updatedMessage_1 : message;
          })
        });
      }

    case ON_MESSAGE_DELETED:
      {
        var eventedChannel = action.payload.channel;
        var deletedMessageId_1 = action.payload.messageId;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: state.allMessages.filter(function (message) {
            return !index$2.compareIds(message.messageId, deletedMessageId_1);
          })
        });
      }

    case ON_MESSAGE_DELETED_BY_REQ_ID:
      {
        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          allMessages: state.allMessages.filter(function (m) {
            return !index$2.compareIds(m.reqId, action.payload);
          })
        });
      }

    case ON_OPERATOR_UPDATED:
      {
        var eventedChannel = action.payload.channel;
        var updatedOperators = action.payload.operators;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          currentOpenChannel: LocalizationContext.__assign(LocalizationContext.__assign({}, state.currentOpenChannel), {
            operators: updatedOperators
          }),
          operators: updatedOperators
        });
      }

    case ON_USER_ENTERED:
      {
        var eventedChannel = action.payload.channel;
        var enteredUser = action.payload.user;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          participants: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.participants, true), [enteredUser], false)
        });
      }

    case ON_USER_EXITED:
      {
        var eventedChannel = action.payload.channel;
        var exitedUser_1 = action.payload.user;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          participants: state.participants.filter(function (participant) {
            return !index$2.compareIds(participant.userId, exitedUser_1.userId);
          })
        });
      }

    case ON_USER_MUTED:
      {
        var eventedChannel = action.payload.channel;
        var mutedUser = action.payload.user;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url || state.mutedParticipantIds.indexOf(mutedUser.userId) >= 0) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          mutedParticipantIds: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.mutedParticipantIds, true), [mutedUser.userId], false)
        });
      }

    case ON_USER_UNMUTED:
      {
        var eventedChannel = action.payload.channel;
        var unmutedUser_1 = action.payload.user;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url || state.mutedParticipantIds.indexOf(unmutedUser_1.userId) < 0) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          mutedParticipantIds: state.mutedParticipantIds.filter(function (userId) {
            return userId !== unmutedUser_1.userId;
          })
        });
      }

    case ON_USER_BANNED:
      {
        var eventedChannel = action.payload.channel;
        var bannedUser = action.payload.user;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url || state.bannedParticipantIds.indexOf(bannedUser.userId) >= 0) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          bannedParticipantIds: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], state.bannedParticipantIds, true), [bannedUser.userId], false)
        });
      }

    case ON_USER_UNBANNED:
      {
        var eventedChannel = action.payload.channel;
        var unbannedUser_1 = action.payload.user;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== eventedChannel.url || state.bannedParticipantIds.indexOf(unbannedUser_1.userId) < 0) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          bannedParticipantIds: state.bannedParticipantIds.filter(function (userId) {
            return userId !== unbannedUser_1.userId;
          })
        });
      }

    case ON_CHANNEL_FROZEN:
      {
        var frozenChannel = action.payload;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== frozenChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          frozen: true
        });
      }

    case ON_CHANNEL_UNFROZEN:
      {
        var unfrozenChannel = action.payload;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== unfrozenChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          frozen: false
        });
      }

    case ON_CHANNEL_CHANGED:
      {
        var changedChannel = action.payload;
        var currentChannel = state.currentOpenChannel;

        if (!currentChannel || currentChannel.url && currentChannel.url !== changedChannel.url) {
          return state;
        }

        return LocalizationContext.__assign(LocalizationContext.__assign({}, state), {
          currentOpenChannel: changedChannel
        });
      }

    case ON_META_DATA_CREATED:
      {
        // const eventedChannel = action.payload.channel;
        // const createdMetaData = action.payload.metaData;
        // return {
        //   ...state
        // };
        return state;
      }

    case ON_META_DATA_UPDATED:
      {
        // const eventedChannel = action.payload.channel;
        // const updatedMetaData = action.payload.metaData;
        // return {
        //   ...state
        // };
        return state;
      }

    case ON_META_DATA_DELETED:
      {
        // const eventedChannel = action.payload.channel;
        // const deletedMetaDataKeys = action.payload.metaDataKeys;
        // return {
        //   ...state
        // };
        return state;
      }

    case ON_META_COUNTERS_CREATED:
      {
        // const eventedChannel = action.payload.channel;
        // const createdMetaCounter = action.payload.metaCounter;
        // return {
        //   ...state
        // };
        return state;
      }

    case ON_META_COUNTERS_UPDATED:
      {
        // const eventedChannel = action.payload.channel;
        // const updatedMetaCounter = action.payload.metaCounter;
        // return {
        //   ...state
        // };
        return state;
      }

    case ON_META_COUNTERS_DELETED:
      {
        // const eventedChannel = action.payload.channel;
        // const deletedMetaCounterKeys = action.payload.metaCounterKeys;
        // return {
        //   ...state
        // };
        return state;
      }

    case ON_MENTION_RECEIVED:
      {
        // const eventedChannel = action.payload.channel;
        // const mentionedMessage = action.payload.message;
        // return {
        //   ...state
        // };
        return state;
      }

    default:
      return state;
  }
}

var initialState = {
  allMessages: [],
  loading: false,
  initialized: false,
  currentOpenChannel: null,
  isInvalid: false,
  hasMore: false,
  lastMessageTimestamp: 0,
  frozen: false,
  operators: [],
  participants: [],
  bannedParticipantIds: [],
  mutedParticipantIds: []
};

function useSetChannel(_a, _b) {
  var channelUrl = _a.channelUrl,
      sdkInit = _a.sdkInit,
      fetchingParticipants = _a.fetchingParticipants;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  React.useEffect(function () {
    if (channelUrl && sdkInit && sdk && sdk.OpenChannel) {
      logger.info('OpenChannel | useSetChannel fetching channel', channelUrl);
      sdk.OpenChannel.getChannel(channelUrl, function (openChannel, error) {
        if (!error) {
          logger.info('OpenChannel | useSetChannel fetched channel', openChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: openChannel
          });
          openChannel.enter(function (_, error) {
            if (error) {
              logger.warning('OpenChannel | useSetChannel enter channel failed', {
                channelUrl: channelUrl,
                error: error
              });
              messagesDispatcher({
                type: SET_CHANNEL_INVALID,
                payload: null
              });
            }

            if (fetchingParticipants) {
              // fetch participants, banned participantIds, muted participantIds
              var participantListQuery = openChannel.createParticipantListQuery();
              var bannedParticipantListQuery = openChannel.createBannedUserListQuery();
              var mutedParticipantListQuery = openChannel.createMutedUserListQuery();
              fetchWithListQuery(participantListQuery, logger, function (users) {
                messagesDispatcher({
                  type: FETCH_PARTICIPANT_LIST,
                  payload: {
                    channel: openChannel,
                    users: users
                  }
                });
              });
              fetchWithListQuery(bannedParticipantListQuery, logger, function (users) {
                messagesDispatcher({
                  type: FETCH_BANNED_USER_LIST,
                  payload: {
                    channel: openChannel,
                    users: users
                  }
                });
              });
              fetchWithListQuery(mutedParticipantListQuery, logger, function (users) {
                messagesDispatcher({
                  type: FETCH_MUTED_USER_LIST,
                  payload: {
                    channel: openChannel,
                    users: users
                  }
                });
              });
            }
          });
        } else {
          logger.warning('OpenChannel | useSetChannel fetching channel failed', {
            channelUrl: channelUrl,
            error: error
          });
          messagesDispatcher({
            type: SET_CHANNEL_INVALID,
            payload: null
          });
        }
      }); // .then((openChannel) => {
      //   logger.info('OpenChannel | useSetChannel fetched channel', openChannel);
      //   messagesDispatcher({
      //     type: messageActionTypes.SET_CURRENT_CHANNEL,
      //     payload: openChannel,
      //   });
      //   openChannel.enter((_, error) => {
      //     if (error) {
      //       logger.warning('OpenChannel | useSetChannel enter channel failed', { channelUrl, error });
      //       messagesDispatcher({
      //         type: messageActionTypes.SET_CHANNEL_INVALID,
      //       });
      //     }
      //     if (fetchingParticipants) {
      //       // fetch participants, banned participantIds, muted participantIds
      //       const participantListQuery = openChannel.createParticipantListQuery();
      //       const bannedParticipantListQuery = openChannel.createBannedUserListQuery();
      //       const mutedParticipantListQuery = openChannel.createMutedUserListQuery();
      //       utils.fetchWithListQuery(
      //         participantListQuery,
      //         logger,
      //         (users) => {
      //           messagesDispatcher({
      //             type: messageActionTypes.FETCH_PARTICIPANT_LIST,
      //             payload: {
      //               channel: openChannel,
      //               users,
      //             },
      //           });
      //         },
      //       );
      //       utils.fetchWithListQuery(
      //         bannedParticipantListQuery,
      //         logger,
      //         (users) => {
      //           messagesDispatcher({
      //             type: messageActionTypes.FETCH_BANNED_USER_LIST,
      //             payload: {
      //               channel: openChannel,
      //               users,
      //             },
      //           });
      //         },
      //       );
      //       utils.fetchWithListQuery(
      //         mutedParticipantListQuery,
      //         logger,
      //         (users) => {
      //           messagesDispatcher({
      //             type: messageActionTypes.FETCH_MUTED_USER_LIST,
      //             payload: {
      //               channel: openChannel,
      //               users,
      //             },
      //           });
      //         },
      //       );
      //     }
      //   });
      // })
      // .catch((error) => {
      //   logger.warning('OpenChannel | useSetChannel fetching channel failed', { channelUrl, error });
      //   messagesDispatcher({
      //     type: messageActionTypes.SET_CHANNEL_INVALID,
      //   });
      // });
    }
  }, [channelUrl, sdkInit, fetchingParticipants]);
}

function useHandleChannelEvents(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel,
      checkScrollBottom = _a.checkScrollBottom;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  React.useEffect(function () {
    var messageReceiverId = LocalizationContext.uuidv4();

    if (currentOpenChannel && currentOpenChannel.url && sdk && sdk.ChannelHandler) {
      var ChannelHandler = new sdk.ChannelHandler();
      logger.info('OpenChannel | useHandleChannelEvents: Setup evnet handler', messageReceiverId);

      ChannelHandler.onMessageReceived = function (channel, message) {
        var scrollToEnd = checkScrollBottom();
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMessageReceived', {
          channelUrl: channelUrl,
          message: message
        });
        messagesDispatcher({
          type: ON_MESSAGE_RECEIVED,
          payload: {
            channel: channel,
            message: message
          }
        });

        if (scrollToEnd) {
          try {
            setTimeout(function () {
              scrollIntoLast();
            });
          } catch (error) {
            logger.warning('OpenChannel | onMessageReceived | scroll to end failed');
          }
        }
      };

      ChannelHandler.onMessageUpdated = function (channel, message) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMessageUpdated', {
          channelUrl: channelUrl,
          message: message
        });
        messagesDispatcher({
          type: ON_MESSAGE_UPDATED,
          payload: {
            channel: channel,
            message: message
          }
        });
      };

      ChannelHandler.onMessageDeleted = function (channel, messageId) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMessageDeleted', {
          channelUrl: channelUrl,
          messageId: messageId
        });
        messagesDispatcher({
          type: ON_MESSAGE_DELETED,
          payload: {
            channel: channel,
            messageId: messageId
          }
        });
      };

      ChannelHandler.onOperatorUpdated = function (channel, operators) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onOperatorUpdated', {
          channelUrl: channelUrl,
          operators: operators
        });
        messagesDispatcher({
          type: ON_OPERATOR_UPDATED,
          payload: {
            channel: channel,
            operators: operators
          }
        });
      };

      ChannelHandler.onUserEntered = function (channel, user) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserEntered', {
          channelUrl: channelUrl,
          user: user
        });
        messagesDispatcher({
          type: ON_USER_ENTERED,
          payload: {
            channel: channel,
            user: user
          }
        });
      };

      ChannelHandler.onUserExited = function (channel, user) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserExited', {
          channelUrl: channelUrl,
          user: user
        });
        messagesDispatcher({
          type: ON_USER_EXITED,
          payload: {
            channel: channel,
            user: user
          }
        });
      };

      ChannelHandler.onUserMuted = function (channel, user) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserMuted', {
          channelUrl: channelUrl,
          user: user
        });
        messagesDispatcher({
          type: ON_USER_MUTED,
          payload: {
            channel: channel,
            user: user
          }
        });
      };

      ChannelHandler.onUserUnmuted = function (channel, user) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserUnmuted', {
          channelUrl: channelUrl,
          user: user
        });
        messagesDispatcher({
          type: ON_USER_UNMUTED,
          payload: {
            channel: channel,
            user: user
          }
        });
      };

      ChannelHandler.onUserBanned = function (channel, user) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserBanned', {
          channelUrl: channelUrl,
          user: user
        });
        messagesDispatcher({
          type: ON_USER_BANNED,
          payload: {
            channel: channel,
            user: user
          }
        });
      };

      ChannelHandler.onUserUnbanned = function (channel, user) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserUnbanned', {
          channelUrl: channelUrl,
          user: user
        });
        messagesDispatcher({
          type: ON_USER_UNBANNED,
          payload: {
            channel: channel,
            user: user
          }
        });
      };

      ChannelHandler.onChannelFrozen = function (channel) {
        logger.info('OpenChannel | useHandleChannelEvents: onChannelFrozen', channel);
        messagesDispatcher({
          type: ON_CHANNEL_FROZEN,
          payload: channel
        });
      };

      ChannelHandler.onChannelUnfrozen = function (channel) {
        logger.info('OpenChannel | useHandleChannelEvents: onChannelUnfrozen', channel);
        messagesDispatcher({
          type: ON_CHANNEL_UNFROZEN,
          payload: channel
        });
      };

      ChannelHandler.onChannelChanged = function (channel) {
        logger.info('OpenChannel | useHandleChannelEvents: onChannelChanged', channel);
        messagesDispatcher({
          type: ON_CHANNEL_CHANGED,
          payload: channel
        });
      };

      ChannelHandler.onMetaDataCreated = function (channel, metaData) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaDataCreated', {
          channelUrl: channelUrl,
          metaData: metaData
        });
        messagesDispatcher({
          type: ON_META_DATA_CREATED,
          payload: {
            channel: channel,
            metaData: metaData
          }
        });
      };

      ChannelHandler.onMetaDataUpdated = function (channel, metaData) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaDataUpdated', {
          channelUrl: channelUrl,
          metaData: metaData
        });
        messagesDispatcher({
          type: ON_META_DATA_UPDATED,
          payload: {
            channel: channel,
            metaData: metaData
          }
        });
      };

      ChannelHandler.onMetaDataDeleted = function (channel, metaDataKeys) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaDataDeleted', {
          channelUrl: channelUrl,
          metaDataKeys: metaDataKeys
        });
        messagesDispatcher({
          type: ON_META_DATA_DELETED,
          payload: {
            channel: channel,
            metaDataKeys: metaDataKeys
          }
        });
      };

      ChannelHandler.onMetaCountersCreated = function (channel, metaCounter) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersCreated', {
          channelUrl: channelUrl,
          metaCounter: metaCounter
        });
        messagesDispatcher({
          type: ON_META_COUNTERS_CREATED,
          payload: {
            channel: channel,
            metaCounter: metaCounter
          }
        });
      };

      ChannelHandler.onMetaCountersUpdated = function (channel, metaCounter) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersUpdated', {
          channelUrl: channelUrl,
          metaCounter: metaCounter
        });
        messagesDispatcher({
          type: ON_META_COUNTERS_UPDATED,
          payload: {
            channel: channel,
            metaCounter: metaCounter
          }
        });
      };

      ChannelHandler.onMetaCountersDeleted = function (channel, metaCounterKeys) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersDeleted', {
          channelUrl: channelUrl,
          metaCounterKeys: metaCounterKeys
        });
        messagesDispatcher({
          type: ON_META_COUNTERS_DELETED,
          payload: {
            channel: channel,
            metaCounterKeys: metaCounterKeys
          }
        });
      };

      ChannelHandler.onMentionReceived = function (channel, message) {
        var channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMentionReceived', {
          channelUrl: channelUrl,
          message: message
        });
        messagesDispatcher({
          type: ON_MENTION_RECEIVED,
          payload: {
            channel: channel,
            message: message
          }
        });
      };

      sdk.addChannelHandler(messageReceiverId, ChannelHandler);
    }

    return function () {
      if (sdk && sdk.removeChannelHandler) {
        logger.info('OpenChannel | useHandleChannelEvents: Removing message receiver handler', messageReceiverId);
        sdk.removeChannelHandler(messageReceiverId);
      }
    };
  }, [currentOpenChannel]);
}

function useInitialMessagesFetch(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel,
      userFilledMessageListParams = _a.userFilledMessageListParams;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  React.useEffect(function () {
    logger.info('OpenChannel | useInitialMessagesFetch: Setup started', currentOpenChannel);
    messagesDispatcher({
      type: RESET_MESSAGES,
      payload: null
    });

    if (sdk && sdk.MessageListParams && currentOpenChannel && currentOpenChannel.getMessagesByTimestamp) {
      var messageListParams_1 = new sdk.MessageListParams();
      messageListParams_1.prevResultSize = 30;
      messageListParams_1.isInclusive = true;
      messageListParams_1.includeReplies = false;
      messageListParams_1.includeReactions = false;

      if (userFilledMessageListParams) {
        Object.keys(userFilledMessageListParams).forEach(function (key) {
          messageListParams_1[key] = userFilledMessageListParams[key];
        });
        logger.info('OpenChannel | useInitialMessagesFetch: Used customizedMessageListParams');
      }

      logger.info('OpenChannel | useInitialMessagesFetch: Fetching messages', {
        currentOpenChannel: currentOpenChannel,
        messageListParams: messageListParams_1
      });
      messagesDispatcher({
        type: GET_PREV_MESSAGES_START,
        payload: null
      });
      currentOpenChannel.getMessagesByTimestamp(new Date().getTime(), messageListParams_1, function (messages, error) {
        if (!error) {
          logger.info('OpenChannel | useInitialMessagesFetch: Fetching messages succeeded', messages);
          var hasMore = messages && messages.length > 0;
          var lastMessageTimestamp = hasMore ? messages[0].createdAt : null;
          messagesDispatcher({
            type: GET_PREV_MESSAGES_SUCESS,
            payload: {
              currentOpenChannel: currentOpenChannel,
              messages: messages,
              hasMore: hasMore,
              lastMessageTimestamp: lastMessageTimestamp
            }
          });
          setTimeout(function () {
            scrollIntoLast();
          });
        } else {
          logger.error('OpenChannel | useInitialMessagesFetch: Fetching messages failed', error);
          messagesDispatcher({
            type: GET_PREV_MESSAGES_FAIL,
            payload: {
              currentOpenChannel: currentOpenChannel,
              messages: [],
              hasMore: false,
              lastMessageTimestamp: 0
            }
          });
        }
      });
    }
  }, [currentOpenChannel, userFilledMessageListParams]);
}

function useScrollCallback(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel,
      lastMessageTimestamp = _a.lastMessageTimestamp;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher,
      hasMore = _b.hasMore,
      userFilledMessageListParams = _b.userFilledMessageListParams;
  return React.useCallback(function (callback) {
    if (hasMore && sdk && sdk.MessageListParams) {
      logger.info('OpenChannel | useScrollCallback: start');
      var messageListParams_1 = new sdk.MessageListParams();
      messageListParams_1.prevResultSize = 30;
      messageListParams_1.includeReplies = false;
      messageListParams_1.includeReactions = false;

      if (userFilledMessageListParams) {
        Object.keys(userFilledMessageListParams).forEach(function (key) {
          messageListParams_1[key] = userFilledMessageListParams[key];
        });
        logger.info('OpenChannel | useScrollCallback: Used userFilledMessageListParams', userFilledMessageListParams);
      }

      logger.info('OpenChannel | useScrollCallback: Fetching messages', {
        currentOpenChannel: currentOpenChannel,
        messageListParams: messageListParams_1
      });
      currentOpenChannel.getMessagesByTimestamp(lastMessageTimestamp || new Date().getTime(), messageListParams_1, function (messages, error) {
        if (!error) {
          logger.info('OpenChannel | useScrollCallback: Fetching messages succeeded', messages);
          var hasMore_1 = messages && messages.length > 0;
          var lastMessageTimestamp_1 = hasMore_1 ? messages[0].createdAt : null;
          messagesDispatcher({
            type: GET_PREV_MESSAGES_SUCESS,
            payload: {
              currentOpenChannel: currentOpenChannel,
              messages: messages,
              hasMore: hasMore_1,
              lastMessageTimestamp: lastMessageTimestamp_1
            }
          });
          setTimeout(function () {
            callback();
          });
        } else {
          logger.error('OpenChannel | useScrollCallback: Fetching messages failed', error);
          messagesDispatcher({
            type: GET_PREV_MESSAGES_FAIL,
            payload: {
              currentOpenChannel: currentOpenChannel,
              messages: [],
              hasMore: false,
              lastMessageTimestamp: 0
            }
          });
        }
      });
    }
  }, [currentOpenChannel, lastMessageTimestamp]);
}

function useCheckScrollBottom(_a, _b) {
  var conversationScrollRef = _a.conversationScrollRef;
  var logger = _b.logger;
  return React.useCallback(function () {
    var isBottom = true;

    if (conversationScrollRef) {
      try {
        var conversationScroll = conversationScrollRef.current;
        isBottom = conversationScroll.scrollHeight <= conversationScroll.scrollTop + conversationScroll.clientHeight;
      } catch (error) {
        logger.error('OpenChannel | useCheckScrollBottom', error);
      }
    }

    return isBottom;
  }, [conversationScrollRef]);
}

function useSendMessageCallback(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel,
      onBeforeSendUserMessage = _a.onBeforeSendUserMessage,
      checkScrollBottom = _a.checkScrollBottom,
      messageInputRef = _a.messageInputRef;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  return React.useCallback(function () {
    if (sdk && sdk.UserMessageParams) {
      var text = messageInputRef.current.value;

      var createParamsDefault = function createParamsDefault(txt) {
        var message = typeof txt === 'string' ? txt.trim() : txt.toString(10).trim();
        var params = new sdk.UserMessageParams();
        params.message = message;
        return params;
      };

      var createCustomParams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';

      if (createCustomParams) {
        logger.info('OpenChannel | useSendMessageCallback: Creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
      }

      var params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
      logger.info('OpenChannel | useSendMessageCallback: Sending message has started', params);
      var isBottom_1 = checkScrollBottom();
      var pendingMessage = currentOpenChannel.sendUserMessage(params, function (message, error) {
        if (!error) {
          logger.info('OpenChannel | useSendMessageCallback: Sending message succeeded', message);
          messagesDispatcher({
            type: SENDING_MESSAGE_SUCCEEDED,
            payload: message
          });

          if (isBottom_1) {
            setTimeout(function () {
              scrollIntoLast();
            });
          }
        } else {
          logger.warning('OpenChannel | useSendMessageCallback: Sending message failed', error);
          messagesDispatcher({
            type: SENDING_MESSAGE_FAILED,
            payload: messageActionTypes
          });
        }
      });
      messagesDispatcher({
        type: SENDING_MESSAGE_START,
        payload: {
          message: pendingMessage,
          channel: currentOpenChannel
        }
      });
    }
  }, [currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom, messageInputRef]);
}

function useFileUploadCallback(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel,
      checkScrollBottom = _a.checkScrollBottom,
      _c = _a.imageCompression,
      imageCompression = _c === void 0 ? {} : _c,
      onBeforeSendFileMessage = _a.onBeforeSendFileMessage;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  return React.useCallback(function (file) {
    if (sdk && sdk.FileMessageParams) {
      var compressionRate_1 = imageCompression.compressionRate,
          resizingWidth_1 = imageCompression.resizingWidth,
          resizingHeight_1 = imageCompression.resizingHeight;
      var createCustomParams_1 = onBeforeSendFileMessage && typeof onBeforeSendFileMessage === 'function';
      var compressibleFileType = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
      var compressibleRatio = compressionRate_1 > 0 && compressionRate_1 < 1; // pxToNumber returns null if values are invalid

      var compressibleDiamensions_1 = pxToNumber(resizingWidth_1) || pxToNumber(resizingHeight_1);
      var canCompressImage = compressibleFileType && (compressibleRatio || compressibleDiamensions_1);

      var createParamsDefault_1 = function createParamsDefault_1(file_) {
        var params = new sdk.FileMessageParams();
        params.file = file_;
        return params;
      };

      if (canCompressImage) {
        // Using image compression
        try {
          var image_1 = document.createElement('img');
          image_1.src = URL.createObjectURL(file);

          image_1.onload = function () {
            URL.revokeObjectURL(image_1.src);
            var canvas = document.createElement('canvas');
            var imageWidth = image_1.naturalWidth || image_1.width;
            var imageHeight = image_1.naturalHeight || image_1.height;
            var targetWidth = pxToNumber(resizingWidth_1) || imageWidth;
            var targetHeight = pxToNumber(resizingHeight_1) || imageHeight; // In canvas.toBlob(callback, mimeType, qualityArgument)
            // qualityArgument doesnt work
            // so in case compressibleDiamensions are not present, we use ratio

            if (file.type === 'image/png' && !compressibleDiamensions_1) {
              targetWidth *= compressionRate_1;
              targetHeight *= compressionRate_1;
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            var context = canvas.getContext('2d');
            context.drawImage(image_1, 0, 0, targetWidth, targetHeight);
            context.canvas.toBlob(function (newImageBlob) {
              var compressedFile = new File([newImageBlob], file.name, {
                type: file.type
              });

              if (createCustomParams_1) {
                logger.info('OpenChannel | useFileUploadCallback: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
              }

              var params = onBeforeSendFileMessage ? onBeforeSendFileMessage(compressedFile) : createParamsDefault_1(compressedFile);
              logger.info('OpenChannel | useFileUploadCallback: Uploading file message start', params);
              var isBottom = checkScrollBottom();
              var pendingMessage = currentOpenChannel.sendFileMessage(params, function (message, error) {
                if (!error) {
                  logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
                  messagesDispatcher({
                    type: SENDING_MESSAGE_SUCCEEDED,
                    payload: message
                  });

                  if (isBottom) {
                    setTimeout(function () {
                      scrollIntoLast();
                    });
                  }
                } else {
                  logger.error('OpenChannel | useFileUploadCallback: Sending file message failed', {
                    message: message,
                    error: error
                  });
                  message.localUrl = URL.createObjectURL(file);
                  message.file = file;
                  messagesDispatcher({
                    type: SENDING_MESSAGE_FAILED,
                    payload: message
                  });
                }
              });
              messagesDispatcher({
                type: SENDING_MESSAGE_START,
                payload: {
                  message: LocalizationContext.__assign(LocalizationContext.__assign({}, pendingMessage), {
                    url: URL.createObjectURL(file),
                    // pending thumbnail message seems to be failed
                    requestState: 'pending'
                  }),
                  channel: currentOpenChannel
                }
              });
            }, file.type, compressionRate_1);
          };
        } catch (error) {
          logger.warning('OpenChannel | useFileUploadCallback: Sending file message with image compression failed', error);
        }
      } else {
        // Not using image compression
        if (createCustomParams_1) {
          logger.info('OpenChannel | useFileUploadCallback: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
        }

        var params = onBeforeSendFileMessage ? onBeforeSendFileMessage(file) : createParamsDefault_1(file);
        logger.info('OpenChannel | useFileUploadCallback: Uploading file message start', params);
        var isBottom_1 = checkScrollBottom();
        var pendingMessage = currentOpenChannel.sendFileMessage(params, function (message, error) {
          if (!error) {
            logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
            messagesDispatcher({
              type: SENDING_MESSAGE_SUCCEEDED,
              payload: message
            });

            if (isBottom_1) {
              setTimeout(function () {
                scrollIntoLast();
              });
            }
          } else {
            logger.error('OpenChannel | useFileUploadCallback: Sending file message failed', {
              message: message,
              error: error
            });
            message.localUrl = URL.createObjectURL(file);
            message.file = file;
            messagesDispatcher({
              type: SENDING_MESSAGE_FAILED,
              payload: message
            });
          }
        });
        messagesDispatcher({
          type: SENDING_MESSAGE_START,
          payload: {
            message: LocalizationContext.__assign(LocalizationContext.__assign({}, pendingMessage), {
              url: URL.createObjectURL(file),
              // pending thumbnail message seems to be failed
              requestState: 'pending'
            }),
            channel: currentOpenChannel
          }
        });
      }
    }
  }, [currentOpenChannel, onBeforeSendFileMessage, checkScrollBottom, imageCompression]);
}

function useUpdateMessageCallback(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel,
      onBeforeSendUserMessage = _a.onBeforeSendUserMessage;
  var sdk = _b.sdk,
      logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  return React.useCallback(function (messageId, text, callback) {
    var createParamsDefault = function createParamsDefault(txt) {
      var params = new sdk.UserMessageParams();
      params.message = txt;
      return params;
    };

    if (onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function') {
      logger.info('OpenChannel | useUpdateMessageCallback: Creating params using onBeforeUpdateUserMessage');
    }

    var params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
    currentOpenChannel.updateUserMessage(messageId, params, function (message, error) {
      if (callback) {
        callback();
      }

      if (!error) {
        logger.info('OpenChannel | useUpdateMessageCallback: Updating message succeeded', {
          message: message,
          params: params
        });
        messagesDispatcher({
          type: ON_MESSAGE_UPDATED,
          payload: {
            channel: currentOpenChannel,
            message: message
          }
        });
      } else {
        logger.warning('OpenChannel | useUpdateMessageCallback: Updating message failed', error);
      }
    });
  }, [currentOpenChannel, onBeforeSendUserMessage]);
}

function useDeleteMessageCallback(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel;
  var logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  return React.useCallback(function (message, callback) {
    logger.info('OpenChannel | useDeleteMessageCallback: Deleting message', message);
    var sendingStatus = message.sendingStatus;
    logger.info('OpenChannel | useDeleteMessageCallback: Deleting message requestState', sendingStatus);

    if (sendingStatus === 'failed' || sendingStatus === 'pending') {
      logger.info('OpenChannel | useDeleteMessageCallback: Deleted message from local', message);
      messagesDispatcher({
        type: ON_MESSAGE_DELETED_BY_REQ_ID,
        payload: message.reqId
      });

      if (callback) {
        callback();
      }
    } else {
      if (!(message.messageType === 'file' || message.messageType === 'user')) {
        return;
      }

      var messageToDelete = message;
      currentOpenChannel.deleteMessage(messageToDelete, function (error) {
        logger.info('OpenChannel | useDeleteMessageCallback: Deleting message on server', sendingStatus);

        if (callback) {
          callback();
        }

        if (!error) {
          logger.info('OpenChannel | useDeleteMessageCallback: Deleting message succeeded', message);
          messagesDispatcher({
            type: ON_MESSAGE_DELETED,
            payload: {
              channel: currentOpenChannel,
              messageId: message.messageId
            }
          });
        } else {
          logger.warning('OpenChannel | useDeleteMessageCallback: Deleting message failed', error);
        }
      });
    }
  }, [currentOpenChannel]);
}

function useResendMessageCallback(_a, _b) {
  var currentOpenChannel = _a.currentOpenChannel;
  var logger = _b.logger,
      messagesDispatcher = _b.messagesDispatcher;
  return React.useCallback(function (failedMessage) {
    logger.info('OpenChannel | useResendMessageCallback: Resending message has started', failedMessage);
    var messageType = failedMessage.messageType,
        file = failedMessage.file;

    if (failedMessage && typeof failedMessage.isResendable === 'function' && failedMessage.isResendable()) {
      // eslint-disable-next-line no-param-reassign
      failedMessage.requestState = 'pending';
      messagesDispatcher({
        type: RESENDING_MESSAGE_START,
        payload: {
          channel: currentOpenChannel,
          message: failedMessage
        }
      }); // userMessage

      if (messageType === 'user' && failedMessage.messageType === 'user') {
        currentOpenChannel.resendUserMessage(failedMessage, function (message, error) {
          if (!error) {
            logger.info('OpenChannel | useResendMessageCallback: Reseding message succeeded', message);
            messagesDispatcher({
              type: SENDING_MESSAGE_SUCCEEDED,
              payload: message
            });
          } else {
            logger.warning('OpenChannel | useResendMessageCallback: Resending message failed', error); // eslint-disable-next-line no-param-reassign

            failedMessage.requestState = 'failed';
            messagesDispatcher({
              type: SENDING_MESSAGE_FAILED,
              payload: failedMessage
            });
          }
        });
        return;
      } // fileMessage


      if (messageType === 'file' && failedMessage.messageType === 'file') {
        currentOpenChannel.resendFileMessage(failedMessage, file, function (message, error) {
          if (!error) {
            logger.info('OpenChannel | useResendMessageCallback: Resending file message succeeded', message);
            messagesDispatcher({
              type: SENDING_MESSAGE_SUCCEEDED,
              payload: message
            });
          } else {
            logger.warning('OpenChannel | useResendMessageCallback: Resending file message failed', error); // eslint-disable-next-line no-param-reassign

            failedMessage.requestState = 'failed';
            messagesDispatcher({
              type: SENDING_MESSAGE_FAILED,
              payload: failedMessage
            });
          }
        });
      }
    } else {
      // to alert user on console
      // eslint-disable-next-line no-console
      console.error('OpenChannel | useResendMessageCallback: Message is not resendable');
      logger.warning('OpenChannel | useResendMessageCallback: Message is not resendable', failedMessage);
    }
  }, [currentOpenChannel]);
}

var COMPONENT_CLASS_NAME = 'sendbird-openchannel-conversation';
var OpenchannelConversation = function OpenchannelConversation(props) {
  var // internal props
  stores = props.stores,
      config = props.config,
      // normal props
  useMessageGrouping = props.useMessageGrouping,
      channelUrl = props.channelUrl,
      _a = props.queries,
      queries = _a === void 0 ? {} : _a,
      disableUserProfile = props.disableUserProfile,
      _b = props.fetchingParticipants,
      fetchingParticipants = _b === void 0 ? false : _b,
      // We didn't decide to support fetching participant list
  renderCustomMessage = props.renderCustomMessage,
      renderUserProfile = props.renderUserProfile,
      renderChannelTitle = props.renderChannelTitle,
      renderMessageInput = props.renderMessageInput,
      onBeforeSendUserMessage = props.onBeforeSendUserMessage,
      onBeforeSendFileMessage = props.onBeforeSendFileMessage,
      onChatHeaderActionClick = props.onChatHeaderActionClick;
  var sdkStore = stores.sdkStore,
      userStore = stores.userStore;
  var userId = config.userId,
      isOnline = config.isOnline,
      logger = config.logger,
      pubSub = config.pubSub,
      imageCompression = config.imageCompression;
  var sdk = sdkStore.sdk;
  var user = userStore.user; // hook variables

  var _c = React.useReducer(reducer, initialState),
      messagesStore = _c[0],
      messagesDispatcher = _c[1];

  var allMessages = messagesStore.allMessages,
      loading = messagesStore.loading,
      initialized = messagesStore.initialized,
      currentOpenChannel = messagesStore.currentOpenChannel,
      isInvalid = messagesStore.isInvalid,
      hasMore = messagesStore.hasMore,
      lastMessageTimestamp = messagesStore.lastMessageTimestamp,
      operators = messagesStore.operators,
      bannedParticipantIds = messagesStore.bannedParticipantIds,
      mutedParticipantIds = messagesStore.mutedParticipantIds; // ref

  var messageInputRef = React.useRef(null); // useSendMessageCallback

  var conversationScrollRef = React.useRef(null); // useScrollAfterSendMessageCallback

  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet; // const

  var sdkInit = sdkStore.initialized;
  var userFilledMessageListParams = queries ? queries.messageListParams : null;
  var disabled = !initialized || !isOnline || isDisabledBecauseFrozen(currentOpenChannel, userId); // || utils.isDisabledBecauseMuted(mutedParticipantIds, userId)

  var userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  var userDefinedRenderProfile = renderUserProfile || config.renderUserProfile; // useMemo

  var amIBanned = React.useMemo(function () {
    return bannedParticipantIds.indexOf(user.userId) >= 0;
  }, [channelUrl, bannedParticipantIds, user]);
  var amIMuted = React.useMemo(function () {
    return mutedParticipantIds.indexOf(user.userId) >= 0;
  }, [channelUrl, mutedParticipantIds, user]);
  var amIOperator = React.useMemo(function () {
    return operators.map(function (operator) {
      return operator.userId;
    }).indexOf(user.userId) >= 0;
  }, [channelUrl, operators, user]); // use hooks

  useSetChannel({
    channelUrl: channelUrl,
    sdkInit: sdkInit,
    fetchingParticipants: fetchingParticipants
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  var checkScrollBottom = useCheckScrollBottom({
    conversationScrollRef: conversationScrollRef
  }, {
    logger: logger
  });
  useHandleChannelEvents({
    currentOpenChannel: currentOpenChannel,
    checkScrollBottom: checkScrollBottom
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  useInitialMessagesFetch({
    currentOpenChannel: currentOpenChannel,
    userFilledMessageListParams: userFilledMessageListParams
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  var onScroll = useScrollCallback({
    currentOpenChannel: currentOpenChannel,
    lastMessageTimestamp: lastMessageTimestamp
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher,
    hasMore: hasMore,
    userFilledMessageListParams: userFilledMessageListParams
  });
  var handleSendMessage = useSendMessageCallback({
    currentOpenChannel: currentOpenChannel,
    onBeforeSendUserMessage: onBeforeSendUserMessage,
    checkScrollBottom: checkScrollBottom,
    messageInputRef: messageInputRef
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  var handleFileUpload = useFileUploadCallback({
    currentOpenChannel: currentOpenChannel,
    onBeforeSendFileMessage: onBeforeSendFileMessage,
    checkScrollBottom: checkScrollBottom,
    imageCompression: imageCompression
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  var updateMessage = useUpdateMessageCallback({
    currentOpenChannel: currentOpenChannel,
    onBeforeSendUserMessage: onBeforeSendUserMessage
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  var deleteMessage = useDeleteMessageCallback({
    currentOpenChannel: currentOpenChannel
  }, {
    logger: logger,
    messagesDispatcher: messagesDispatcher
  });
  var resendMessage = useResendMessageCallback({
    currentOpenChannel: currentOpenChannel
  }, {
    logger: logger,
    messagesDispatcher: messagesDispatcher
  }); // handle API calls from withSendbird

  React.useEffect(function () {
    var subscriber = new Map();

    if (!pubSub || !pubSub.subscribe) {
      return;
    }

    subscriber.set(index$3.SEND_USER_MESSAGE, pubSub.subscribe(index$3.SEND_USER_MESSAGE, function (msg) {
      var channel = msg.channel,
          message = msg.message;
      scrollIntoLast();

      if (channel && channelUrl === channel.url) {
        messagesDispatcher({
          type: SENDING_MESSAGE_SUCCEEDED,
          payload: message
        });
      }
    }));
    subscriber.set(index$3.SEND_MESSAGE_START, pubSub.subscribe(index$3.SEND_MESSAGE_START, function (msg) {
      var channel = msg.channel,
          message = msg.message;

      if (channel && channelUrl === channel.url) {
        messagesDispatcher({
          type: SENDING_MESSAGE_START,
          payload: message
        });
      }
    }));
    subscriber.set(index$3.SEND_FILE_MESSAGE, pubSub.subscribe(index$3.SEND_FILE_MESSAGE, function (msg) {
      var channel = msg.channel,
          message = msg.message;
      scrollIntoLast();

      if (channel && channelUrl === channel.url) {
        messagesDispatcher({
          type: SENDING_MESSAGE_SUCCEEDED,
          payload: message
        });
      }
    }));
    subscriber.set(index$3.UPDATE_USER_MESSAGE, pubSub.subscribe(index$3.UPDATE_USER_MESSAGE, function (msg) {
      var channel = msg.channel,
          message = msg.message,
          fromSelector = msg.fromSelector;

      if (fromSelector && channel && channelUrl === channel.url) {
        messagesDispatcher({
          type: ON_MESSAGE_UPDATED,
          payload: {
            channel: channel,
            message: message
          }
        });
      }
    }));
    subscriber.set(index$3.DELETE_MESSAGE, pubSub.subscribe(index$3.DELETE_MESSAGE, function (msg) {
      var channel = msg.channel,
          messageId = msg.messageId;

      if (channel && channelUrl === channel.url) {
        messagesDispatcher({
          type: ON_MESSAGE_DELETED,
          payload: messageId
        });
      }
    }));
    return function () {
      if (subscriber) {
        subscriber.forEach(function (s) {
          try {
            s.remove();
          } catch (_a) {//
          }
        });
      }
    };
  }, [channelUrl, sdkInit]);

  if (!currentOpenChannel || !currentOpenChannel.url || amIBanned) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: COMPONENT_CLASS_NAME
    }, /*#__PURE__*/React__default["default"].createElement(index$1.PlaceHolder, {
      type: index$1.PlaceHolderTypes$1.NO_CHANNELS
    }));
  }

  if (loading) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: COMPONENT_CLASS_NAME
    }, /*#__PURE__*/React__default["default"].createElement(index$1.PlaceHolder, {
      type: index$1.PlaceHolderTypes$1.LOADING
    }));
  }

  if (isInvalid) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: COMPONENT_CLASS_NAME
    }, /*#__PURE__*/React__default["default"].createElement(index$1.PlaceHolder, {
      type: index$1.PlaceHolderTypes$1.WRONG
    }));
  }

  return /*#__PURE__*/React__default["default"].createElement(index$3.UserProfileProvider, {
    className: COMPONENT_CLASS_NAME,
    disableUserProfile: userDefinedDisableUserProfile,
    renderUserProfile: userDefinedRenderProfile
  }, renderChannelTitle ? renderChannelTitle({
    channel: currentOpenChannel,
    user: user
  }) : /*#__PURE__*/React__default["default"].createElement(OpenchannelConversationHeader, {
    title: currentOpenChannel.name,
    subTitle: kFormatter(currentOpenChannel.participantCount) + " " + stringSet.OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS,
    coverImage: currentOpenChannel.coverUrl,
    onActionClick: onChatHeaderActionClick,
    amIOperator: amIOperator
  }), currentOpenChannel.isFrozen && /*#__PURE__*/React__default["default"].createElement(FrozenNotification, null), /*#__PURE__*/React__default["default"].createElement(OpenchannelConversationScroll$1, {
    ref: conversationScrollRef,
    renderCustomMessage: renderCustomMessage,
    openchannel: currentOpenChannel,
    user: user,
    useMessageGrouping: useMessageGrouping,
    isOnline: isOnline,
    allMessages: allMessages,
    onScroll: onScroll,
    hasMore: hasMore,
    updateMessage: updateMessage,
    deleteMessage: deleteMessage,
    resendMessage: resendMessage
  }), renderMessageInput ? renderMessageInput({
    channel: currentOpenChannel,
    user: user,
    disabled: disabled
  }) : /*#__PURE__*/React__default["default"].createElement(MessageInputWrapper$1, {
    channel: currentOpenChannel,
    user: user,
    ref: messageInputRef,
    disabled: disabled || amIMuted,
    onSendMessage: handleSendMessage,
    onFileUpload: handleFileUpload,
    renderMessageInput: renderMessageInput
  }));
};
var index = LocalizationContext.withSendbirdContext(OpenchannelConversation);

exports.OpenchannelConversation = OpenchannelConversation;
exports["default"] = index;
//# sourceMappingURL=OpenChannel.js.map
