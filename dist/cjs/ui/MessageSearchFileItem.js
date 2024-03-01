'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var index$1 = require('../chunks/bundle-Ny3NKw-X.js');
var index = require('../chunks/bundle-Z1maM5mk.js');
var index$2 = require('../chunks/bundle-wzulmlgb.js');
var utils = require('../chunks/bundle-38g4arE5.js');
require('./ImageRenderer.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-uGaTvmsl.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-LQQkMjKl.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');

function getCreatedAt(_a) {
    var createdAt = _a.createdAt, locale = _a.locale, stringSet = _a.stringSet;
    var optionalParam = locale ? { locale: locale } : null;
    if (!createdAt) {
        return '';
    }
    if (index.isToday(createdAt)) {
        return index$1.format(createdAt, 'p', optionalParam);
    }
    if (index.isYesterday(createdAt)) {
        return (stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_STATUS__YESTERDAY) || 'Yesterday';
    }
    if (index.isThisYear(createdAt)) {
        return index$1.format(createdAt, 'MMM d', optionalParam);
    }
    return index$1.format(createdAt, 'yyyy/M/d', optionalParam);
}
function getIconOfFileType(message) {
    var _a, _b, _c;
    var fileMessageUrl = (_a = utils.getMessageFirstFileUrl(message)) !== null && _a !== void 0 ? _a : '';
    var fileExtension = (_c = (_b = (fileMessageUrl.match(/\.([^.]*?)(?=\?|#|$)/))) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : '';
    if (/(jpg|jpeg|png)$/i.test(fileExtension)) {
        return ui_Icon.IconTypes.PHOTO;
    }
    else if (/mp4$/i.test(fileExtension) || index$2.isVoiceMessage(message)) {
        return ui_Icon.IconTypes.PLAY;
    }
    else if (/mp3/i.test(fileExtension)) {
        return ui_Icon.IconTypes.FILE_AUDIO;
    }
    else if (/gif/i.test(fileExtension)) {
        return ui_Icon.IconTypes.GIF;
    }
    else {
        return ui_Icon.IconTypes.FILE_DOCUMENT;
    }
}

function MessageSearchFileItem(props) {
    var className = props.className, message = props.message, selected = props.selected, onClick = props.onClick;
    var createdAt = message.createdAt;
    var url = utils.getMessageFirstFileUrl(message);
    var name = utils.getMessageFirstFileName(message);
    // @ts-ignore
    var sender = message.sender || message._sender;
    var profileUrl = sender.profileUrl, nickname = sender.nickname;
    var _a = LocalizationContext.useLocalization(), stringSet = _a.stringSet, dateLocale = _a.dateLocale;
    var isVoiceMsg = index$2.isVoiceMessage(message);
    var prettyFilename = isVoiceMsg ? stringSet.VOICE_MESSAGE : (name || url);
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-message-search-file-item',
            selected ? 'sendbird-message-search-file-item--selected' : '',
        ], false).join(' '), onClick: function (e) {
            e.stopPropagation();
            onClick(message);
        } },
        React.createElement("div", { className: "sendbird-message-search-file-item__left" },
            React.createElement(ui_Avatar.Avatar, { className: "sendbird-message-search-file-item__left__sender-avatar", src: profileUrl, alt: "profile image", width: "56px", height: "56px" })),
        React.createElement("div", { className: "sendbird-message-search-file-item__right" },
            React.createElement(ui_Label.Label, { className: "sendbird-message-search-file-item__right__sender-name", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, nickname || stringSet.NO_NAME),
            React.createElement("div", { className: "sendbird-message-search-file-item__right__content" },
                !isVoiceMsg && (React.createElement("div", { className: 'sendbird-message-search-file-item__right__content__type-icon' },
                    React.createElement(ui_Icon.default, { type: getIconOfFileType(message), fillColor: ui_Icon.IconColors.PRIMARY, width: "18px", height: "18px" }))),
                React.createElement(ui_Label.Label, { className: "sendbird-message-search-file-item__right__content__url", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, prettyFilename))),
        React.createElement(ui_Label.Label, { className: "sendbird-message-search-file-item__message-created-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, getCreatedAt({ createdAt: createdAt, locale: dateLocale, stringSet: stringSet })),
        React.createElement("div", { className: "sendbird-message-search-file-item__right-footer" })));
}

module.exports = MessageSearchFileItem;
//# sourceMappingURL=MessageSearchFileItem.js.map
