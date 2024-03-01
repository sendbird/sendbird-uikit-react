import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-sR62lMVk.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import TextButton from './TextButton.js';
import { w as getClassName, o as getUIKitFileType, t as truncateString } from '../chunks/bundle-Jwc7mleJ.js';
import { C as Colors } from '../chunks/bundle-nMxV4WMS.js';
import { u as useMediaQueryContext } from '../chunks/bundle-pjLq9qJd.js';
import '../chunks/bundle-xhjHZ041.js';
import '../chunks/bundle--MbN9aKT.js';
import '../chunks/bundle-IDH-OOHE.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-AN6QCsUL.js';

function FileMessageItemBody(_a) {
    var _b;
    var className = _a.className, message = _a.message, _c = _a.isByMe, isByMe = _c === void 0 ? false : _c, _d = _a.mouseHover, mouseHover = _d === void 0 ? false : _d, _e = _a.isReactionEnabled, isReactionEnabled = _e === void 0 ? false : _e, _f = _a.truncateLimit, truncateLimit = _f === void 0 ? null : _f;
    var isMobile = useMediaQueryContext().isMobile;
    var truncateMaxNum = truncateLimit || (isMobile ? 20 : null);
    return (React__default.createElement("div", { className: getClassName([
            className,
            'sendbird-file-message-item-body',
            isByMe ? 'outgoing' : 'incoming',
            mouseHover ? 'mouse-hover' : '',
            (isReactionEnabled && ((_b = message === null || message === void 0 ? void 0 : message.reactions) === null || _b === void 0 ? void 0 : _b.length) > 0) ? 'reactions' : '',
        ]) },
        React__default.createElement("div", { className: "sendbird-file-message-item-body__file-icon" },
            React__default.createElement(Icon, { className: "sendbird-file-message-item-body__file-icon__icon", type: {
                    IMAGE: IconTypes.PHOTO,
                    VIDEO: IconTypes.PLAY,
                    AUDIO: IconTypes.FILE_AUDIO,
                    GIF: IconTypes.GIF,
                    OTHERS: IconTypes.FILE_DOCUMENT,
                }[getUIKitFileType(message === null || message === void 0 ? void 0 : message.type)], fillColor: IconColors.PRIMARY, width: "24px", height: "24px" })),
        React__default.createElement(TextButton, { className: "sendbird-file-message-item-body__file-name", onClick: function () { window.open(message === null || message === void 0 ? void 0 : message.url); }, color: isByMe ? Colors.ONCONTENT_1 : Colors.ONBACKGROUND_1 },
            React__default.createElement(Label, { className: "sendbird-file-message-item-body__file-name__text", type: LabelTypography.BODY_1, color: isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1 }, truncateString((message === null || message === void 0 ? void 0 : message.name) || (message === null || message === void 0 ? void 0 : message.url), truncateMaxNum)))));
}

export { FileMessageItemBody as default };
//# sourceMappingURL=FileMessageItemBody.js.map
