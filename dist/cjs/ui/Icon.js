'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var utils = require('../chunks/bundle-Xwl4gw4D.js');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

/* eslint-disable no-redeclare */
var Types = {
    ADD: 'ADD',
    ARROW_LEFT: 'ARROW_LEFT',
    ATTACH: 'ATTACH',
    AUDIO_ON_LINED: 'AUDIO_ON_LINED',
    BAN: 'BAN',
    BROADCAST: 'BROADCAST',
    CAMERA: 'CAMERA',
    CHANNELS: 'CHANNELS',
    CHAT: 'CHAT',
    CHAT_FILLED: 'CHAT_FILLED',
    CHEVRON_DOWN: 'CHEVRON_DOWN',
    CHEVRON_RIGHT: 'CHEVRON_RIGHT',
    CLOSE: 'CLOSE',
    COLLAPSE: 'COLLAPSE',
    COPY: 'COPY',
    CREATE: 'CREATE',
    DELETE: 'DELETE',
    DISCONNECTED: 'DISCONNECTED',
    DOCUMENT: 'DOCUMENT',
    DONE: 'DONE',
    DONE_ALL: 'DONE_ALL',
    DOWNLOAD: 'DOWNLOAD',
    EDIT: 'EDIT',
    EMOJI_MORE: 'EMOJI_MORE',
    ERROR: 'ERROR',
    EXPAND: 'EXPAND',
    FILE_AUDIO: 'FILE_AUDIO',
    FILE_DOCUMENT: 'FILE_DOCUMENT',
    FREEZE: 'FREEZE',
    GIF: 'GIF',
    INFO: 'INFO',
    LEAVE: 'LEAVE',
    MEMBERS: 'MEMBERS',
    MESSAGE: 'MESSAGE',
    MODERATIONS: 'MODERATIONS',
    MORE: 'MORE',
    MUTE: 'MUTE',
    NOTIFICATIONS: 'NOTIFICATIONS',
    NOTIFICATIONS_OFF_FILLED: 'NOTIFICATIONS_OFF_FILLED',
    OPERATOR: 'OPERATOR',
    PHOTO: 'PHOTO',
    PLAY: 'PLAY',
    PLUS: 'PLUS',
    QUESTION: 'QUESTION',
    REFRESH: 'REFRESH',
    REPLY: 'REPLY',
    REMOVE: 'REMOVE',
    SEARCH: 'SEARCH',
    SEND: 'SEND',
    SETTINGS_FILLED: 'SETTINGS_FILLED',
    SLIDE_LEFT: 'SLIDE_LEFT',
    SPINNER: 'SPINNER',
    SUPERGROUP: 'SUPERGROUP',
    THREAD: 'THREAD',
    THUMBNAIL_NONE: 'THUMBNAIL_NONE',
    TOGGLE_OFF: 'TOGGLE_OFF',
    TOGGLE_ON: 'TOGGLE_ON',
    USER: 'USER',
    FEEDBACK_LIKE: 'FEEDBACK_LIKE',
    FEEDBACK_DISLIKE: 'FEEDBACK_DISLIKE',
};

/* eslint-disable no-redeclare */
var Colors = {
    DEFAULT: 'DEFAULT',
    PRIMARY: 'PRIMARY',
    PRIMARY_2: 'PRIMARY_2',
    SECONDARY: 'SECONDARY',
    CONTENT: 'CONTENT',
    CONTENT_INVERSE: 'CONTENT_INVERSE',
    WHITE: 'WHITE',
    GRAY: 'GRAY',
    THUMBNAIL_ICON: 'THUMBNAIL_ICON',
    SENT: 'SENT',
    READ: 'READ',
    ON_BACKGROUND_1: 'ON_BACKGROUND_1',
    ON_BACKGROUND_2: 'ON_BACKGROUND_2',
    ON_BACKGROUND_3: 'ON_BACKGROUND_3',
    ON_BACKGROUND_4: 'ON_BACKGROUND_4',
    BACKGROUND_3: 'BACKGROUND_3',
    ERROR: 'ERROR',
};

function changeColorToClassName(color) {
    switch (color) {
        case Colors.PRIMARY: return 'sendbird-icon-color--primary';
        case Colors.PRIMARY_2: return 'sendbird-icon-color--primary-2';
        case Colors.SECONDARY: return 'sendbird-icon-color--secondary';
        case Colors.CONTENT: return 'sendbird-icon-color--content';
        case Colors.CONTENT_INVERSE: return 'sendbird-icon-color--content-inverse';
        case Colors.WHITE: return 'sendbird-icon-color--white';
        case Colors.GRAY: return 'sendbird-icon-color--gray';
        case Colors.THUMBNAIL_ICON: return 'sendbird-icon-color--thumbnail-icon';
        case Colors.SENT: return 'sendbird-icon-color--sent';
        case Colors.READ: return 'sendbird-icon-color--read';
        case Colors.ON_BACKGROUND_1: return 'sendbird-icon-color--on-background-1';
        case Colors.ON_BACKGROUND_2: return 'sendbird-icon-color--on-background-2';
        case Colors.ON_BACKGROUND_3: return 'sendbird-icon-color--on-background-3';
        case Colors.ON_BACKGROUND_4: return 'sendbird-icon-color--on-background-4';
        case Colors.BACKGROUND_3: return 'sendbird-icon-color--background-3';
        case Colors.ERROR: return 'sendbird-icon-color--error';
        default: return '';
    }
}
function changeTypeToIconClassName(type) {
    switch (type) {
        case Types.ADD: return 'sendbird-icon-add';
        case Types.ARROW_LEFT: return 'sendbird-icon-arrow-left';
        case Types.ATTACH: return 'sendbird-icon-attach';
        case Types.AUDIO_ON_LINED: return 'sendbird-icon-audio-on-lined';
        case Types.BAN: return 'sendbird-icon-ban';
        case Types.BROADCAST: return 'sendbird-icon-broadcast';
        case Types.CAMERA: return 'sendbird-icon-camera';
        case Types.CHANNELS: return 'sendbird-icon-channels';
        case Types.CHAT: return 'sendbird-icon-chat';
        case Types.CHAT_FILLED: return 'sendbird-icon-chat-filled';
        case Types.CHEVRON_DOWN: return 'sendbird-icon-chevron-down';
        case Types.CHEVRON_RIGHT: return 'sendbird-icon-chevron-right';
        case Types.CLOSE: return 'sendbird-icon-close';
        case Types.COLLAPSE: return 'sendbird-icon-collapse';
        case Types.COPY: return 'sendbird-icon-copy';
        case Types.CREATE: return 'sendbird-icon-create';
        case Types.DELETE: return 'sendbird-icon-delete';
        case Types.DISCONNECTED: return 'sendbird-icon-disconnected';
        case Types.DOCUMENT: return 'sendbird-icon-document';
        case Types.DONE: return 'sendbird-icon-done';
        case Types.DONE_ALL: return 'sendbird-icon-done-all';
        case Types.DOWNLOAD: return 'sendbird-icon-down-load';
        case Types.EDIT: return 'sendbird-icon-edit';
        case Types.EMOJI_MORE: return 'sendbird-icon-emoji-more';
        case Types.ERROR: return 'sendbird-icon-error';
        case Types.EXPAND: return 'sendbird-icon-expand';
        case Types.FILE_AUDIO: return 'sendbird-icon-file-audio';
        case Types.FILE_DOCUMENT: return 'sendbird-icon-file-document';
        case Types.FREEZE: return 'sendbird-icon-freeze';
        case Types.GIF: return 'sendbird-icon-gif';
        case Types.INFO: return 'sendbird-icon-info';
        case Types.LEAVE: return 'sendbird-icon-leave';
        case Types.MEMBERS: return 'sendbird-icon-members';
        case Types.MESSAGE: return 'sendbird-icon-message';
        case Types.MODERATIONS: return 'sendbird-icon-moderations';
        case Types.MORE: return 'sendbird-icon-more';
        case Types.MUTE: return 'sendbird-icon-mute';
        case Types.NOTIFICATIONS: return 'sendbird-icon-notifications';
        case Types.NOTIFICATIONS_OFF_FILLED: return 'sendbird-icon-notifications-off-filled';
        case Types.OPERATOR: return 'sendbird-icon-operator';
        case Types.PHOTO: return 'sendbird-icon-photo';
        case Types.PLAY: return 'sendbird-icon-play';
        case Types.PLUS: return 'sendbird-iconn-plus';
        case Types.QUESTION: return 'sendbird-icon-question';
        case Types.REFRESH: return 'sendbird-icon-refresh';
        case Types.REMOVE: return 'sendbird-icon-remove';
        case Types.REPLY: return 'sendbird-icon-reply';
        case Types.SEARCH: return 'sendbird-icon-search';
        case Types.SEND: return 'sendbird-icon-send';
        case Types.SETTINGS_FILLED: return 'sendbird-icon-settings-filled';
        case Types.SPINNER: return 'sendbird-icon-spinner';
        case Types.SUPERGROUP: return 'sendbird-icon-supergroup';
        case Types.THREAD: return 'sendbird-icon-thread';
        case Types.THUMBNAIL_NONE: return 'sendbird-icon-thumbnail-none';
        case Types.TOGGLE_OFF: return 'sendbird-icon-toggle-off';
        case Types.TOGGLE_ON: return 'sendbird-icon-toggle-on';
        case Types.USER: return 'sendbird-icon-user';
        case Types.FEEDBACK_LIKE: return 'sendbird-icon-feedback-like';
        case Types.FEEDBACK_DISLIKE: return 'sendbird-icon-feedback-dislike';
        default: return 'sendbird-icon-unknown'; // If you see this text 'icon' replace icon for it
    }
}

var _path$U;
function _extends$X() { _extends$X = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$X.apply(this, arguments); }
var SvgIconAdd = function SvgIconAdd(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$X({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$U || (_path$U = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M50.667 5.333a8 8 0 0 1 8 8v37.334a8 8 0 0 1-8 8H13.333a8 8 0 0 1-8-8V13.333a8 8 0 0 1 8-8zm0 5.334H13.333a2.667 2.667 0 0 0-2.666 2.666v37.334a2.667 2.667 0 0 0 2.666 2.666h37.334a2.667 2.667 0 0 0 2.666-2.666V13.333a2.667 2.667 0 0 0-2.666-2.666m-18.667 8a2.667 2.667 0 0 1 2.649 2.355l.018.311v8h8a2.667 2.667 0 0 1 .311 5.316l-.311.018h-8v8a2.667 2.667 0 0 1-5.316.311l-.018-.311v-8h-8a2.667 2.667 0 0 1-.311-5.316l.311-.018h8v-8A2.667 2.667 0 0 1 32 18.667",
    className: "icon-add_svg__fill"
  })));
};

