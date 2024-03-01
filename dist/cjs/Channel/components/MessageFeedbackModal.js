'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Modal = require('../../chunks/bundle-6hGNMML2.js');
var ui_Button = require('../../ui/Button.js');
var ui_Input = require('../../ui/Input.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var MediaQueryContext = require('../../chunks/bundle-4WvE40Un.js');
var useKeyDown = require('../../chunks/bundle-noP7JXqE.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('react-dom');
require('../../chunks/bundle-jCTpndN0.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('@sendbird/uikit-tools');

function MessageFeedbackModal(props) {
    var _a, _b;
    var selectedFeedback = props.selectedFeedback, message = props.message, onClose = props.onClose, onSubmit = props.onSubmit, onUpdate = props.onUpdate, onRemove = props.onRemove;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var isEdit = (message === null || message === void 0 ? void 0 : message.myFeedback) && selectedFeedback === message.myFeedback.rating;
    var hasComment = (_a = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _a === void 0 ? void 0 : _a.comment;
    var onSubmitWrapper = function () {
        var _a;
        if (!selectedFeedback)
            return;
        var comment = (_a = inputRef.current.value) !== null && _a !== void 0 ? _a : '';
        if (isEdit) {
            if (comment !== message.myFeedback.comment) {
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(selectedFeedback, comment);
            }
            else {
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        }
        else if (!message.myFeedback) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(selectedFeedback, comment);
        }
    };
    var modalRef = React.useRef(null);
    var inputRef = React.useRef(null);
    var onKeyDown = useKeyDown.useKeyDown(modalRef, {
        Enter: function () { return onSubmitWrapper(); },
        Escape: function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); },
    });
    return (React.createElement("div", { onKeyDown: onKeyDown },
        React.createElement(ui_Modal.Modal, { contentClassName: 'sendbird-message-feedback-modal-content__mobile', type: ui_Button.ButtonTypes.PRIMARY, onCancel: onClose, onSubmit: function () {
                onSubmitWrapper();
            }, submitText: stringSet.BUTTON__SUBMIT, renderHeader: function () { return (React.createElement("div", { className: 'sendbird-modal__header' },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.H_1, color: ui_Label.LabelColors.ONBACKGROUND_1, className: 'sendbird-message-feedback-modal-header' }, stringSet.FEEDBACK_MODAL_TITLE))); }, customFooter: React.createElement("div", { className: 'sendbird-message-feedback-modal-footer__root' },
                !isMobile && (message === null || message === void 0 ? void 0 : message.myFeedback) && selectedFeedback === message.myFeedback.rating
                    ? React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.WARNING, onClick: onRemove, labelType: ui_Label.LabelTypography.BUTTON_3 }, stringSet.BUTTON__REMOVE_FEEDBACK)
                    : React.createElement("div", null),
                React.createElement("div", { className: 'sendbird-message-feedback-modal-footer__right-content' },
                    React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, onClick: onClose },
                        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_3, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.BUTTON__CANCEL)),
                    React.createElement(ui_Button.default, { onClick: function () { return onSubmitWrapper(); } },
                        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_3, color: ui_Label.LabelColors.ONCONTENT_1 }, hasComment ? stringSet.BUTTON__SAVE : stringSet.BUTTON__SUBMIT)))) },
            React.createElement("div", { className: 'sendbird-message-feedback-modal-body__root' },
                React.createElement(ui_Input.default, { name: 'sendbird-message-feedback-modal-body__root', ref: inputRef, value: isEdit ? (_b = message.myFeedback) === null || _b === void 0 ? void 0 : _b.comment : undefined, placeHolder: stringSet.FEEDBACK_CONTENT_PLACEHOLDER, autoFocus: true })))));
}

module.exports = MessageFeedbackModal;
//# sourceMappingURL=MessageFeedbackModal.js.map
