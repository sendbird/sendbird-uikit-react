import { c as __spreadArray } from './bundle-KMsJXUN2.js';
import React__default, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import Button, { ButtonTypes, ButtonSizes } from '../ui/Button.js';
import ContextMenu, { MenuItems, MenuItem } from '../ui/ContextMenu.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import IconButton from '../ui/IconButton.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-kMMCn6GE.js';
import { L as LocalizationContext } from './bundle-msnuMA4R.js';
import { a as UserProfileContext } from './bundle-x78eEPy7.js';
import './bundle-JjzC7gJ9.js';
import { A as Avatar } from './bundle-OJq071GK.js';
import 'react-dom';
import './bundle-ZTmwWu_-.js';
import MutedAvatarOverlay from '../ui/MutedAvatarOverlay.js';
import UserProfile from '../ui/UserProfile.js';
import { useOpenChannelSettingsContext } from '../OpenChannelSettings/context.js';
import '../withSendbird.js';
import { M as Modal } from './bundle-O8mkJ7az.js';
import UserListItem$1 from '../ui/UserListItem.js';
import { n as noop } from './bundle-7YRb7CRq.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';

function ParticipantsModal(_a) {
    var _b, _c, _d;
    var onCancel = _a.onCancel;
    var state = useSendbirdStateContext();
    var channel = useOpenChannelSettingsContext().channel;
    var stringSet = useContext(LocalizationContext).stringSet;
    var _e = useState([]), participants = _e[0], setParticipants = _e[1];
    var _f = useState(null), participantListQuery = _f[0], setParticipantListQuery = _f[1];
    var userId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var sdk = (_d = (_c = state === null || state === void 0 ? void 0 : state.stores) === null || _c === void 0 ? void 0 : _c.sdkStore) === null || _d === void 0 ? void 0 : _d.sdk;
    var isOperatorView = channel === null || channel === void 0 ? void 0 : channel.isOperator(userId);
    useEffect(function () {
        if (!channel || !(channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery)) {
            return;
        }
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({});
        setParticipantListQuery(participantListQuery);
        participantListQuery.next().then(function (participantList) {
            setParticipants(participantList);
        });
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { hideFooter: true, isFullScreenOnMobile: true, onCancel: function () { return onCancel(); }, onSubmit: noop, titleText: stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = participantListQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        participantListQuery.next().then(function (fetchedParticipants) {
                            setParticipants(__spreadArray(__spreadArray([], participants, true), fetchedParticipants, true));
                        });
                    }
                } }, participants.map(function (p) {
                var _a;
                var isOperator = channel === null || channel === void 0 ? void 0 : channel.isOperator(p.userId);
                return (React__default.createElement(UserListItem$1, { user: p, key: p.userId, currentUser: (_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId, action: (userId !== p.userId && isOperatorView)
                        ? function (_a) {
                            var actionRef = _a.actionRef, parentRef = _a.parentRef;
                            return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                    React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                    React__default.createElement(MenuItem, { onClick: function () {
                                            if (isOperator) {
                                                channel === null || channel === void 0 ? void 0 : channel.removeOperators([p.userId]).then(function () {
                                                    closeDropdown();
                                                });
                                            }
                                            else {
                                                channel === null || channel === void 0 ? void 0 : channel.addOperators([p.userId]).then(function () {
                                                    closeDropdown();
                                                });
                                            }
                                        }, dataSbId: "open_channel_setting_participant_context_menu_".concat((isOperator) ? 'unregister_operator' : 'register_as_operator') }, isOperator
                                        ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
                                        : stringSet.OPEN_CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR),
                                    React__default.createElement(MenuItem, { onClick: function () {
                                            if (p.isMuted) {
                                                channel === null || channel === void 0 ? void 0 : channel.unmuteUser(p).then(function () {
                                                    closeDropdown();
                                                });
                                            }
                                            else {
                                                channel === null || channel === void 0 ? void 0 : channel.muteUser(p).then(function () {
                                                    closeDropdown();
                                                });
                                            }
                                        }, dataSbId: "open_channel_setting_participant_context_menu_".concat(p.isMuted ? 'unmute' : 'mute') }, p.isMuted
                                        ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE
                                        : stringSet.OPEN_CHANNEL_SETTING__MODERATION__MUTE),
                                    React__default.createElement(MenuItem, { onClick: function () {
                                            channel === null || channel === void 0 ? void 0 : channel.banUser(p).then(function () {
                                                closeDropdown();
                                            });
                                        }, dataSbId: "open_channel_setting_participant_context_menu_ban" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN))); } }));
                        }
                        : null }));
            })))));
}

