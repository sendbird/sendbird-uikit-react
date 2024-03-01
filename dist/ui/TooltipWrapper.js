import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default, { useState, useRef } from 'react';

var SPACE_FROM_TRIGGER = 8;
function TooltipWrapper(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, hoverTooltip = _a.hoverTooltip;
    var _c = useState(false), showHoverTooltip = _c[0], setShowHoverTooltip = _c[1];
    var childrenRef = useRef(null);
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-tooltip-wrapper',
        ], false).join(' '), onMouseOver: function () { setShowHoverTooltip(true); }, onFocus: function () { setShowHoverTooltip(true); }, onMouseOut: function () { setShowHoverTooltip(false); }, onBlur: function () { setShowHoverTooltip(false); } },
        React__default.createElement("div", { className: "sendbird-tooltip-wrapper__children", ref: childrenRef }, children),
        showHoverTooltip && (React__default.createElement("div", { className: "sendbird-tooltip-wrapper__hover-tooltip", style: { bottom: "calc(100% + ".concat(SPACE_FROM_TRIGGER, "px)") } },
            React__default.createElement("div", { className: "sendbird-tooltip-wrapper__hover-tooltip__inner" },
                React__default.createElement("div", { className: "sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container", style: { left: childrenRef.current && "calc(".concat(childrenRef.current.offsetWidth / 2, "px - 50%)") } }, hoverTooltip))))));
}

export { TooltipWrapper as default };
//# sourceMappingURL=TooltipWrapper.js.map
