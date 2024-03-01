import React__default, { useState } from 'react';
import ContextMenu, { MenuItems, MenuItem } from '../ui/ContextMenu.js';
import { l as isUserMessage, q as isSentMessage, u as isFailedMessage, v as isPendingMessage, b as isFileMessage, i as isVoiceMessage, M as isThreadMessage, x as copyToClipboard, y as getEmojiListAll } from './bundle-WrTlYypL.js';
import { u as useLocalization } from './bundle-hS8Jw8F1.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-ljRDDTki.js';
import BottomSheet from '../ui/BottomSheet.js';
import ImageRenderer from '../ui/ImageRenderer.js';
import ReactionButton from '../ui/ReactionButton.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';

var MobileContextMenu = function (props) {
    var _a, _b, _c;
    var hideMenu = props.hideMenu, channel = props.channel, message = props.message, replyType = props.replyType, userId = props.userId, resendMessage = props.resendMessage, showEdit = props.showEdit, showRemove = props.showRemove, deleteMenuState = props.deleteMenuState, deleteMessage = props.deleteMessage, setQuoteMessage = props.setQuoteMessage, parentRef = props.parentRef, onReplyInThread = props.onReplyInThread, _d = props.isOpenedFromThread, isOpenedFromThread = _d === void 0 ? false : _d;
    var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
    var stringSet = useLocalization().stringSet;
    var showMenuItemCopy = isUserMessage(message);
    var showMenuItemEdit = (isUserMessage(message) && isSentMessage(message) && isByMe);
    var showMenuItemResend = (isFailedMessage(message) && (message === null || message === void 0 ? void 0 : message.isResendable) && isByMe);
    var showMenuItemDelete = !isPendingMessage(message) && isByMe;
    var showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
    var showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;
    var disableDelete = ((deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
        || ((_c = (_b = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _b === void 0 ? void 0 : _b.replyCount) !== null && _c !== void 0 ? _c : 0) > 0);
    var showMenuItemDownload = !isPendingMessage(message) && isFileMessage(message)
        && !(isVoiceMessage(message) && ((channel === null || channel === void 0 ? void 0 : channel.isSuper) || (channel === null || channel === void 0 ? void 0 : channel.isBroadcast)));
    var showMenuItemReply = (replyType === 'QUOTE_REPLY')
        && !isFailedMessage(message)
        && !isPendingMessage(message)
        && (channel === null || channel === void 0 ? void 0 : channel.isGroupChannel());
    var showMenuItemThread = (replyType === 'THREAD') && !isOpenedFromThread
        && !isFailedMessage(message)
        && !isPendingMessage(message)
        && !isThreadMessage(message)
        && (channel === null || channel === void 0 ? void 0 : channel.isGroupChannel());
    var fileMessage = message;
    return (React__default.createElement(ContextMenu, { isOpen: true, menuItems: function () {
            var _a, _b, _c;
            return (React__default.createElement(MenuItems, { className: "sendbird-message__mobile-context-menu", parentRef: parentRef, parentContainRef: parentRef, closeDropdown: hideMenu },
                showMenuItemCopy && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-copy", onClick: function () {
                        hideMenu();
                        copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
                    }, dataSbId: "ui_mobile_message_item_menu_copy" },
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__COPY),
                    React__default.createElement(Icon, { type: IconTypes.COPY, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemReply && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-reply", onClick: function () {
                        hideMenu();
                        setQuoteMessage(message);
                    }, disable: ((_a = message === null || message === void 0 ? void 0 : message.parentMessageId) !== null && _a !== void 0 ? _a : 0) > 0, dataSbId: "ui_mobile_message_item_menu_reply" },
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: ((_b = message === null || message === void 0 ? void 0 : message.parentMessageId) !== null && _b !== void 0 ? _b : 0) > 0
                            ? LabelColors.ONBACKGROUND_4
                            : LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__REPLY),
                    React__default.createElement(Icon, { type: IconTypes.REPLY, fillColor: ((_c = message === null || message === void 0 ? void 0 : message.parentMessageId) !== null && _c !== void 0 ? _c : 0) > 0
                            ? IconColors.ON_BACKGROUND_4
                            : IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemThread && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-reply", onClick: function () {
                        hideMenu();
                        onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                    }, dataSbId: "ui_mobile_message_item_menu_thread" },
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__THREAD),
                    React__default.createElement(Icon, { type: IconTypes.THREAD, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemEdit && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-edit", onClick: function () {
                        hideMenu();
                        showEdit(true);
                    }, dataSbId: "ui_mobile_message_item_menu_edit" },
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__EDIT),
                    React__default.createElement(Icon, { type: IconTypes.EDIT, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemResend && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-resend", onClick: function () {
                        hideMenu();
                        resendMessage(message);
                    }, dataSbId: "ui_mobile_message_item_menu_resend" },
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__RESEND),
                    React__default.createElement(Icon, { type: IconTypes.REFRESH, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemDeleteFinal && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-delete", onClick: function () {
                        if (isFailedMessage(message)) {
                            hideMenu();
                            deleteMessage === null || deleteMessage === void 0 ? void 0 : deleteMessage(message);
                        }
                        else if (!disableDelete) {
                            hideMenu();
                            showRemove === null || showRemove === void 0 ? void 0 : showRemove(true);
                        }
                    }, disable: disableDelete, dataSbId: "ui_mobile_message_item_menu_delete" },
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: disableDelete
                            ? LabelColors.ONBACKGROUND_4
                            : LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__DELETE),
                    React__default.createElement(Icon, { type: IconTypes.DELETE, fillColor: disableDelete
                            ? IconColors.ON_BACKGROUND_4
                            : IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemDownload && (React__default.createElement(MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-save", onClick: function () {
                        hideMenu();
                    }, dataSbId: "ui_mobile_message_item_menu_download_file" },
                    React__default.createElement("a", { className: "sendbird-message__contextmenu--hyperlink", rel: "noopener noreferrer", href: fileMessage === null || fileMessage === void 0 ? void 0 : fileMessage.url, target: "_blank" },
                        React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__SAVE),
                        React__default.createElement(Icon, { type: IconTypes.DOWNLOAD, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }))))));
        } }));
};

