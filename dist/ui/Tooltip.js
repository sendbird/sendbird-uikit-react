import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';

function Tooltip(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.children, children = _c === void 0 ? '' : _c;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-tooltip',
        ], false).join(' ') },
        React__default.createElement(Label, { className: "sendbird-tooltip__text", type: LabelTypography.CAPTION_2, color: LabelColors.ONCONTENT_1 }, children)));
}

export { Tooltip as default };
//# sourceMappingURL=Tooltip.js.map