var _path$T;
function _extends$W() { _extends$W = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$W.apply(this, arguments); }
var SvgIconArrowLeft = function SvgIconArrowLeft(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$W({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$T || (_path$T = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M33.886 8.781a2.67 2.67 0 0 1 .221 3.52l-.221.251-16.78 16.781H56a2.667 2.667 0 0 1 .311 5.316l-.311.018-38.895-.001 16.78 16.782a2.666 2.666 0 0 1 .222 3.52l-.221.251a2.67 2.67 0 0 1-3.52.222l-.252-.222L8.781 33.886a2.67 2.67 0 0 1-.222-3.52l.222-.252L30.114 8.781a2.67 2.67 0 0 1 3.772 0",
    className: "icon-arrow-left_svg__fill"
  })));
};

var _path$S;
function _extends$V() { _extends$V = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$V.apply(this, arguments); }
var SvgIconAttach = function SvgIconAttach(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$V({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$S || (_path$S = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "m55.334 28.926-24.506 23.34c-5.222 4.973-13.74 4.973-18.962 0-5.149-4.903-5.149-12.797 0-17.7l24.506-23.34c3.138-2.988 8.278-2.988 11.416 0 3.064 2.919 3.064 7.594 0 10.513L23.255 45.077c-1.055 1.005-2.815 1.005-3.87.001-.98-.933-.98-2.39 0-3.325l22.64-21.535a2.667 2.667 0 0 0-3.676-3.864L15.709 37.89a7.58 7.58 0 0 0-.001 11.05c3.113 2.966 8.11 2.966 11.224 0l24.533-23.338c5.272-5.021 5.272-13.217 0-18.238-5.197-4.95-13.573-4.95-18.77 0L8.187 30.704c-7.356 7.005-7.356 18.419 0 25.424 7.281 6.935 19.036 6.935 26.318 0l24.506-23.34a2.666 2.666 0 1 0-3.678-3.862z",
    className: "icon-attach_svg__fill"
  })));
};

var _g$2, _defs;
function _extends$U() { _extends$U = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$U.apply(this, arguments); }
var SvgIconAudioOnLined = function SvgIconAudioOnLined(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$U({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 64 64"
  }, props), _g$2 || (_g$2 = /*#__PURE__*/React__namespace.createElement("g", {
    clipPath: "url(#icon-audio-on-lined_svg__a)"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    d: "M32 0C26.11 0 21.333 4.776 21.333 10.667V32c0 5.891 4.776 10.667 10.667 10.667S42.667 37.89 42.667 32V10.667C42.667 4.776 37.89 0 32 0m-5.333 10.667a5.333 5.333 0 0 1 10.666 0V32a5.333 5.333 0 0 1-10.666 0z",
    className: "icon-audio-on-lined_svg__fill",
    clipRule: "evenodd"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    d: "M16 26.667a2.667 2.667 0 1 0-5.333 0V32c0 10.879 8.143 19.856 18.666 21.168v5.499h-8a2.667 2.667 0 0 0 0 5.333h21.334a2.667 2.667 0 1 0 0-5.333h-8v-5.499C45.19 51.856 53.333 42.88 53.333 32v-5.333a2.667 2.667 0 1 0-5.333 0V32c0 8.837-7.163 16-16 16s-16-7.163-16-16z",
    className: "icon-audio-on-lined_svg__fill"
  }))), _defs || (_defs = /*#__PURE__*/React__namespace.createElement("defs", null, /*#__PURE__*/React__namespace.createElement("clipPath", {
    id: "icon-audio-on-lined_svg__a"
  }, /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#fff",
    d: "M0 0h64v64H0z"
  })))));
};

var _path$R;
function _extends$T() { _extends$T = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$T.apply(this, arguments); }
var SvgIconBan = function SvgIconBan(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$T({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$R || (_path$R = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333 2.667 48.2 2.667 32 15.8 2.667 32 2.667M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8m12.333 21.333a1 1 0 0 1 1 1v3.334a1 1 0 0 1-1 1H19.667a1 1 0 0 1-1-1v-3.334a1 1 0 0 1 1-1z",
    className: "icon-ban_svg__fill"
  })));
};

var _path$Q;
function _extends$S() { _extends$S = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$S.apply(this, arguments); }
var SvgIconBroadcast = function SvgIconBroadcast(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$S({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$Q || (_path$Q = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M58.545 5.498q.121.389.122.796v46.079a2.666 2.666 0 0 1-3.462 2.546l-17.951-5.61c-.645 5.273-5.14 9.358-10.587 9.358C20.776 58.667 16 53.89 16 48v-5.334h-5.333a8 8 0 0 1-7.997-7.75l-.003-.25V24a8 8 0 0 1 8-8H16L55.205 3.749a2.665 2.665 0 0 1 3.34 1.75zM21.333 44.587V48a5.333 5.333 0 0 0 10.652.398L32 47.92zm32-34.667-32 9.997v18.83l32 9.997zM16 21.333h-5.333a2.67 2.67 0 0 0-2.65 2.356L8 24v10.667a2.667 2.667 0 0 0 2.667 2.666H16z",
    className: "icon-broadcast_svg__fill"
  })));
};

var _path$P;
function _extends$R() { _extends$R = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$R.apply(this, arguments); }
var SvgIconCamera = function SvgIconCamera(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$R({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$P || (_path$P = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M40 5.333c.892 0 1.724.446 2.219 1.188l4.541 6.812H56a8 8 0 0 1 7.986 7.53l.014.47v29.334a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V21.333a8 8 0 0 1 8-8h9.237l4.544-6.812a2.67 2.67 0 0 1 1.888-1.167l.331-.02zm-1.43 5.334H25.428l-4.542 6.812a2.66 2.66 0 0 1-1.887 1.167l-.331.02H8a2.67 2.67 0 0 0-2.667 2.667v29.334A2.667 2.667 0 0 0 8 53.333h48a2.667 2.667 0 0 0 2.667-2.666V21.333A2.667 2.667 0 0 0 56 18.667H45.333a2.67 2.67 0 0 1-2.218-1.188zM32 21.333c7.364 0 13.333 5.97 13.333 13.334S39.363 48 32 48s-13.333-5.97-13.333-13.333S24.637 21.333 32 21.333m0 5.334a8 8 0 1 0 0 16 8 8 0 0 0 0-16",
    className: "icon-camera_svg__fill"
  })));
};

var _path$O;
function _extends$Q() { _extends$Q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$Q.apply(this, arguments); }
var SvgIconChannels = function SvgIconChannels(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$Q({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$O || (_path$O = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "m42.65 5.333.311.017a2.666 2.666 0 0 1 2.373 2.633l-.017.311-1.45 13.04h9.466a2.667 2.667 0 0 1 .311 5.315l-.31.018H43.271l-1.184 10.666h11.245a2.667 2.667 0 0 1 .312 5.316l-.31.018H41.495l-1.512 13.627a2.667 2.667 0 0 1-5.318-.277l.017-.311 1.448-13.04H25.496l-1.512 13.628a2.667 2.667 0 0 1-5.318-.277l.017-.311 1.448-13.04h-9.464a2.667 2.667 0 0 1-.311-5.315l.31-.018h10.057l1.186-10.667H10.667a2.667 2.667 0 0 1-.311-5.315l.31-.018h11.835l1.515-13.627a2.67 2.67 0 0 1 2.634-2.373l.311.017a2.666 2.666 0 0 1 2.373 2.633l-.017.311-1.45 13.04H38.5l1.515-13.628a2.67 2.67 0 0 1 2.634-2.373zm-5.927 32 1.186-10.667H27.272l-1.184 10.667z",
    className: "icon-channels_svg__fill"
  })));
};

var _path$N;
function _extends$P() { _extends$P = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$P.apply(this, arguments); }
var SvgIconChat = function SvgIconChat(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$P({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$N || (_path$N = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58q-8.947 2.868-12.504 1.981-4.198-1.047-1.657-3.663 1.757-2.094 2.928-5.234.934-2.502-.737-7A29.15 29.15 0 0 1 2.666 32C2.667 15.8 15.8 2.667 32 2.667M32 8C18.745 8 8 18.745 8 32c0 3.5.747 6.88 2.168 9.978l.405.837.137.271.106.285c1.517 4.085 1.89 7.622.734 10.72l-.382.972-.192.433.235-.05a62 62 0 0 0 4.886-1.363l1.721-.568 2.04-.696 1.95.917A23.9 23.9 0 0 0 32 56c13.255 0 24-10.745 24-24S45.255 8 32 8",
    className: "icon-chat_svg__fill"
  })));
};

var _path$M;
function _extends$O() { _extends$O = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$O.apply(this, arguments); }
var SvgIconChatFilled = function SvgIconChatFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$O({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$M || (_path$M = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58q-8.947 2.868-12.504 1.981-4.198-1.047-1.657-3.663 1.757-2.094 2.928-5.234.934-2.502-.737-7A29.15 29.15 0 0 1 2.666 32C2.667 15.8 15.8 2.667 32 2.667",
    className: "icon-chat-filled_svg__fill"
  })));
};

var _path$L;
function _extends$N() { _extends$N = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$N.apply(this, arguments); }
var SvgIconChevronDown = function SvgIconChevronDown(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$N({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$L || (_path$L = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M16.121 21.879a3 3 0 0 0-4.242 0 3 3 0 0 0 0 4.242l18 18a3 3 0 0 0 4.242 0l18-18a3 3 0 0 0 0-4.242 3 3 0 0 0-4.242 0L32 37.757z",
    className: "icon-chevron-down_svg__fill"
  })));
};

var _path$K;
function _extends$M() { _extends$M = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$M.apply(this, arguments); }
var SvgIconChevronRight = function SvgIconChevronRight(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$M({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$K || (_path$K = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M22.114 46.114a2.668 2.668 0 0 0 3.772 3.772l16-16a2.67 2.67 0 0 0 0-3.772l-16-16a2.668 2.668 0 0 0-3.772 3.772L36.23 32z",
    className: "icon-chevron-right_svg__fill"
  })));
};

