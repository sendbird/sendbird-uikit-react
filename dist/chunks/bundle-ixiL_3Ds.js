import { c as __spreadArray } from './bundle-xhjHZ041.js';
import React__default, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { n as noop } from './bundle-IDH-OOHE.js';
import { L as LocalizationContext } from './bundle-1inZXcUV.js';
import { u as useMediaQueryContext } from './bundle-pjLq9qJd.js';
import IconButton from '../ui/IconButton.js';
import Button, { ButtonTypes } from '../ui/Button.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-sR62lMVk.js';

// simple component to be used as modal root
var MODAL_ROOT = 'sendbird-modal-root';
var ModalRoot = function () { return (React__default.createElement("div", { id: MODAL_ROOT, className: MODAL_ROOT })); };

var ModalHeader = function (_a) {
    var titleText = _a.titleText;
    return (React__default.createElement("div", { className: "sendbird-modal__header" },
        React__default.createElement(Label, { type: LabelTypography.H_1, color: LabelColors.ONBACKGROUND_1 }, titleText)));
};
var ModalBody = function (_a) {
    var children = _a.children;
    return (React__default.createElement("div", { className: "sendbird-modal__body" },
        React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_2 }, children)));
};
var ModalFooter = function (_a) {
    var submitText = _a.submitText, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.hideCancelButton, hideCancelButton = _c === void 0 ? false : _c, _d = _a.type, type = _d === void 0 ? ButtonTypes.DANGER : _d, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-modal__footer" },
        !hideCancelButton && (React__default.createElement(Button, { type: ButtonTypes.SECONDARY, onClick: onCancel },
            React__default.createElement(Label, { type: LabelTypography.BUTTON_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.BUTTON__CANCEL))),
        React__default.createElement(Button, { type: type, disabled: disabled, onClick: onSubmit }, submitText)));
};
function Modal(props) {
    var _a = props.children, children = _a === void 0 ? null : _a, _b = props.className, className = _b === void 0 ? '' : _b, _c = props.contentClassName, contentClassName = _c === void 0 ? '' : _c, _d = props.isCloseOnClickOutside, isCloseOnClickOutside = _d === void 0 ? false : _d, _e = props.isFullScreenOnMobile, isFullScreenOnMobile = _e === void 0 ? false : _e, titleText = props.titleText, submitText = props.submitText, _f = props.disabled, disabled = _f === void 0 ? false : _f, _g = props.hideFooter, hideFooter = _g === void 0 ? false : _g, _h = props.type, type = _h === void 0 ? ButtonTypes.DANGER : _h, 
    /**
     * Do not use this! We will deprecate onCancel in v4.
     */
    _j = props.onCancel, 
    /**
     * Do not use this! We will deprecate onCancel in v4.
     */
    onCancel = _j === void 0 ? noop : _j, onClose = props.onClose, _k = props.onSubmit, onSubmit = _k === void 0 ? noop : _k, renderHeader = props.renderHeader, customFooter = props.customFooter;
    var handleClose = onClose !== null && onClose !== void 0 ? onClose : onCancel;
    var isMobile = useMediaQueryContext().isMobile;
    return createPortal((React__default.createElement("div", { className: "\n      sendbird-modal ".concat(className, "\n      ").concat((isFullScreenOnMobile && isMobile) ? 'sendbird-modal--full-mobile' : '', "\n    ") },
        React__default.createElement("div", { className: __spreadArray([
                'sendbird-modal__content'
            ], (Array.isArray(contentClassName) ? contentClassName : [contentClassName]), true).join(' ') },
            (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || (React__default.createElement(ModalHeader, { titleText: titleText !== null && titleText !== void 0 ? titleText : '' })),
            React__default.createElement(ModalBody, null, children),
            !hideFooter && (customFooter !== null && customFooter !== void 0 ? customFooter : (React__default.createElement(ModalFooter, { disabled: disabled, onCancel: handleClose, onSubmit: onSubmit, submitText: submitText !== null && submitText !== void 0 ? submitText : '', type: type }))),
            !isMobile && (React__default.createElement("div", { className: "sendbird-modal__close" },
                React__default.createElement(IconButton, { width: "32px", height: "32px", onClick: handleClose },
                    React__default.createElement(Icon, { type: IconTypes.CLOSE, fillColor: IconColors.DEFAULT, width: "24px", height: "24px" }))))),
        React__default.createElement("div", { className: "\n          sendbird-modal__backdrop\n          ".concat(isCloseOnClickOutside && 'sendbird-modal__backdrop--clickoutside', "\n        "), onClick: function (e) {
                e === null || e === void 0 ? void 0 : e.stopPropagation();
                if (isCloseOnClickOutside) {
                    handleClose();
                }
            } }))), document.getElementById(MODAL_ROOT));
}

export { Modal as M, MODAL_ROOT as a, ModalRoot as b, ModalFooter as c, ModalHeader as d, ModalBody as e };
//# sourceMappingURL=bundle-ixiL_3Ds.js.map
