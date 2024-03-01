'use strict';

var React = require('react');
var ui_ContextMenu = require('../ui/ContextMenu.js');
var index = require('./bundle-wzulmlgb.js');
var LocalizationContext = require('./bundle-60kIt9Rq.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Label = require('./bundle-26QzFMMl.js');
var ui_BottomSheet = require('../ui/BottomSheet.js');
var ui_ImageRenderer = require('../ui/ImageRenderer.js');
var ui_ReactionButton = require('../ui/ReactionButton.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');

var MobileContextMenu = function (props) {
    var _a, _b, _c;
    var hideMenu = props.hideMenu, channel = props.channel, message = props.message, replyType = props.replyType, userId = props.userId, resendMessage = props.resendMessage, showEdit = props.showEdit, showRemove = props.showRemove, deleteMenuState = props.deleteMenuState, deleteMessage = props.deleteMessage, setQuoteMessage = props.setQuoteMessage, parentRef = props.parentRef, onReplyInThread = props.onReplyInThread, _d = props.isOpenedFromThread, isOpenedFromThread = _d === void 0 ? false : _d;
    var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var showMenuItemCopy = index.isUserMessage(message);
    var showMenuItemEdit = (index.isUserMessage(message) && index.isSentMessage(message) && isByMe);
    var showMenuItemResend = (index.isFailedMessage(message) && (message === null || message === void 0 ? void 0 : message.isResendable) && isByMe);
    var showMenuItemDelete = !index.isPendingMessage(message) && isByMe;
    var showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
    var showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;
    var disableDelete = ((deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
        || ((_c = (_b = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _b === void 0 ? void 0 : _b.replyCount) !== null && _c !== void 0 ? _c : 0) > 0);
    var showMenuItemDownload = !index.isPendingMessage(message) && index.isFileMessage(message)
        && !(index.isVoiceMessage(message) && ((channel === null || channel === void 0 ? void 0 : channel.isSuper) || (channel === null || channel === void 0 ? void 0 : channel.isBroadcast)));
    var showMenuItemReply = (replyType === 'QUOTE_REPLY')
        && !index.isFailedMessage(message)
        && !index.isPendingMessage(message)
        && (channel === null || channel === void 0 ? void 0 : channel.isGroupChannel());
    var showMenuItemThread = (replyType === 'THREAD') && !isOpenedFromThread
        && !index.isFailedMessage(message)
        && !index.isPendingMessage(message)
        && !index.isThreadMessage(message)
        && (channel === null || channel === void 0 ? void 0 : channel.isGroupChannel());
    var fileMessage = message;
    return (React.createElement(ui_ContextMenu.default, { isOpen: true, menuItems: function () {
            var _a, _b, _c;
            return (React.createElement(ui_ContextMenu.MenuItems, { className: "sendbird-message__mobile-context-menu", parentRef: parentRef, parentContainRef: parentRef, closeDropdown: hideMenu },
                showMenuItemCopy && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-copy", onClick: function () {
                        hideMenu();
                        index.copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
                    }, dataSbId: "ui_mobile_message_item_menu_copy" },
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__COPY),
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.COPY, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemReply && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-reply", onClick: function () {
                        hideMenu();
                        setQuoteMessage(message);
                    }, disable: ((_a = message === null || message === void 0 ? void 0 : message.parentMessageId) !== null && _a !== void 0 ? _a : 0) > 0, dataSbId: "ui_mobile_message_item_menu_reply" },
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ((_b = message === null || message === void 0 ? void 0 : message.parentMessageId) !== null && _b !== void 0 ? _b : 0) > 0
                            ? ui_Label.LabelColors.ONBACKGROUND_4
                            : ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__REPLY),
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.REPLY, fillColor: ((_c = message === null || message === void 0 ? void 0 : message.parentMessageId) !== null && _c !== void 0 ? _c : 0) > 0
                            ? ui_Icon.IconColors.ON_BACKGROUND_4
                            : ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemThread && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-reply", onClick: function () {
                        hideMenu();
                        onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                    }, dataSbId: "ui_mobile_message_item_menu_thread" },
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__THREAD),
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.THREAD, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemEdit && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-edit", onClick: function () {
                        hideMenu();
                        showEdit(true);
                    }, dataSbId: "ui_mobile_message_item_menu_edit" },
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__EDIT),
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.EDIT, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemResend && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-resend", onClick: function () {
                        hideMenu();
                        resendMessage(message);
                    }, dataSbId: "ui_mobile_message_item_menu_resend" },
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__RESEND),
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.REFRESH, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemDeleteFinal && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-delete", onClick: function () {
                        if (index.isFailedMessage(message)) {
                            hideMenu();
                            deleteMessage === null || deleteMessage === void 0 ? void 0 : deleteMessage(message);
                        }
                        else if (!disableDelete) {
                            hideMenu();
                            showRemove === null || showRemove === void 0 ? void 0 : showRemove(true);
                        }
                    }, disable: disableDelete, dataSbId: "ui_mobile_message_item_menu_delete" },
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: disableDelete
                            ? ui_Label.LabelColors.ONBACKGROUND_4
                            : ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__DELETE),
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.DELETE, fillColor: disableDelete
                            ? ui_Icon.IconColors.ON_BACKGROUND_4
                            : ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
                showMenuItemDownload && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-message__mobile-context-menu-item menu-item-save", onClick: function () {
                        hideMenu();
                    }, dataSbId: "ui_mobile_message_item_menu_download_file" },
                    React.createElement("a", { className: "sendbird-message__contextmenu--hyperlink", rel: "noopener noreferrer", href: fileMessage === null || fileMessage === void 0 ? void 0 : fileMessage.url, target: "_blank" },
                        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__SAVE),
                        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.DOWNLOAD, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))))));
        } }));
};

