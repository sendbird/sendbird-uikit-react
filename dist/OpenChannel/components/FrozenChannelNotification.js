import React__default, { useContext } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-1inZXcUV.js';
import { L as Label, a as LabelTypography } from '../../chunks/bundle-sR62lMVk.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-xhjHZ041.js';

var FrozenNotification = function () {
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-frozen-channel-notification" },
        React__default.createElement(Label, { className: "sendbird-frozen-channel-notification__text", type: LabelTypography.CAPTION_2 }, stringSet.CHANNEL_FROZEN)));
};

export { FrozenNotification as default };
//# sourceMappingURL=FrozenChannelNotification.js.map