var UserListItem = function (_a) {
    var user = _a.user, currentUser = _a.currentUser, isOperator = _a.isOperator, action = _a.action;
    var avatarRef = useRef(null);
    var actionRef = useRef(null);
    var _b = useContext(UserProfileContext), disableUserProfile = _b.disableUserProfile, renderUserProfile = _b.renderUserProfile;
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-participants-accordion__member" },
        React__default.createElement("div", { className: "sendbird-participants-accordion__member-avatar" },
            React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(Avatar, { className: "sendbird-participants-accordion__member-avatar__avatar", onClick: function () {
                            if (!disableUserProfile) {
                                toggleDropdown();
                            }
                        }, ref: avatarRef, src: user.profileUrl, width: 24, height: 24 }),
                    (user === null || user === void 0 ? void 0 : user.isMuted) ? (React__default.createElement(MutedAvatarOverlay, null)) : '')); }, menuItems: function (closeDropdown) { return (renderUserProfile
                    ? renderUserProfile({
                        user: user,
                        currentUserId: currentUser,
                        close: closeDropdown,
                        avatarRef: avatarRef,
                    })
                    : (React__default.createElement(MenuItems, { openLeft: true, parentRef: avatarRef, 
                        // for catching location(x, y) of MenuItems
                        parentContainRef: avatarRef, 
                        // for toggling more options(menus & reactions)
                        closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                        React__default.createElement(UserProfile, { disableMessaging: true, user: user, currentUserId: currentUser, onSuccess: closeDropdown })))); } })),
        React__default.createElement(Label, { className: "sendbird-participants-accordion__member__title", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_1 },
            user.nickname || stringSet.NO_NAME,
            (currentUser === user.userId) && (stringSet.OPEN_CHANNEL_SETTINGS__MEMBERS__YOU)),
        !user.nickname && (React__default.createElement(Label, { className: "sendbird-participants-accordion__member__title user-id", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, user.userId)),
        isOperator && (React__default.createElement(Label, { className: "sendbird-participants-accordion__member__title\n                ".concat((user === null || user === void 0 ? void 0 : user.userId) !== currentUser ? 'operator' : '', "\n                ").concat((user === null || user === void 0 ? void 0 : user.userId) === currentUser ? 'self-operator' : '', "\n              "), type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_2 }, stringSet.OPEN_CHANNEL_SETTINGS__MEMBERS__OPERATOR)),
        action && (React__default.createElement("div", { className: "sendbird-participants-accordion__member__action", ref: actionRef }, action({ actionRef: actionRef })))));
};