var EMOJI_SIZE = 38;
var MobileBottomSheet = function (props) {
    var _a, _b, _c;
    var hideMenu = props.hideMenu, channel = props.channel, emojiContainer = props.emojiContainer, message = props.message, replyType = props.replyType, userId = props.userId, resendMessage = props.resendMessage, deleteMessage = props.deleteMessage, toggleReaction = props.toggleReaction, isReactionEnabled = props.isReactionEnabled, showEdit = props.showEdit, showRemove = props.showRemove, deleteMenuState = props.deleteMenuState, setQuoteMessage = props.setQuoteMessage, onReplyInThread = props.onReplyInThread, _d = props.isOpenedFromThread, isOpenedFromThread = _d === void 0 ? false : _d;
    var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var isOnline = globalStore.config.isOnline;
    var showMenuItemCopy = index.isUserMessage(message);
    var showMenuItemEdit = (index.isUserMessage(message) && index.isSentMessage(message) && isByMe);
    var showMenuItemResend = (isOnline && index.isFailedMessage(message) && (message === null || message === void 0 ? void 0 : message.isResendable) && isByMe);
    var showMenuItemDelete = !index.isPendingMessage(message) && isByMe;
    var showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
    var showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;
    var disableDelete = ((deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
        || ((_c = (_b = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _b === void 0 ? void 0 : _b.replyCount) !== null && _c !== void 0 ? _c : 0) > 0);
    var showMenuItemDownload = index.isSentMessage(message) && index.isFileMessage(message) && !index.isVoiceMessage(message);
    var showReaction = !index.isFailedMessage(message) && !index.isPendingMessage(message) && isReactionEnabled;
    var showMenuItemReply = (replyType === 'QUOTE_REPLY')
        && !index.isFailedMessage(message)
        && !index.isPendingMessage(message)
        && ((channel === null || channel === void 0 ? void 0 : channel.isGroupChannel()) && !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast));
    var showMenuItemThread = (replyType === 'THREAD') && !isOpenedFromThread
        && !index.isFailedMessage(message)
        && !index.isPendingMessage(message)
        && !index.isThreadMessage(message)
        && ((channel === null || channel === void 0 ? void 0 : channel.isGroupChannel()) && !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast));
    var disableReaction = (message === null || message === void 0 ? void 0 : message.parentMessageId) > 0;
    var fileMessage = message;
    var maxEmojisPerRow = Math.floor(window.innerWidth / EMOJI_SIZE) - 1;
    var _e = React.useState(false), showEmojisOnly = _e[0], setShowEmojisOnly = _e[1];
    var emojis = index.getEmojiListAll(emojiContainer);
    // calculate max emojis that can be shown in screen
    var visibleEmojis = showEmojisOnly
        ? emojis
        : emojis === null || emojis === void 0 ? void 0 : emojis.slice(0, maxEmojisPerRow);
    var canShowMoreEmojis = emojis.length > maxEmojisPerRow;
    return (React.createElement(ui_BottomSheet, { onBackdropClick: hideMenu },
        React.createElement("div", { className: 'sendbird-message__bottomsheet' },
            showReaction && (React.createElement("div", { className: 'sendbird-message__bottomsheet-reactions' },
                React.createElement("ul", { className: "sendbird-message__bottomsheet-reaction-bar" },
                    React.createElement("div", { className: "\n                    sendbird-message__bottomsheet-reaction-bar__row\n                    ".concat(showEmojisOnly ? 'sendbird-message__bottomsheet-reaction-bar__all' : '', "\n                  ") },
                        visibleEmojis.map(function (emoji) {
                            var _a, _b, _c;
                            var isReacted = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.filter(function (reaction) { return reaction.key === emoji.key; })[0]) === null || _b === void 0 ? void 0 : _b.userIds) === null || _c === void 0 ? void 0 : _c.some(function (reactorId) { return reactorId === userId; });
                            return (React.createElement(ui_ReactionButton, { key: emoji.key, width: "".concat(EMOJI_SIZE, "px"), height: "".concat(EMOJI_SIZE, "px"), selected: isReacted, onClick: function () {
                                    hideMenu();
                                    toggleReaction(message, emoji.key, isReacted);
                                }, dataSbId: "ui_mobile_emoji_reactions_menu_".concat(emoji.key) },
                                React.createElement(ui_ImageRenderer.default, { url: (emoji === null || emoji === void 0 ? void 0 : emoji.url) || '', width: "28px", height: "28px", placeHolder: function (_a) {
                                        var style = _a.style;
                                        return (React.createElement("div", { style: style },
                                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.QUESTION, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                                    } })));
                        }),
                        canShowMoreEmojis && !showEmojisOnly && (React.createElement(ui_ReactionButton, { key: "emoji_more", width: "38px", height: "38px", onClick: function () {
                                setShowEmojisOnly(true);
                            }, dataSbId: "ui_mobile_emoji_reactions_menu_emojiadd" },
                            React.createElement(ui_ImageRenderer.default, { url: '', width: "28px", height: "28px", placeHolder: function (_a) {
                                    var style = _a.style;
                                    return (React.createElement("div", { style: style },
                                        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.EMOJI_MORE, fillColor: ui_Icon.IconColors.ON_BACKGROUND_3, width: "28px", height: "28px" })));
                                } }))))))),
            !showEmojisOnly && (React.createElement("div", { className: 'sendbird-message__bottomsheet--actions' },
                showMenuItemCopy && (React.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        index.copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
                    } },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.COPY, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__COPY))),
                showMenuItemEdit && (React.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        showEdit(true);
                    } },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.EDIT, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__EDIT))),
                showMenuItemResend && (React.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        resendMessage(message);
                    } },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.REFRESH, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__RESEND))),
                showMenuItemReply && (React.createElement("div", { className: "sendbird-message__bottomsheet--action\n                      ".concat(disableReaction ? 'sendbird-message__bottomsheet--action-disabled' : '', "\n                    "), role: "menuitem", "aria-disabled": disableReaction ? true : false, onClick: function () {
                        if (!disableReaction) {
                            hideMenu();
                            setQuoteMessage(message);
                        }
                    } },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.REPLY, fillColor: disableReaction
                            ? ui_Icon.IconColors.ON_BACKGROUND_3
                            : ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: disableReaction ? ui_Label.LabelColors.ONBACKGROUND_4 : ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__REPLY))),
                showMenuItemThread && (React.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                        onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                    } },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.THREAD, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.MESSAGE_MENU__THREAD))),
                showMenuItemDeleteFinal && (React.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        if (index.isFailedMessage(message)) {
                            hideMenu();
                            deleteMessage === null || deleteMessage === void 0 ? void 0 : deleteMessage(message);
                        }
                        else if (!disableDelete) {
                            hideMenu();
                            showRemove === null || showRemove === void 0 ? void 0 : showRemove(true);
                        }
                    } },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.DELETE, fillColor: disableDelete
                            ? ui_Icon.IconColors.ON_BACKGROUND_4
                            : ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: disableDelete
                            ? ui_Label.LabelColors.ONBACKGROUND_4
                            : ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__DELETE))),
                showMenuItemDownload && (React.createElement("div", { className: 'sendbird-message__bottomsheet--action', onClick: function () {
                        hideMenu();
                    } },
                    React.createElement("a", { className: "sendbird-message__bottomsheet--hyperlink", rel: "noopener noreferrer", href: fileMessage === null || fileMessage === void 0 ? void 0 : fileMessage.url, target: "_blank" },
                        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.DOWNLOAD, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }),
                        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet === null || stringSet === void 0 ? void 0 : stringSet.MESSAGE_MENU__SAVE)))))))));
};

