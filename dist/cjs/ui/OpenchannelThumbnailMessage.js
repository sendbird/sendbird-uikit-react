'use strict';

var _tslib = require('../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var index$1 = require('../chunks/bundle-T9gnzy2i.js');
var LocalizationContext = require('../chunks/bundle-Nz6fSUye.js');
var ui_Avatar = require('../chunks/bundle-PoiZwjvJ.js');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Icon = require('./Icon.js');
var ui_IconButton = require('./IconButton.js');
var ui_ImageRenderer = require('./ImageRenderer.js');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
var ui_Loader = require('./Loader.js');
var ui_UserProfile = require('./UserProfile.js');
var UserProfileContext = require('../chunks/bundle-HnlcCy36.js');
var index = require('../chunks/bundle-onSp6JcR.js');
var MediaQueryContext = require('../chunks/bundle-37dz9yoi.js');
var useLongPress = require('../chunks/bundle-l768-Ldg.js');
require('../chunks/bundle-eyiJykZ-.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-5mXB6h1C.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-NNEanMqk.js');
require('../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-8G36Z6Or.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-NfUcey5s.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');

var SUPPORTING_TYPES = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    UNSUPPORTED: 'UNSUPPORTED',
};
var SUPPORTED_MIMES = {
    IMAGE: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ],
    VIDEO: [
        'video/mpeg',
        'video/ogg',
        'video/webm',
        'video/mp4',
    ],
};
var getSupportingFileType = function (type) {
    if (SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0) {
        return SUPPORTING_TYPES.IMAGE;
    }
    if (SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0) {
        return SUPPORTING_TYPES.VIDEO;
    }
    return SUPPORTING_TYPES.UNSUPPORTED;
};

