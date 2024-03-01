'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Icon = require('./Icon.js');
var ui_IconButton = require('./IconButton.js');
var index = require('../chunks/bundle-bjSez2lv.js');
var LocalizationContext = require('../chunks/bundle-Nz6fSUye.js');
var types = require('../chunks/bundle-qKiW2e44.js');
require('../chunks/bundle-zYqQA3cT.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-NNEanMqk.js');
require('../chunks/bundle-2Pq38lvD.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-8G36Z6Or.js');
require('../chunks/bundle-eyiJykZ-.js');

function MessageMenu(_a) {
    var _b;
    var className = _a.className, message = _a.message, channel = _a.channel, _c = _a.isByMe, isByMe = _c === void 0 ? false : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, replyType = _a.replyType, _e = _a.disableDeleteMessage, disableDeleteMessage = _e === void 0 ? null : _e, showEdit = _a.showEdit, showRemove = _a.showRemove, deleteMessage = _a.deleteMessage, resendMessage = _a.resendMessage, setQuoteMessage = _a.setQuoteMessage, setSupposedHover = _a.setSupposedHover, onReplyInThread = _a.onReplyInThread, _f = _a.onMoveToParentMessage, onMoveToParentMessage = _f === void 0 ? null : _f;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var triggerRef = React.useRef(null);
    var containerRef = React.useRef(null);
    var showMenuItemCopy = index.isUserMessage(message);
    var showMenuItemEdit = (!(channel === null || channel === void 0 ? void 0 : channel.isEphemeral) && index.isUserMessage(message) && index.isSentMessage(message) && isByMe);
    var showMenuItemResend = (index.isFailedMessage(message) && (message === null || message === void 0 ? void 0 : message.isResendable) && isByMe);
    var showMenuItemDelete = !(channel === null || channel === void 0 ? void 0 : channel.isEphemeral) && !index.isPendingMessage(message) && isByMe;
    var showMenuItemOpenInChannel = onMoveToParentMessage !== null;
    /**
     * TODO: Manage timing issue
     * User delete pending message -> Sending message success
     */
    var isReplyTypeEnabled = !index.isFailedMessage(message)
        && !index.isPendingMessage(message)
        && (((_b = channel === null || channel === void 0 ? void 0 : channel.isGroupChannel) === null || _b === void 0 ? void 0 : _b.call(channel))
            && !(channel === null || channel === void 0 ? void 0 : channel.isEphemeral)
            && (((channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (channel === null || channel === void 0 ? void 0 : channel.myRole) === types.Role.OPERATOR)
                || !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast)));
    var showMenuItemReply = isReplyTypeEnabled && replyType === 'QUOTE_REPLY';
    var showMenuItemThread = isReplyTypeEnabled && replyType === 'THREAD' && !(message === null || message === void 0 ? void 0 : message.parentMessageId) && onReplyInThread;
    if (!(showMenuItemCopy
        || showMenuItemReply
        || showMenuItemThread
        || showMenuItemOpenInChannel
        || showMenuItemEdit
        || showMenuItemResend
        || showMenuItemDelete)) {
        return null;
    }
    return (React.createElement("div", { className: index.getClassName([className, 'sendbird-message-item-menu']), ref: containerRef },
        React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-message-item-menu__trigger", ref: triggerRef, width: "32px", height: "32px", onClick: function () {
                    toggleDropdown();
                    setSupposedHover(true);
                }, onBlur: function () {
                    setSupposedHover(false);
                } },
                React.createElement(ui_Icon.default, { className: "sendbird-message-item-menu__trigger__icon", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE, width: "24px", height: "24px" }))); }, menuItems: function (close) {
                var _a;
                var closeDropdown = function () {
                    close();
                    setSupposedHover(false);
                };
                return (React.createElement(ui_ContextMenu.MenuItems, { className: "sendbird-message-item-menu__list", parentRef: triggerRef, parentContainRef: containerRef, closeDropdown: closeDropdown, openLeft: isByMe },
                    showMenuItemCopy && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-copy", onClick: function () {
                            index.copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
                            closeDropdown();
                        }, dataSbId: "ui_message_item_menu_copy" }, stringSet.MESSAGE_MENU__COPY)),
                    showMenuItemReply && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-reply", onClick: function () {
                            setQuoteMessage(message);
                            closeDropdown();
                        }, disable: (message === null || message === void 0 ? void 0 : message.parentMessageId) > 0, dataSbId: "ui_message_item_menu_reply" }, stringSet.MESSAGE_MENU__REPLY)),
                    showMenuItemThread && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-thread", onClick: function () {
                            onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                            closeDropdown();
                        }, dataSbId: "ui_message_item_menu_thread" }, stringSet.MESSAGE_MENU__THREAD)),
                    showMenuItemOpenInChannel && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-open-channel", onClick: function () {
                            onMoveToParentMessage === null || onMoveToParentMessage === void 0 ? void 0 : onMoveToParentMessage();
                            closeDropdown();
                        }, dataSbId: "ui_message_item_menu_open_in_channel" }, stringSet.MESSAGE_MENU__OPEN_IN_CHANNEL)),
                    showMenuItemEdit && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-edit", onClick: function () {
                            if (!disabled) {
                                showEdit(true);
                                closeDropdown();
                            }
                        }, dataSbId: "ui_message_item_menu_edit" }, stringSet.MESSAGE_MENU__EDIT)),
                    showMenuItemResend && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-resend", onClick: function () {
                            if (!disabled) {
                                resendMessage(message);
                                closeDropdown();
                            }
                        }, dataSbId: "ui_message_item_menu_resend" }, stringSet.MESSAGE_MENU__RESEND)),
                    showMenuItemDelete && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-delete", onClick: function () {
                            if (index.isFailedMessage(message)) {
                                deleteMessage === null || deleteMessage === void 0 ? void 0 : deleteMessage(message);
                            }
                            else if (!disabled) {
                                showRemove(true);
                                closeDropdown();
                            }
                        }, disable: typeof disableDeleteMessage === 'boolean'
                            ? disableDeleteMessage
                            : ((_a = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _a === void 0 ? void 0 : _a.replyCount) > 0, dataSbId: "ui_message_item_menu_delete" }, stringSet.MESSAGE_MENU__DELETE))));
            } })));
}

exports.MessageMenu = MessageMenu;
exports.default = MessageMenu;
//# sourceMappingURL=MessageItemMenu.js.map
