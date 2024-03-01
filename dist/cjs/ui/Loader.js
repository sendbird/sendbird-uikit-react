'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var ui_Icon = require('./Icon.js');
require('../chunks/bundle-QStqvuCY.js');

function Loader(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.width, width = _c === void 0 ? '26px' : _c, _d = _a.height, height = _d === void 0 ? '26px' : _d, children = _a.children;
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-loader',
        ], false).join(' '), style: {
            width: typeof width === 'string' ? width : "".concat(width, "px"),
            height: typeof height === 'string' ? height : "".concat(height, "px"),
        } }, children
        || (React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.SPINNER, width: "26px", height: "26px" }))));
}

module.exports = Loader;
//# sourceMappingURL=Loader.js.map
