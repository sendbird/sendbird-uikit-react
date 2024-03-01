import React__default, { useState, useContext, useEffect, useCallback } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-msnuMA4R.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-kMMCn6GE.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { useOpenChannelSettingsContext } from '../context.js';
import ChannelProfile from './OpenChannelProfile.js';
import { M as Modal } from '../../chunks/bundle-O8mkJ7az.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { U as UserListItem$1, P as ParticipantList } from '../../chunks/bundle-NrZT-X9Z.js';
import Accordion, { AccordionGroup } from '../../ui/Accordion.js';
import Button, { ButtonTypes, ButtonSizes } from '../../ui/Button.js';
import ContextMenu, { MenuItems, MenuItem } from '../../ui/ContextMenu.js';
import IconButton from '../../ui/IconButton.js';
import { c as __spreadArray, _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import UserListItem from '../../ui/UserListItem.js';
import { n as noop } from '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../withSendbird.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nGuCRoDK.js';
import '../../ui/OpenChannelAvatar.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../chunks/bundle-E4eEah-U.js';
import './EditDetailsModal.js';
import '../../chunks/bundle-THTV9S18.js';
import '../../ui/Input.js';
import 'react-dom';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../chunks/bundle-JjzC7gJ9.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../ui/AccordionGroup.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../ui/Checkbox.js';

function DeleteChannel() {
    var _a, _b;
    var _c = useState(false), showDeleteChannelModal = _c[0], setShowDeleteChannelModal = _c[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var globalState = useSendbirdStateContext();
    var isOnline = (_a = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _a === void 0 ? void 0 : _a.isOnline;
    var logger = (_b = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _b === void 0 ? void 0 : _b.logger;
    var _d = useOpenChannelSettingsContext(), channel = _d.channel, onDeleteChannel = _d.onDeleteChannel;
    var deleteChannel = function () {
        channel === null || channel === void 0 ? void 0 : channel.delete().then(function (response) {
            logger.info('OpenChannelSettings: Delete channel success', response);
            if (onDeleteChannel) {
                onDeleteChannel(channel);
            }
        }).catch(function (error) {
            logger.warning('OpenChannelSettings: Delete channel failed', error);
        });
    };
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "sendbird-openchannel-settings__panel-item\n          sendbird-openchannel-settings__delete-channel\n            ".concat(!isOnline ? 'sendbird-openchannel-settings__panel-item__disabled' : ''), role: "button", tabIndex: 0, onKeyDown: function () {
                if (!isOnline) {
                    return;
                }
                setShowDeleteChannelModal(true);
            }, onClick: function () {
                if (!isOnline) {
                    return;
                }
                setShowDeleteChannelModal(true);
            } },
            React__default.createElement(Icon, { type: IconTypes.DELETE, fillColor: IconColors.ERROR, className: [
                    'sendbird-openchannel-settings__panel-icon-left',
                    'sendbird-openchannel-settings__panel-icon__delete',
                ].join(' '), height: "24px", width: "24px" }),
            React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_PANEL)),
        showDeleteChannelModal && (React__default.createElement(Modal, { isFullScreenOnMobile: true, onCancel: function () {
                setShowDeleteChannelModal(false);
            }, onSubmit: function () {
                deleteChannel();
            }, titleText: stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE, submitText: stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT }, stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_CONTEXT))));
}

function OperatorListModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = useState([]), users = _c[0], setUsers = _c[1];
    var _d = useState(null), operatorQuery = _d[0], setOperatorQuery = _d[1];
    var channel = useOpenChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUserId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = useContext(LocalizationContext).stringSet;
    useEffect(function () {
        var operatorListQuery = channel === null || channel === void 0 ? void 0 : channel.createOperatorListQuery({
            limit: 20,
        });
        operatorListQuery.next().then(function (participants) {
            setUsers(participants);
        });
        setOperatorQuery(operatorListQuery);
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { hideFooter: true, isFullScreenOnMobile: true, titleText: stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ALL, onCancel: onCancel },
            React__default.createElement("div", { className: "sendbird-more-users__popup-scroll", onScroll: function (e) {
                    var hasNext = operatorQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        operatorQuery.next().then(function (o) {
                            setUsers(__spreadArray(__spreadArray([], users, true), o, true));
                        });
                    }
                } }, users.map(function (operator) { return (React__default.createElement(UserListItem, { currentUser: currentUserId, user: operator, key: operator.userId, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return (currentUserId !== (operator === null || operator === void 0 ? void 0 : operator.userId)
                        ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                React__default.createElement(MenuItem, { onClick: function () {
                                        channel === null || channel === void 0 ? void 0 : channel.removeOperators([operator.userId]).then(function () {
                                            setUsers(users.filter(function (_a) {
                                                var userId = _a.userId;
                                                return userId !== operator.userId;
                                            }));
                                        });
                                        closeDropdown();
                                    }, dataSbId: "open_channel_setting_operator_context_menu_unregister_operator" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR))); } })) : null);
                } })); })))));
}