var MobileMenu = function (props) {
    var message = props.message, hideMenu = props.hideMenu, userId = props.userId, channel = props.channel, _a = props.isReactionEnabled, isReactionEnabled = _a === void 0 ? false : _a, isByMe = props.isByMe, replyType = props.replyType, disabled = props.disabled, deleteMenuState = props.deleteMenuState, showRemove = props.showRemove, showEdit = props.showEdit, resendMessage = props.resendMessage, deleteMessage = props.deleteMessage, setQuoteMessage = props.setQuoteMessage, emojiContainer = props.emojiContainer, toggleReaction = props.toggleReaction, parentRef = props.parentRef, onReplyInThread = props.onReplyInThread, isOpenedFromThread = props.isOpenedFromThread;
    return (React.createElement(React.Fragment, null, isReactionEnabled
        ? (React.createElement(MobileBottomSheet, { channel: channel, message: message, hideMenu: hideMenu, isByMe: isByMe, userId: userId, replyType: replyType, disabled: disabled, showRemove: showRemove, showEdit: showEdit, deleteMenuState: deleteMenuState, resendMessage: resendMessage, deleteMessage: deleteMessage, setQuoteMessage: setQuoteMessage, emojiContainer: emojiContainer, toggleReaction: toggleReaction, isReactionEnabled: isReactionEnabled, onReplyInThread: onReplyInThread, isOpenedFromThread: isOpenedFromThread })) : (React.createElement(MobileContextMenu, { channel: channel, userId: userId, message: message, hideMenu: hideMenu, isByMe: isByMe, showEdit: showEdit, replyType: replyType, disabled: disabled, deleteMenuState: deleteMenuState, showRemove: showRemove, resendMessage: resendMessage, deleteMessage: deleteMessage, setQuoteMessage: setQuoteMessage, parentRef: parentRef, onReplyInThread: onReplyInThread, isOpenedFromThread: isOpenedFromThread }))));
};

exports.MobileMenu = MobileMenu;
//# sourceMappingURL=bundle-VLUCx6pj.js.map
