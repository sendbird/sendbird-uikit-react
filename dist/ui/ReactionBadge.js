import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';

var ReactionBadge = React__default.forwardRef(function (props, ref) {
    var _a = props.className, className = _a === void 0 ? '' : _a, children = props.children, _b = props.count, count = _b === void 0 ? '' : _b, _c = props.isAdd, isAdd = _c === void 0 ? false : _c, _d = props.selected, selected = _d === void 0 ? false : _d, _e = props.onClick, onClick = _e === void 0 ? function () { } : _e;
    var getClassNameTail = function () {
        if (selected && !isAdd) {
            return '--selected';
        }
        if (isAdd) {
            return '--is-add';
        }
        return '';
    };
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            "sendbird-reaction-badge".concat(getClassNameTail()),
        ], false).join(' '), role: "button", ref: ref, onClick: onClick, onKeyDown: onClick, onTouchEnd: onClick, tabIndex: 0 },
        React__default.createElement("div", { className: "sendbird-reaction-badge__inner" },
            React__default.createElement("div", { className: "sendbird-reaction-badge__inner__icon" }, children),
            React__default.createElement(Label, { className: (children && count) && 'sendbird-reaction-badge__inner__count', type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_1 }, count))));
});

export { ReactionBadge as default };
//# sourceMappingURL=ReactionBadge.js.map
