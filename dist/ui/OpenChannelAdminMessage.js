import { c as __spreadArray } from '../chunks/bundle-xhjHZ041.js';
import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-sR62lMVk.js';
import '../chunks/bundle--MbN9aKT.js';

function OpenChannelAdminMessage(_a) {
    var className = _a.className, message = _a.message;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-openchannel-admin-message',
        ], false).join(' ') },
        React__default.createElement(Label, { className: "sendbird-openchannel-admin-message__text", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, message.message || '')));
}

export { OpenChannelAdminMessage as default };
//# sourceMappingURL=OpenChannelAdminMessage.js.map
