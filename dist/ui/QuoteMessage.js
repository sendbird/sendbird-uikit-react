import React__default, { useContext, useState } from 'react';
import Icon, { IconTypes, IconColors } from './Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-sR62lMVk.js';
import ImageRenderer from './ImageRenderer.js';
import { L as LocalizationContext } from '../chunks/bundle-1inZXcUV.js';
import { z as getUIKitFileTypes, w as getClassName, l as isUserMessage, i as isVoiceMessage, p as isThumbnailMessage, c as isMultipleFilesMessage, k as isVideo, A as isGif, m as getUIKitMessageType, U as UIKitMessageTypes, o as getUIKitFileType, t as truncateString } from '../chunks/bundle-Jwc7mleJ.js';
import { g as getMessageFirstFileUrl, a as getMessageFirstFileType, b as getMessageFirstFileName } from '../chunks/bundle-NGtuBFFS.js';
import '../chunks/bundle-xhjHZ041.js';
import '../chunks/bundle-IDH-OOHE.js';
import '../chunks/bundle--MbN9aKT.js';
import '../chunks/bundle-V_fO-GlK.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-AN6QCsUL.js';

function QuoteMessage(_a) {
    var _b;
    var _c, _d, _e, _f, _g, _h;
    var message = _a.message, _j = _a.userId, userId = _j === void 0 ? '' : _j, _k = _a.isByMe, isByMe = _k === void 0 ? false : _k, _l = _a.className, className = _l === void 0 ? '' : _l, _m = _a.isUnavailable, isUnavailable = _m === void 0 ? false : _m, onClick = _a.onClick;
    var stringSet = useContext(LocalizationContext).stringSet;
    var parentMessage = message.parentMessage;
    var parentMessageSender = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.sender;
    var parentMessageSenderNickname = (userId === (parentMessageSender === null || parentMessageSender === void 0 ? void 0 : parentMessageSender.userId)) ? stringSet.QUOTED_MESSAGE__CURRENT_USER : parentMessageSender === null || parentMessageSender === void 0 ? void 0 : parentMessageSender.nickname;
    var parentMessageUrl = getMessageFirstFileUrl(parentMessage);
    var parentMessageType = getMessageFirstFileType(parentMessage);
    var currentMessageSenderNickname = (userId === ((_c = message === null || message === void 0 ? void 0 : message.sender) === null || _c === void 0 ? void 0 : _c.userId)) ? stringSet.QUOTED_MESSAGE__CURRENT_USER : (_d = message === null || message === void 0 ? void 0 : message.sender) === null || _d === void 0 ? void 0 : _d.nickname;
    var _o = useState(false), isThumbnailLoaded = _o[0], setThumbnailLoaded = _o[1];
    var uikitFileTypes = getUIKitFileTypes();
    var splitFileName = (_f = (_e = getMessageFirstFileName(parentMessage)) === null || _e === void 0 ? void 0 : _e.split('/')) !== null && _f !== void 0 ? _f : parentMessageUrl.split('/');
    return (React__default.createElement("div", { className: getClassName([className, 'sendbird-quote-message', isByMe ? 'outgoing' : 'incoming', isUnavailable ? 'unavailable' : '']), key: parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.messageId, onClick: function () {
            if (!isUnavailable && onClick) {
                onClick();
            }
        }, onTouchEnd: function () {
            if (!isUnavailable && onClick) {
                onClick();
            }
        } },
        React__default.createElement("div", { className: "sendbird-quote-message__replied-to" },
            React__default.createElement(Icon, { className: "sendbird-quote-message__replied-to__icon", type: IconTypes.REPLY, fillColor: IconColors.ON_BACKGROUND_3, width: "12px", height: "12px" }),
            React__default.createElement(Label, { className: "sendbird-quote-message__replied-to__text", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_3 },
                React__default.createElement("span", { className: "sendbird-quote-message__replied-to__text__nickname" }, currentMessageSenderNickname),
                React__default.createElement("span", { className: "sendbird-quote-message__replied-to__text__text" }, stringSet.QUOTED_MESSAGE__REPLIED_TO),
                React__default.createElement("span", { className: "sendbird-quote-message__replied-to__text__nickname" }, parentMessageSenderNickname))),
        React__default.createElement("div", { className: "sendbird-quote-message__replied-message" },
            isUnavailable && (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__text-message" },
                React__default.createElement(Label, { className: "sendbird-quote-message__replied-message__text-message__word", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.QUOTED_MESSAGE__UNAVAILABLE))),
            ((isUserMessage(parentMessage) && ((_g = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.message) === null || _g === void 0 ? void 0 : _g.length) > 0) && !isUnavailable) && (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__text-message" },
                React__default.createElement(Label, { className: "sendbird-quote-message__replied-message__text-message__word", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_1 }, parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.message))),
            (isVoiceMessage(parentMessage) && parentMessageUrl && !isUnavailable) && (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__text-message" },
                React__default.createElement(Label, { className: "sendbird-quote-message__replied-message__text-message__word", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.VOICE_MESSAGE))),
            ((isThumbnailMessage(parentMessage)
                || isMultipleFilesMessage(parentMessage))
                && parentMessageUrl
                && !isUnavailable) && (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message" },
                React__default.createElement(ImageRenderer, { className: "sendbird-quote-message__replied-message__thumbnail-message__image", url: parentMessageUrl, alt: parentMessageType, width: "144px", height: "108px", onLoad: function () { return setThumbnailLoaded(true); }, defaultComponent: (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__placeholder" },
                        React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__placeholder__icon" },
                            React__default.createElement(Icon, { type: isVideo(parentMessageType) ? IconTypes.PLAY : IconTypes.PHOTO, fillColor: IconColors.ON_BACKGROUND_2, width: "22px", height: "22px" })))) }),
                (isVideo(parentMessageType) && !(((_h = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.thumbnails) === null || _h === void 0 ? void 0 : _h.length) > 0)) && (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement("video", { className: "sendbird-quote-message__replied-message__thumbnail-message__video" },
                        React__default.createElement("source", { src: parentMessageUrl, type: parentMessageType })),
                    React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover" },
                        React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover__icon" },
                            React__default.createElement(Icon, { type: IconTypes.PLAY, fillColor: IconColors.ON_BACKGROUND_2, width: "14px", height: "14px" }))))),
                (isThumbnailLoaded && isGif(parentMessageType)) && (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover" },
                    React__default.createElement("div", { className: "sendbird-quote-message__replied-message__thumbnail-message__cover__icon" },
                        React__default.createElement(Icon, { type: IconTypes.GIF, fillColor: IconColors.THUMBNAIL_ICON, width: "14px", height: "14px" })))))),
            (getUIKitMessageType(parentMessage) === UIKitMessageTypes.FILE && parentMessageUrl && !isUnavailable) && (React__default.createElement("div", { className: "sendbird-quote-message__replied-message__file-message" },
                React__default.createElement(Icon, { className: "sendbird-quote-message__replied-message__file-message__type-icon", type: (_b = {},
                        _b[uikitFileTypes.IMAGE] = IconTypes.PHOTO,
                        _b[uikitFileTypes.VIDEO] = IconTypes.PLAY,
                        _b[uikitFileTypes.AUDIO] = IconTypes.FILE_AUDIO,
                        _b[uikitFileTypes.GIF] = IconTypes.GIF,
                        _b[uikitFileTypes.OTHERS] = IconTypes.FILE_DOCUMENT,
                        _b)[getUIKitFileType(parentMessageType)], fillColor: IconColors.ON_BACKGROUND_3, width: "16px", height: "16px" }),
                React__default.createElement(Label, { className: "sendbird-quote-message__replied-message__file-message__file-name", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_3 }, truncateString(splitFileName[splitFileName.length - 1])))))));
}

export { QuoteMessage as default };
//# sourceMappingURL=QuoteMessage.js.map
