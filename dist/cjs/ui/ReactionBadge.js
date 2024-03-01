'use strict';

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
require('../chunks/bundle-xYV6cL9E.js');

var ReactionBadge = React.forwardRef(function (props, ref) {
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
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            "sendbird-reaction-badge".concat(getClassNameTail()),
        ], false).join(' '), role: "button", ref: ref, onClick: onClick, onKeyDown: onClick, onTouchEnd: onClick, tabIndex: 0 },
        React.createElement("div", { className: "sendbird-reaction-badge__inner" },
            React.createElement("div", { className: "sendbird-reaction-badge__inner__icon" }, children),
            React.createElement(ui_Label.Label, { className: (children && count) && 'sendbird-reaction-badge__inner__count', type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_1 }, count))));
});

module.exports = ReactionBadge;
//# sourceMappingURL=ReactionBadge.js.map