var EMOJI_SIZE = 38;
var MobileBottomSheet = function (props) {
    var _a, _b, _c;
    var hideMenu = props.hideMenu, channel = props.channel, emojiContainer = props.emojiContainer, message = props.message, replyType = props.replyType, userId = props.userId, resendMessage = props.resendMessage, deleteMessage = props.deleteMessage, toggleReaction = props.toggleReaction, isReactionEnabled = props.isReactionEnabled, showEdit = props.showEdit, showRemove = props.showRemove, deleteMenuState = props.deleteMenuState, setQuoteMessage = props.setQuoteMessage, onReplyInThread = props.onReplyInThread, _d = props.isOpenedFromThread, isOpenedFromThread = _d === void 0 ? false : _d;
    var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
    var stringSet = useLocalization().stringSet;
    var globalStore = useSendbirdStateContext();
    var isOnline = globalStore.config.isOnline;
    var showMenuItemCopy = isUserMessage(message);
    var showMenuItemEdit = (isUserMessage(message) && isSentMessage(message) && isByMe);
    var showMenuItemResend = (isOnline && isFailedMessage(message) && (message === null || message === void 0 ? void 0 : message.isResendable) && isByMe);
    var showMenuItemDelete = !isPendingMessage(message) && isByMe;
    var showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
    var showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;
    var disableDelete = ((deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
        || ((_c = (_b = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _b === void 0 ? void 0 : _b.replyCount) !== null && _c !== void 0 ? _c : 0) > 0);
    var showMenuItemDownload = isSentMessage(message) && isFileMessage(message) && !isVoiceMessage(message);
    var showReaction = !isFailedMessage(message) && !isPendingMessage(message) && isReactionEnabled;
    var showMenuItemReply = (replyType === 'QUOTE_REPLY')
        && !isFailedMessage(message)
        && !isPendingMessage(message)
        && ((channel === null || channel === void 0 ? void 0 : channel.isGroupChannel()) && !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast));
    var showMenuItemThread = (replyType === 'THREAD') && !isOpenedFromThread
        && !isFailedMessage(message)
        && !isPendingMessage(message)
        && !isThreadMessage(message)
        && ((channel === null || channel === void 0 ? void 0 : channel.isGroupChannel()) && !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast));
    var disableReaction = (message === null || message === void 0 ? void 0 : message.parentMessageId) > 0;
    var fileMessage = message;
    var maxEmojisPerRow = Math.floor(window.innerWidth / EMOJI_SIZE) - 1;
    var _e = useState(false), showEmojisOnly = _e[0], setShowEmojisOnly = _e[1];
    var emojis = getEmojiListAll(emojiContainer);
    // calculate max emojis that can be shown in screen
    var visibleEmojis = showEmojisOnly
        ? emojis
        : emojis === null || emojis === void 0 ? void 0 : emojis.slice(0, maxEmojisPerRow);
    var canShowMoreEmojis = emojis.length > maxEmojisPerRow;
    return (React__default.createElement(BottomSheet, { onBackdropClick: hideMenu },
        React__default.createElement("div", { className: 'sendbird-message__bottomsheet' },
            showReaction && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet-reactions' },
                React__default.createElement("ul", { className: "sendbird-message__bottomsheet-reaction-bar" },
                    React__default.createElement("div", { className: "\n                    sendbird-message__bottomsheet-reaction-bar__row\n                    ".concat(showEmojisOnly ? 'sendbird-message__bottomsheet-reaction-bar__all' : '', "\n                  ") },
                        visibleEmojis.map(function (emoji) {
                            var _a, _b, _c;
                            var isReacted = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.filter(function (reaction) { return reaction.key === emoji.key; })[0]) === null || _b === void 0 ? void 0 : _b.userIds) === null || _c === void 0 ? void 0 : _c.some(function (reactorId) { return reactorId === userId; });
                            return (React__default.createElement(ReactionButton, { key: emoji.key, width: "".concat(EMOJI_SIZE, "px"), height: "".concat(EMOJI_SIZE, "px"), selected: isReacted, onClick: function () {
                                    hideMenu();
                                    toggleReaction(message, emoji.key, isReacted);
                                }, dataSbId: "ui_mobile_emoji_reactions_menu_".concat(emoji.key) },
                                React__default.createElement(ImageRenderer, { url: (emoji === null || emoji === void 0 ? void 0 : emoji.url) || '', width: "28px", height: "28px", placeHolder: function (_a) {
                                        var style = _a.style;
                                        return (React__default.createElement("div", { style: style },
                                            React__default.createElement(Icon, { type: IconTypes.QUESTION, fillColor: IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                                    } })));
                        }),
                        canShowMoreEmojis && !showEmojisOnly && (React__default.createElement(ReactionButton, { key: "emoji_more", width: "38px", height: "38px", onClick: function () {
                                setShowEmojisOnly(true);
                            }, dataSbId: "ui_mobile_emoji_reactions_menu_emojiadd" },
                            React__default.createElement(ImageRenderer, { url: '', width: "28px", height: "28px", placeHolder: function (_a) {
                                    var style = _a.style;
                                    return (React__default.createElement("div", { style: style },
                                        React__default.createElement(Icon, { type: IconTypes.EMOJI_MORE, fillColor: IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                                } }))))))),
            !showEmojisOnly && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--actions' },
                showMenuItemCopy && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
                    } },
                    React__default.createElement(Icon, { type: IconTypes.COPY, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__COPY))),
                showMenuItemEdit && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        showEdit(true);
                    } },
                    React__default.createElement(Icon, { type: IconTypes.EDIT, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__EDIT))),
                showMenuItemResend && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        resendMessage(message);
                    } },
                    React__default.createElement(Icon, { type: IconTypes.REFRESH, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__RESEND))),
                showMenuItemReply && (React__default.createElement("div", { className: "sendbird-message__bottomsheet--action\n                      ".concat(disableReaction ? 'sendbird-message__bottomsheet--action-disabled' : '', "\n                    "), role: "menuitem", "aria-disabled": disableReaction ? true : false, onClick: function () {
                        if (!disableReaction) {
                            hideMenu();
                            setQuoteMessage(message);
                        }
                    } },
                    React__default.createElement(Icon, { type: IconTypes.REPLY, fillColor: disableReaction
                            ? IconColors.ON_BACKGROUND_3
                            : IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: disableReaction ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__REPLY))),
                showMenuItemThread && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                    } },
                    React__default.createElement(Icon, { type: IconTypes.THREAD, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__THREAD))),
                showMenuItemDeleteFinal && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        if (isFailedMessage(message)) {
                            hideMenu();
                            deleteMessage === null || deleteMessage === void 0 ? void 0 : deleteMessage(message);
                        }
                        else if (!disableDelete) {
                            hideMenu();
                            showRemove === null || showRemove === void 0 ? void 0 : showRemove(true);
                        }
                    } },
                    React__default.createElement(Icon, { type: IconTypes.DELETE, fillColor: disableDelete
                            ? IconColors.ON_BACKGROUND_4
                            : IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: disableDelete
                            ? LabelColors.ONBACKGROUND_4
                            : LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__DELETE))),
                showMenuItemDownload && (React__default.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                    } },
                    React__default.createElement("a", { className: "sendbird-message__bottomsheet--hyperlink", rel: "noopener noreferrer", href: fileMessage === null || fileMessage === void 0 ? void 0 : fileMessage.url, target: "_blank" },
                        React__default.createElement(Icon, { type: IconTypes.DOWNLOAD, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                        React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__SAVE)))))))));
};