var _path$J;
function _extends$L() { _extends$L = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$L.apply(this, arguments); }
var SvgIconClose = function SvgIconClose(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$L({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$J || (_path$J = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M52.552 11.448a2.666 2.666 0 0 1 .222 3.52l-.222.251-16.781 16.78 16.781 16.782a2.665 2.665 0 0 1 0 3.771 2.666 2.666 0 0 1-3.52.222l-.251-.222L32 35.771 15.219 52.552a2.665 2.665 0 0 1-3.771 0 2.666 2.666 0 0 1-.222-3.52l.222-.251L28.228 32l-16.78-16.781a2.665 2.665 0 0 1 0-3.771 2.666 2.666 0 0 1 3.52-.222l.251.222 16.78 16.78 16.782-16.78a2.665 2.665 0 0 1 3.771 0",
    className: "icon-close_svg__fill"
  })));
};

var _path$I;
function _extends$K() { _extends$K = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$K.apply(this, arguments); }
var SvgIconCollapse = function SvgIconCollapse(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$K({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$I || (_path$I = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M16 8a2.667 2.667 0 0 0-2.649 2.356l-.018.31v42.667a2.667 2.667 0 0 0 5.316.311l.018-.31V34.666h25.56l-6.113 6.114a2.67 2.67 0 0 0-.221 3.52l.221.251a2.666 2.666 0 0 0 3.52.222l.252-.222 10.666-10.666a2.666 2.666 0 0 0 .222-3.52l-.222-.252-10.666-10.666a2.666 2.666 0 0 0-3.993 3.52l.221.251 6.113 6.114h-25.56V10.667A2.667 2.667 0 0 0 16 8",
    className: "icon-collapse_svg__fill"
  })));
};

var _path$H;
function _extends$J() { _extends$J = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$J.apply(this, arguments); }
var SvgIconCopy = function SvgIconCopy(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$J({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$H || (_path$H = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M53.333 21.333a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-24a8 8 0 0 1-8-8v-24a8 8 0 0 1 8-8zm0 5.334h-24a2.667 2.667 0 0 0-2.666 2.666v24A2.667 2.667 0 0 0 29.333 56h24A2.667 2.667 0 0 0 56 53.333v-24a2.667 2.667 0 0 0-2.667-2.666m-18.666-24a8 8 0 0 1 7.986 7.53l.014.47v2.666a2.667 2.667 0 0 1-5.316.311l-.018-.31v-2.667a2.67 2.67 0 0 0-2.355-2.65L34.667 8h-24a2.67 2.67 0 0 0-2.65 2.356l-.017.31v24a2.67 2.67 0 0 0 2.356 2.65l.31.017h2.667a2.667 2.667 0 0 1 .311 5.316l-.31.018h-2.667a8 8 0 0 1-7.987-7.53l-.013-.47v-24c0-4.26 3.33-7.743 7.53-7.987l.47-.013z",
    className: "icon-copy_svg__fill"
  })));
};

var _path$G;
function _extends$I() { _extends$I = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$I.apply(this, arguments); }
var SvgIconCreate = function SvgIconCreate(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$I({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$G || (_path$G = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58q-8.947 2.868-12.504 1.981-4.198-1.047-1.657-3.663 1.757-2.094 2.928-5.234.934-2.502-.737-7A29.15 29.15 0 0 1 2.666 32C2.667 15.8 15.8 2.667 32 2.667M32 8C18.745 8 8 18.745 8 32c0 3.5.747 6.88 2.168 9.978l.405.837.137.271.106.285c1.517 4.085 1.89 7.622.734 10.72l-.382.972-.192.433.235-.05a62 62 0 0 0 4.886-1.363l1.721-.568 2.04-.696 1.95.917A23.9 23.9 0 0 0 32 56c13.255 0 24-10.745 24-24S45.255 8 32 8m2.667 16v5.333H40c3.556 0 3.556 5.334 0 5.334h-5.333V40c0 3.556-5.334 3.556-5.334 0v-5.333H24c-3.556 0-3.556-5.334 0-5.334h5.333V24c0-3.556 5.334-3.556 5.334 0",
    className: "icon-create_svg__fill"
  })));
};

var _path$F;
function _extends$H() { _extends$H = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$H.apply(this, arguments); }
var SvgIconDelete = function SvgIconDelete(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$H({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$F || (_path$F = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M37.333 2.667c4.26 0 7.743 3.33 7.987 7.53l.013.47v2.666H56a2.667 2.667 0 0 1 .311 5.316l-.311.018h-2.668l.001 34.666c0 4.26-3.33 7.743-7.53 7.987l-.47.013H18.667a8 8 0 0 1-7.987-7.53l-.013-.47V18.667H8a2.667 2.667 0 0 1-.311-5.316L8 13.333h10.666v-2.666a8 8 0 0 1 7.53-7.987l.47-.013zm10.666 16H16v34.666a2.67 2.67 0 0 0 2.356 2.65l.31.017h26.667a2.67 2.67 0 0 0 2.65-2.356l.017-.31zm-21.332 8a2.667 2.667 0 0 1 2.648 2.355l.018.311v16a2.667 2.667 0 0 1-5.316.311l-.017-.31v-16a2.667 2.667 0 0 1 2.667-2.667m10.666 0a2.67 2.67 0 0 1 2.65 2.355l.017.311v16a2.667 2.667 0 0 1-5.315.311l-.018-.31v-16a2.667 2.667 0 0 1 2.666-2.667m0-18.667H26.667a2.67 2.67 0 0 0-2.65 2.356l-.017.31v2.667h16v-2.666a2.67 2.67 0 0 0-2.356-2.65L37.334 8z",
    className: "icon-delete_svg__fill"
  })));
};

var _path$E;
function _extends$G() { _extends$G = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$G.apply(this, arguments); }
var SvgIconDisconnected = function SvgIconDisconnected(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$G({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$E || (_path$E = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "m54.534 6.069-.248.217-9.736 9.735-.04.04-9.573 9.573q-.226.178-.405.404L6.286 54.286a2.423 2.423 0 0 0 3.18 3.645l.248-.217 13.374-13.373a2.42 2.42 0 0 0 1.88-.401 12.12 12.12 0 0 1 14.04 0 2.424 2.424 0 1 0 2.808-3.952 16.95 16.95 0 0 0-11.303-3.072l6.743-6.744a24.1 24.1 0 0 1 10.159 5.021 2.424 2.424 0 0 0 3.11-3.719 29 29 0 0 0-9.34-5.23l5.633-5.634a36.2 36.2 0 0 1 9.225 5.934 2.425 2.425 0 0 0 3.211-3.633 41 41 0 0 0-8.796-5.941l7.256-7.256a2.423 2.423 0 0 0-3.18-3.645m-35.04 21.474a29 29 0 0 0-6.032 3.942 2.424 2.424 0 0 0 3.137 3.697 24 24 0 0 1 5.022-3.282 2.425 2.425 0 0 0-2.127-4.357M4.748 22.909a2.424 2.424 0 0 0 3.207 3.636 36.36 36.36 0 0 1 26.978-8.977 2.424 2.424 0 0 0 .389-4.832A41.2 41.2 0 0 0 4.748 22.909",
    className: "icon-disconnected_svg__fill"
  })));
};

var _path$D;
function _extends$F() { _extends$F = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$F.apply(this, arguments); }
var SvgIconDocument = function SvgIconDocument(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$F({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$D || (_path$D = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M37.333 2.667a3 3 0 0 1 .274.014l.085.01.058.008q.07.01.141.026l.029.007q.075.016.146.037l.034.01q.357.107.663.303l.034.022q.053.034.104.072l.057.043q.045.033.085.068.091.075.176.16l-.126-.117q.075.065.143.135L55.21 19.438q.07.07.134.143l.035.04q.04.047.076.096l.04.054.07.1.024.038c.16.253.279.535.347.836l.01.048q.014.064.024.13l.006.048.007.051.004.041q.014.135.014.27v32a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V10.667a8 8 0 0 1 8-8zM34.666 8H16a2.667 2.667 0 0 0-2.667 2.667v42.666A2.667 2.667 0 0 0 16 56h32a2.667 2.667 0 0 0 2.667-2.667L50.666 24H37.333a2.667 2.667 0 0 1-2.648-2.356l-.018-.31zm12.227 10.667-6.894-6.894.001 6.894z",
    className: "icon-document_svg__fill"
  })));
};

var _path$C;
function _extends$E() { _extends$E = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$E.apply(this, arguments); }
var SvgIconDone = function SvgIconDone(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$E({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$C || (_path$C = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M12.552 31.448a2.665 2.665 0 1 0-3.771 3.771l13.333 13.333a2.666 2.666 0 0 0 3.772 0L55.219 19.22a2.667 2.667 0 0 0-3.771-3.771L24 42.895z",
    className: "icon-done_svg__fill"
  })));
};

var _path$B;
function _extends$D() { _extends$D = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$D.apply(this, arguments); }
var SvgIconDoneAll = function SvgIconDoneAll(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$D({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$B || (_path$B = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M5.886 31.448 19.219 44.78a2.667 2.667 0 0 1-3.771 3.771L2.114 35.22a2.667 2.667 0 0 1 3.772-3.771zm52.228-16a2.666 2.666 0 1 1 3.772 3.771L32.552 48.552a2.665 2.665 0 0 1-3.771 0L15.448 35.22a2.665 2.665 0 0 1 0-3.771 2.665 2.665 0 0 1 3.771 0l11.448 11.447zm-9.562 0a2.665 2.665 0 0 1 0 3.771L32.556 35.215a2.665 2.665 0 0 1-3.771 0 2.664 2.664 0 0 1 0-3.77L44.78 15.447a2.665 2.665 0 0 1 3.771 0z",
    className: "icon-done-all_svg__fill"
  })));
};