function ParticipantList(_a) {
    var _b;
    var _c = _a.isOperatorView, isOperatorView = _c === void 0 ? false : _c;
    var globalState = useSendbirdStateContext();
    var currentUserId = (_b = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _b === void 0 ? void 0 : _b.userId;
    var channel = useOpenChannelSettingsContext().channel;
    var stringSet = useContext(LocalizationContext).stringSet;
    var _d = useState(null), participants = _d[0], setParticipants = _d[1];
    var _e = useState(null), participantListQuery = _e[0], setParticipantListQuery = _e[1];
    var _f = useState(false), showParticipantsModal = _f[0], setShowParticipantsModal = _f[1];
    useEffect(function () {
        if (!channel || !(channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery)) {
            return;
        }
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({ limit: 10 });
        setParticipantListQuery(participantListQuery);
        participantListQuery.next().then(function (participants) {
            setParticipants(participants);
        });
    }, [channel]);
    var refreshList = useCallback(function () {
        if (!channel) {
            setParticipants([]);
            return;
        }
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({ limit: 10 });
        participantListQuery.next().then(function (participants) {
            setParticipants(participants);
        });
    }, [channel]);
    return (React__default.createElement("div", { className: "sendbird-openchannel-settings__participant-list", onScroll: function (e) {
            var hasNext = participantListQuery.hasNext;
            var target = e.target;
            var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
            if (hasNext && fetchMore) {
                participantListQuery.next().then(function (fetchedParticipants) {
                    setParticipants(__spreadArray(__spreadArray([], participants, true), fetchedParticipants, true));
                });
            }
        } },
        React__default.createElement("div", null, participants === null || participants === void 0 ? void 0 :
            participants.map(function (p) {
                var isOperator = channel === null || channel === void 0 ? void 0 : channel.isOperator(p.userId);
                return (React__default.createElement(UserListItem, { user: p, currentUser: currentUserId, key: p.userId, isOperator: isOperator, action: function (_a) {
                        var actionRef = _a.actionRef;
                        return ((isOperatorView && currentUserId !== (p === null || p === void 0 ? void 0 : p.userId))
                            ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-openchannel-participant-list__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                    React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                    React__default.createElement(MenuItem, { onClick: function () {
                                            if (isOperator) {
                                                channel === null || channel === void 0 ? void 0 : channel.removeOperators([p.userId]).then(function () {
                                                    closeDropdown();
                                                    refreshList();
                                                });
                                            }
                                            else {
                                                channel === null || channel === void 0 ? void 0 : channel.addOperators([p.userId]).then(function () {
                                                    closeDropdown();
                                                    refreshList();
                                                });
                                            }
                                        }, dataSbId: "open_channel_setting_partitipant_conext_menu_".concat((isOperator) ? 'unregister_operator' : 'register_as_operator') }, isOperator
                                        ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
                                        : stringSet.OPEN_CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR),
                                    React__default.createElement(MenuItem, { onClick: function () {
                                            if (p.isMuted) {
                                                channel === null || channel === void 0 ? void 0 : channel.unmuteUser(p).then(function () {
                                                    closeDropdown();
                                                    refreshList();
                                                });
                                            }
                                            else {
                                                channel === null || channel === void 0 ? void 0 : channel.muteUser(p).then(function () {
                                                    closeDropdown();
                                                    refreshList();
                                                });
                                            }
                                        }, dataSbId: "open_channel_setting_partitipant_conext_menu_".concat(p.isMuted ? 'unmute' : 'mute') }, p.isMuted
                                        ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE
                                        : stringSet.OPEN_CHANNEL_SETTING__MODERATION__MUTE),
                                    React__default.createElement(MenuItem, { onClick: function () {
                                            channel === null || channel === void 0 ? void 0 : channel.banUser(p).then(function () {
                                                closeDropdown();
                                                refreshList();
                                            });
                                        }, dataSbId: "open_channel_setting_partitipant_conext_menu_ban" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN))); } }))
                            : null);
                    } }));
            }),
            (participants && participants.length === 0)
                ? (React__default.createElement(Label, { className: "sendbird-channel-settings__empty-list", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_3 }, stringSet.OPEN_CHANNEL_SETTINGS__EMPTY_LIST)) : null,
            React__default.createElement("div", { className: "sendbird-openchannel-participant-list__footer" }, (participantListQuery === null || participantListQuery === void 0 ? void 0 : participantListQuery.hasNext) && (React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () { return setShowParticipantsModal(true); } }, stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE))),
            showParticipantsModal && (React__default.createElement(ParticipantsModal, { onCancel: function () {
                    setShowParticipantsModal(false);
                    refreshList();
                } })))));
}

export { ParticipantList as P, UserListItem as U };
//# sourceMappingURL=bundle-NrZT-X9Z.js.map