function AddOperatorsModal(_a) {
    var onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var _b = useState([]), participants = _b[0], setParticipants = _b[1];
    var _c = useState({}), selectedUsers = _c[0], setSelectedUsers = _c[1];
    var _d = useState(null), participantQuery = _d[0], setParticipantQuery = _d[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var channel = useOpenChannelSettingsContext().channel;
    useEffect(function () {
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({
            limit: 20,
        });
        participantListQuery.next().then(function (users) {
            setParticipants(users);
        });
        setParticipantQuery(participantListQuery);
    }, []);
    var selectedCount = Object.keys(selectedUsers).filter(function (m) { return selectedUsers[m]; }).length;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, type: ButtonTypes.PRIMARY, submitText: stringSet.CHANNEL_SETTING__OPERATORS__ADD_BUTTON, onCancel: onCancel, onSubmit: function () {
                var users = Object.keys(selectedUsers).filter(function (m) { return selectedUsers[m]; });
                channel === null || channel === void 0 ? void 0 : channel.addOperators(users).then(function () {
                    onSubmit(users);
                });
            }, titleText: stringSet.OPEN_CHANNEL_CONVERSATION__SELECT_PARTICIPANTS },
            React__default.createElement(Label, { color: (selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3, type: LabelTypography.CAPTION_1 }, "".concat(selectedCount, " ").concat(stringSet.MODAL__INVITE_MEMBER__SELECTED)),
            React__default.createElement("div", { className: "sendbird-more-users__popup-scroll", onScroll: function (e) {
                    var hasNext = participantQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        participantQuery.next().then(function (o) {
                            setParticipants(__spreadArray(__spreadArray([], participants, true), o, true));
                        });
                    }
                } }, participants.map(function (participant) {
                var isOperator = (channel === null || channel === void 0 ? void 0 : channel.operators.find(function (operator) { return (operator === null || operator === void 0 ? void 0 : operator.userId) === (participant === null || participant === void 0 ? void 0 : participant.userId); })) ? true : false;
                return (React__default.createElement(UserListItem, { checkBox: true, checked: selectedUsers[participant.userId] || isOperator, disabled: isOperator, isOperator: isOperator, onChange: function (event) {
                        var _a;
                        var modifiedSelectedUsers = __assign(__assign({}, selectedUsers), (_a = {}, _a[event.target.id] = event.target.checked, _a));
                        if (!event.target.checked) {
                            delete modifiedSelectedUsers[event.target.id];
                        }
                        setSelectedUsers(modifiedSelectedUsers);
                    }, user: participant, key: participant.userId }));
            })))));
}