var _path$A;
function _extends$C() { _extends$C = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$C.apply(this, arguments); }
var SvgIconDownload = function SvgIconDownload(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$C({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$A || (_path$A = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M56 42.667a2.667 2.667 0 0 1 2.649 2.355l.018.311v8c0 4.26-3.33 7.743-7.53 7.987l-.47.013H13.333a8 8 0 0 1-7.986-7.53l-.014-.47v-8a2.667 2.667 0 0 1 5.316-.311l.018.311v8a2.67 2.67 0 0 0 2.355 2.65l.311.017h37.334a2.667 2.667 0 0 0 2.648-2.356l.018-.31v-8A2.667 2.667 0 0 1 56 42.667m-36.552-8.781a2.666 2.666 0 0 1 3.52-3.993l.251.221 6.114 6.114V5.333a2.667 2.667 0 0 1 5.316-.311l.018.311v30.894l6.114-6.113a2.67 2.67 0 0 1 3.52-.221l.251.221a2.666 2.666 0 0 1 .222 3.52l-.222.252-10.658 10.657a2 2 0 0 1-.135.128l.127-.119a3 3 0 0 1-.195.176l-.056.045-.086.064-.056.04-.086.056-.06.036-.081.046-.079.04a3 3 0 0 1-.14.065l-.09.036q-.034.014-.067.025l-.09.03-.063.019q-.064.018-.13.034l-.013.003-.144.028-.064.01q-.045.008-.092.012l-.084.008-.103.006-.069.002h-.095q-.042 0-.082-.003l.139.003q-.126 0-.249-.011l-.061-.007-.092-.012-.09-.015-.118-.025-.04-.01a3 3 0 0 1-.34-.11l-.015-.006q-.074-.03-.145-.063l-.042-.02L30.71 45l-.067-.039q-.045-.026-.087-.054l-.062-.041q-.045-.03-.088-.063l-.04-.03-.008-.007a3 3 0 0 1-.251-.223z",
    className: "icon-download_svg__fill"
  })));
};

var _path$z;
function _extends$B() { _extends$B = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$B.apply(this, arguments); }
var SvgIconEdit = function SvgIconEdit(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$B({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 65 65"
  }, props), _path$z || (_path$z = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M56 56a2.667 2.667 0 0 1 .311 5.315l-.311.018H8a2.667 2.667 0 0 1-.311-5.316L8 56zM35.448 3.448a2.665 2.665 0 0 1 3.771 0l10.667 10.666a2.67 2.67 0 0 1 0 3.772L20.552 47.219c-.5.5-1.178.781-1.885.781H8a2.667 2.667 0 0 1-2.667-2.667V34.667c0-.708.281-1.386.781-1.886zm1.885 5.659L10.667 35.77v6.896h6.89L44.227 16z",
    className: "icon-edit_svg__fill"
  })));
};

var _path$y;
function _extends$A() { _extends$A = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$A.apply(this, arguments); }
var SvgIconEmojiMore = function SvgIconEmojiMore(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$A({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$y || (_path$y = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32.097 3.22c2.65 0 5.255.357 7.763 1.054a2.134 2.134 0 0 1-1.144 4.111 24.7 24.7 0 0 0-6.619-.899c-13.603 0-24.63 11.027-24.63 24.63s11.027 24.63 24.63 24.63 24.63-11.027 24.63-24.63c0-2.227-.295-4.413-.87-6.518a2.13 2.13 0 0 1 1.494-2.62 2.13 2.13 0 0 1 2.62 1.494 29 29 0 0 1 1.023 7.644c0 15.96-12.938 28.897-28.897 28.897-15.96 0-28.897-12.937-28.897-28.897S16.138 3.22 32.097 3.22m10.705 34.792a2.133 2.133 0 0 1 2.024 2.808c-1.873 5.623-6.937 9.488-12.729 9.488s-10.856-3.865-12.73-9.488a2.134 2.134 0 0 1 1.875-2.803l.15-.005zm-3.477 4.266H24.867l.294.382c1.539 1.887 3.718 3.113 6.115 3.342l.314.024.507.015c2.617 0 5.037-1.188 6.743-3.151l.193-.23zM21.392 21.954c1.087 0 1.985.814 2.116 1.866l.017.267v5.353a2.133 2.133 0 0 1-4.25.268l-.017-.268v-5.353c0-1.178.955-2.133 2.134-2.133m21.41 0c1.088 0 1.985.814 2.117 1.866l.017.267v5.353a2.133 2.133 0 0 1-4.25.268l-.017-.268v-5.353c0-1.178.955-2.133 2.133-2.133M54.853 0a.8.8 0 0 1 .8.8v7.786h7.76a.8.8 0 0 1 .8.8v2.667a.8.8 0 0 1-.8.8h-7.76v7.758a.8.8 0 0 1-.8.8h-2.666a.8.8 0 0 1-.8-.8v-7.758h-7.785a.8.8 0 0 1-.8-.8V9.387a.8.8 0 0 1 .8-.8l7.784-.001V.8a.8.8 0 0 1 .8-.8z",
    className: "icon-emoji-more_svg__fill"
  })));
};

var _path$x;
function _extends$z() { _extends$z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$z.apply(this, arguments); }
var SvgIconError = function SvgIconError(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$z({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$x || (_path$x = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 5.06a8 8 0 0 1 6.561 3.424l.287.439 22.608 37.744a8 8 0 0 1 .022 7.962 8 8 0 0 1-6.356 4.014l-.535.024H9.384a8 8 0 0 1-6.862-4.038 8.01 8.01 0 0 1-.226-7.493l.27-.506L25.16 8.91A8 8 0 0 1 32 5.06m0 5.333c-.816 0-1.58.372-2.076.99l-.196.28-22.565 37.67a2.67 2.67 0 0 0 1.909 3.973l.341.027h45.144a2.67 2.67 0 0 0 2.45-3.659l-.148-.304L34.28 11.676A2.67 2.67 0 0 0 32 10.393m0 32.274A2.667 2.667 0 1 1 32 48a2.667 2.667 0 0 1 0-5.333m0-21.334a2.667 2.667 0 0 1 2.649 2.356l.018.311v10.667a2.667 2.667 0 0 1-5.316.311l-.018-.311V24A2.667 2.667 0 0 1 32 21.333",
    className: "icon-error_svg__fill"
  })));
};

var _path$w;
function _extends$y() { _extends$y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$y.apply(this, arguments); }
var SvgIconExpand = function SvgIconExpand(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$y({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$w || (_path$w = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M48 8a2.667 2.667 0 0 1 2.649 2.356l.018.31V32l-.001.027v21.306a2.667 2.667 0 0 1-5.315.311l-.018-.31V34.665H19.772l6.114 6.115a2.67 2.67 0 0 1 .221 3.52l-.221.251a2.666 2.666 0 0 1-3.52.222l-.252-.222-10.666-10.666a2.666 2.666 0 0 1-.222-3.52l.222-.252 10.666-10.666a2.666 2.666 0 0 1 3.993 3.52l-.221.251-6.113 6.114h25.56V10.667A2.667 2.667 0 0 1 48 8",
    className: "icon-expand_svg__fill"
  })));
};

var _path$v;
function _extends$x() { _extends$x = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$x.apply(this, arguments); }
var SvgIconFileAudio = function SvgIconFileAudio(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$x({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$v || (_path$v = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M30.52 12.51c1.685-1.226 4.139-.103 4.139 1.893v35.194c0 1.996-2.454 3.119-4.138 1.893l-12.45-9.909H7.898c-1.416 0-2.564-1.074-2.564-2.399V24.818c0-1.325 1.148-2.4 2.564-2.4h10.175zm20.427.163c10.293 10.667 10.293 27.987 0 38.654a2.137 2.137 0 0 1-3.156-.047c-.86-.942-.84-2.448.044-3.364 8.49-8.799 8.49-23.033 0-31.832-.884-.916-.904-2.422-.044-3.364a2.137 2.137 0 0 1 3.156-.047m-8.492 8.799c5.597 5.8 5.597 15.231 0 21.031a2.136 2.136 0 0 1-3.156-.046c-.86-.942-.84-2.448.044-3.364 3.794-3.932 3.794-10.279 0-14.211-.884-.916-.904-2.422-.044-3.363a2.136 2.136 0 0 1 3.156-.047",
    className: "icon-file-audio_svg__fill"
  })));
};

var _path$u;
function _extends$w() { _extends$w = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$w.apply(this, arguments); }
var SvgIconFileDocument = function SvgIconFileDocument(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$w({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$u || (_path$u = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M39.414 6.4a2.4 2.4 0 0 1 1.71.701l12.642 12.75c.407.41.634.953.634 1.516v29.765c0 3.542-4.342 6.468-8 6.468H16.16c-3.658 0-6.4-2.926-6.4-6.468L9.6 12.868c0-3.542 2.902-6.468 6.56-6.468zm3.331 35.173-21.49.027-.147.005c-1.066.08-1.908 1.014-1.908 2.155 0 1.193.92 2.16 2.055 2.16l21.49-.027.147-.005c1.066-.08 1.908-1.014 1.908-2.155 0-1.193-.92-2.16-2.055-2.16m0-8.533-21.49.027-.147.005c-1.066.08-1.908 1.014-1.908 2.155 0 1.193.92 2.16 2.055 2.16l21.49-.027.147-.005c1.066-.08 1.908-1.014 1.908-2.155 0-1.193-.92-2.16-2.055-2.16m-11.807-8.507h-9.6l-.153.006a2.15 2.15 0 0 0-1.985 2.154c0 1.193.957 2.16 2.138 2.16h9.6l.152-.005a2.15 2.15 0 0 0 1.985-2.155c0-1.193-.957-2.16-2.137-2.16",
    className: "icon-file-document_svg__fill"
  })));
};

var _path$t;
function _extends$v() { _extends$v = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$v.apply(this, arguments); }
var SvgIconFreeze = function SvgIconFreeze(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$v({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$t || (_path$t = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "m41.636 3.226.251.222a2.67 2.67 0 0 1 .222 3.52l-.222.251-7.219 7.218V27.38l11.209-6.472 2.643-9.86a2.667 2.667 0 0 1 5.218 1.051l-.067.329-2.237 8.35 8.352 2.24a2.67 2.67 0 0 1 1.952 2.938l-.067.328a2.67 2.67 0 0 1-2.937 1.952l-.329-.066-9.861-2.643L37.334 32l11.209 6.47 9.862-2.64.329-.067a2.67 2.67 0 0 1 2.937 1.952l.067.328a2.67 2.67 0 0 1-1.952 2.938l-8.353 2.237 2.238 8.353.067.329a2.666 2.666 0 0 1-5.218 1.052l-2.643-9.861-11.209-6.472v12.944l7.219 7.218a2.667 2.667 0 0 1-3.52 3.993l-.251-.222L32 54.437l-6.114 6.115a2.666 2.666 0 0 1-3.52.222l-.251-.222a2.666 2.666 0 0 1-.222-3.52l.222-.251 7.218-7.22V36.62l-11.209 6.47-2.642 9.863a2.666 2.666 0 0 1-5.218-1.052l.067-.329 2.236-8.351-8.35-2.24a2.665 2.665 0 0 1-1.953-2.937l.067-.328a2.665 2.665 0 0 1 2.937-1.952l.329.066 9.861 2.642L26.667 32l-11.209-6.472-9.86 2.643-.329.066a2.665 2.665 0 0 1-2.937-1.952l-.067-.328a2.67 2.67 0 0 1 1.952-2.938l8.35-2.239-2.235-8.351-.067-.329a2.667 2.667 0 0 1 5.218-1.052l2.642 9.862 11.209 6.47V14.439L22.116 7.22a2.665 2.665 0 0 1 0-3.771 2.666 2.666 0 0 1 3.52-.222l.251.222 6.114 6.112 6.115-6.112a2.666 2.666 0 0 1 3.52-.222z",
    className: "icon-freeze_svg__fill"
  })));
};