function OpenchannelThumbnailMessage(_a) {
    var _b;
    var className = _a.className, message = _a.message, isOperator = _a.isOperator, _c = _a.isEphemeral, isEphemeral = _c === void 0 ? false : _c, disabled = _a.disabled, userId = _a.userId, chainTop = _a.chainTop, onClick = _a.onClick, showRemove = _a.showRemove, resendMessage = _a.resendMessage;
    var type = message.type, url = message.url, thumbnails = message.thumbnails, localUrl = message.localUrl;
    var status = message === null || message === void 0 ? void 0 : message.sendingStatus;
    var thumbnailUrl = (thumbnails && thumbnails.length > 0 && thumbnails[0].url) || null;
    var _d = LocalizationContext.useLocalization(), stringSet = _d.stringSet, dateLocale = _d.dateLocale;
    var _e = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _e.disableUserProfile, renderUserProfile = _e.renderUserProfile;
    var _f = React.useState(360), messageWidth = _f[0], setMessageWidth = _f[1];
    var _g = React.useState(false), contextMenu = _g[0], setContextMenu = _g[1];
    var messageRef = React.useRef(null);
    var mobileMenuRef = React.useRef(null);
    var contextMenuRef = React.useRef(null);
    var avatarRef = React.useRef(null);
    var onLongPress = useLongPress.useLongPress({
        onLongPress: function () { setContextMenu(true); },
        onClick: function () { onClick(true); },
    });
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var memorizedThumbnailPlaceHolder = React.useMemo(function () { return function (type) { return function (_a) {
        var style = _a.style;
        return ( // eslint-disable-line
        React.createElement("div", { style: style },
            React.createElement(ui_Icon.default, { type: type, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "56px", height: "56px" })));
    }; }; }, []);
    var isMessageSent = index.checkIsSent(status);
    var isPending = index.checkIsPending(status);
    var isFailed = index.checkIsFailed(status);
    var sender = index.getSenderFromMessage(message);
    React.useEffect(function () {
        var _a, _b;
        var thumbnailWidth = ((_b = (_a = messageRef === null || messageRef === void 0 ? void 0 : messageRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0) - 80;
        setMessageWidth(thumbnailWidth > 360 ? 360 : thumbnailWidth);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                'sendbird-openchannel-thumbnail-message',
            ], false).join(' '), ref: messageRef },
            React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__left" }, !chainTop && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-openchannel-thumbnail-message__left__avatar", src: sender.profileUrl || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
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
            React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__right" },
                !chainTop && (React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__right__title" },
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-thumbnail-message__right__title__sender-name", type: ui_Label.LabelTypography.CAPTION_2, color: isOperator ? ui_Label.LabelColors.SECONDARY_3 : ui_Label.LabelColors.ONBACKGROUND_2 }, sender && (sender.friendName
                        || sender.nickname
                        || sender.userId)),
                    React.createElement(ui_Label.Label, { className: "sendbird-openchannel-thumbnail-message__right__title__sent-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_3 }, (message === null || message === void 0 ? void 0 : message.createdAt) && (index$1.format(message.createdAt, 'p', {
                        locale: dateLocale,
                    }))))),
                React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__right__body", ref: mobileMenuRef },
                    React.createElement("div", _tslib.__assign({ className: "sendbird-openchannel-thumbnail-message__right__body__wrap", role: "button", onClick: function () {
                            if (isMessageSent) {
                                onClick(true);
                            }
                        }, onKeyDown: function () {
                            if (isMessageSent) {
                                onClick(true);
                            }
                        }, tabIndex: 0 }, (isMobile ? _tslib.__assign({}, onLongPress) : {})),
                        React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__overlay" }),
                        (_b = {},
                            _b[SUPPORTING_TYPES.VIDEO] = ((url || localUrl)
                                ? (React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video" },
                                    (thumbnailUrl)
                                        ? (React.createElement(ui_ImageRenderer.default, { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video", url: thumbnailUrl, width: messageWidth, height: "270px", alt: "image", placeHolder: memorizedThumbnailPlaceHolder(ui_Icon.IconTypes.PLAY) }))
                                        : (React.createElement("video", { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video__video" },
                                            React.createElement("source", { src: url || localUrl, type: type }))),
                                    React.createElement(ui_Icon.default, { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon", type: ui_Icon.IconTypes.PLAY, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "56px", height: "56px" })))
                                : (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__video--icon", type: ui_Icon.IconTypes.PHOTO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "56px", height: "56px" }))),
                            _b[SUPPORTING_TYPES.IMAGE] = ((url || localUrl)
                                ? (React.createElement(ui_ImageRenderer.default, { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__image", url: thumbnailUrl || url || localUrl, alt: "image", width: messageWidth, height: "270px", placeHolder: memorizedThumbnailPlaceHolder(ui_Icon.IconTypes.PHOTO) }))
                                : (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon", type: ui_Icon.IconTypes.PHOTO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "56px", height: "56px" }))),
                            _b[SUPPORTING_TYPES.UNSUPPORTED] = (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-thumbnail-message__right__body__wrap__unknown", type: ui_Icon.IconTypes.PHOTO, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "56px", height: "56px" })),
                            _b)[getSupportingFileType(type)])),
                (isPending || isFailed) && (React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__right__tail" },
                    isPending && (React.createElement(ui_Loader, { width: "16px", height: "16px" },
                        React.createElement(ui_Icon.default, { className: "sendbird-openchannel-thumbnail-message__right__tail__pending", type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY, width: "16px", height: "16px" }))),
                    isFailed && (React.createElement(ui_Icon.default, { className: "sendbird-openchannel-thumbnail-message__right__tail__failed", type: ui_Icon.IconTypes.ERROR, fillColor: ui_Icon.IconColors.ERROR, width: "16px", height: "16px" }))))),
            !isMobile && (React.createElement("div", { className: "sendbird-openchannel-thumbnail-message__context-menu", ref: contextMenuRef }, (index.isFineResend({ message: message, userId: userId, status: status }) || !isEphemeral) && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (index.showMenuTrigger({ message: message, userId: userId, status: status }) && (React.createElement(ui_IconButton, { className: "sendbird-openchannel-thumbnail-message__context-menu--icon", width: "32px", height: "32px", onClick: toggleDropdown },
                    React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE, width: "24px", height: "24px" })))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentRef: contextMenuRef, parentContainRef: contextMenuRef, closeDropdown: closeDropdown, openLeft: true },
                    index.isFineResend({ message: message, userId: userId, status: status }) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                            resendMessage(message);
                            closeDropdown();
                        }, dataSbId: "open_channel_thumbnail_message_menu_resend" }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND)),
                    (!isEphemeral && index.isFineDelete({ message: message, userId: userId, status: status })) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                            if (disabled) {
                                return;
                            }
                            showRemove(true);
                            closeDropdown();
                        }, dataSbId: "open_channel_thumbnail_message_menu_delete" }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE)))); } }))))),
        contextMenu && (React.createElement(index.OpenChannelMobileMenu, { message: message, parentRef: mobileMenuRef, hideMenu: function () {
                setContextMenu(false);
            }, showRemove: function () {
                setContextMenu(false);
                showRemove(true);
            }, resendMessage: function () {
                setContextMenu(false);
                resendMessage(message);
            } }))));
}

module.exports = OpenchannelThumbnailMessage;
//# sourceMappingURL=OpenchannelThumbnailMessage.js.map
