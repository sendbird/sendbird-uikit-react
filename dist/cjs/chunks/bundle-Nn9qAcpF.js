'use strict';

var React = require('react');
var ui_Modal = require('./bundle-NeYvE4zX.js');
require('./bundle-zYqQA3cT.js');
require('./bundle-2Pq38lvD.js');
var ui_Button = require('../ui/Button.js');
var LocalizationContext = require('./bundle-Nz6fSUye.js');
var stringFormatterUtils = require('./bundle-Ri0nZ4E4.js');

var RemoveMessageModalView = function (props) {
    var _a;
    var _b = props.onSubmit, onSubmit = _b === void 0 ? function () {
        /* noop */
    } : _b, onCancel = props.onCancel, message = props.message, deleteMessage = props.deleteMessage;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement(ui_Modal.Modal, { type: ui_Button.ButtonTypes.DANGER, disabled: ((_a = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _a === void 0 ? void 0 : _a.replyCount) > 0, onCancel: onCancel, onSubmit: function () {
            if (message.isUserMessage() || message.isFileMessage() || message.isMultipleFilesMessage()) {
                deleteMessage(message).then(function () {
                    // For other status such as PENDING, SCHEDULED, and CANCELED,
                    // invalid parameters error is thrown so nothing happens.
                    onSubmit();
                    onCancel();
                });
            }
        }, submitText: stringSet.MESSAGE_MENU__DELETE, titleText: stringFormatterUtils.getModalDeleteMessageTitle(stringSet, message) }));
};

exports.RemoveMessageModalView = RemoveMessageModalView;
//# sourceMappingURL=bundle-Nn9qAcpF.js.map
