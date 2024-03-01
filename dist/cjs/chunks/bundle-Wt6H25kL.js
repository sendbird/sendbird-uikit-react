'use strict';

var React = require('react');
var ui_Modal = require('./bundle-6hGNMML2.js');
require('./bundle-xbdnJE9-.js');
require('./bundle-KkCwxjVN.js');
var ui_Button = require('../ui/Button.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');
var Thread_context = require('../Thread/context.js');
var stringFormatterUtils = require('./bundle-gOYUXAiI.js');

var RemoveMessage = function (props) {
    var _a;
    var onCancel = props.onCancel, onSubmit = props.onSubmit, message = props.message;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var deleteMessage = Thread_context.useThreadContext().deleteMessage;
    return (React.createElement(ui_Modal.Modal, { type: ui_Button.ButtonTypes.DANGER, disabled: ((_a = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _a === void 0 ? void 0 : _a.replyCount) > 0, onCancel: onCancel, onSubmit: function () {
            deleteMessage(message).then(function () {
                onCancel === null || onCancel === void 0 ? void 0 : onCancel();
                onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
            });
        }, submitText: stringSet.MESSAGE_MENU__DELETE, titleText: stringFormatterUtils.getModalDeleteMessageTitle(stringSet, message) }));
};

exports.RemoveMessage = RemoveMessage;
//# sourceMappingURL=bundle-Wt6H25kL.js.map
