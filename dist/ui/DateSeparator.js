import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { C as Colors, c as changeColorToClassName } from '../chunks/bundle-02rQraFs.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';

var DateSeparator = function (_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.separatorColor, separatorColor = _d === void 0 ? Colors.ONBACKGROUND_4 : _d;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-separator',
        ], false).join(' ') },
        React__default.createElement("div", { className: ['sendbird-separator__left', "".concat(changeColorToClassName(separatorColor), "--background-color")].join(' ') }),
        React__default.createElement("div", { className: "sendbird-separator__text" }, children
            || (React__default.createElement(Label, { type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, "Date Separator"))),
        React__default.createElement("div", { className: ['sendbird-separator__right', "".concat(changeColorToClassName(separatorColor), "--background-color")].join(' ') })));
};

export { DateSeparator as default };
//# sourceMappingURL=DateSeparator.js.map
