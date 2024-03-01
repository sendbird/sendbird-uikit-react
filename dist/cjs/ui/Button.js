'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
require('../chunks/bundle-xYV6cL9E.js');

exports.ButtonTypes = void 0;
(function (ButtonTypes) {
    ButtonTypes["PRIMARY"] = "PRIMARY";
    ButtonTypes["SECONDARY"] = "SECONDARY";
    ButtonTypes["DANGER"] = "DANGER";
    ButtonTypes["DISABLED"] = "DISABLED";
    ButtonTypes["WARNING"] = "WARNING";
})(exports.ButtonTypes || (exports.ButtonTypes = {}));
exports.ButtonSizes = void 0;
(function (ButtonSizes) {
    ButtonSizes["BIG"] = "BIG";
    ButtonSizes["SMALL"] = "SMALL";
})(exports.ButtonSizes || (exports.ButtonSizes = {}));

function changeTypeToClassName(type) {
    switch (type) {
        case exports.ButtonTypes.PRIMARY: return 'sendbird-button--primary';
        case exports.ButtonTypes.SECONDARY: return 'sendbird-button--secondary';
        case exports.ButtonTypes.DANGER: return 'sendbird-button--danger';
        case exports.ButtonTypes.DISABLED: return 'sendbird-button--disabled';
        case exports.ButtonTypes.WARNING: return 'sendbird-button--warning';
        default: return null;
    }
}
function changeSizeToClassName(size) {
    switch (size) {
        case exports.ButtonSizes.BIG: return 'sendbird-button--big';
        case exports.ButtonSizes.SMALL: return 'sendbird-button--small';
        default: return null;
    }
}

function Button(_a) {
    var className = _a.className, _b = _a.type, type = _b === void 0 ? exports.ButtonTypes.PRIMARY : _b, _c = _a.size, size = _c === void 0 ? exports.ButtonSizes.BIG : _c, _d = _a.children, children = _d === void 0 ? 'Button' : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e, _f = _a.onClick, onClick = _f === void 0 ? function () { } : _f, _g = _a.labelType, labelType = _g === void 0 ? ui_Label.LabelTypography.BUTTON_1 : _g, _h = _a.labelColor, labelColor = _h === void 0 ? ui_Label.LabelColors.ONCONTENT_1 : _h;
    var injectingClassNames = _tslib.__spreadArray(_tslib.__spreadArray([], ((Array.isArray(className)) ? className : [className]), true), [
        'sendbird-button',
        (disabled ? 'sendbird-button__disabled' : ''),
        changeTypeToClassName(type),
        changeSizeToClassName(size),
    ], false).join(' ');
    return (React.createElement("button", { className: injectingClassNames, type: "button", onClick: onClick, disabled: disabled },
        React.createElement(ui_Label.Label, { className: "sendbird-button__text", type: labelType, color: labelColor }, children)));
}

exports.default = Button;
//# sourceMappingURL=Button.js.map
