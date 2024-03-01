import { c as __spreadArray } from '../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-kMMCn6GE.js';
import '../chunks/bundle-Tg3CrpQU.js';

function AdminMessage(_a) {
    var _b;
    var _c = _a.className, className = _c === void 0 ? '' : _c, message = _a.message;
    if (!((message === null || message === void 0 ? void 0 : message.isAdminMessage) || (message === null || message === void 0 ? void 0 : message.messageType)) || !((_b = message === null || message === void 0 ? void 0 : message.isAdminMessage) === null || _b === void 0 ? void 0 : _b.call(message)) || (message === null || message === void 0 ? void 0 : message.messageType) !== 'admin') {
        return null;
    }
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-admin-message',
        ], false).join(' ') },
        React__default.createElement(Label, { className: "sendbird-admin-message__text", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, message === null || message === void 0 ? void 0 : message.message)));
}

export { AdminMessage as default };
//# sourceMappingURL=AdminMessage.js.map
