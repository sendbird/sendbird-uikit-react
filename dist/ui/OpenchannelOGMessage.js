import { _ as __assign, c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default, { useContext, useState, useRef, useMemo, useEffect } from 'react';
import { f as format } from '../chunks/bundle-ePTRDi6d.js';
import { A as Avatar } from '../chunks/bundle-LbQw2cVx.js';
import ContextMenu, { MenuItems, MenuItem } from './ContextMenu.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import IconButton from './IconButton.js';
import ImageRenderer from './ImageRenderer.js';
import LinkLabel from './LinkLabel.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import Loader from './Loader.js';
import UserProfile from './UserProfile.js';
import { a as UserProfileContext } from '../chunks/bundle-jDtVwIPR.js';
import { u as uuidv4 } from '../chunks/bundle-0Kp88b8b.js';
import { c as copyToClipboard } from '../chunks/bundle-8kOzvGVm.js';
import { u as useLocalization } from '../chunks/bundle-hS8Jw8F1.js';
import { g as getSenderFromMessage, s as showMenuTrigger, i as isFineCopy, a as isFineEdit, b as isFineResend, c as isFineDelete, O as OpenChannelMobileMenu, d as checkIsPending, e as checkIsFailed } from '../chunks/bundle-_I_VShhL.js';
import { u as useMediaQueryContext } from '../chunks/bundle-qlkGlvyT.js';
import { u as useLongPress } from '../chunks/bundle-okHpD60h.js';
import { T as TextFragment } from '../chunks/bundle-1q5AhvE7.js';
import { t as tokenizeMessage } from '../chunks/bundle-coC6nc_5.js';
import '../chunks/bundle-8u3PnqsX.js';
import '../chunks/bundle-fNigAmmf.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-UuydkZ4A.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-7BSf_PUT.js';
import './Button.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';
import '../Message/context.js';
import './MentionLabel.js';

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
    var _e = useLocalization(), stringSet = _e.stringSet, dateLocale = _e.dateLocale;
    var isMobile = useMediaQueryContext().isMobile;
    var _f = useContext(UserProfileContext), disableUserProfile = _f.disableUserProfile, renderUserProfile = _f.renderUserProfile;
    var _g = useState({}), contextStyle = _g[0], setContextStyle = _g[1];
    var _h = useState(false), showContextMenu = _h[0], setShowContextMenu = _h[1];
    var openLink = function () {
        if (checkOGIsEnalbed(message) && (ogMetaData === null || ogMetaData === void 0 ? void 0 : ogMetaData.url)) {
            window.open(ogMetaData.url, '_blank', 'noopener,noreferrer');
        }
    };
    var onLongPress = useLongPress({
        onLongPress: function () { return setShowContextMenu(true); },
        onClick: openLink,
    }, {
        delay: 300,
    });
    var messageComponentRef = useRef(null);
    var contextMenuRef = useRef(null);
    var mobileMenuRef = useRef(null);
    var avatarRef = useRef(null);
    var isPending = checkIsPending(status);
    var isFailed = checkIsFailed(status);
    var sender = getSenderFromMessage(message);
    var tokens = useMemo(function () {
        return tokenizeMessage({
            messageText: message.message,
        });
    }, [message === null || message === void 0 ? void 0 : message.updatedAt, message === null || message === void 0 ? void 0 : message.message]);
    // place conxt menu top depending clientHeight of message component
    useEffect(function () {
        var _a;
        if (((_a = messageComponentRef === null || messageComponentRef === void 0 ? void 0 : messageComponentRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) > 36) {
            setContextStyle({ top: '8px ' });
        }
        else {
            setContextStyle({ top: '2px' });
        }
    }, [window.innerWidth]);
    if (!message || message.messageType !== 'user') {
        return React__default.createElement(React__default.Fragment, null);
    }
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", __assign({ className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                'sendbird-openchannel-og-message',
            ], false).join(' '), ref: messageComponentRef }, (isMobile ? __assign({}, onLongPress) : {})),
            React__default.createElement("div", { className: "sendbird-openchannel-og-message__top" },
                React__default.createElement("div", { className: "sendbird-openchannel-og-message__top__left" }, !chainTop && (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(Avatar, { className: "sendbird-openchannel-og-message__top__left__avatar", src: sender.profileUrl || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
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
                        : (React__default.createElement(MenuItems, { parentRef: avatarRef, parentContainRef: avatarRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                            React__default.createElement(UserProfile, { user: sender, onSuccess: closeDropdown, disableMessaging: true })))); } }))),
                React__default.createElement("div", { className: "sendbird-openchannel-og-message__top__right" },
                    !chainTop && (React__default.createElement("div", { className: "sendbird-openchannel-og-message__top__right__title" },
                        React__default.createElement(Label, { className: "sendbird-openchannel-og-message__top__right__title__sender-name", type: LabelTypography.CAPTION_2, color: isOperator ? LabelColors.SECONDARY_3 : LabelColors.ONBACKGROUND_2 }, sender && (sender.friendName
                            || sender.nickname
                            || sender.userId)),
                        React__default.createElement(Label, { className: "sendbird-openchannel-og-message__top__right__title__sent-at", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_3 }, (message === null || message === void 0 ? void 0 : message.createdAt) && (format(message === null || message === void 0 ? void 0 : message.createdAt, 'p', {
                            locale: dateLocale,
                        }))))),
                    React__default.createElement("div", { className: "sendbird-openchannel-og-message__top__right__description" },
                        React__default.createElement(Label, { className: "sendbird-openchannel-og-message__top__right__description__message", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 },
                            React__default.createElement(TextFragment, { tokens: tokens }),
                            (((_c = message === null || message === void 0 ? void 0 : message.updatedAt) !== null && _c !== void 0 ? _c : 0) > 0) && (React__default.createElement(Label, { key: uuidv4(), className: 'sendbird-openchannel-og-message--word', type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_2 }, stringSet.MESSAGE_EDITED))))),
                !isMobile && (React__default.createElement("div", { className: "sendbird-openchannel-og-message__top__context-menu", ref: contextMenuRef, style: contextStyle },
                    React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (showMenuTrigger({ message: message, userId: userId, status: status }) && (React__default.createElement(IconButton, { className: "sendbird-openchannel-og-message__top__context-menu--icon", width: "32px", height: "32px", onClick: function () {
                                toggleDropdown();
                            } },
                            React__default.createElement(Icon, { type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE, width: "24px", height: "24px" })))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: contextMenuRef, parentContainRef: contextMenuRef, closeDropdown: closeDropdown, openLeft: true },
                            isFineCopy({ message: message, userId: userId, status: status }) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__copy", onClick: function () {
                                    copyToClipboard(message.message);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_copy" }, stringSet.CONTEXT_MENU_DROPDOWN__COPY)),
                            (!isEphemeral && isFineEdit({ message: message, userId: userId, status: status })) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__edit", onClick: function () {
                                    if (disabled) {
                                        return;
                                    }
                                    showEdit(true);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_edit" }, stringSet.CONTEXT_MENU_DROPDOWN__EDIT)),
                            isFineResend({ message: message, userId: userId, status: status }) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__resend", onClick: function () {
                                    resendMessage(message);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_resend" }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND)),
                            (!isEphemeral && isFineDelete({ message: message, userId: userId, status: status })) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-og-message__top__context-menu__delete", onClick: function () {
                                    if (disabled) {
                                        return;
                                    }
                                    showRemove(true);
                                    closeDropdown();
                                }, dataSbId: "open_channel_og_message_menu_delete" }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE)))); } })))),
            React__default.createElement("div", { className: "sendbird-openchannel-og-message__bottom" },
                React__default.createElement("div", { className: "sendbird-openchannel-og-message__bottom__og-tag", ref: mobileMenuRef },
                    ogMetaData.url && (React__default.createElement(Label, { className: "sendbird-openchannel-og-message__bottom__og-tag__url", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, ogMetaData.url)),
                    ogMetaData.title && (React__default.createElement(LinkLabel, { className: "sendbird-openchannel-og-message__bottom__og-tag__title", src: ogMetaData.url, type: LabelTypography.SUBTITLE_2, color: LabelColors.PRIMARY }, ogMetaData.title)),
                    ogMetaData.description && (React__default.createElement(Label, { className: "sendbird-openchannel-og-message__bottom__og-tag__description", type: LabelTypography.BODY_2, color: LabelColors.ONBACKGROUND_1 }, ogMetaData.description)),
                    ogMetaData.url && (React__default.createElement("div", { className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail", role: "button", onClick: openLink, onKeyDown: openLink, tabIndex: 0 }, defaultImage && (React__default.createElement(ImageRenderer, { className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image", url: defaultImage.url || '', alt: defaultImage.alt || '', height: "189px", defaultComponent: (React__default.createElement("div", { className: "sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image--placeholder" },
                            React__default.createElement(Icon, { type: IconTypes.THUMBNAIL_NONE, width: "56px", height: "56px" }))) }))))),
                (isPending || isFailed) && (React__default.createElement("div", { className: "sendbird-openchannel-og-message__top__right__tail" },
                    isPending && (React__default.createElement(Loader, { width: "16px", height: "16px" },
                        React__default.createElement(Icon, { className: "sendbird-openchannel-og-message__top__right__tail__pending", type: IconTypes.SPINNER, fillColor: IconColors.PRIMARY, width: "16px", height: "16px" }))),
                    isFailed && (React__default.createElement(Icon, { className: "sendbird-openchannel-og-message__top__right__tail__failed", type: IconTypes.ERROR, fillColor: IconColors.ERROR, width: "16px", height: "16px" })))))),
        showContextMenu && (React__default.createElement(OpenChannelMobileMenu, { message: message, parentRef: mobileMenuRef, hideMenu: function () {
                setShowContextMenu(false);
            }, showRemove: function () {
                setShowContextMenu(false);
                showRemove(true);
            }, showEdit: function () {
                setShowContextMenu(false);
                showEdit(true);
            }, copyToClipboard: function () {
                setShowContextMenu(false);
                copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
            }, resendMessage: function () {
                setShowContextMenu(false);
                resendMessage(message);
            } }))));
}

export { OpenchannelOGMessage as default };
//# sourceMappingURL=OpenchannelOGMessage.js.map