var OperatorList = function () {
    var _a, _b, _c;
    var _d = useState(false), showAdd = _d[0], setShowAdd = _d[1];
    var _e = useState(false), showMore = _e[0], setShowMore = _e[1];
    var state = useSendbirdStateContext();
    var currentUserId = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    var stringSet = useContext(LocalizationContext).stringSet;
    var channel = useOpenChannelSettingsContext().channel;
    return (React__default.createElement("div", null, (_b = channel === null || channel === void 0 ? void 0 : channel.operators) === null || _b === void 0 ? void 0 :
        _b.slice(0, 10).map(function (operator) { return (React__default.createElement(UserListItem$1, { key: operator.userId, user: operator, currentUser: currentUserId, action: function (_a) {
                var actionRef = _a.actionRef;
                return (currentUserId !== (operator === null || operator === void 0 ? void 0 : operator.userId)
                    ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-openchannel-operator-list__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.removeOperators([operator.userId]).then(function () {
                                        closeDropdown();
                                    });
                                }, dataSbId: "open_channel_setting_operator_context_menu_unregister_operator" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR),
                            React__default.createElement(MenuItem, { onClick: function () {
                                    if (operator.isMuted) {
                                        channel === null || channel === void 0 ? void 0 : channel.unmuteUser(operator).then(function () {
                                            closeDropdown();
                                        });
                                    }
                                    else {
                                        channel === null || channel === void 0 ? void 0 : channel.muteUser(operator).then(function () {
                                            closeDropdown();
                                        });
                                    }
                                }, dataSbId: "open_channel_setting_operator_context_menu_".concat(operator.isMuted ? 'unmute' : 'mute') }, operator.isMuted
                                ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE
                                : stringSet.OPEN_CHANNEL_SETTING__MODERATION__MUTE),
                            React__default.createElement(MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.banUser(operator).then(function () {
                                        closeDropdown();
                                    });
                                }, dataSbId: "open_channel_setting_operator_context_menu_ban" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN))); } })) : null);
            } })); }),
        React__default.createElement("div", { className: "sendbird-openchannel-operator-list__footer" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowAdd(true);
                } }, stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ADD),
            ((_c = channel === null || channel === void 0 ? void 0 : channel.operators) === null || _c === void 0 ? void 0 : _c.length) > 10 && (React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowMore(true);
                } }, stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ALL))),
        showMore && (React__default.createElement(React__default.Fragment, null,
            React__default.createElement(OperatorListModal, { onCancel: function () {
                    setShowMore(false);
                } }))),
        showAdd && (React__default.createElement(React__default.Fragment, null,
            React__default.createElement(AddOperatorsModal, { onCancel: function () { return setShowAdd(false); }, onSubmit: function () {
                    setShowAdd(false);
                } })))));
};

function MutedParticipantsModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = useState([]), mutedUsers = _c[0], setMutedUsers = _c[1];
    var _d = useState(null), userListQuery = _d[0], setUserListQuery = _d[1];
    var channel = useOpenChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUserId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = useContext(LocalizationContext).stringSet;
    useEffect(function () {
        var mutedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMutedUserListQuery({
            limit: 10,
        });
        mutedUserListQuery.next().then(function (users) {
            setMutedUsers(users);
        });
        setUserListQuery(mutedUserListQuery);
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: noop, titleText: stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = userListQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        userListQuery.next().then(function (o) {
                            setMutedUsers(__spreadArray(__spreadArray([], mutedUsers, true), o, true));
                        });
                    }
                } }, mutedUsers.map(function (mutedUser) { return (React__default.createElement(UserListItem, { currentUser: currentUserId, user: mutedUser, key: mutedUser.userId, action: function (_a) {
                    var actionRef = _a.actionRef;
                    return ((mutedUser === null || mutedUser === void 0 ? void 0 : mutedUser.userId) !== currentUserId
                        ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                React__default.createElement(MenuItem, { onClick: function () {
                                        channel === null || channel === void 0 ? void 0 : channel.unmuteUser(mutedUser).then(function () {
                                            closeDropdown();
                                            setMutedUsers(mutedUsers.filter(function (u) {
                                                return (u.userId !== mutedUser.userId);
                                            }));
                                        });
                                    }, dataSbId: "open_channel_setting_muted_member_context_menu_unmute" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE))); } })) : null);
                } })); })))));
}

