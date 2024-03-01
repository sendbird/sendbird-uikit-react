import { _ as __assign } from '../chunks/bundle-xhjHZ041.js';
import React__default, { useState } from 'react';
import Icon, { IconTypes, IconColors } from './Icon.js';
import ImageRenderer from './ImageRenderer.js';
import { q as isSentMessage, w as getClassName, r as isVideoMessage, s as isGifMessage } from '../chunks/bundle-Jwc7mleJ.js';
import { n as noop } from '../chunks/bundle-IDH-OOHE.js';
import { u as useLongPress } from '../chunks/bundle-FgXHPuhY.js';
import { c as getMessageFirstFileThumbnailUrl, g as getMessageFirstFileUrl, a as getMessageFirstFileType } from '../chunks/bundle-NGtuBFFS.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-AN6QCsUL.js';
import '../chunks/bundle-pjLq9qJd.js';

function ThumbnailMessageItemBody(_a) {
    var _b, _c;
    var _d = _a.className, className = _d === void 0 ? '' : _d, message = _a.message, _e = _a.isByMe, isByMe = _e === void 0 ? false : _e, _f = _a.mouseHover, mouseHover = _f === void 0 ? false : _f, _g = _a.isReactionEnabled, isReactionEnabled = _g === void 0 ? false : _g, _h = _a.showFileViewer, showFileViewer = _h === void 0 ? noop : _h, _j = _a.style, style = _j === void 0 ? {} : _j;
    var thumbnailUrl = getMessageFirstFileThumbnailUrl(message);
    var _k = useState(false), imageRendered = _k[0], setImageRendered = _k[1];
    var onClickHandler = useLongPress({
        onLongPress: noop,
        onClick: function () {
            if (isSentMessage(message)) {
                showFileViewer === null || showFileViewer === void 0 ? void 0 : showFileViewer(true);
            }
        },
    });
    return (React__default.createElement("div", __assign({ className: getClassName([
            className,
            'sendbird-thumbnail-message-item-body',
            isByMe ? 'outgoing' : 'incoming',
            mouseHover ? 'mouse-hover' : '',
            (isReactionEnabled && ((_c = (_b = message.reactions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0) ? 'reactions' : '',
        ]) }, onClickHandler),
        React__default.createElement(ImageRenderer, { className: "sendbird-thumbnail-message-item-body__thumbnail", url: thumbnailUrl || getMessageFirstFileUrl(message), alt: getMessageFirstFileType(message), width: (style === null || style === void 0 ? void 0 : style.width) || '360px', height: (style === null || style === void 0 ? void 0 : style.height) || '270px', onLoad: function () { setImageRendered(true); }, placeHolder: function (_a) {
                var style = _a.style;
                return (React__default.createElement("div", { className: "sendbird-thumbnail-message-item-body__placeholder", style: style }));
            } }),
        (isVideoMessage(message) && !thumbnailUrl) && !imageRendered && (React__default.createElement("video", { className: "sendbird-thumbnail-message-item-body__video" },
            React__default.createElement("source", { src: getMessageFirstFileUrl(message), type: getMessageFirstFileType(message) }))),
        React__default.createElement("div", { className: "sendbird-thumbnail-message-item-body__image-cover" }),
        (isVideoMessage(message) || isGifMessage(message)) && (React__default.createElement("div", { className: "sendbird-thumbnail-message-item-body__icon-wrapper" },
            React__default.createElement("div", { className: "sendbird-thumbnail-message-item-body__icon-wrapper__icon" },
                React__default.createElement(Icon, { type: isVideoMessage(message) ? IconTypes.PLAY : IconTypes.GIF, fillColor: IconColors.THUMBNAIL_ICON, width: "34px", height: "34px" }))))));
}

export { ThumbnailMessageItemBody as default };
//# sourceMappingURL=ThumbnailMessageItemBody.js.map