var _path$s;
function _extends$u() { _extends$u = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$u.apply(this, arguments); }
var SvgIconGif = function SvgIconGif(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$u({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$s || (_path$s = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M16.664 45.333q3.233 0 5.89-.953 2.658-.954 4.113-2.683V31.34h-10.29v3.94h4.902v4.474q-1.292 1.284-4.327 1.283-3.017 0-4.58-2.085-1.561-2.085-1.562-6.168v-1.657q.018-4.047 1.455-6.097t4.184-2.05q2.155 0 3.385 1.034t1.59 3.262h5.243q-.486-4.206-3.107-6.408t-7.273-2.201q-3.34 0-5.827 1.506t-3.807 4.35q-1.32 2.843-1.32 6.728v1.765q.036 3.78 1.428 6.578 1.392 2.797 3.95 4.269 2.56 1.47 5.953 1.47m20.67 0V18.667H32v26.666h5.333zm10.396 0V34.436h9.721v-4.432H47.73v-6.887h10.937v-4.45h-16v26.666z",
    className: "icon-gif_svg__fill"
  })));
};

var _path$r;
function _extends$t() { _extends$t = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$t.apply(this, arguments); }
var SvgIconInfo = function SvgIconInfo(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$t({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$r || (_path$r = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333 2.667 48.2 2.667 32 15.8 2.667 32 2.667M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8m1.667 21.333a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3.334a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1zm-1.667-8a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334",
    className: "icon-info_svg__fill"
  })));
};

var _path$q;
function _extends$s() { _extends$s = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$s.apply(this, arguments); }
var SvgIconLeave = function SvgIconLeave(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$s({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$q || (_path$q = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 5.333a2.667 2.667 0 0 1 .311 5.316l-.311.018H10.667a2.67 2.67 0 0 0-2.65 2.355L8 13.333v37.334a2.667 2.667 0 0 0 2.356 2.648l.31.018H32a2.667 2.667 0 0 1 .311 5.316l-.311.018H10.667a8 8 0 0 1-7.987-7.53l-.013-.47V13.333a8 8 0 0 1 7.53-7.986l.47-.014zm17.634 13.893.252.222 10.666 10.666a2.666 2.666 0 0 1 .222 3.52l-.222.252-10.666 10.666a2.666 2.666 0 0 1-3.993-3.52l.221-.251 4.78-4.782L20 36a2.667 2.667 0 0 1-.311-5.315l.311-.018h33.56l-7.446-7.448a2.67 2.67 0 0 1-.221-3.52l.221-.251a2.666 2.666 0 0 1 3.52-.222",
    className: "icon-leave_svg__fill"
  })));
};

var _path$p;
function _extends$r() { _extends$r = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$r.apply(this, arguments); }
var SvgIconMembers = function SvgIconMembers(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$r({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$p || (_path$p = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M34.667 37.333c7.17 0 13.018 5.66 13.32 12.755l.013.579V56a2.667 2.667 0 0 1-5.315.311L42.667 56v-5.333c0-4.26-3.33-7.743-7.53-7.987l-.47-.013H13.333a8 8 0 0 0-7.986 7.53l-.014.47V56a2.667 2.667 0 0 1-5.316.311L0 56v-5.333c0-7.17 5.66-13.019 12.755-13.321l.578-.013zM54 37.765a13.33 13.33 0 0 1 9.986 12.297l.014.605V56a2.667 2.667 0 0 1-5.315.311L58.667 56v-5.331a8 8 0 0 0-6-7.74A2.667 2.667 0 1 1 54 37.765M24 5.333c7.364 0 13.333 5.97 13.333 13.334S31.363 32 24 32s-13.333-5.97-13.333-13.333S16.637 5.333 24 5.333m19.328.43a13.333 13.333 0 0 1 0 25.834 2.667 2.667 0 1 1-1.323-5.167 8 8 0 0 0 0-15.5 2.667 2.667 0 1 1 1.323-5.167M24 10.667a8 8 0 1 0 0 16 8 8 0 0 0 0-16",
    className: "icon-members_svg__fill"
  })));
};

var _path$o;
function _extends$q() { _extends$q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$q.apply(this, arguments); }
var SvgIconMessage = function SvgIconMessage(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$q({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$o || (_path$o = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58q-8.947 2.868-12.504 1.981-4.198-1.047-1.657-3.663 1.757-2.094 2.928-5.234.934-2.502-.737-7A29.15 29.15 0 0 1 2.666 32C2.667 15.8 15.8 2.667 32 2.667M32 8C18.745 8 8 18.745 8 32c0 3.5.747 6.88 2.168 9.978l.405.837.137.271.106.285c1.517 4.085 1.89 7.622.734 10.72l-.382.972-.192.433.235-.05a62 62 0 0 0 4.886-1.363l1.721-.568 2.04-.696 1.95.917A23.9 23.9 0 0 0 32 56c13.255 0 24-10.745 24-24S45.255 8 32 8M18.667 29.333a2.667 2.667 0 1 1-.001 5.333 2.667 2.667 0 0 1 .001-5.333m13.333 0a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334m13.333 0a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334",
    className: "icon-message_svg__fill"
  })));
};

var _path$n;
function _extends$p() { _extends$p = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$p.apply(this, arguments); }
var SvgIconModerations = function SvgIconModerations(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$p({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$n || (_path$n = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M18.667 34.667a2.667 2.667 0 0 1 .311 5.316l-.311.017h-5.334v16a2.667 2.667 0 0 1-5.316.311L8 56V40H2.667a2.667 2.667 0 0 1-.311-5.315l.31-.018h16zM32 29.333a2.667 2.667 0 0 1 2.649 2.356l.018.311v24a2.667 2.667 0 0 1-5.316.311L29.333 56V32A2.667 2.667 0 0 1 32 29.333M61.333 40a2.667 2.667 0 0 1 .311 5.315l-.31.018h-5.335L56 56a2.667 2.667 0 0 1-5.315.311L50.667 56l-.001-10.668-5.333.001a2.667 2.667 0 0 1-.311-5.316l.311-.017zm-8-34.667a2.67 2.67 0 0 1 2.65 2.356L56 8v24a2.667 2.667 0 0 1-5.315.311L50.667 32V8a2.667 2.667 0 0 1 2.666-2.667m-42.666 0a2.667 2.667 0 0 1 2.648 2.356l.018.311v18.667a2.667 2.667 0 0 1-5.316.311L8 26.667V8a2.667 2.667 0 0 1 2.667-2.667m21.333 0a2.667 2.667 0 0 1 2.649 2.356l.018.311-.001 10.666H40a2.668 2.668 0 0 1 .311 5.317L40 24H24a2.667 2.667 0 0 1-.311-5.315l.311-.018h5.333V8A2.667 2.667 0 0 1 32 5.333",
    className: "icon-moderations_svg__fill"
  })));
};

var _path$m;
function _extends$o() { _extends$o = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$o.apply(this, arguments); }
var SvgIconMore = function SvgIconMore(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$o({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$m || (_path$m = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 45.333a5.333 5.333 0 1 1 0 10.666 5.333 5.333 0 0 1 0-10.666M32 28a5.333 5.333 0 1 1 0 10.668A5.333 5.333 0 0 1 32 28m0-17.333c2.946 0 5.333 2.387 5.333 5.333S34.946 21.333 32 21.333 26.667 18.946 26.667 16s2.387-5.333 5.333-5.333",
    className: "icon-more_svg__fill"
  })));
};

var _path$l;
function _extends$n() { _extends$n = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$n.apply(this, arguments); }
var SvgIconMute = function SvgIconMute(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$n({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$l || (_path$l = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "m55.62 19.616.067.123A26.55 26.55 0 0 1 58.667 32c0 4.326-1.03 8.41-2.864 12.025q-1.518 4.089-.67 6.363 1.066 2.855 2.662 4.758 2.31 2.379-1.506 3.33-3.135.782-10.879-1.646l-.488-.155-1.594-.527A26.6 26.6 0 0 1 32 58.667a26.55 26.55 0 0 1-12.326-3.014l-.059-.03 4-4A21.2 21.2 0 0 0 32 53.333c2.993 0 5.89-.614 8.562-1.786l.498-.226 1.925-.905 3.613 1.196.695.219q1.093.337 2.054.595l.472.125.485.121-.167-.42-.2-.594c-.814-2.685-.484-5.681.713-9.065l.154-.425.106-.284.528-1.084a21.2 21.2 0 0 0 1.895-8.8 21.2 21.2 0 0 0-1.71-8.385zm2.266-13.502a2.67 2.67 0 0 1 .221 3.52l-.221.252-48 48a2.668 2.668 0 0 1-3.993-3.52l.221-.252 5.238-5.237a26.56 26.56 0 0 1-6.015-16.412L5.333 32C5.333 17.272 17.273 5.333 32 5.333a26.55 26.55 0 0 1 16.877 6.02l5.237-5.239a2.67 2.67 0 0 1 3.772 0M32 10.667c-11.782 0-21.333 9.55-21.333 21.333 0 4.836 1.614 9.401 4.48 13.084l29.936-29.938A21.25 21.25 0 0 0 32 10.666z",
    className: "icon-mute_svg__fill"
  })));
};

