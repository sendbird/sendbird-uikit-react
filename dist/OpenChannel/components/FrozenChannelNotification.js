import React__default, { useContext } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { L as Label, a as LabelTypography } from '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-UnAcr6wX.js';

var FrozenNotification = function () {
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-frozen-channel-notification" },
        React__default.createElement(Label, { className: "sendbird-frozen-channel-notification__text", type: LabelTypography.CAPTION_2 }, stringSet.CHANNEL_FROZEN)));
};

export { FrozenNotification as default };
//# sourceMappingURL=FrozenChannelNotification.js.map
