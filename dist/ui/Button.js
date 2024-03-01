import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';

var ButtonTypes;
(function (ButtonTypes) {
    ButtonTypes["PRIMARY"] = "PRIMARY";
    ButtonTypes["SECONDARY"] = "SECONDARY";
    ButtonTypes["DANGER"] = "DANGER";
    ButtonTypes["DISABLED"] = "DISABLED";
    ButtonTypes["WARNING"] = "WARNING";
})(ButtonTypes || (ButtonTypes = {}));
var ButtonSizes;
(function (ButtonSizes) {
    ButtonSizes["BIG"] = "BIG";
    ButtonSizes["SMALL"] = "SMALL";
})(ButtonSizes || (ButtonSizes = {}));

function changeTypeToClassName(type) {
    switch (type) {
        case ButtonTypes.PRIMARY: return 'sendbird-button--primary';
        case ButtonTypes.SECONDARY: return 'sendbird-button--secondary';
        case ButtonTypes.DANGER: return 'sendbird-button--danger';
        case ButtonTypes.DISABLED: return 'sendbird-button--disabled';
        case ButtonTypes.WARNING: return 'sendbird-button--warning';
        default: return null;
    }
}
function changeSizeToClassName(size) {
    switch (size) {
        case ButtonSizes.BIG: return 'sendbird-button--big';
        case ButtonSizes.SMALL: return 'sendbird-button--small';
        default: return null;
    }
}

function Button(_a) {
    var className = _a.className, _b = _a.type, type = _b === void 0 ? ButtonTypes.PRIMARY : _b, _c = _a.size, size = _c === void 0 ? ButtonSizes.BIG : _c, _d = _a.children, children = _d === void 0 ? 'Button' : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e, _f = _a.onClick, onClick = _f === void 0 ? function () { } : _f, _g = _a.labelType, labelType = _g === void 0 ? LabelTypography.BUTTON_1 : _g, _h = _a.labelColor, labelColor = _h === void 0 ? LabelColors.ONCONTENT_1 : _h;
    var injectingClassNames = __spreadArray(__spreadArray([], ((Array.isArray(className)) ? className : [className]), true), [
        'sendbird-button',
        (disabled ? 'sendbird-button__disabled' : ''),
        changeTypeToClassName(type),
        changeSizeToClassName(size),
    ], false).join(' ');
    return (React__default.createElement("button", { className: injectingClassNames, type: "button", onClick: onClick, disabled: disabled },
        React__default.createElement(Label, { className: "sendbird-button__text", type: labelType, color: labelColor }, children)));
}

export { ButtonSizes, ButtonTypes, Button as default };
//# sourceMappingURL=Button.js.map
