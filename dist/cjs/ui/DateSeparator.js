'use strict';

var _tslib = require('../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var color = require('../chunks/bundle-0uk8Bfy0.js');
var ui_Label = require('../chunks/bundle-KkCwxjVN.js');
require('../chunks/bundle-Yzhiyr0t.js');

var DateSeparator = function (_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.separatorColor, separatorColor = _d === void 0 ? color.Colors.ONBACKGROUND_4 : _d;
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-separator',
        ], false).join(' ') },
        React.createElement("div", { className: ['sendbird-separator__left', "".concat(color.changeColorToClassName(separatorColor), "--background-color")].join(' ') }),
        React.createElement("div", { className: "sendbird-separator__text" }, children
            || (React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, "Date Separator"))),
        React.createElement("div", { className: ['sendbird-separator__right', "".concat(color.changeColorToClassName(separatorColor), "--background-color")].join(' ') })));
};

module.exports = DateSeparator;
//# sourceMappingURL=DateSeparator.js.map
