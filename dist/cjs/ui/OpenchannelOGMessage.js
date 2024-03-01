'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var index$1 = require('../chunks/bundle-Ny3NKw-X.js');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Icon = require('./Icon.js');
var ui_IconButton = require('./IconButton.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var ui_LinkLabel = require('./LinkLabel.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
var ui_Loader = require('./Loader.js');
var ui_UserProfile = require('./UserProfile.js');
var UserProfileContext = require('../chunks/bundle-DKcL-93i.js');
var uuid = require('../chunks/bundle-Gzug-R-w.js');
var utils = require('../chunks/bundle-XXuhZ3_I.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var index = require('../chunks/bundle-CMujcR1g.js');
var MediaQueryContext = require('../chunks/bundle-MZHOyRuu.js');
var useLongPress = require('../chunks/bundle-Kz-b8WGm.js');
var index$2 = require('../chunks/bundle-TSHHC3WX.js');
var tokenize = require('../chunks/bundle-Q2J-7okW.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-uGaTvmsl.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-eH49AisR.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-LutGJd7y.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');
require('../Message/context.js');
require('./MentionLabel.js');

var checkOGIsEnalbed = function (message) {
    var ogMetaData = message.ogMetaData;
    if (!ogMetaData) {
        return false;
    }
    var url = ogMetaData.url;
    if (!url) {
        return false;
    }
    return true;
};

function OpenchannelOGMessage(_a) {
    var _b, _c;
    var message = _a.message, isOperator = _a.isOperator, _d = _a.isEphemeral, isEphemeral = _d === void 0 ? false : _d, className = _a.className, disabled = _a.disabled, showEdit = _a.showEdit, showRemove = _a.showRemove, resendMessage = _a.resendMessage, chainTop = _a.chainTop, userId = _a.userId;
    var status = message === null || message === void 0 ? void 0 : message.sendingStatus;
    var ogMetaData = (_b = message.ogMetaData) !== null && _b !== void 0 ? _b : null;
    var defaultImage = ogMetaData === null || ogMetaData === void 0 ? void 0 : ogMetaData.defaultImage;
    var _e = LocalizationContext.useLocalization(), stringSet = _e.stringSet, dateLocale = _e.dateLocale;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var _f = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _f.disableUserProfile, renderUserProfile = _f.renderUserProfile;
    var _g = React.useState({}), contextStyle = _g[0], setContextStyle = _g[1];
    var _h = React.useState(false), showContextMenu = _h[0], setShowContextMenu = _h[1];
    var openLink = function () {
        if (checkOGIsEnalbed(message) && (ogMetaData === null || ogMetaData === void 0 ? void 0 : ogMetaData.url)) {
            window.open(ogMetaData.url, '_blank', 'noopener,noreferrer');
        }
    };
    var onLongPress = useLongPress.useLongPress({
        onLongPress: function () { return setShowContextMenu(true); },
        onClick: openLink,
    }, {
        delay: 300,
    });
    var messageComponentRef = React.useRef(null);
    var contextMenuRef = React.useRef(null);
    var mobileMenuRef = React.useRef(null);
    var avatarRef = React.useRef(null);
    var isPending = index.checkIsPending(status);
    var isFailed = index.checkIsFailed(status);
    var sender = index.getSenderFromMessage(message);
    var tokens = React.useMemo(function () {
        return tokenize.tokenizeMessage({
            messageText: message.message,
        });
    }, [message === null || message === void 0 ? void 0 : message.updatedAt, message === null || message === void 0 ? void 0 : message.message]);
    // place conxt menu top depending clientHeight of message component
    React.useEffect(function () {
        var _a;
        if (((_a = messageComponentRef === null || messageComponentRef === void 0 ? void 0 : messageComponentRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) > 36) {
            setContextStyle({ top: '8px ' });
        }
        else {
            setContextStyle({ top: '2px' });
        }
    }, [window.innerWidth]);
    if (!message || message.messageType !== 'user') {
        return React.createElement(React.Fragment, null);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", _tslib.__assign({ className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                'sendbird-openchannel-og-message',
            ], false).join(' '), ref: messageComponentRef }, (isMobile ? _tslib.__assign({}, onLongPress) : {})),
            React.createElement("div", { className: "sendbird-openchannel-og-message__top" },
                React.createElement("div", { className: "sendbird-openchannel-og-message__top__left" }, !chainTop && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-openchannel-og-message__top__left__avatar", src: sender.profileUrl || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
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
                React.createElement("div", { className: "sendbird-openchannel-og-message__top__right" },
                    !chainTop && (React.createElement("div", { className: "sendbird-openchannel-og-message__top__right__title" },
                        React.createElement(ui_Label.Label, { className: "sendbird-openchannel-og-message__top__right__title__sender-name", type: ui_Label.LabelTypography.CAPTION_2, color: isOperator ? ui_Label.LabelColors.SECONDARY_3 : ui_Label.LabelColors.ONBACKGROUND_2 }, sender && (sender.friendName
                            || sender.nickname
                            || sender.userId)),
                        React.createElement(ui_Label.Label, { className: "sendbird-openchannel-og-message__top__right__title__sent-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_3 }, (message === null || message === void 0 ? void 0 : message.createdAt) && (index$1.format(message === null || message === void 0 ? void 0 : message.createdAt, 'p', {
                            locale: dateLocale,
                        }))))),
                    React.createElement("div", { className: "sendbird-openchannel-og-message__top__right__description" },
                        React.createElement(ui_Label.Label, { className: "sendbird-openchannel-og-message__top__right__description__message", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 },
                            React.createElement(index$2.TextFragment, { tokens: tokens }),
                            (((_c = message === null || message === void 0 ? void 0 : message.updatedAt) !== null && _c !== void 0 ? _c : 0) > 0) && (React.createElement(ui_Label.Label, { key: uuid.uuidv4(), className: 'sendbird-openchannel-og-message--word', type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.MESSAGE_EDITED))))),
                !isMobile && (React.createElement("div", { className: "sendbird-openchannel-og-message__top__context-menu", ref: contextMenuRef, style: contextStyle },
                    React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (index.showMenuTrigger({ message: message, userId: userId, status: status }) && (React.createElement(ui_IconButton, { className: "sendbird-openchannel-og-message__top__context-menu--icon", width: "32px", height: "32px", onClick: function () {
                                toggleDropdown();
                            } },
                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE, width: "24px", height: "24px" })))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentRef: contextMenuRef, parentContainRef: contextMenuRef, closeDropdown: closeDropdown, openLeft: true },
                            index.isFineCopy({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__copy", onClick: function () {
                                    utils.copyToClipboard(message.message);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_copy" }, stringSet.CONTEXT_MENU_DROPDOWN__COPY)),
                            (!isEphemeral && index.isFineEdit({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__edit", onClick: function () {
                                    if (disabled) {
                                        return;
                                    }
                                    showEdit(true);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_edit" }, stringSet.CONTEXT_MENU_DROPDOWN__EDIT)),
                            index.isFineResend({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__resend", onClick: function () {
                                    resendMessage(message);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_resend" }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND)),
                            (!isEphemeral && index.isFineDelete({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__delete", onClick: function () {
                                    if (disabled) {
                                        return;
                                    }
                                    showRemove(true);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_delete" }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE)))); } })))),
            React.createElement("div", { className: "sendbird-openchannel-og-message__bottom" },
                React.createElement("div", { className: "sendbird-openchannel-og-message__bottom__og-tag", ref: mobileMenuRef },
                    ogMetaData.url && (React.createElement(ui_Label.Label, { className: "sendbird-openchannel-og-message__bottom__og-tag__url", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, ogMetaData.url)),
                    ogMetaData.title && (React.createElement(ui_LinkLabel.default, { className: "sendbird-openchannel-og-message__bottom__og-tag__title", src: ogMetaData.url, type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.PRIMARY }, ogMetaData.title)),
                    ogMetaData.description && (React.createElement(ui_Label.Label, { className: "sendbird-openchannel-og-message__bottom__og-tag__description", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, ogMetaData.description)),
                    ogMetaData.url && (React.createElement("div", { className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail", role: "button", onClick: openLink, onKeyDown: openLink, tabIndex: 0 }, defaultImage && (React.createElement(ui_ImageRenderer.default, { className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image", url: defaultImage.url || '', alt: defaultImage.alt || '', height: "189px", defaultComponent: (React.createElement("div", { className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image--placeholder" },
                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.THUMBNAIL_NONE, width: "56px", height: "56px" }))) }))))),
                (isPending || isFailed) && (React.createElement("div", { className: "sendbird-openchannel-og-message__top__right__tail" },
                    isPending && (React.createElement(ui_Loader, { width: "16px", height: "16px" },
                        React.createElement(ui_Icon.default, { className: "sendbird-openchannel-og-message__top__right__tail__pending", type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" }))),
                    isFailed && (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-og-message__top__right__tail__failed", type: ui_Icon.IconTypes.ERROR, fillColor: ui_Icon.IconColors.ERROR, width: "16px", height: "16px" })))))),
        showContextMenu && (React.createElement(index.OpenChannelMobileMenu, { message: message, parentRef: mobileMenuRef, hideMenu: function () {
                setShowContextMenu(false);
            }, showRemove: function () {
                setShowContextMenu(false);
                showRemove(true);
            }, showEdit: function () {
                setShowContextMenu(false);
                showEdit(true);
            }, copyToClipboard: function () {
                setShowContextMenu(false);
                utils.copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
            }, resendMessage: function () {
                setShowContextMenu(false);
                resendMessage(message);
            } }))));
}

module.exports = OpenchannelOGMessage;
//# sourceMappingURL=OpenchannelOGMessage.js.map