var _path$k;
function _extends$m() { _extends$m = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$m.apply(this, arguments); }
var SvgIconNotifications = function SvgIconNotifications(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$m({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$k || (_path$k = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M36.613 53.333c2.056 0 3.338 2.227 2.307 4.005a8 8 0 0 1-13.84 0c-.98-1.689.129-3.783 2.004-3.988l.303-.017zM32 2.667c11.56 0 20.972 9.194 21.323 20.669l.01.664v13.333a5.334 5.334 0 0 0 4.936 5.319l.753.033c2.963.318 3.077 4.616.342 5.24l-.342.056-.355.019H5.333l-.355-.019c-3.082-.33-3.082-4.965 0-5.296l.753-.033a5.335 5.335 0 0 0 4.92-4.9l.016-.419V24c0-11.782 9.55-21.333 21.333-21.333M32 8c-8.636 0-15.674 6.842-15.989 15.4L16 24v13.333c0 1.562-.336 3.046-.939 4.383l-.275.564-.218.387h34.861l-.215-.387a10.6 10.6 0 0 1-1.146-3.74l-.055-.674-.013-.533V24c0-8.837-7.163-16-16-16",
    className: "icon-notifications_svg__fill"
  })));
};

var _path$j;
function _extends$l() { _extends$l = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$l.apply(this, arguments); }
var SvgIconNotificationsOffFilled = function SvgIconNotificationsOffFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$l({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$j || (_path$j = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M36.613 53.333c2.056 0 3.338 2.227 2.307 4.005a8 8 0 0 1-13.84 0c-.98-1.689.129-3.783 2.004-3.988l.303-.017zM32 2.667c7.173 0 13.52 3.54 17.387 8.97l5.686-5.687a2.105 2.105 0 0 1 2.85-.117l.127.117a2.105 2.105 0 0 1 0 2.977L8.927 58.05c-.78.781-2.023.82-2.85.117l-.127-.117a2.105 2.105 0 0 1 0-2.977L13.023 48h-7.69l-.355-.019c-3.082-.33-3.082-4.965 0-5.296l.753-.033a5.335 5.335 0 0 0 4.92-4.9l.016-.419V24c0-11.782 9.55-21.333 21.333-21.333m20.85 16.795c.271 1.253.433 2.548.473 3.874l.01.664v13.333a5.334 5.334 0 0 0 4.936 5.319l.753.033c2.963.318 3.077 4.616.342 5.24l-.342.056-.355.019H24.31z",
    className: "icon-notifications-off-filled_svg__fill"
  })));
};

var _path$i;
function _extends$k() { _extends$k = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$k.apply(this, arguments); }
var SvgIconOperator = function SvgIconOperator(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$k({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$i || (_path$i = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M29.83 6.45a2.667 2.667 0 0 1 4.34 0l11.697 16.374L57 13.918c1.88-1.504 4.573.054 4.32 2.35l-.047.29-8 37.334A2.666 2.666 0 0 1 50.666 56H13.333a2.666 2.666 0 0 1-2.607-2.108l-8-37.333c-.525-2.452 2.315-4.207 4.273-2.641l11.132 8.906zM32 12.587l-11.163 15.63a2.667 2.667 0 0 1-3.836.532l-7.497-5.997 5.984 27.915h33.021l5.984-27.915L47 28.749a2.667 2.667 0 0 1-3.632-.281l-.204-.251zM32 32a5.333 5.333 0 1 1 0 10.668A5.333 5.333 0 0 1 32 32",
    className: "icon-operator_svg__fill"
  })));
};

var _path$h;
function _extends$j() { _extends$j = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$j.apply(this, arguments); }
var SvgIconPhoto = function SvgIconPhoto(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$j({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$h || (_path$h = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M50.667 5.333a8 8 0 0 1 8 8v37.334a8 8 0 0 1-8 8H13.333a8 8 0 0 1-8-8V13.333a8 8 0 0 1 8-8zm-8 25.107L19.77 53.332l30.896.001a2.667 2.667 0 0 0 2.661-2.498l.005-.168v-9.564L42.666 30.44zm8-19.773H13.333a2.667 2.667 0 0 0-2.666 2.666v37.334c0 1.143.72 2.119 1.731 2.498L40.781 24.78a2.67 2.67 0 0 1 3.52-.222l.251.222 8.78 8.78.001-20.228a2.667 2.667 0 0 0-2.498-2.661zm-28 5.333a6.666 6.666 0 1 1 0 13.333 6.666 6.666 0 0 1 0-13.333m0 5.333a1.334 1.334 0 1 0 0 2.667 1.334 1.334 0 0 0 0-2.667",
    className: "icon-photo_svg__fill"
  })));
};

var _path$g;
function _extends$i() { _extends$i = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$i.apply(this, arguments); }
var SvgIconPlay = function SvgIconPlay(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$i({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$g || (_path$g = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M51.908 34.75c1.9-1.233 1.896-3.26.013-4.514L19.376 8.577c-1.893-1.26-3.404-.391-3.376 1.968l.522 42.888c.028 2.347 1.596 3.247 3.493 2.016z",
    className: "icon-play_svg__fill"
  })));
};

var _path$f;
function _extends$h() { _extends$h = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$h.apply(this, arguments); }
var SvgIconPlus = function SvgIconPlus(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$h({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$f || (_path$f = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M34.667 29.333h18.666c3.556 0 3.556 5.334 0 5.334H34.667v18.666c0 3.556-5.334 3.556-5.334 0V34.667H10.667c-3.556 0-3.556-5.334 0-5.334h18.666V10.667c0-3.556 5.334-3.556 5.334 0z",
    className: "icon-plus_svg__fill"
  })));
};

var _path$e;
function _extends$g() { _extends$g = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$g.apply(this, arguments); }
var SvgIconQuestion = function SvgIconQuestion(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$g({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$e || (_path$e = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 61.333C15.8 61.333 2.667 48.2 2.667 32S15.8 2.667 32 2.667 61.333 15.8 61.333 32 48.2 61.333 32 61.333M32 56c13.255 0 24-10.745 24-24S45.255 8 32 8 8 18.745 8 32s10.745 24 24 24m2.213-18.63a2.667 2.667 0 1 1-5.333 0v-2.69c0-1.148.734-2.168 1.823-2.53.173-.058.532-.195 1.01-.407.809-.36 1.616-.79 2.354-1.282 1.835-1.223 2.813-2.528 2.813-3.786a5.333 5.333 0 0 0-10.364-1.777 2.667 2.667 0 0 1-5.032-1.77 10.668 10.668 0 0 1 20.729 3.551c0 3.413-2.022 6.109-5.187 8.22a21 21 0 0 1-2.813 1.578zm-5.333 7.523a2.667 2.667 0 1 1 5.333 0v.44a2.667 2.667 0 1 1-5.333 0v-.44",
    className: "icon-question_svg__fill"
  })));
};

var _path$d;
function _extends$f() { _extends$f = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }
var SvgIconRefresh = function SvgIconRefresh(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$f({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$d || (_path$d = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "m46.14 14.43.562.537 6.631 6.167v-7.8a2.67 2.67 0 0 1 2.356-2.65l.311-.017a2.667 2.667 0 0 1 2.649 2.355l.018.311v16a2.67 2.67 0 0 1-2.356 2.65L56 32H40a2.667 2.667 0 0 1-.311-5.315l.311-.018h11.452l-8.44-7.85c-5.964-5.893-15.168-7.182-22.563-3.156-7.38 4.018-11.172 12.357-9.314 20.455 1.859 8.107 8.935 14.032 17.362 14.518 8.43.487 16.162-4.585 18.967-12.426a2.667 2.667 0 0 1 5.022 1.797C48.88 50.082 38.973 56.582 28.19 55.959c-10.785-.623-19.862-8.222-22.254-18.65C3.542 26.872 8.426 16.135 17.9 10.977c9.227-5.024 20.65-3.579 28.241 3.453z",
    className: "icon-refresh_svg__fill"
  })));
};

var _path$c;
function _extends$e() { _extends$e = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }
var SvgIconRemove = function SvgIconRemove(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$e({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$c || (_path$c = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333 2.667 48.2 2.667 32 15.8 2.667 32 2.667m9.886 19.447a2.67 2.67 0 0 0-3.772 0L32 28.23l-6.114-6.115-.134-.124a2.667 2.667 0 0 0-3.638.124l-.124.134a2.667 2.667 0 0 0 .124 3.638L28.23 32l-6.115 6.114-.124.134a2.667 2.667 0 0 0 .124 3.638l.134.124a2.667 2.667 0 0 0 3.638-.124L32 35.77l6.114 6.115.134.124a2.667 2.667 0 0 0 3.638-.124l.124-.134a2.667 2.667 0 0 0-.124-3.638L35.77 32l6.115-6.114.124-.134a2.667 2.667 0 0 0-.124-3.638z",
    className: "icon-remove_svg__fill"
  })));
};

var _path$b;
function _extends$d() { _extends$d = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }
var SvgIconReplyFilled = function SvgIconReplyFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$d({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 12 12"
  }, props), _path$b || (_path$b = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M11.774 10.5c.062 0 .12-.025.164-.07a.22.22 0 0 0 .062-.164c-.069-1.447-.495-2.678-1.268-3.66-.618-.785-1.455-1.409-2.49-1.855a9.3 9.3 0 0 0-2.406-.655 10 10 0 0 0-.862-.078V2.225a.23.23 0 0 0-.128-.203.23.23 0 0 0-.24.028L.084 5.692A.22.22 0 0 0 0 5.865c0 .068.03.132.082.175l4.523 3.737c.067.056.16.068.24.03a.22.22 0 0 0 .13-.202v-1.95c1.134-.08 2.178.003 3.107.25a6.4 6.4 0 0 1 2.087.96c1.018.724 1.398 1.5 1.401 1.507a.23.23 0 0 0 .204.128",
    className: "icon-reply-filled_svg__fill"
  })));
};

var _path$a;
function _extends$c() { _extends$c = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }
var SvgIconSearch = function SvgIconSearch(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$c({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$a || (_path$a = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M26.667 48C14.885 48 5.333 38.449 5.333 26.667S14.885 5.333 26.667 5.333 48 14.885 48 26.667c0 4.93-1.672 9.469-4.48 13.081l13.67 13.67a2.668 2.668 0 0 1-3.772 3.772l-13.67-13.67A21.24 21.24 0 0 1 26.667 48m0-5.333c8.836 0 16-7.164 16-16s-7.164-16-16-16-16 7.163-16 16 7.163 16 16 16",
    className: "icon-search_svg__fill"
  })));
};

var _path$9;
function _extends$b() { _extends$b = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }
var SvgIconSend = function SvgIconSend(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$b({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$9 || (_path$9 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M59.795 29.43 7.329 2.979C4.691 1.802 1.76 4.153 2.932 6.798l6.925 18.609a2 2 0 0 0 1.544 1.275l32.273 5.394L11.4 37.47a2 2 0 0 0-1.544 1.275L2.932 57.353c-.879 2.645 1.76 4.997 4.397 3.527l52.466-26.453c2.051-.882 2.051-3.82 0-4.996z",
    className: "icon-send_svg__fill"
  })));
};

