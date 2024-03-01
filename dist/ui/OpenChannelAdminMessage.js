import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';

function OpenChannelAdminMessage(_a) {
    var className = _a.className, message = _a.message;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-openchannel-admin-message',
        ], false).join(' ') },
        React__default.createElement(Label, { className: "sendbird-openchannel-admin-message__text", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, message.message || '')));
}

export { OpenChannelAdminMessage as default };
//# sourceMappingURL=OpenChannelAdminMessage.js.map
