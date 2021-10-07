import React__default from 'react';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var SendbirdSdkContext = /*#__PURE__*/React__default.createContext();

var withSendbirdContext = function withSendbirdContext(OriginalComponent, mapStoreToProps) {
  var ContextAwareComponent = function ContextAwareComponent(props) {
    return /*#__PURE__*/React__default.createElement(SendbirdSdkContext.Consumer, null, function (context) {
      if (mapStoreToProps && typeof mapStoreToProps !== 'function') {
        // eslint-disable-next-line no-console
        console.warn('Second parameter to withSendbirdContext must be a pure function');
      }

      var mergedProps = mapStoreToProps && typeof mapStoreToProps === 'function' ? _objectSpread2(_objectSpread2({}, mapStoreToProps(context)), props) : _objectSpread2(_objectSpread2({}, context), props); // eslint-disable-next-line react/jsx-props-no-spreading

      return /*#__PURE__*/React__default.createElement(OriginalComponent, mergedProps);
    });
  };

  var componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = "SendbirdAware".concat(componentName);
  return ContextAwareComponent;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/* eslint-disable no-bitwise */

/* eslint-disable eqeqeq */

/* eslint-disable no-mixed-operators */
// https://stackoverflow.com/a/2117523
// used mainly for dom key generation
var uuidv4 = function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

var getStringSet = function getStringSet() {
  var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en';
  var stringSet = {
    en: {
      OPEN_CHANNEL_SETTINGS__OPERATOR_TITLE: 'Channel Information',
      OPEN_CHANNEL_SETTINGS__OPERATOR_URL: 'URL',
      OPEN_CHANNEL_SETTINGS__PARTICIPANTS_ACCORDION_TITLE: 'Participants',
      OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_PANEL: 'Delete channel',
      OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE: 'Delete this channel',
      OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT: 'Delete',
      OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE: 'Participants',
      OPEN_CHANNEL_SETTINGS__EMPTY_LIST: 'No participants yet',
      OPEN_CHANNEL_SETTINGS__SEE_ALL: 'See all participants',
      OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE: 'All participants',
      OPEN_CHANNEL_SETTINGS__NO_TITLE: '(No title)',
      OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS: 'participants',
      TRYING_TO_CONNECT: 'Trying to connect…',
      USER_PROFILE__MESSAGE: 'Message',
      USER_PROFILE__USER_ID: 'User ID',
      EDIT_PROFILE__TITLE: 'My profile',
      EDIT_PROFILE__IMAGE_LABEL: 'Profile image',
      EDIT_PROFILE__IMAGE_UPLOAD: 'Upload',
      EDIT_PROFILE__NICKNAME_LABEL: 'Nickname',
      EDIT_PROFILE__NICKNAME_PLACEHOLDER: 'Enter your nickname',
      EDIT_PROFILE__USERID_LABEL: 'User ID',
      EDIT_PROFILE__THEME_LABEL: 'Dark theme',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER: 'Enter message',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__DISABLED: 'Chat is unavailable in this channel',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__MUTED: 'Chat is unavailable because you are being muted',
      CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE: 'new message(s) since',
      CHANNEL__MESSAGE_LIST__NOTIFICATION__ON: 'on',
      CHANNEL_SETTING__HEADER__TITLE: 'Channel information',
      CHANNEL_SETTING__PROFILE__EDIT: 'Edit',
      CHANNEL_SETTING__MEMBERS__TITLE: 'Members',
      CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS: 'All members',
      CHANNEL_SETTING__MEMBERS__INVITE_MEMBER: 'Invite users',
      CHANNEL_SETTING__LEAVE_CHANNEL__TITLE: 'Leave channel',
      CHANNEL_SETTING__OPERATORS__TITLE: 'Operators',
      CHANNEL_SETTING__OPERATORS__TITLE_ALL: 'All operators',
      CHANNEL_SETTING__OPERATORS__TITLE_ADD: 'Add operator',
      CHANNEL_SETTING__MUTED_MEMBERS__TITLE: 'Muted members',
      CHANNEL_SETTING__BANNED_MEMBERS__TITLE: 'Banned members',
      CHANNEL_SETTING__FREEZE_CHANNEL: 'Freeze Channel',
      BUTTON__CANCEL: 'Cancel',
      BUTTON__DELETE: 'Delete',
      BUTTON__SAVE: 'Save',
      BUTTON__CREATE: 'Create',
      BUTTON__INVITE: 'Invite',
      BADGE__OVER: '+',
      MODAL__DELETE_MESSAGE__TITLE: 'Delete this message?',
      MODAL__CHANNEL_INFORMATION__TITLE: 'Edit channel information',
      MODAL__CHANNEL_INFORMATION__CHANNEL_IMAGE: 'Channel image',
      MODAL__CHANNEL_INFORMATION__UPLOAD: 'Upload',
      MODAL__CHANNEL_INFORMATION__CHANNEL_NAME: 'Channel name',
      MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER: 'Enter name',
      MODAL__INVITE_MEMBER__TITLE: 'Invite member',
      MODAL__INVITE_MEMBER__SELECTEC: 'selected',
      MODAL__CREATE_CHANNEL__TITLE: 'New channel',
      MODAL__CREATE_CHANNEL__SELECTED: 'selected',
      TYPING_INDICATOR__IS_TYPING: 'is typing...',
      TYPING_INDICATOR__AND: 'and',
      TYPING_INDICATOR__ARE_TYPING: 'are typing...',
      TYPING_INDICATOR__MULTIPLE_TYPING: 'Several people are typing...',
      CHANNEL_FROZEN: 'Channel frozen',
      PLACE_HOLDER__NO_CHANNEL: 'No channels',
      PLACE_HOLDER__WRONG: 'Something went wrong',
      PLACE_HOLDER__RETRY_TO_CONNECT: 'Retry',
      PLACE_HOLDER__NO_MESSAGES: 'No messages',
      NO_TITLE: 'No title',
      NO_NAME: '(No name)',
      NO_MEMBERS: '(No members)',
      TOOLTIP__AND_YOU: ', and you',
      TOOLTIP__YOU: 'you',
      YOU: ' (You)',
      TOOLTIP__UNKNOWN_USER: '(no name)',
      UNKNOWN__UNKNOWN_MESSAGE_TYPE: '(Unknown message type)',
      UNKNOWN__CANNOT_READ_MESSAGE: 'Cannot read this message.',
      MESSAGE_EDITED: '(edited)',
      MESSAGE_MENU__COPY: 'Copy',
      MESSAGE_MENU__REPLY: 'Reply',
      MESSAGE_MENU__EDIT: 'Edit',
      MESSAGE_MENU__RESEND: 'Resend',
      MESSAGE_MENU__DELETE: 'Delete',
      SEARCH: 'Search',
      SEARCH_IN_CHANNEL: 'Search in channel',
      SEARCH_IN: 'Search in',
      SEARCHING: 'Searching for messages...',
      NO_SEARCHED_MESSAGE: 'No results found.',
      REPLYING_ATTACHMENT__REPLY_TO: 'Reply to',
      REPLYING_ATTACHMENT__FILE_TYPE__IMAGE: 'Photo',
      REPLYING_ATTACHMENT__FILE_TYPE__GIF: 'GIF',
      REPLYING_ATTACHMENT__FILE_TYPE__VIDEO: 'Video',
      REPLIED_TO: 'replied to',
      // FIXME: get back legacy, remove after refactoring open channel messages
      CONTEXT_MENU_DROPDOWN__COPY: 'Copy',
      CONTEXT_MENU_DROPDOWN__EDIT: 'Edit',
      CONTEXT_MENU_DROPDOWN__RESEND: 'Resend',
      CONTEXT_MENU_DROPDOWN__DELETE: 'Delete'
    }
  };
  return stringSet[lang];
};

var LocalizationContext = /*#__PURE__*/React__default.createContext({
  stringSet: getStringSet('en')
});

var LocalizationProvider = function LocalizationProvider(props) {
  var children = props.children;
  return /*#__PURE__*/React__default.createElement(LocalizationContext.Provider, {
    value: props
  }, children);
};

export { LocalizationProvider as L, SendbirdSdkContext as S, __assign as _, _objectSpread2 as a, _slicedToArray as b, LocalizationContext as c, __spreadArray as d, _toConsumableArray as e, _defineProperty as f, getStringSet as g, _inherits as h, _createSuper as i, _createClass as j, _classCallCheck as k, _assertThisInitialized as l, uuidv4 as u, withSendbirdContext as w };
//# sourceMappingURL=LocalizationContext-2d4f87f4.js.map
