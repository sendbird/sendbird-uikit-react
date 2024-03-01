'use strict';

var React = require('react');
var ui_ContextMenu = require('../ui/ContextMenu.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var LocalizationContext = require('./bundle-60kIt9Rq.js');

var OpenChannelMessageStatusTypes = {
    NONE: 'none',
    PENDING: 'pending',
    FAILED: 'failed',
    CANCELED: 'canceled',
    SUCCEEDED: 'succeeded',
};
var getSenderFromMessage = function (message) {
    // @ts-ignore
    return message.sender || message._sender;
};
var checkIsSent = function (status) { return (status === OpenChannelMessageStatusTypes.SUCCEEDED); };
var checkIsPending = function (status) { return (status === OpenChannelMessageStatusTypes.PENDING); };
var checkIsFailed = function (status) { return (status === OpenChannelMessageStatusTypes.FAILED); };
var checkIsByMe = function (message, userId) { return (getSenderFromMessage(message).userId === userId); };
var isFineCopy = function (_a) {
    var _b;
    var message = _a.message;
    return ((message === null || message === void 0 ? void 0 : message.messageType) === 'user' && ((_b = message === null || message === void 0 ? void 0 : message.message) === null || _b === void 0 ? void 0 : _b.length) > 0);
};
var isFineResend = function (_a) {
    var message = _a.message, status = _a.status, userId = _a.userId;
    return checkIsByMe(message, userId)
        && checkIsFailed(status)
        // @ts-ignore
        && (message === null || message === void 0 ? void 0 : message.isResendable);
};
var isFineEdit = function (_a) {
    var _b;
    var message = _a.message, status = _a.status, userId = _a.userId;
    return checkIsByMe(message, userId) && checkIsSent(status) && ((_b = message === null || message === void 0 ? void 0 : message.isUserMessage) === null || _b === void 0 ? void 0 : _b.call(message));
};
var isFineDelete = function (_a) {
    var message = _a.message, userId = _a.userId;
    return checkIsByMe(message, userId);
};
var isFineDownload = function (_a) {
    var _b;
    var message = _a.message, status = _a.status;
    if (((_b = message === null || message === void 0 ? void 0 : message.isFileMessage) === null || _b === void 0 ? void 0 : _b.call(message)) && checkIsSent(status)) {
        return true;
    }
    return false;
};
var showMenuTrigger = function (props) {
    var message = props.message, status = props.status, userId = props.userId;
    // @ts-ignore
    if (message.messageType === 'user') {
        return (isFineDelete({ message: message, status: status, userId: userId })
            || isFineEdit({ message: message, status: status, userId: userId })
            // @ts-ignore
            || isFineCopy({ message: message, status: status, userId: userId })
            || isFineResend({ message: message, status: status, userId: userId }));
    }
    else {
        return (isFineDelete({ message: message, status: status, userId: userId })
            || isFineResend({ message: message, status: status, userId: userId }));
    }
};

var OpenChannelMobileMenu = function (props) {
    var _a, _b;
    var message = props.message, parentRef = props.parentRef, resendMessage = props.resendMessage, showEdit = props.showEdit, showRemove = props.showRemove, copyToClipboard = props.copyToClipboard, hideMenu = props.hideMenu, _c = props.isEphemeral, isEphemeral = _c === void 0 ? false : _c;
    var userMessage = message;
    var status = message === null || message === void 0 ? void 0 : message.sendingStatus;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var userId = (_b = (_a = useSendbirdStateContext.useSendbirdStateContext()) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.userId;
    var fileMessage = message;
    return (React.createElement(ui_ContextMenu.default, { isOpen: true, menuItems: function () { return (React.createElement(ui_ContextMenu.MenuItems, { className: "sendbird-openchannel__mobile-menu", parentRef: parentRef, parentContainRef: parentRef, closeDropdown: hideMenu },
            isFineCopy({ message: userMessage, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__copy", onClick: function () {
                    copyToClipboard();
                }, dataSbId: "open_channel_mobile_context_menu_copy" },
                React.createElement(React.Fragment, null, stringSet.CONTEXT_MENU_DROPDOWN__COPY))),
            (!isEphemeral && isFineEdit({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__edit", onClick: function () {
                    showEdit();
                }, dataSbId: "open_channel_mobile_context_menu_edit" },
                React.createElement(React.Fragment, null, stringSet.CONTEXT_MENU_DROPDOWN__EDIT))),
            isFineResend({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                    resendMessage();
                }, dataSbId: "open_channel_mobile_context_menu_resend" },
                React.createElement(React.Fragment, null, stringSet.CONTEXT_MENU_DROPDOWN__RESEND))),
            (!isEphemeral && isFineDelete({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                    showRemove();
                }, dataSbId: "open_channel_mobile_context_menu_delete" },
                React.createElement(React.Fragment, null, stringSet.CONTEXT_MENU_DROPDOWN__DELETE))),
            isFineDownload({ message: message, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                    hideMenu();
                }, dataSbId: "open_channel_mobile_context_menu_download_file" },
                React.createElement("a", { className: "sendbird-openchannel__mobile-menu-hyperlink", rel: "noopener noreferrer", href: fileMessage === null || fileMessage === void 0 ? void 0 : fileMessage.url, target: "_blank" }, stringSet.CONTEXT_MENU_DROPDOWN__SAVE))))); } }));
};

exports.OpenChannelMobileMenu = OpenChannelMobileMenu;
exports.checkIsFailed = checkIsFailed;
exports.checkIsPending = checkIsPending;
exports.checkIsSent = checkIsSent;
exports.getSenderFromMessage = getSenderFromMessage;
exports.isFineCopy = isFineCopy;
exports.isFineDelete = isFineDelete;
exports.isFineEdit = isFineEdit;
exports.isFineResend = isFineResend;
exports.showMenuTrigger = showMenuTrigger;
//# sourceMappingURL=bundle-CMujcR1g.js.map