var MutedParticipantList = function () {
    var _a;
    var _b = useState([]), mutedUsers = _b[0], setMutedUsers = _b[1];
    var _c = useState(false), hasNext = _c[0], setHasNext = _c[1];
    var _d = useState(false), showModal = _d[0], setShowModal = _d[1];
    var channel = useOpenChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUserId = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    var stringSet = useContext(LocalizationContext).stringSet;
    useEffect(function () {
        if (!channel) {
            setMutedUsers([]);
            return;
        }
        var mutedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMutedUserListQuery({
            limit: 10,
        });
        mutedUserListQuery.next().then(function (members) {
            setMutedUsers(members);
            setHasNext(mutedUserListQuery.hasNext);
        });
    }, [channel]);
    var refreshList = useCallback(function () {
        if (!channel) {
            setMutedUsers([]);
            return;
        }
        var mutedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMutedUserListQuery({
            limit: 10,
        });
        mutedUserListQuery.next().then(function (members) {
            setMutedUsers(members);
            setHasNext(mutedUserListQuery.hasNext);
        });
    }, [channel]);
    return (React__default.createElement(React__default.Fragment, null,
        mutedUsers.map(function (mutedUser) { return (React__default.createElement(UserListItem$1, { key: mutedUser.userId, user: mutedUser, currentUser: currentUserId, isOperator: channel === null || channel === void 0 ? void 0 : channel.isOperator(mutedUser.userId), action: function (_a) {
                var actionRef = _a.actionRef;
                return ((mutedUser === null || mutedUser === void 0 ? void 0 : mutedUser.userId) !== currentUserId
                    ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { closeDropdown: closeDropdown, openLeft: true, parentRef: actionRef },
                            React__default.createElement(MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.unmuteUser(mutedUser).then(function () {
                                        refreshList();
                                        closeDropdown();
                                    });
                                }, dataSbId: "open_channel_setting_muted_member_context_menu_unmute" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE))); } })) : null);
            } })); }),
        mutedUsers && mutedUsers.length === 0 && (React__default.createElement(Label, { className: "sendbird-channel-settings__empty-list", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_3 }, stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__NO_ONE)),
        hasNext && (React__default.createElement("div", { className: "sendbird-channel-settings-muted-participant-list__footer" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowModal(true);
                } }, stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE_ALL))),
        showModal && (React__default.createElement(MutedParticipantsModal, { onCancel: function () {
                setShowModal(false);
                refreshList();
            } }))));
};

function BannedUsersModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = useState([]), bannedUsers = _c[0], setBannedUsers = _c[1];
    var _d = useState(null), userListQuery = _d[0], setUserListQuery = _d[1];
    var channel = useOpenChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var stringSet = useContext(LocalizationContext).stringSet;
    var currentUserId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    useEffect(function () {
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery();
        bannedUserListQuery.next().then(function (users) {
            setBannedUsers(users);
        });
        setUserListQuery(bannedUserListQuery);
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { hideFooter: true, isFullScreenOnMobile: true, onCancel: function () { return onCancel(); }, onSubmit: noop, titleText: stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = userListQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        userListQuery.next().then(function (o) {
                            setBannedUsers(__spreadArray(__spreadArray([], bannedUsers, true), o, true));
                        });
                    }
                } }, bannedUsers.map(function (bannedUser) { return (React__default.createElement(UserListItem, { user: bannedUser, key: bannedUser.userId, action: function (_a) {
                    var actionRef = _a.actionRef;
                    return ((bannedUser === null || bannedUser === void 0 ? void 0 : bannedUser.userId) !== currentUserId
                        ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                React__default.createElement(MenuItem, { onClick: function () {
                                        channel === null || channel === void 0 ? void 0 : channel.unbanUser(bannedUser).then(function () {
                                            closeDropdown();
                                            setBannedUsers(bannedUsers.filter(function (u) {
                                                return (u.userId !== bannedUser.userId);
                                            }));
                                        });
                                    }, dataSbId: "open_channel_setting_banned_user_context_menu_unban" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNBAN))); } })) : null);
                } })); })))));
}

var BannedUserList = function () {
    var _a;
    var _b = useState([]), bannedUsers = _b[0], setBannedUsers = _b[1];
    var _c = useState(false), hasNext = _c[0], setHasNext = _c[1];
    var _d = useState(false), showModal = _d[0], setShowModal = _d[1];
    var channel = useOpenChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var stringSet = useContext(LocalizationContext).stringSet;
    var currentUserId = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    useEffect(function () {
        if (!channel) {
            setBannedUsers([]);
            return;
        }
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery();
        bannedUserListQuery.next().then(function (users) {
            setBannedUsers(users);
            setHasNext(bannedUserListQuery.hasNext);
        });
    }, [channel]);
    var refreshList = useCallback(function () {
        if (!channel) {
            setBannedUsers([]);
            return;
        }
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery();
        bannedUserListQuery.next().then(function (users) {
            setBannedUsers(users);
            setHasNext(bannedUserListQuery.hasNext);
        });
    }, [channel]);
    return (React__default.createElement(React__default.Fragment, null,
        bannedUsers.map(function (bannedUser) { return (React__default.createElement(UserListItem$1, { key: bannedUser.userId, user: bannedUser, isOperator: channel === null || channel === void 0 ? void 0 : channel.isOperator(bannedUser.userId), action: function (_a) {
                var actionRef = _a.actionRef;
                return ((bannedUser === null || bannedUser === void 0 ? void 0 : bannedUser.userId) !== currentUserId
                    ? (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.unbanUser(bannedUser).then(function () {
                                        closeDropdown();
                                        refreshList();
                                    });
                                }, dataSbId: "open_channel_setting_banned_user_context_menu_unban" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNBAN))); } })) : null);
            } })); }),
        bannedUsers && bannedUsers.length === 0 && (React__default.createElement(Label, { className: "sendbird-channel-settings__empty-list", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_3 }, stringSet.OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__NO_ONE)),
        hasNext && (React__default.createElement("div", { className: "sendbird-channel-settings-banned-user-list__footer" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowModal(true);
                } }, stringSet.OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE_ALL))),
        showModal && (React__default.createElement(BannedUsersModal, { onCancel: function () {
                setShowModal(false);
                refreshList();
            } }))));
};

