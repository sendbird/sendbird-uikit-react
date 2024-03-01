'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var index$1 = require('../chunks/bundle-Ny3NKw-X.js');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Icon = require('./Icon.js');
var ui_IconButton = require('./IconButton.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_Loader = require('./Loader.js');
var ui_UserProfile = require('./UserProfile.js');
var UserProfileContext = require('../chunks/bundle-DKcL-93i.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var utils = require('../chunks/bundle-XXuhZ3_I.js');
var uuid = require('../chunks/bundle-Gzug-R-w.js');
var index = require('../chunks/bundle-CMujcR1g.js');
var MediaQueryContext = require('../chunks/bundle-MZHOyRuu.js');
var useLongPress = require('../chunks/bundle-Kz-b8WGm.js');
var index$2 = require('../chunks/bundle-wzulmlgb.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('./ImageRenderer.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-uGaTvmsl.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-eH49AisR.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-LutGJd7y.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');

function OpenchannelUserMessage(_a) {
    var className = _a.className, message = _a.message, isOperator = _a.isOperator, _b = _a.isEphemeral, isEphemeral = _b === void 0 ? false : _b, userId = _a.userId, resendMessage = _a.resendMessage, disabled = _a.disabled, showEdit = _a.showEdit, showRemove = _a.showRemove, chainTop = _a.chainTop;
    // hooks
    var _c = LocalizationContext.useLocalization(), stringSet = _c.stringSet, dateLocale = _c.dateLocale;
    var _d = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _d.disableUserProfile, renderUserProfile = _d.renderUserProfile;
    var messageRef = React.useRef(null);
    var avatarRef = React.useRef(null);
    var contextMenuRef = React.useRef(null);
    var mobileMenuRef = React.useRef(null);
    var _e = React.useState({}), contextStyle = _e[0], setContextStyle = _e[1];
    var _f = React.useState(false), contextMenu = _f[0], setContextMenu = _f[1];
    // consts
    var status = message === null || message === void 0 ? void 0 : message.sendingStatus;
    var isPending = index.checkIsPending(status);
    var isFailed = index.checkIsFailed(status);
    var sender = index.getSenderFromMessage(message);
    // place context menu top depending clientHeight of message component
    React.useEffect(function () {
        var _a;
        if (((_a = messageRef === null || messageRef === void 0 ? void 0 : messageRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) > 36) {
            setContextStyle({ top: '8px ' });
        }
        else {
            setContextStyle({ top: '2px' });
        }
    }, [window.innerWidth]);
    var onLongPress = useLongPress.useLongPress({
        onLongPress: function () {
            setContextMenu(true);
        },
    });
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    if (!message || message.messageType !== 'user') {
        return React.createElement(React.Fragment, null);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                'sendbird-openchannel-user-message',
            ], false).join(' '), ref: messageRef },
            React.createElement("div", { className: "sendbird-openchannel-user-message__left" }, !chainTop && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-openchannel-user-message__left__avatar", src: sender.profileUrl || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
                        if (!disableUserProfile) {
                            toggleDropdown();
                        }
                    } })); }, menuItems: function (closeDropdown) { return (renderUserProfile
                    ? (renderUserProfile({
                        user: sender,
                        close: closeDropdown,
                        currentUserId: userId,
                        avatarRef: avatarRef,
                    }))
                    : (React.createElement(ui_ContextMenu.MenuItems, { parentRef: avatarRef, parentContainRef: avatarRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                        React.createElement(ui_UserProfile, { user: sender, onSuccess: closeDropdown, disableMessaging: true })))); } }))),
            React.createElement("div", { className: "sendbird-openchannel-user-message__right" },
                !chainTop && (React.createElement("div", { className: "sendbird-openchannel-user-message__right__top" },
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-user-message__right__top__sender-name", type: ui_Label.LabelTypography.CAPTION_2, color: isOperator ? ui_Label.LabelColors.SECONDARY_3 : ui_Label.LabelColors.ONBACKGROUND_2 }, sender && (sender.friendName
                        || sender.nickname
                        || sender.userId)),
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-user-message__right__top__sent-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_3 }, (message === null || message === void 0 ? void 0 : message.createdAt) && (index$1.format(message === null || message === void 0 ? void 0 : message.createdAt, 'p', {
                        locale: dateLocale,
                    }))))),
                React.createElement("div", _tslib.__assign({}, (isMobile ? _tslib.__assign({}, onLongPress) : {}), { className: "sendbird-openchannel-user-message__right__bottom", ref: mobileMenuRef }),
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-user-message__right__bottom__message", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, message === null || message === void 0 ? void 0 :
                        message.message,
                        index$2.isEditedMessage(message) && (React.createElement(ui_Label.Label, { key: uuid.uuidv4(), type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_2, className: "sendbird-openchannel-user-message-word" }, " ".concat(stringSet.MESSAGE_EDITED, " "))))),
                (isPending || isFailed) && (React.createElement("div", { className: "sendbird-openchannel-user-message__right__tail" },
                    isPending && (React.createElement(ui_Loader, { width: "16px", height: "16px" },
                        React.createElement(ui_Icon.default, { className: "sendbird-openchannel-user-message__right__tail__pending", type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" }))),
                    isFailed && (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-user-message__right__tail__failed", type: ui_Icon.IconTypes.ERROR, fillColor: ui_Icon.IconColors.ERROR, width: "16px", height: "16px" }))))),
            !isMobile && (React.createElement("div", { className: "sendbird-openchannel-user-message__context-menu", ref: contextMenuRef, style: contextStyle },
                React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (index.showMenuTrigger({ message: message, userId: userId, status: status }) && (React.createElement(ui_IconButton, { className: "sendbird-openchannel-user-message__context-menu--icon", width: "32px", height: "32px", onClick: function () {
                            toggleDropdown();
                        } },
                        React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE, width: "24px", height: "24px" })))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentRef: contextMenuRef, parentContainRef: contextMenuRef, closeDropdown: closeDropdown, openLeft: true },
                        index.isFineCopy({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-user-message__context-menu__copy", onClick: function () {
                                utils.copyToClipboard(message.message);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_copy" }, stringSet.CONTEXT_MENU_DROPDOWN__COPY)),
                        (!isEphemeral && index.isFineEdit({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-user-message__context-menu__edit", onClick: function () {
                                if (disabled) {
                                    return;
                                }
                                showEdit(true);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_edit" }, stringSet.CONTEXT_MENU_DROPDOWN__EDIT)),
                        index.isFineResend({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-user-message__context-menu__resend", onClick: function () {
                                resendMessage(message);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_resend" }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND)),
                        (!isEphemeral && index.isFineDelete({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-user-message__context-menu__delete", onClick: function () {
                                if (disabled) {
                                    return;
                                }
                                showRemove(true);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_delete" }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE)))); } })))),
        contextMenu && (React.createElement(index.OpenChannelMobileMenu, { message: message, parentRef: mobileMenuRef, hideMenu: function () {
                setContextMenu(false);
            }, showRemove: function () {
                setContextMenu(false);
                showRemove(true);
            }, showEdit: function () {
                setContextMenu(false);
                showEdit(true);
            }, copyToClipboard: function () {
                setContextMenu(false);
                utils.copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
            }, resendMessage: function () {
                setContextMenu(false);
                resendMessage(message);
            } }))));
}

module.exports = OpenchannelUserMessage;
//# sourceMappingURL=OpenchannelUserMessage.js.map
