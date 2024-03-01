'use strict';

var React = require('react');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-KkCwxjVN.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var LocalizationContext = require('../chunks/bundle-WKa05h0_.js');
var index = require('../chunks/bundle-Uw6P-cM9.js');
var utils = require('../chunks/bundle--4Ob_RGQ.js');
require('../chunks/bundle-xbdnJE9-.js');
require('../chunks/bundle-jCTpndN0.js');
require('../chunks/bundle-Yzhiyr0t.js');
require('../chunks/bundle-HY8cubCp.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-tNuJSOqI.js');

function QuoteMessage(_a) {
    var _b;
    var _c, _d, _e, _f, _g, _h;
    var message = _a.message, _j = _a.userId, userId = _j === void 0 ? '' : _j, _k = _a.isByMe, isByMe = _k === void 0 ? false : _k, _l = _a.className, className = _l === void 0 ? '' : _l, _m = _a.isUnavailable, isUnavailable = _m === void 0 ? false : _m, onClick = _a.onClick;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var parentMessage = message.parentMessage;
    var parentMessageSender = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender;
    var parentMessageSenderNickname = (userId === (parentMessageSender === null || parentMessageSender === void 0 ? void 0 : parentMessageSender.userId)) ? stringSet.QUOTED_MESSAGE__CURRENT_USER : parentMessageSender === null || parentMessageSender === void 0 ? void 0 : parentMessageSender.nickname;
    var parentMessageUrl = utils.getMessageFirstFileUrl(parentMessage);
    var parentMessageType = utils.getMessageFirstFileType(parentMessage);
    var currentMessageSenderNickname = (userId === ((_c = message === null || message === void 0 ? void 0 : message.sender) === null || _c === void 0 ? void 0 : _c.userId)) ? stringSet.QUOTED_MESSAGE__CURRENT_USER : (_d = message === null || message === void 0 ? void 0 : message.sender) === null || _d === void 0 ? void 0 : _d.nickname;
    var _o = React.useState(false), isThumbnailLoaded = _o[0], setThumbnailLoaded = _o[1];
    var uikitFileTypes = index.getUIKitFileTypes();
    var splitFileName = (_f = (_e = utils.getMessageFirstFileName(parentMessage)) === null || _e === void 0 ? void 0 : _e.split('/')) !== null && _f !== void 0 ? _f : parentMessageUrl.split('/');
    return (React.createElement("div", { className: index.getClassName([className, 'sendbird-quote-message', isByMe ? 'outgoing' : 'incoming', isUnavailable ? 'unavailable' : '']), key: parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.messageId, onClick: function () {
            if (!isUnavailable && onClick) {
                onClick();
            }
        }, onTouchEnd: function () {
            if (!isUnavailable && onClick) {
                onClick();
            }
        } },
        React.createElement("div", { className: "sendbird-quote-message__replied-to" },
            React.createElement(ui_Icon.default, { className: "sendbird-quote-message__replied-to__icon", type: ui_Icon.IconTypes.REPLY, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "12px", height: "12px" }),
            React.createElement(ui_Label.Label, { className: "sendbird-quote-message__replied-to__text", type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_3 },
                React.createElement("span", { className: "sendbird-quote-message__replied-to__text__nickname" }, currentMessageSenderNickname),
                React.createElement("span", { className: "sendbird-quote-message__replied-to__text__text" }, stringSet.QUOTED_MESSAGE__REPLIED_TO),
                React.createElement("span", { className: "sendbird-quote-message__replied-to__text__nickname" }, parentMessageSenderNickname))),
        React.createElement("div", { className: "sendbird-quote-message__replied-message" },
            isUnavailable && (React.createElement("div", { className: "sendbird-quote-message__replied-message__text-message" },
                React.createElement(ui_Label.Label, { className: "sendbird-quote-message__replied-message__text-message__word", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.QUOTED_MESSAGE__UNAVAILABLE))),
            ((index.isUserMessage(parentMessage) && ((_g = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.message) === null || _g === void 0 ? void 0 : _g.length) > 0) && !isUnavailable) && (React.createElement("div", { className: "sendbird-quote-message__replied-message__text-message" },
                React.createElement(ui_Label.Label, { className: "sendbird-quote-message__replied-message__text-message__word", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.message))),
            (index.isVoiceMessage(parentMessage) && parentMessageUrl && !isUnavailable) && (React.createElement("div", { className: "sendbird-quote-message__replied-message__text-message" },
                React.createElement(ui_Label.Label, { className: "sendbird-quote-message__replied-message__text-message__word", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.VOICE_MESSAGE))),
            ((index.isThumbnailMessage(parentMessage)
                || index.isMultipleFilesMessage(parentMessage))
                && parentMessageUrl
                && !isUnavailable) && (React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message" },
                React.createElement(ui_ImageRenderer.default, { className: "sendbird-quote-message__replied-message__thumbnail-message__image", url: parentMessageUrl, alt: parentMessageType, width: "144px", height: "108px", onLoad: function () { return setThumbnailLoaded(true); }, defaultComponent: (React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__placeholder" },
                        React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__placeholder__icon" },
                            React.createElement(ui_Icon.default, { type: index.isVideo(parentMessageType) ? ui_Icon.IconTypes.PLAY : ui_Icon.IconTypes.PHOTO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "22px", height: "22px" })))) }),
                (index.isVideo(parentMessageType) && !(((_h = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.thumbnails) === null || _h === void 0 ? void 0 : _h.length) > 0)) && (React.createElement(React.Fragment, null,
                    React.createElement("video", { className: "sendbird-quote-message__replied-message__thumbnail-message__video" },
                        React.createElement("source", { src: parentMessageUrl, type: parentMessageType })),
                    React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover" },
                        React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover__icon" },
                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.PLAY, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "14px", height: "14px" }))))),
                (isThumbnailLoaded && index.isGif(parentMessageType)) && (React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover" },
                    React.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover__icon" },
                        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.GIF, fillColor: ui_Icon.IconColors.THUMBNAIL_ICON, width: "14px", height: "14px" })))))),
            (index.getUIKitMessageType(parentMessage) === index.UIKitMessageTypes.FILE && parentMessageUrl && !isUnavailable) && (React.createElement("div", { className: "sendbird-quote-message__replied-message__file-message" },
                React.createElement(ui_Icon.default, { className: "sendbird-quote-message__replied-message__file-message__type-icon", type: (_b = {},
                        _b[uikitFileTypes.IMAGE] = ui_Icon.IconTypes.PHOTO,
                        _b[uikitFileTypes.VIDEO] = ui_Icon.IconTypes.PLAY,
                        _b[uikitFileTypes.AUDIO] = ui_Icon.IconTypes.FILE_AUDIO,
                        _b[uikitFileTypes.GIF] = ui_Icon.IconTypes.GIF,
                        _b[uikitFileTypes.OTHERS] = ui_Icon.IconTypes.FILE_DOCUMENT,
                        _b)[index.getUIKitFileType(parentMessageType)], fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "16px", height: "16px" }),
                React.createElement(ui_Label.Label, { className: "sendbird-quote-message__replied-message__file-message__file-name", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_3 }, index.truncateString(splitFileName[splitFileName.length - 1])))))));
}

module.exports = QuoteMessage;
//# sourceMappingURL=QuoteMessage.js.map
