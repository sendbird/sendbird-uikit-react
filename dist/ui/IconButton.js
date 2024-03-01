import { c as __spreadArray, _ as __assign } from '../chunks/bundle-UnAcr6wX.js';
import React__default, { useState } from 'react';

var IconButton = React__default.forwardRef(function (props, ref) {
    var _a = props.className, className = _a === void 0 ? '' : _a, children = props.children, _b = props.disabled, disabled = _b === void 0 ? false : _b, _c = props.width, width = _c === void 0 ? '56px' : _c, _d = props.height, height = _d === void 0 ? '56px' : _d, _e = props.type, type = _e === void 0 ? 'button' : _e, _f = props.style, style = _f === void 0 ? {} : _f, _g = props.onBlur, onBlur = _g === void 0 ? function () { } : _g, _h = props.onClick, onClick = _h === void 0 ? function () { } : _h;
    var _j = useState(false), isPressed = _j[0], setIsPressed = _j[1];
    return (React__default.createElement("button", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-iconbutton',
            isPressed ? 'sendbird-iconbutton--pressed' : '',
        ], false).join(' '), disabled: disabled, ref: ref, type: type, style: __assign(__assign({}, style), { height: height, width: width }), onClick: function (e) {
            if (disabled) {
                return;
            }
            setIsPressed(true);
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
        }, onBlur: function (e) {
            setIsPressed(false);
            onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
        } },
        React__default.createElement("span", { className: "sendbird-iconbutton__inner" }, children)));
});

export { IconButton as default };
//# sourceMappingURL=IconButton.js.map