var _path$8;
function _extends$a() { _extends$a = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }
var SvgIconSettingsFilled = function SvgIconSettingsFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$a({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$8 || (_path$8 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 2.667A5.33 5.33 0 0 1 37.333 8v.24A4.4 4.4 0 0 0 40 12.267a4.4 4.4 0 0 0 4.853-.88l.16-.16a5.33 5.33 0 0 1 7.547 0 5.333 5.333 0 0 1 0 7.546l-.16.16a4.4 4.4 0 0 0-.88 4.854V24a4.4 4.4 0 0 0 4.027 2.667H56c2.946 0 5.333 2.387 5.333 5.333S58.946 37.333 56 37.333h-.24A4.4 4.4 0 0 0 51.733 40a4.4 4.4 0 0 0 .88 4.853l.16.16a5.33 5.33 0 0 1 0 7.547 5.333 5.333 0 0 1-7.546 0l-.16-.16a4.4 4.4 0 0 0-4.854-.88 4.4 4.4 0 0 0-2.666 4.027V56a5.333 5.333 0 0 1-10.667 0v-.24A4.4 4.4 0 0 0 24 51.733a4.4 4.4 0 0 0-4.853.88l-.16.16a5.33 5.33 0 0 1-7.547 0 5.333 5.333 0 0 1 0-7.546l.16-.16a4.4 4.4 0 0 0 .88-4.854 4.4 4.4 0 0 0-4.027-2.666H8A5.333 5.333 0 0 1 8 26.88h.24A4.4 4.4 0 0 0 12.267 24a4.4 4.4 0 0 0-.88-4.853l-.16-.16a5.33 5.33 0 0 1 0-7.547 5.333 5.333 0 0 1 7.546 0l.16.16a4.4 4.4 0 0 0 4.854.88H24a4.4 4.4 0 0 0 2.667-4.027V8A5.33 5.33 0 0 1 32 2.667M32 24a8 8 0 1 0 0 16 8 8 0 0 0 0-16",
    className: "icon-settings-filled_svg__fill"
  })));
};

var _path$7;
function _extends$9() { _extends$9 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
var SvgIconSlideLeft = function SvgIconSlideLeft(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$9({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 32 32"
  }, props), _path$7 || (_path$7 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M21.943 24.39a1.333 1.333 0 0 1-1.886 1.886l-9.333-9.333a1.333 1.333 0 0 1 0-1.886l9.333-9.333a1.333 1.333 0 1 1 1.886 1.885L13.553 16z",
    className: "icon-slide-left_svg__fill",
    clipRule: "evenodd"
  })));
};

var _path$6;
function _extends$8() { _extends$8 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
var SvgIconSpinner = function SvgIconSpinner(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$8({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$6 || (_path$6 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M32 61.333C48.2 61.333 61.333 48.2 61.333 32S48.2 2.667 32 2.667 2.667 15.8 2.667 32a2.838 2.838 0 1 0 5.678 0C8.344 18.935 18.934 8.344 32 8.344c13.065 0 23.656 10.591 23.656 23.656S45.065 55.656 32 55.656a2.838 2.838 0 1 0 0 5.677",
    className: "icon-spinner_svg__fill"
  })));
};

var _path$5;
function _extends$7() { _extends$7 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
var SvgIconSupergroup = function SvgIconSupergroup(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$7({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$5 || (_path$5 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M36.889 43.013c6.608 0 12.121 4.685 12.43 10.734l.014.537V58a2.667 2.667 0 0 1-5.316.311L44 58v-3.716c0-3.07-2.87-5.718-6.636-5.925l-.475-.013H27.11c-3.838 0-6.86 2.525-7.096 5.557l-.015.381V58a2.667 2.667 0 0 1-5.315.311L14.667 58v-3.716c0-6.126 5.324-10.986 11.864-11.26l.58-.011zm18.578-17.291q.401 0 .784.118c4.632 1.426 7.518 4.801 7.736 9.688l.013.594v12.8a2.667 2.667 0 0 1-5.315.311l-.018-.311V36.124c-.002-2.595-1.163-4.171-3.528-5.034l-.104-.037-2.502.002a2.667 2.667 0 0 1-2.648-2.356l-.018-.31a2.67 2.67 0 0 1 2.355-2.65l.311-.017zm-44 0 .31.018a2.666 2.666 0 0 1 2.356 2.648l-.018.311a2.666 2.666 0 0 1-2.648 2.356l-2.51-.002-.119.042c-2.246.85-3.503 2.574-3.505 5.147v12.68l-.018.31A2.666 2.666 0 0 1 0 48.922V36.24l.014-.591c.225-4.874 3.203-8.415 7.712-9.809q.384-.117.788-.118zM32 19.958c5.512 0 10 4.409 10 9.871s-4.488 9.872-10 9.872-10-4.41-10-9.872 4.488-9.871 10-9.871m0 5.333c-2.588 0-4.667 2.043-4.667 4.538s2.08 4.538 4.667 4.538c2.588 0 4.667-2.042 4.667-4.538 0-2.495-2.08-4.538-4.667-4.538M17.333 2.667c5.513 0 10 4.409 10 9.871s-4.487 9.871-10 9.871c-5.512 0-10-4.409-10-9.871s4.488-9.871 10-9.871m29.334 0c5.512 0 10 4.409 10 9.871s-4.488 9.871-10 9.871c-5.513 0-10-4.409-10-9.871s4.487-9.871 10-9.871M17.333 8c-2.587 0-4.666 2.042-4.666 4.538s2.079 4.538 4.666 4.538S22 15.034 22 12.538 19.921 8 17.333 8m29.334 0C44.079 8 42 10.042 42 12.538s2.079 4.538 4.667 4.538 4.666-2.042 4.666-4.538S49.254 8 46.667 8",
    className: "icon-supergroup_svg__fill"
  })));
};

var _path$4, _path2;
function _extends$6() { _extends$6 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
var SvgIconThread = function SvgIconThread(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$6({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 64 64"
  }, props), _path$4 || (_path$4 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M38.824 25.895a2.95 2.95 0 0 1 4.16-.074L57.1 39.378a2.92 2.92 0 0 1 .002 4.213L42.985 57.177a2.95 2.95 0 0 1-4.158-.07 2.92 2.92 0 0 1 .07-4.14l11.928-11.48-11.926-11.451a2.92 2.92 0 0 1-.075-4.14",
    className: "icon-thread_svg__fill",
    clipRule: "evenodd"
  })), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
    d: "M8.866 6c1.583 0 2.866 1.216 2.866 2.716V25.5c0 7.672 6.846 14.068 15.475 14.068h22.927c1.583 0 2.866 1.216 2.866 2.716S51.717 45 50.134 45H27.207C15.604 45 6 36.35 6 25.5V8.716C6 7.216 7.283 6 8.866 6",
    className: "icon-thread_svg__fill",
    clipRule: "evenodd"
  })));
};

var _path$3;
function _extends$5() { _extends$5 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
var SvgIconThumbnailNone = function SvgIconThumbnailNone(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$5({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M34.667 5.333a2.667 2.667 0 0 1 0 5.334H13.333a2.667 2.667 0 0 0-2.666 2.666v37.334c0 1.143.72 2.118 1.73 2.497l28.384-28.383a2.667 2.667 0 0 1 3.771 0l8.781 8.78v-4.228a2.667 2.667 0 0 1 2.498-2.661l.169-.005a2.667 2.667 0 0 1 2.667 2.666v21.334a8 8 0 0 1-8 8H13.33a8 8 0 0 1-7.998-8V13.333a8 8 0 0 1 8-8zm8 25.105L19.77 53.333h30.897a2.667 2.667 0 0 0 2.661-2.498l.005-.168v-9.563zM22.667 16a6.666 6.666 0 1 1 0 13.333 6.666 6.666 0 0 1 0-13.333m0 5.333a1.334 1.334 0 1 0 0 2.667 1.334 1.334 0 0 0 0-2.667M56.78 3.448a2.665 2.665 0 0 1 3.771 0 2.665 2.665 0 0 1 0 3.771l-4.782 4.78 4.782 4.782c.998.998 1.04 2.59.125 3.638l-.125.133a2.665 2.665 0 0 1-3.771 0l-4.782-4.781-4.78 4.781a2.667 2.667 0 0 1-3.638.125l-.133-.125a2.665 2.665 0 0 1 0-3.771L48.228 12l-4.78-4.781a2.667 2.667 0 0 1-.125-3.638l.125-.133a2.665 2.665 0 0 1 3.771 0l4.78 4.78z",
    className: "icon-thumbnail-none_svg__fill"
  })));
};

var _g$1;
function _extends$4() { _extends$4 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
var SvgIconToggleoff = function SvgIconToggleoff(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 88 48"
  }, props), _g$1 || (_g$1 = /*#__PURE__*/React__namespace.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React__namespace.createElement("rect", {
    width: 80,
    height: 40,
    x: 4,
    y: 4,
    fill: "#000",
    className: "icon-toggleoff_svg__fill",
    rx: 20
  }), /*#__PURE__*/React__namespace.createElement("circle", {
    cx: 24,
    cy: 24,
    r: 12,
    fill: "#FFF"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#FFF",
    d: "M64 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4zm0 2H24C14.059 6 6 14.059 6 24c0 9.764 7.774 17.712 17.47 17.992L24 42h40c9.941 0 18-8.059 18-18 0-9.764-7.774-17.712-17.47-17.992z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    d: "M64 0H24C10.745 0 0 10.745 0 24s10.745 24 24 24h40c13.255 0 24-10.745 24-24S77.255 0 64 0m0 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4z",
    className: "icon-toggleoff_svg__fill"
  }))));
};

var _g;
function _extends$3() { _extends$3 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
var SvgIconToggleon = function SvgIconToggleon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 88 48"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React__namespace.createElement("rect", {
    width: 80,
    height: 40,
    x: 4,
    y: 4,
    fill: "#000",
    className: "icon-toggleon_svg__fill",
    rx: 20
  }), /*#__PURE__*/React__namespace.createElement("circle", {
    cx: 64,
    cy: 24,
    r: 12,
    fill: "#FFF"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#FFF",
    d: "M64 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4zm0 2H24C14.059 6 6 14.059 6 24c0 9.764 7.774 17.712 17.47 17.992L24 42h40c9.941 0 18-8.059 18-18 0-9.764-7.774-17.712-17.47-17.992z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    d: "M64 0H24C10.745 0 0 10.745 0 24s10.745 24 24 24h40c13.255 0 24-10.745 24-24S77.255 0 64 0m0 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4z",
    className: "icon-toggleon_svg__fill"
  }))));
};

