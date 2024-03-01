import { c as __spreadArray, _ as __assign } from '../chunks/bundle-UnAcr6wX.js';
import React__default, { useContext, useRef, useState, useEffect } from 'react';
import { f as format } from '../chunks/bundle-ePTRDi6d.js';
import { A as Avatar } from '../chunks/bundle-LbQw2cVx.js';
import ContextMenu, { MenuItems, MenuItem } from './ContextMenu.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import IconButton from './IconButton.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import Loader from './Loader.js';
import UserProfile from './UserProfile.js';
import { a as UserProfileContext } from '../chunks/bundle-jDtVwIPR.js';
import { u as useLocalization } from '../chunks/bundle-hS8Jw8F1.js';
import { c as copyToClipboard } from '../chunks/bundle-8kOzvGVm.js';
import { u as uuidv4 } from '../chunks/bundle-0Kp88b8b.js';
import { g as getSenderFromMessage, s as showMenuTrigger, i as isFineCopy, a as isFineEdit, b as isFineResend, c as isFineDelete, O as OpenChannelMobileMenu, d as checkIsPending, e as checkIsFailed } from '../chunks/bundle-_I_VShhL.js';
import { u as useMediaQueryContext } from '../chunks/bundle-qlkGlvyT.js';
import { u as useLongPress } from '../chunks/bundle-okHpD60h.js';
import { e as isEditedMessage } from '../chunks/bundle-WrTlYypL.js';
import '../chunks/bundle-8u3PnqsX.js';
import './ImageRenderer.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-fNigAmmf.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-7BSf_PUT.js';
import './Button.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-UuydkZ4A.js';

