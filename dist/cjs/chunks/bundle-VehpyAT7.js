'use strict';

var _tslib = require('./bundle-xbdnJE9-.js');
var React = require('react');
var index$1 = require('./bundle-KOig1nUx.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Label = require('./bundle-KkCwxjVN.js');
var ui_Loader = require('../ui/Loader.js');
var index$2 = require('./bundle-Uw6P-cM9.js');
var utils_message_getOutgoingMessageState = require('../utils/message/getOutgoingMessageState.js');
var index = require('./bundle-_wF3sJvp.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');

var getChannelTitle = function (channel, currentUserId, stringSet) {
    var _a;
    if (stringSet === void 0) { stringSet = ui_Label.LabelStringSet; }
    if (!(channel === null || channel === void 0 ? void 0 : channel.name) && !(channel === null || channel === void 0 ? void 0 : channel.members)) {
        return stringSet.NO_TITLE;
    }
    if ((channel === null || channel === void 0 ? void 0 : channel.name) && channel.name !== 'Group Channel') {
        return channel.name;
    }
    if (((_a = channel === null || channel === void 0 ? void 0 : channel.members) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        return stringSet.NO_MEMBERS;
    }
    return ((channel === null || channel === void 0 ? void 0 : channel.members) || [])
        .filter(function (_a) {
        var userId = _a.userId;
        return userId !== currentUserId;
    })
        .map(function (_a) {
        var nickname = _a.nickname;
        return nickname || stringSet.NO_NAME;
    })
        .join(', ');
};
var getLastMessageCreatedAt = function (_a) {
    var _b;
    var channel = _a.channel, locale = _a.locale, _c = _a.stringSet, stringSet = _c === void 0 ? ui_Label.LabelStringSet : _c;
    var createdAt = (_b = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _b === void 0 ? void 0 : _b.createdAt;
    var optionalParam = locale ? { locale: locale } : null;
    if (!createdAt) {
        return '';
    }
    if (index.isToday(createdAt)) {
        return index$1.format(createdAt, 'p', optionalParam);
    }
    if (index.isYesterday(createdAt)) {
        return stringSet.MESSAGE_STATUS__YESTERDAY || 'Yesterday';
    }
    if (index.isThisYear(createdAt)) {
        return index$1.format(createdAt, 'MMM d', optionalParam);
    }
    return index$1.format(createdAt, 'yyyy/M/d', optionalParam);
};
var getTotalMembers = function (channel) { return ((channel === null || channel === void 0 ? void 0 : channel.memberCount) ? channel.memberCount : 0); };
var getChannelPreviewFileDisplayString = function (mimeType, stringSet) {
    var _a, _b, _c, _d, _e, _f;
    if (stringSet === void 0) { stringSet = ui_Label.LabelStringSet; }
    if (index$2.isGif(mimeType)) {
        return (_a = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GIF) !== null && _a !== void 0 ? _a : '';
    }
    if (index$2.isImage(mimeType)) {
        return (_b = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO) !== null && _b !== void 0 ? _b : '';
    }
    if (index$2.isVideo(mimeType)) {
        return (_c = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VIDEO) !== null && _c !== void 0 ? _c : '';
    }
    if (index$2.isAudio(mimeType)) {
        return (_d = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_AUDIO) !== null && _d !== void 0 ? _d : '';
    }
    if (index$2.isVoiceMessageMimeType(mimeType)) {
        return (_e = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VOICE_MESSAGE) !== null && _e !== void 0 ? _e : '';
    }
    return (_f = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GENERAL) !== null && _f !== void 0 ? _f : '';
};
var getPrettyLastMessage = function (message, stringSet) {
    var _a, _b, _c, _d;
    if (message === void 0) { message = null; }
    if (stringSet === void 0) { stringSet = ui_Label.LabelStringSet; }
    if (!message)
        return '';
    if (message.isFileMessage()) {
        return getChannelPreviewFileDisplayString(message.type, stringSet);
    }
    if (message.isMultipleFilesMessage()) {
        var mimeType = (_b = (_a = message.fileInfoList) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.mimeType;
        if (index$2.isImage(mimeType) || index$2.isGif(mimeType)) {
            return (_c = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO) !== null && _c !== void 0 ? _c : '';
        }
        return getChannelPreviewFileDisplayString(mimeType, stringSet);
    }
    return (_d = message.message) !== null && _d !== void 0 ? _d : '';
};
var getLastMessage = function (channel, stringSet) {
    if (stringSet === void 0) { stringSet = ui_Label.LabelStringSet; }
    return (channel === null || channel === void 0 ? void 0 : channel.lastMessage) ? getPrettyLastMessage(channel === null || channel === void 0 ? void 0 : channel.lastMessage, stringSet) : '';
};
var getChannelUnreadMessageCount = function (channel) { return (channel === null || channel === void 0 ? void 0 : channel.unreadMessageCount) ? channel.unreadMessageCount : 0; };

var MessageStatusTypes = utils_message_getOutgoingMessageState.OutgoingMessageStates;
function MessageStatus(_a) {
    var _b, _c;
    var _d;
    var className = _a.className, message = _a.message, channel = _a.channel, _e = _a.isDateSeparatorConsidered, isDateSeparatorConsidered = _e === void 0 ? true : _e;
    var _f = LocalizationContext.useLocalization(), stringSet = _f.stringSet, dateLocale = _f.dateLocale;
    var status = utils_message_getOutgoingMessageState.getOutgoingMessageState(channel, message);
    var hideMessageStatusIcon = ((_d = channel === null || channel === void 0 ? void 0 : channel.isGroupChannel) === null || _d === void 0 ? void 0 : _d.call(channel)) && ((channel.isSuper || channel.isPublic || channel.isBroadcast)
        && !(status === utils_message_getOutgoingMessageState.OutgoingMessageStates.PENDING || status === utils_message_getOutgoingMessageState.OutgoingMessageStates.FAILED));
    var iconType = (_b = {},
        _b[utils_message_getOutgoingMessageState.OutgoingMessageStates.SENT] = ui_Icon.IconTypes.DONE,
        _b[utils_message_getOutgoingMessageState.OutgoingMessageStates.DELIVERED] = ui_Icon.IconTypes.DONE_ALL,
        _b[utils_message_getOutgoingMessageState.OutgoingMessageStates.READ] = ui_Icon.IconTypes.DONE_ALL,
        _b[utils_message_getOutgoingMessageState.OutgoingMessageStates.FAILED] = ui_Icon.IconTypes.ERROR,
        _b);
    var iconColor = (_c = {},
        _c[utils_message_getOutgoingMessageState.OutgoingMessageStates.SENT] = ui_Icon.IconColors.SENT,
        _c[utils_message_getOutgoingMessageState.OutgoingMessageStates.DELIVERED] = ui_Icon.IconColors.SENT,
        _c[utils_message_getOutgoingMessageState.OutgoingMessageStates.READ] = ui_Icon.IconColors.READ,
        _c[utils_message_getOutgoingMessageState.OutgoingMessageStates.FAILED] = ui_Icon.IconColors.ERROR,
        _c);
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-message-status',
        ], false).join(' ') },
        (status === utils_message_getOutgoingMessageState.OutgoingMessageStates.PENDING) ? (React.createElement(ui_Loader, { className: "sendbird-message-status__icon", width: "16px", height: "16px" },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" }))) : (React.createElement(ui_Icon.default, { className: "sendbird-message-status__icon ".concat(hideMessageStatusIcon ? 'hide-icon' : '', " ").concat(status === utils_message_getOutgoingMessageState.OutgoingMessageStates.FAILED ? '' : 'sendbird-message-status--sent'), type: iconType[status] || ui_Icon.IconTypes.ERROR, fillColor: iconColor[status], width: "16px", height: "16px" })),
        index$2.isSentStatus(status) && (React.createElement(ui_Label.Label, { className: "sendbird-message-status__text", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, isDateSeparatorConsidered
            ? index$1.format((message === null || message === void 0 ? void 0 : message.createdAt) || 0, 'p', { locale: dateLocale })
            : getLastMessageCreatedAt({ channel: channel, locale: dateLocale, stringSet: stringSet })))));
}

exports.MessageStatus = MessageStatus;
exports.MessageStatusTypes = MessageStatusTypes;
exports.getChannelTitle = getChannelTitle;
exports.getChannelUnreadMessageCount = getChannelUnreadMessageCount;
exports.getLastMessage = getLastMessage;
exports.getLastMessageCreatedAt = getLastMessageCreatedAt;
exports.getTotalMembers = getTotalMembers;
//# sourceMappingURL=bundle-VehpyAT7.js.map
