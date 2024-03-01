import React__default, { useContext, useRef } from 'react';
import ContextMenu, { MenuItems, MenuItem } from './ContextMenu.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import IconButton from './IconButton.js';
import { l as isUserMessage, q as isSentMessage, u as isFailedMessage, v as isPendingMessage, w as getClassName, x as copyToClipboard } from '../chunks/bundle-WrTlYypL.js';
import { L as LocalizationContext } from '../chunks/bundle-hS8Jw8F1.js';
import { R as Role } from '../chunks/bundle-AGNrfX7p.js';
import '../chunks/bundle-UnAcr6wX.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-0Kp88b8b.js';
import '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../chunks/bundle-CRwhglru.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-UuydkZ4A.js';
import '../chunks/bundle-8u3PnqsX.js';

function MessageMenu(_a) {
    var _b;
    var className = _a.className, message = _a.message, channel = _a.channel, _c = _a.isByMe, isByMe = _c === void 0 ? false : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, replyType = _a.replyType, _e = _a.disableDeleteMessage, disableDeleteMessage = _e === void 0 ? null : _e, showEdit = _a.showEdit, showRemove = _a.showRemove, deleteMessage = _a.deleteMessage, resendMessage = _a.resendMessage, setQuoteMessage = _a.setQuoteMessage, setSupposedHover = _a.setSupposedHover, onReplyInThread = _a.onReplyInThread, _f = _a.onMoveToParentMessage, onMoveToParentMessage = _f === void 0 ? null : _f;
    var stringSet = useContext(LocalizationContext).stringSet;
    var triggerRef = useRef(null);
    var containerRef = useRef(null);
    var showMenuItemCopy = isUserMessage(message);
    var showMenuItemEdit = (!(channel === null || channel === void 0 ? void 0 : channel.isEphemeral) && isUserMessage(message) && isSentMessage(message) && isByMe);
    var showMenuItemResend = (isFailedMessage(message) && (message === null || message === void 0 ? void 0 : message.isResendable) && isByMe);
    var showMenuItemDelete = !(channel === null || channel === void 0 ? void 0 : channel.isEphemeral) && !isPendingMessage(message) && isByMe;
    var showMenuItemOpenInChannel = onMoveToParentMessage !== null;
    /**
     * TODO: Manage timing issue
     * User delete pending message -> Sending message success
     */
    var isReplyTypeEnabled = !isFailedMessage(message)
        && !isPendingMessage(message)
        && (((_b = channel === null || channel === void 0 ? void 0 : channel.isGroupChannel) === null || _b === void 0 ? void 0 : _b.call(channel))
            && !(channel === null || channel === void 0 ? void 0 : channel.isEphemeral)
            && (((channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (channel === null || channel === void 0 ? void 0 : channel.myRole) === Role.OPERATOR)
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
    return (React__default.createElement("div", { className: getClassName([className, 'sendbird-message-item-menu']), ref: containerRef },
        React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-message-item-menu__trigger", ref: triggerRef, width: "32px", height: "32px", onClick: function () {
                    toggleDropdown();
                    setSupposedHover(true);
                }, onBlur: function () {
                    setSupposedHover(false);
                } },
                React__default.createElement(Icon, { className: "sendbird-message-item-menu__trigger__icon", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE, width: "24px", height: "24px" }))); }, menuItems: function (close) {
                var _a;
                var closeDropdown = function () {
                    close();
                    setSupposedHover(false);
                };
                return (React__default.createElement(MenuItems, { className: "sendbird-message-item-menu__list", parentRef: triggerRef, parentContainRef: containerRef, closeDropdown: closeDropdown, openLeft: isByMe },
                    showMenuItemCopy && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-copy", onClick: function () {
                            copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
                            closeDropdown();
                        }, dataSbId: "ui_message_item_menu_copy" }, stringSet.MESSAGE_MENU__COPY)),
                    showMenuItemReply && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-reply", onClick: function () {
                            setQuoteMessage(message);
                            closeDropdown();
                        }, disable: (message === null || message === void 0 ? void 0 : message.parentMessageId) > 0, dataSbId: "ui_message_item_menu_reply" }, stringSet.MESSAGE_MENU__REPLY)),
                    showMenuItemThread && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-thread", onClick: function () {
                            onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                            closeDropdown();
                        }, dataSbId: "ui_message_item_menu_thread" }, stringSet.MESSAGE_MENU__THREAD)),
                    showMenuItemOpenInChannel && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-open-channel", onClick: function () {
                            onMoveToParentMessage === null || onMoveToParentMessage === void 0 ? void 0 : onMoveToParentMessage();
                            closeDropdown();
                        }, dataSbId: "ui_message_item_menu_open_in_channel" }, stringSet.MESSAGE_MENU__OPEN_IN_CHANNEL)),
                    showMenuItemEdit && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-edit", onClick: function () {
                            if (!disabled) {
                                showEdit(true);
                                closeDropdown();
                            }
                        }, dataSbId: "ui_message_item_menu_edit" }, stringSet.MESSAGE_MENU__EDIT)),
                    showMenuItemResend && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-resend", onClick: function () {
                            if (!disabled) {
                                resendMessage(message);
                                closeDropdown();
                            }
                        }, dataSbId: "ui_message_item_menu_resend" }, stringSet.MESSAGE_MENU__RESEND)),
                    showMenuItemDelete && (React__default.createElement(MenuItem, { className: "sendbird-message-item-menu__list__menu-item menu-item-delete", onClick: function () {
                            if (isFailedMessage(message)) {
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

export { MessageMenu, MessageMenu as default };
//# sourceMappingURL=MessageItemMenu.js.map
