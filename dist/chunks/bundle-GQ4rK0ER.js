import { c as __spreadArray } from './bundle-KMsJXUN2.js';
import React__default from 'react';
import { f as format } from './bundle-vbGNKQpe.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { c as LabelStringSet, L as Label, a as LabelTypography, b as LabelColors } from './bundle-kMMCn6GE.js';
import Loader from '../ui/Loader.js';
import { d as isImage, A as isGif, k as isVideo, C as isAudio, D as isVoiceMessageMimeType, E as isSentStatus } from './bundle-ZnLsMTHr.js';
import { getOutgoingMessageState, OutgoingMessageStates } from '../utils/message/getOutgoingMessageState.js';
import { i as isToday, a as isYesterday, b as isThisYear } from './bundle-vWrgNSvP.js';
import { u as useLocalization } from './bundle-msnuMA4R.js';

var getChannelTitle = function (channel, currentUserId, stringSet) {
    var _a;
    if (stringSet === void 0) { stringSet = LabelStringSet; }
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
    var channel = _a.channel, locale = _a.locale, _c = _a.stringSet, stringSet = _c === void 0 ? LabelStringSet : _c;
    var createdAt = (_b = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _b === void 0 ? void 0 : _b.createdAt;
    var optionalParam = locale ? { locale: locale } : null;
    if (!createdAt) {
        return '';
    }
    if (isToday(createdAt)) {
        return format(createdAt, 'p', optionalParam);
    }
    if (isYesterday(createdAt)) {
        return stringSet.MESSAGE_STATUS__YESTERDAY || 'Yesterday';
    }
    if (isThisYear(createdAt)) {
        return format(createdAt, 'MMM d', optionalParam);
    }
    return format(createdAt, 'yyyy/M/d', optionalParam);
};
var getTotalMembers = function (channel) { return ((channel === null || channel === void 0 ? void 0 : channel.memberCount) ? channel.memberCount : 0); };
var getChannelPreviewFileDisplayString = function (mimeType, stringSet) {
    var _a, _b, _c, _d, _e, _f;
    if (stringSet === void 0) { stringSet = LabelStringSet; }
    if (isGif(mimeType)) {
        return (_a = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GIF) !== null && _a !== void 0 ? _a : '';
    }
    if (isImage(mimeType)) {
        return (_b = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO) !== null && _b !== void 0 ? _b : '';
    }
    if (isVideo(mimeType)) {
        return (_c = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VIDEO) !== null && _c !== void 0 ? _c : '';
    }
    if (isAudio(mimeType)) {
        return (_d = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_AUDIO) !== null && _d !== void 0 ? _d : '';
    }
    if (isVoiceMessageMimeType(mimeType)) {
        return (_e = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VOICE_MESSAGE) !== null && _e !== void 0 ? _e : '';
    }
    return (_f = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GENERAL) !== null && _f !== void 0 ? _f : '';
};
var getPrettyLastMessage = function (message, stringSet) {
    var _a, _b, _c, _d;
    if (message === void 0) { message = null; }
    if (stringSet === void 0) { stringSet = LabelStringSet; }
    if (!message)
        return '';
    if (message.isFileMessage()) {
        return getChannelPreviewFileDisplayString(message.type, stringSet);
    }
    if (message.isMultipleFilesMessage()) {
        var mimeType = (_b = (_a = message.fileInfoList) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.mimeType;
        if (isImage(mimeType) || isGif(mimeType)) {
            return (_c = stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO) !== null && _c !== void 0 ? _c : '';
        }
        return getChannelPreviewFileDisplayString(mimeType, stringSet);
    }
    return (_d = message.message) !== null && _d !== void 0 ? _d : '';
};
var getLastMessage = function (channel, stringSet) {
    if (stringSet === void 0) { stringSet = LabelStringSet; }
    return (channel === null || channel === void 0 ? void 0 : channel.lastMessage) ? getPrettyLastMessage(channel === null || channel === void 0 ? void 0 : channel.lastMessage, stringSet) : '';
};
var getChannelUnreadMessageCount = function (channel) { return (channel === null || channel === void 0 ? void 0 : channel.unreadMessageCount) ? channel.unreadMessageCount : 0; };

var MessageStatusTypes = OutgoingMessageStates;
function MessageStatus(_a) {
    var _b, _c;
    var _d;
    var className = _a.className, message = _a.message, channel = _a.channel, _e = _a.isDateSeparatorConsidered, isDateSeparatorConsidered = _e === void 0 ? true : _e;
    var _f = useLocalization(), stringSet = _f.stringSet, dateLocale = _f.dateLocale;
    var status = getOutgoingMessageState(channel, message);
    var hideMessageStatusIcon = ((_d = channel === null || channel === void 0 ? void 0 : channel.isGroupChannel) === null || _d === void 0 ? void 0 : _d.call(channel)) && ((channel.isSuper || channel.isPublic || channel.isBroadcast)
        && !(status === OutgoingMessageStates.PENDING || status === OutgoingMessageStates.FAILED));
    var iconType = (_b = {},
        _b[OutgoingMessageStates.SENT] = IconTypes.DONE,
        _b[OutgoingMessageStates.DELIVERED] = IconTypes.DONE_ALL,
        _b[OutgoingMessageStates.READ] = IconTypes.DONE_ALL,
        _b[OutgoingMessageStates.FAILED] = IconTypes.ERROR,
        _b);
    var iconColor = (_c = {},
        _c[OutgoingMessageStates.SENT] = IconColors.SENT,
        _c[OutgoingMessageStates.DELIVERED] = IconColors.SENT,
        _c[OutgoingMessageStates.READ] = IconColors.READ,
        _c[OutgoingMessageStates.FAILED] = IconColors.ERROR,
        _c);
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-message-status',
        ], false).join(' ') },
        (status === OutgoingMessageStates.PENDING) ? (React__default.createElement(Loader, { className: "sendbird-message-status__icon", width: "16px", height: "16px" },
            React__default.createElement(Icon, { type: IconTypes.SPINNER, fillColor: IconColors.PRIMARY, width: "16px", height: "16px" }))) : (React__default.createElement(Icon, { className: "sendbird-message-status__icon ".concat(hideMessageStatusIcon ? 'hide-icon' : '', " ").concat(status === OutgoingMessageStates.FAILED ? '' : 'sendbird-message-status--sent'), type: iconType[status] || IconTypes.ERROR, fillColor: iconColor[status], width: "16px", height: "16px" })),
        isSentStatus(status) && (React__default.createElement(Label, { className: "sendbird-message-status__text", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, isDateSeparatorConsidered
            ? format((message === null || message === void 0 ? void 0 : message.createdAt) || 0, 'p', { locale: dateLocale })
            : getLastMessageCreatedAt({ channel: channel, locale: dateLocale, stringSet: stringSet })))));
}

export { MessageStatus as M, getTotalMembers as a, getLastMessageCreatedAt as b, getLastMessage as c, getChannelUnreadMessageCount as d, MessageStatusTypes as e, getChannelTitle as g };
//# sourceMappingURL=bundle-GQ4rK0ER.js.map
