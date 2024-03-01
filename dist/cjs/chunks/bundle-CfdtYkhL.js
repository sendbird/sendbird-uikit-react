'use strict';

var _tslib = require('./bundle-2dG9SU7T.js');
var React = require('react');
var reactDom = require('react-dom');
var utils = require('./bundle-QStqvuCY.js');
var LocalizationContext = require('./bundle-60kIt9Rq.js');
var MediaQueryContext = require('./bundle-MZHOyRuu.js');
var ui_IconButton = require('../ui/IconButton.js');
var ui_Button = require('../ui/Button.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Label = require('./bundle-26QzFMMl.js');

// simple component to be used as modal root
var MODAL_ROOT = 'sendbird-modal-root';
var ModalRoot = function () { return (React.createElement("div", { id: MODAL_ROOT, className: MODAL_ROOT })); };

var ModalHeader = function (_a) {
    var titleText = _a.titleText;
    return (React.createElement("div", { className: "sendbird-modal__header" },
        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.H_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, titleText)));
};
var ModalBody = function (_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "sendbird-modal__body" },
        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_2 }, children)));
};
var ModalFooter = function (_a) {
    var submitText = _a.submitText, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.hideCancelButton, hideCancelButton = _c === void 0 ? false : _c, _d = _a.type, type = _d === void 0 ? ui_Button.ButtonTypes.DANGER : _d, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-modal__footer" },
        !hideCancelButton && (React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, onClick: onCancel },
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.BUTTON__CANCEL))),
        React.createElement(ui_Button.default, { type: type, disabled: disabled, onClick: onSubmit }, submitText)));
};
function Modal(props) {
    var _a = props.children, children = _a === void 0 ? null : _a, _b = props.className, className = _b === void 0 ? '' : _b, _c = props.contentClassName, contentClassName = _c === void 0 ? '' : _c, _d = props.isCloseOnClickOutside, isCloseOnClickOutside = _d === void 0 ? false : _d, _e = props.isFullScreenOnMobile, isFullScreenOnMobile = _e === void 0 ? false : _e, titleText = props.titleText, submitText = props.submitText, _f = props.disabled, disabled = _f === void 0 ? false : _f, _g = props.hideFooter, hideFooter = _g === void 0 ? false : _g, _h = props.type, type = _h === void 0 ? ui_Button.ButtonTypes.DANGER : _h, 
    /**
     * Do not use this! We will deprecate onCancel in v4.
     */
    _j = props.onCancel, 
    /**
     * Do not use this! We will deprecate onCancel in v4.
     */
    onCancel = _j === void 0 ? utils.noop : _j, onClose = props.onClose, _k = props.onSubmit, onSubmit = _k === void 0 ? utils.noop : _k, renderHeader = props.renderHeader, customFooter = props.customFooter;
    var handleClose = onClose !== null && onClose !== void 0 ? onClose : onCancel;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    return reactDom.createPortal((React.createElement("div", { className: "\n      sendbird-modal ".concat(className, "\n      ").concat((isFullScreenOnMobile && isMobile) ? 'sendbird-modal--full-mobile' : '', "\n    ") },
        React.createElement("div", { className: _tslib.__spreadArray([
                'sendbird-modal__content'
            ], (Array.isArray(contentClassName) ? contentClassName : [contentClassName]), true).join(' ') },
            (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || (React.createElement(ModalHeader, { titleText: titleText !== null && titleText !== void 0 ? titleText : '' })),
            React.createElement(ModalBody, null, children),
            !hideFooter && (customFooter !== null && customFooter !== void 0 ? customFooter : (React.createElement(ModalFooter, { disabled: disabled, onCancel: handleClose, onSubmit: onSubmit, submitText: submitText !== null && submitText !== void 0 ? submitText : '', type: type }))),
            !isMobile && (React.createElement("div", { className: "sendbird-modal__close" },
                React.createElement(ui_IconButton, { width: "32px", height: "32px", onClick: handleClose },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CLOSE, fillColor: ui_Icon.IconColors.DEFAULT, width: "24px", height: "24px" }))))),
        React.createElement("div", { className: "\n          sendbird-modal__backdrop\n          ".concat(isCloseOnClickOutside && 'sendbird-modal__backdrop--clickoutside', "\n        "), onClick: function (e) {
                e === null || e === void 0 ? void 0 : e.stopPropagation();
                if (isCloseOnClickOutside) {
                    handleClose();
                }
            } }))), document.getElementById(MODAL_ROOT));
}

exports.MODAL_ROOT = MODAL_ROOT;
exports.Modal = Modal;
exports.ModalBody = ModalBody;
exports.ModalFooter = ModalFooter;
exports.ModalHeader = ModalHeader;
exports.ModalRoot = ModalRoot;
//# sourceMappingURL=bundle-CfdtYkhL.js.map