var _path$2;
function _extends$2() { _extends$2 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var SvgIconUser = function SvgIconUser(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M42.667 37.333c7.17 0 13.018 5.66 13.32 12.755l.013.579V56a2.667 2.667 0 0 1-5.315.311L50.667 56v-5.333c0-4.26-3.33-7.743-7.53-7.987l-.47-.013H21.333a8 8 0 0 0-7.986 7.53l-.014.47V56a2.667 2.667 0 0 1-5.316.311L8 56v-5.333c0-7.17 5.66-13.019 12.755-13.321l.578-.013zM32 5.333c7.364 0 13.333 5.97 13.333 13.334S39.363 32 32 32s-13.333-5.97-13.333-13.333S24.637 5.333 32 5.333m0 5.334a8 8 0 1 0 0 16 8 8 0 0 0 0-16",
    className: "icon-user_svg__fill"
  })));
};

var _path$1;
function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var SvgIconFeedbackLike = function SvgIconFeedbackLike(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    fill: "none"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M12.346 5.336v-.001c.405-.523 1.182-.524 1.58-.037.162.2.25.443.25.69v3.678c0 .518.42.938.938.938H18.6c.359 0 .7.179.911.488l.001.001.369.548.003.004c.174.256.226.583.134.895l-1.532 5.316c-.131.459-.559.782-1.044.782h-7.075c-.3 0-.593-.127-.8-.345l-1.13-1.222v-6.647zm-4.73 3.078 3.245-4.223.002-.002c1.125-1.456 3.339-1.521 4.517-.075.421.52.671 1.177.671 1.874v2.74h2.55c.99 0 1.908.496 2.462 1.31l.002.004.368.547.002.002a2.93 2.93 0 0 1 .382 2.475v.003l-1.528 5.302a2.96 2.96 0 0 1-2.847 2.142h-7.075a2.99 2.99 0 0 1-2.166-.935l-.007-.007-.066-.072a2.13 2.13 0 0 1-1.821 1.025H4.192a2.13 2.13 0 0 1-2.13-2.13v-8.3a2.13 2.13 0 0 1 2.13-2.13h2.115c.493 0 .948.168 1.31.45m-3.678 1.68c0-.141.114-.255.254-.255h2.115c.14 0 .254.114.254.255v8.3c0 .14-.114.255-.254.255H4.192a.255.255 0 0 1-.255-.255z",
    clipRule: "evenodd"
  })));
};

var _path;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgIconFeedbackDislike = function SvgIconFeedbackDislike(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    fill: "none"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#000",
    fillRule: "evenodd",
    d: "M11.654 18.664v.001c-.405.523-1.182.524-1.58.037-.162-.2-.25-.444-.25-.69v-3.678a.94.94 0 0 0-.938-.938H5.4c-.359 0-.7-.179-.911-.488l-.001-.001-.369-.548-.003-.004a1.05 1.05 0 0 1-.134-.895l1.532-5.316c.131-.459.559-.782 1.044-.782h7.075c.3 0 .593.127.8.345l1.13 1.222v6.647zm4.73-3.078-3.245 4.223-.002.002c-1.125 1.456-3.339 1.521-4.517.075a2.98 2.98 0 0 1-.671-1.874v-2.74h-2.55c-.99 0-1.908-.496-2.462-1.31l-.002-.004-.368-.547-.002-.002a2.93 2.93 0 0 1-.382-2.475v-.003L3.711 5.63a2.96 2.96 0 0 1 2.847-2.142h7.075c.823 0 1.608.345 2.166.935l.007.007.066.072a2.13 2.13 0 0 1 1.821-1.025h2.115a2.13 2.13 0 0 1 2.13 2.13v8.3a2.13 2.13 0 0 1-2.13 2.13h-2.115a2.12 2.12 0 0 1-1.31-.45m3.678-1.68c0 .141-.114.255-.254.255h-2.115a.255.255 0 0 1-.255-.255v-8.3c0-.14.115-.255.255-.255h2.115c.14 0 .255.114.255.255z",
    clipRule: "evenodd"
  })));
};

function changeTypeToIconComponent(type) {
    switch (type) {
        case Types.ADD: return React.createElement(SvgIconAdd, null);
        case Types.ARROW_LEFT: return React.createElement(SvgIconArrowLeft, null);
        case Types.ATTACH: return React.createElement(SvgIconAttach, null);
        case Types.AUDIO_ON_LINED: return React.createElement(SvgIconAudioOnLined, null);
        case Types.BAN: return React.createElement(SvgIconBan, null);
        case Types.BROADCAST: return React.createElement(SvgIconBroadcast, null);
        case Types.CAMERA: return React.createElement(SvgIconCamera, null);
        case Types.CHANNELS: return React.createElement(SvgIconChannels, null);
        case Types.CHAT: return React.createElement(SvgIconChat, null);
        case Types.CHAT_FILLED: return React.createElement(SvgIconChatFilled, null);
        case Types.CHEVRON_DOWN: return React.createElement(SvgIconChevronDown, null);
        case Types.CHEVRON_RIGHT: return React.createElement(SvgIconChevronRight, null);
        case Types.CLOSE: return React.createElement(SvgIconClose, null);
        case Types.COLLAPSE: return React.createElement(SvgIconCollapse, null);
        case Types.COPY: return React.createElement(SvgIconCopy, null);
        case Types.CREATE: return React.createElement(SvgIconCreate, null);
        case Types.DELETE: return React.createElement(SvgIconDelete, null);
        case Types.DISCONNECTED: return React.createElement(SvgIconDisconnected, null);
        case Types.DOCUMENT: return React.createElement(SvgIconDocument, null);
        case Types.DONE: return React.createElement(SvgIconDone, null);
        case Types.DONE_ALL: return React.createElement(SvgIconDoneAll, null);
        case Types.DOWNLOAD: return React.createElement(SvgIconDownload, null);
        case Types.EDIT: return React.createElement(SvgIconEdit, null);
        case Types.EMOJI_MORE: return React.createElement(SvgIconEmojiMore, null);
        case Types.ERROR: return React.createElement(SvgIconError, null);
        case Types.EXPAND: return React.createElement(SvgIconExpand, null);
        case Types.FILE_AUDIO: return React.createElement(SvgIconFileAudio, null);
        case Types.FILE_DOCUMENT: return React.createElement(SvgIconFileDocument, null);
        case Types.FREEZE: return React.createElement(SvgIconFreeze, null);
        case Types.GIF: return React.createElement(SvgIconGif, null);
        case Types.INFO: return React.createElement(SvgIconInfo, null);
        case Types.LEAVE: return React.createElement(SvgIconLeave, null);
        case Types.MEMBERS: return React.createElement(SvgIconMembers, null);
        case Types.MESSAGE: return React.createElement(SvgIconMessage, null);
        case Types.MODERATIONS: return React.createElement(SvgIconModerations, null);
        case Types.MORE: return React.createElement(SvgIconMore, null);
        case Types.MUTE: return React.createElement(SvgIconMute, null);
        case Types.NOTIFICATIONS: return React.createElement(SvgIconNotifications, null);
        case Types.NOTIFICATIONS_OFF_FILLED: return React.createElement(SvgIconNotificationsOffFilled, null);
        case Types.OPERATOR: return React.createElement(SvgIconOperator, null);
        case Types.PHOTO: return React.createElement(SvgIconPhoto, null);
        case Types.PLAY: return React.createElement(SvgIconPlay, null);
        case Types.PLUS: return React.createElement(SvgIconPlus, null);
        case Types.QUESTION: return React.createElement(SvgIconQuestion, null);
        case Types.REFRESH: return React.createElement(SvgIconRefresh, null);
        case Types.REMOVE: return React.createElement(SvgIconRemove, null);
        case Types.REPLY: return React.createElement(SvgIconReplyFilled, null);
        case Types.SEARCH: return React.createElement(SvgIconSearch, null);
        case Types.SEND: return React.createElement(SvgIconSend, null);
        case Types.SETTINGS_FILLED: return React.createElement(SvgIconSettingsFilled, null);
        case Types.SLIDE_LEFT: return React.createElement(SvgIconSlideLeft, null);
        case Types.SPINNER: return React.createElement(SvgIconSpinner, null);
        case Types.SUPERGROUP: return React.createElement(SvgIconSupergroup, null);
        case Types.THREAD: return React.createElement(SvgIconThread, null);
        case Types.THUMBNAIL_NONE: return React.createElement(SvgIconThumbnailNone, null);
        case Types.TOGGLE_OFF: return React.createElement(SvgIconToggleoff, null);
        case Types.TOGGLE_ON: return React.createElement(SvgIconToggleon, null);
        case Types.USER: return React.createElement(SvgIconUser, null);
        case Types.FEEDBACK_LIKE: return React.createElement(SvgIconFeedbackLike, null);
        case Types.FEEDBACK_DISLIKE: return React.createElement(SvgIconFeedbackDislike, null);
        default: return 'icon'; // If you see this text 'icon' replace icon for it
    }
}
function Icon(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, type = _a.type, _c = _a.fillColor, fillColor = _c === void 0 ? Colors.DEFAULT : _c, _d = _a.width, width = _d === void 0 ? 26 : _d, _e = _a.height, height = _e === void 0 ? 26 : _e, _f = _a.onClick, onClick = _f === void 0 ? utils.noop : _f, _g = _a.children, children = _g === void 0 ? null : _g;
    var iconStyle = {
        width: typeof width === 'string' ? width : "".concat(width, "px"),
        minWidth: typeof width === 'string' ? width : "".concat(width, "px"),
        height: typeof height === 'string' ? height : "".concat(height, "px"),
        minHeight: typeof height === 'string' ? height : "".concat(height, "px"),
    };
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-icon',
            changeTypeToIconClassName(type),
            changeColorToClassName(fillColor),
        ], false).join(' '), role: 'button', onClick: onClick, onKeyDown: onClick, tabIndex: 0, style: iconStyle }, children || changeTypeToIconComponent(type)));
}
var IconTypes = Types;
var IconColors = Colors;

exports.IconColors = IconColors;
exports.IconTypes = IconTypes;
exports.default = Icon;
//# sourceMappingURL=Icon.js.map
