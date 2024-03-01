'use strict';

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');

var SPACE_FROM_TRIGGER = 8;
function TooltipWrapper(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children, hoverTooltip = _a.hoverTooltip;
    var _c = React.useState(false), showHoverTooltip = _c[0], setShowHoverTooltip = _c[1];
    var childrenRef = React.useRef(null);
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-tooltip-wrapper',
        ], false).join(' '), onMouseOver: function () { setShowHoverTooltip(true); }, onFocus: function () { setShowHoverTooltip(true); }, onMouseOut: function () { setShowHoverTooltip(false); }, onBlur: function () { setShowHoverTooltip(false); } },
        React.createElement("div", { className: "sendbird-tooltip-wrapper__children", ref: childrenRef }, children),
        showHoverTooltip && (React.createElement("div", { className: "sendbird-tooltip-wrapper__hover-tooltip", style: { bottom: "calc(100% + ".concat(SPACE_FROM_TRIGGER, "px)") } },
            React.createElement("div", { className: "sendbird-tooltip-wrapper__hover-tooltip__inner" },
                React.createElement("div", { className: "sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container", style: { left: childrenRef.current && "calc(".concat(childrenRef.current.offsetWidth / 2, "px - 50%)") } }, hoverTooltip))))));
}

module.exports = TooltipWrapper;
//# sourceMappingURL=TooltipWrapper.js.map