var copyToClipboard = function (text) {
    // @ts-ignore: Unreachable code error
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        // @ts-ignore: Unreachable code error
        return window.clipboardData.setData('Text', text);
    }
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
    return false;
};
var OperatorUI = function (_a) {
    var renderChannelProfile = _a.renderChannelProfile;
    var stringSet = useContext(LocalizationContext).stringSet;
    var _b = useOpenChannelSettingsContext(), onCloseClick = _b.onCloseClick, channel = _b.channel;
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "sendbird-openchannel-settings__header" },
            React__default.createElement(Label, { type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__HEADER__TITLE),
            React__default.createElement(Icon, { className: "sendbird-openchannel-settings__close-icon", type: IconTypes.CLOSE, height: "24px", width: "24px", onClick: function () {
                    onCloseClick();
                } })),
        React__default.createElement("div", { className: "sendbird-openchannel-settings__profile" }, (renderChannelProfile === null || renderChannelProfile === void 0 ? void 0 : renderChannelProfile()) || (React__default.createElement(ChannelProfile, null))),
        React__default.createElement("div", { className: "sendbird-openchannel-settings__url" },
            React__default.createElement(Icon, { className: "sendbird-openchannel-settings__copy-icon", type: IconTypes.COPY, height: "22px", width: "22px", onClick: function () {
                    copyToClipboard(channel === null || channel === void 0 ? void 0 : channel.url);
                } }),
            React__default.createElement(Label, { className: "sendbird-openchannel-settings__url-label", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, stringSet.OPEN_CHANNEL_SETTINGS__OPERATOR_URL),
            React__default.createElement(Label, { className: "sendbird-openchannel-settings__url-value", type: LabelTypography.SUBTITLE_2 }, channel === null || channel === void 0 ? void 0 : channel.url)),
        React__default.createElement(AccordionGroup, null,
            React__default.createElement(Accordion, { className: "sendbird-openchannel-settings__operators-list", id: "operators", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(Icon, { className: "sendbird-openchannel-settings__operator-accordion-icon", type: IconTypes.OPERATOR, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS_TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(OperatorList, null))); } }),
            React__default.createElement(Accordion, { className: "sendbird-channel-settings__operators-list", id: "participants", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(Icon, { type: IconTypes.MEMBERS, fillColor: IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-openchannel-settings__operator-accordion-icon" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_ACCORDION_TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(ParticipantList, { isOperatorView: true }))); } }),
            React__default.createElement(Accordion, { className: "sendbird-channel-settings__operators-list", id: "mutedMembers", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(Icon, { className: "sendbird-openchannel-settings__operator-accordion-icon", type: IconTypes.MUTE, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(MutedParticipantList, null))); } }),
            React__default.createElement(Accordion, { className: "sendbird-channel-settings__operators-list", id: "bannedUsers", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(Icon, { className: "sendbird-openchannel-settings__operator-accordion-icon", type: IconTypes.BAN, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }),
                    React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                    React__default.createElement(BannedUserList, null))); } })),
        React__default.createElement(DeleteChannel, null)));
};

export { OperatorUI, copyToClipboard, OperatorUI as default };
//# sourceMappingURL=OperatorUI.js.map
