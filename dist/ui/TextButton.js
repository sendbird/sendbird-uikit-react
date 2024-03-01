import { c as __spreadArray } from '../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { C as Colors, c as changeColorToClassName } from '../chunks/bundle-nGuCRoDK.js';

var TextButton = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.color, color = _c === void 0 ? Colors.ONBACKGROUND_1 : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.disableUnderline, disableUnderline = _e === void 0 ? false : _e, _f = _a.onClick, onClick = _f === void 0 ? function () { } : _f, children = _a.children;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            changeColorToClassName(color),
            disableUnderline ? 'sendbird-textbutton--not-underline' : 'sendbird-textbutton',
            disabled ? 'sendbird-textbutton--disabled' : '',
        ], false).join(' '), role: "button", tabIndex: 0, onClick: function (e) { return onClick(e); }, onKeyPress: function (e) { return onClick(e); } }, children));
};

export { TextButton as default };
//# sourceMappingURL=TextButton.js.map