function OpenchannelUserMessage(_a) {
    var className = _a.className, message = _a.message, isOperator = _a.isOperator, _b = _a.isEphemeral, isEphemeral = _b === void 0 ? false : _b, userId = _a.userId, resendMessage = _a.resendMessage, disabled = _a.disabled, showEdit = _a.showEdit, showRemove = _a.showRemove, chainTop = _a.chainTop;
    // hooks
    var _c = useLocalization(), stringSet = _c.stringSet, dateLocale = _c.dateLocale;
    var _d = useContext(UserProfileContext), disableUserProfile = _d.disableUserProfile, renderUserProfile = _d.renderUserProfile;
    var messageRef = useRef(null);
    var avatarRef = useRef(null);
    var contextMenuRef = useRef(null);
    var mobileMenuRef = useRef(null);
    var _e = useState({}), contextStyle = _e[0], setContextStyle = _e[1];
    var _f = useState(false), contextMenu = _f[0], setContextMenu = _f[1];
    // consts
    var status = message === null || message === void 0 ? void 0 : message.sendingStatus;
    var isPending = checkIsPending(status);
    var isFailed = checkIsFailed(status);
    var sender = getSenderFromMessage(message);
    // place context menu top depending clientHeight of message component
    useEffect(function () {
        var _a;
        if (((_a = messageRef === null || messageRef === void 0 ? void 0 : messageRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) > 36) {
            setContextStyle({ top: '8px ' });
        }
        else {
            setContextStyle({ top: '2px' });
        }
    }, [window.innerWidth]);
    var onLongPress = useLongPress({
        onLongPress: function () {
            setContextMenu(true);
        },
    });
    var isMobile = useMediaQueryContext().isMobile;
    if (!message || message.messageType !== 'user') {
        return React__default.createElement(React__default.Fragment, null);
    }
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
                'sendbird-openchannel-user-message',
            ], false).join(' '), ref: messageRef },
            React__default.createElement("div", { className: "sendbird-openchannel-user-message__left" }, !chainTop && (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(Avatar, { className: "sendbird-openchannel-user-message__left__avatar", src: sender.profileUrl || '', ref: avatarRef, width: "28px", height: "28px", onClick: function () {
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
            React__default.createElement("div", { className: "sendbird-openchannel-user-message__right" },
                !chainTop && (React__default.createElement("div", { className: "sendbird-openchannel-user-message__right__top" },
                    React__default.createElement(Label, { className: "sendbird-openchannel-user-message__right__top__sender-name", type: LabelTypography.CAPTION_2, color: isOperator ? LabelColors.SECONDARY_3 : LabelColors.ONBACKGROUND_2 }, sender && (sender.friendName
                        || sender.nickname
                        || sender.userId)),
                    React__default.createElement(Label, { className: "sendbird-openchannel-user-message__right__top__sent-at", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_3 }, (message === null || message === void 0 ? void 0 : message.createdAt) && (format(message === null || message === void 0 ? void 0 : message.createdAt, 'p', {
                        locale: dateLocale,
                    }))))),
                React__default.createElement("div", __assign({}, (isMobile ? __assign({}, onLongPress) : {}), { className: "sendbird-openchannel-user-message__right__bottom", ref: mobileMenuRef }),
                    React__default.createElement(Label, { className: "sendbird-openchannel-user-message__right__bottom__message", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 }, message === null || message === void 0 ? void 0 :
                        message.message,
                        isEditedMessage(message) && (React__default.createElement(Label, { key: uuidv4(), type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_2, className: "sendbird-openchannel-user-message-word" }, " ".concat(stringSet.MESSAGE_EDITED, " "))))),
                (isPending || isFailed) && (React__default.createElement("div", { className: "sendbird-openchannel-user-message__right__tail" },
                    isPending && (React__default.createElement(Loader, { width: "16px", height: "16px" },
                        React__default.createElement(Icon, { className: "sendbird-openchannel-user-message__right__tail__pending", type: IconTypes.SPINNER, fillColor: IconColors.PRIMARY, width: "16px", height: "16px" }))),
                    isFailed && (React__default.createElement(Icon, { className: "sendbird-openchannel-user-message__right__tail__failed", type: IconTypes.ERROR, fillColor: IconColors.ERROR, width: "16px", height: "16px" }))))),
            !isMobile && (React__default.createElement("div", { className: "sendbird-openchannel-user-message__context-menu", ref: contextMenuRef, style: contextStyle },
                React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (showMenuTrigger({ message: message, userId: userId, status: status }) && (React__default.createElement(IconButton, { className: "sendbird-openchannel-user-message__context-menu--icon", width: "32px", height: "32px", onClick: function () {
                            toggleDropdown();
                        } },
                        React__default.createElement(Icon, { type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE, width: "24px", height: "24px" })))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: contextMenuRef, parentContainRef: contextMenuRef, closeDropdown: closeDropdown, openLeft: true },
                        isFineCopy({ message: message, userId: userId, status: status }) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-user-message__context-menu__copy", onClick: function () {
                                copyToClipboard(message.message);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_copy" }, stringSet.CONTEXT_MENU_DROPDOWN__COPY)),
                        (!isEphemeral && isFineEdit({ message: message, userId: userId, status: status })) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-user-message__context-menu__edit", onClick: function () {
                                if (disabled) {
                                    return;
                                }
                                showEdit(true);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_edit" }, stringSet.CONTEXT_MENU_DROPDOWN__EDIT)),
                        isFineResend({ message: message, userId: userId, status: status }) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-user-message__context-menu__resend", onClick: function () {
                                resendMessage(message);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_resend" }, stringSet.CONTEXT_MENU_DROPDOWN__RESEND)),
                        (!isEphemeral && isFineDelete({ message: message, userId: userId, status: status })) && (React__default.createElement(MenuItem, { className: "sendbird-openchannel-user-message__context-menu__delete", onClick: function () {
                                if (disabled) {
                                    return;
                                }
                                showRemove(true);
                                closeDropdown();
                            }, dataSbId: "open_channel_user_message_menu_delete" }, stringSet.CONTEXT_MENU_DROPDOWN__DELETE)))); } })))),
        contextMenu && (React__default.createElement(OpenChannelMobileMenu, { message: message, parentRef: mobileMenuRef, hideMenu: function () {
                setContextMenu(false);
            }, showRemove: function () {
                setContextMenu(false);
                showRemove(true);
            }, showEdit: function () {
                setContextMenu(false);
                showEdit(true);
            }, copyToClipboard: function () {
                setContextMenu(false);
                copyToClipboard(message === null || message === void 0 ? void 0 : message.message);
            }, resendMessage: function () {
                setContextMenu(false);
                resendMessage(message);
            } }))));
}

export { OpenchannelUserMessage as default };
//# sourceMappingURL=OpenchannelUserMessage.js.map
