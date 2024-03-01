'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var index$1 = require('../chunks/bundle-Ny3NKw-X.js');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_Loader = require('./Loader.js');
var ui_Icon = require('./Icon.js');
var ui_IconButton = require('./IconButton.js');
var ui_TextButton = require('./TextButton.js');
var ui_UserProfile = require('./UserProfile.js');
var UserProfileContext = require('../chunks/bundle-DKcL-93i.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var index = require('../chunks/bundle-CMujcR1g.js');
var MediaQueryContext = require('../chunks/bundle-MZHOyRuu.js');
var useLongPress = require('../chunks/bundle-Kz-b8WGm.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('./ImageRenderer.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-uGaTvmsl.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-Gzug-R-w.js');
require('../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-KNt569rP.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-LutGJd7y.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');

var checkFileType = function (fileUrl) {
    var audioFile = /(\.mp3)$/i;
    var gifFile = /(\.gif)$/i;
    if (audioFile.test(fileUrl)) {
        return ui_Icon.IconTypes.FILE_AUDIO;
    }
    if (gifFile.test(fileUrl)) {
        return ui_Icon.IconTypes.GIF;
    }
    return ui_Icon.IconTypes.FILE_DOCUMENT;
};
var truncate = function (fullStr, strLen) {
    if (fullStr === null || fullStr === undefined)
        return '';
    if (fullStr.length <= strLen)
        return fullStr;
    var separator = '...';
    var sepLen = separator.length;
    var charsToShow = strLen - sepLen;
    var frontChars = Math.ceil(charsToShow / 2);
    var backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

function OpenchannelFileMessage(_a) {
    var className = _a.className, message = _a.message, isOperator = _a.isOperator, _b = _a.isEphemeral, isEphemeral = _b === void 0 ? false : _b, userId = _a.userId, disabled = _a.disabled, chainTop = _a.chainTop, showRemove = _a.showRemove, resendMessage = _a.resendMessage;
    var status = message === null || message === void 0 ? void 0 : message.sendingStatus;
    var _c = LocalizationContext.useLocalization(), dateLocale = _c.dateLocale, stringSet = _c.stringSet;
    var contextMenuRef = React.useRef(null);
    var mobileMenuRef = React.useRef(null);
    var avatarRef = React.useRef(null);
    var _d = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _d.disableUserProfile, renderUserProfile = _d.renderUserProfile;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var openFileUrl = function () { window.open(message.url); };
    var isPending = index.checkIsPending(status);
    var isFailed = index.checkIsFailed(status);
    var sender = index.getSenderFromMessage(message);
    var _e = React.useState(false), contextMenu = _e[0], setContextMenu = _e[1];
    var longPress = useLongPress.useLongPress({
        onLongPress: function () {
            if (isMobile) {
                setContextMenu(true);
            }
        },
        onClick: openFileUrl,
    }, { delay: 300 });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                'sendbird-openchannel-file-message',
            ], false).join(' '), ref: mobileMenuRef },
            React.createElement("div", { className: "sendbird-openchannel-file-message__left" }, !chainTop && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-openchannel-file-message__left__avatar", src: sender.profileUrl || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
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
            React.createElement("div", { className: "sendbird-openchannel-file-message__right" },
                !chainTop && (React.createElement("div", { className: "sendbird-openchannel-file-message__right__title" },
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-file-message__right__title__sender-name", type: ui_Label.LabelTypography.CAPTION_2, color: isOperator ? ui_Label.LabelColors.SECONDARY_3 : ui_Label.LabelColors.ONBACKGROUND_2 }, sender && (sender.friendName
                        || sender.nickname
                        || sender.userId)),
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-file-message__right__title__sent-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_3 }, (message === null || message === void 0 ? void 0 : message.createdAt) && (index$1.format(message.createdAt, 'p', {
                        locale: dateLocale,
                    }))))),
                React.createElement("div", _tslib.__assign({ className: "sendbird-openchannel-file-message__right__body" }, (isMobile ? _tslib.__assign({}, longPress) : {})),
                    checkFileType(message.url) && (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-file-message__right__body__icon", type: checkFileType(message.url), fillColor: ui_Icon.IconColors.PRIMARY, width: "48px", height: "48px" })),
                    React.createElement(ui_TextButton, { className: "sendbird-openchannel-file-message__right__body__file-name", onClick: openFileUrl },
                        React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, truncate(message.name || message.url, 40)))),
                (isPending || isFailed) && (React.createElement("div", { className: "sendbird-openchannel-file-message__right__tail" },
                    isPending && (React.createElement(ui_Loader, { width: "16px", height: "16px" },
                        React.createElement(ui_Icon.default, { className: "sendbird-openchannel-file-message__right__tail__pending", type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" }))),
                    isFailed && (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-file-message__right__tail__failed", type: ui_Icon.IconTypes.ERROR, fillColor: ui_Icon.IconColors.ERROR, width: "16px", height: "16px" }))))),
            !isMobile && (React.createElement("div", { className: "sendbird-openchannel-file-message__context-menu", ref: contextMenuRef }, (index.isFineResend({ message: message, userId: userId, status: status }) || !isEphemeral) && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (index.showMenuTrigger({ message: message, userId: userId, status: status }) && (React.createElement(ui_IconButton, { className: "sendbird-openchannel-file-message__context-menu__icon", width: "32px", height: "32px", onClick: toggleDropdown },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.MORE, width: "24px", height: "24px" })))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentRef: contextMenuRef, parentContainRef: contextMenuRef, closeDropdown: closeDropdown, openLeft: true },
                    index.isFineResend({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                            if (disabled) {
                                return;
                            }
                            resendMessage(message);
                            closeDropdown();
                        }, dataSbId: "open_channel_file_message_context_menu_resend" }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND)),
                    (!isEphemeral && index.isFineDelete({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                            if (disabled) {
                                return;
                            }
                            showRemove(true);
                            closeDropdown();
                        }, dataSbId: "open_channel_file_message_context_menu_delete" }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE)))); } }))))),
        contextMenu && (React.createElement(index.OpenChannelMobileMenu, { message: message, hideMenu: function () {
                setContextMenu(false);
            }, parentRef: mobileMenuRef, showRemove: function () {
                setContextMenu(false);
                showRemove(true);
            } }))));
}

module.exports = OpenchannelFileMessage;
//# sourceMappingURL=OpenchannelFileMessage.js.map
