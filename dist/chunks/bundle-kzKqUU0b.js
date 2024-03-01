import React__default, { useContext } from 'react';
import { M as Modal } from './bundle-O8mkJ7az.js';
import './bundle-KMsJXUN2.js';
import './bundle-kMMCn6GE.js';
import { ButtonTypes } from '../ui/Button.js';
import { L as LocalizationContext } from './bundle-msnuMA4R.js';
import { useThreadContext } from '../Thread/context.js';
import { g as getModalDeleteMessageTitle } from './bundle-pZ049TQg.js';

var RemoveMessage = function (props) {
    var _a;
    var onCancel = props.onCancel, onSubmit = props.onSubmit, message = props.message;
    var stringSet = useContext(LocalizationContext).stringSet;
    var deleteMessage = useThreadContext().deleteMessage;
    return (React__default.createElement(Modal, { type: ButtonTypes.DANGER, disabled: ((_a = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _a === void 0 ? void 0 : _a.replyCount) > 0, onCancel: onCancel, onSubmit: function () {
            deleteMessage(message).then(function () {
                onCancel === null || onCancel === void 0 ? void 0 : onCancel();
                onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
            });
        }, submitText: stringSet.MESSAGE_MENU__DELETE, titleText: getModalDeleteMessageTitle(stringSet, message) }));
};

export { RemoveMessage as R };
//# sourceMappingURL=bundle-kzKqUU0b.js.map
