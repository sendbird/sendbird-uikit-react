import React__default, { useContext } from 'react';
import Icon, { IconTypes, IconColors } from './Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-kMMCn6GE.js';
import { L as LocalizationContext } from '../chunks/bundle-msnuMA4R.js';
import '../chunks/bundle-KMsJXUN2.js';
import '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '../chunks/bundle-CsWYoRVd.js';

function ConnectionStatus() {
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-connection-status" },
        React__default.createElement(Label, { type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_2 }, stringSet.TRYING_TO_CONNECT),
        React__default.createElement(Icon, { type: IconTypes.DISCONNECTED, fillColor: IconColors.SENT, width: "14px", height: "14px" })));
}

export { ConnectionStatus as default };
//# sourceMappingURL=ConnectionStatus.js.map