var MobileMenu = function (props) {
    var message = props.message, hideMenu = props.hideMenu, userId = props.userId, channel = props.channel, _a = props.isReactionEnabled, isReactionEnabled = _a === void 0 ? false : _a, isByMe = props.isByMe, replyType = props.replyType, disabled = props.disabled, deleteMenuState = props.deleteMenuState, showRemove = props.showRemove, showEdit = props.showEdit, resendMessage = props.resendMessage, deleteMessage = props.deleteMessage, setQuoteMessage = props.setQuoteMessage, emojiContainer = props.emojiContainer, toggleReaction = props.toggleReaction, parentRef = props.parentRef, onReplyInThread = props.onReplyInThread, isOpenedFromThread = props.isOpenedFromThread;
    return (React__default.createElement(React__default.Fragment, null, isReactionEnabled
        ? (React__default.createElement(MobileBottomSheet, { channel: channel, message: message, hideMenu: hideMenu, isByMe: isByMe, userId: userId, replyType: replyType, disabled: disabled, showRemove: showRemove, showEdit: showEdit, deleteMenuState: deleteMenuState, resendMessage: resendMessage, deleteMessage: deleteMessage, setQuoteMessage: setQuoteMessage, emojiContainer: emojiContainer, toggleReaction: toggleReaction, isReactionEnabled: isReactionEnabled, onReplyInThread: onReplyInThread, isOpenedFromThread: isOpenedFromThread })) : (React__default.createElement(MobileContextMenu, { channel: channel, userId: userId, message: message, hideMenu: hideMenu, isByMe: isByMe, showEdit: showEdit, replyType: replyType, disabled: disabled, deleteMenuState: deleteMenuState, showRemove: showRemove, resendMessage: resendMessage, deleteMessage: deleteMessage, setQuoteMessage: setQuoteMessage, parentRef: parentRef, onReplyInThread: onReplyInThread, isOpenedFromThread: isOpenedFromThread }))));
};

export { MobileMenu as M };
//# sourceMappingURL=bundle-Z-iEmjEQ.js.map
