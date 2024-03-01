import React__default, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import Button, { ButtonTypes, ButtonSizes } from '../ui/Button.js';
import IconButton from '../ui/IconButton.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import ContextMenu, { MenuItems, MenuItem } from '../ui/ContextMenu.js';
import UserListItem$1 from '../ChannelSettings/components/UserListItem.js';
import { c as __spreadArray, _ as __assign, a as __awaiter, b as __generator, d as __rest } from './bundle-UnAcr6wX.js';
import { M as Modal } from './bundle--BlhOpUS.js';
import UserListItem from '../ui/UserListItem.js';
import { n as noop } from './bundle-CRwhglru.js';
import { useChannelSettingsContext } from '../ChannelSettings/context.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { L as LocalizationContext, u as useLocalization } from './bundle-hS8Jw8F1.js';
import './bundle-ljRDDTki.js';
import { u as useOnScrollPositionChangeDetector } from './bundle-WFlcI9AO.js';
import { u as uuidv4 } from './bundle-0Kp88b8b.js';

function MembersModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = useState([]), members = _c[0], setMembers = _c[1];
    var _d = useState(null), memberQuery = _d[0], setMemberQuery = _d[1];
    var channel = useChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUser = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = useContext(LocalizationContext).stringSet;
    useEffect(function () {
        var memberListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            limit: 20,
        });
        memberListQuery.next().then(function (members) {
            setMembers(members);
        });
        setMemberQuery(memberListQuery);
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: noop, titleText: stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(__spreadArray(__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React__default.createElement(UserListItem, { user: member, key: member.userId, currentUser: currentUser, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return (React__default.createElement(React__default.Fragment, null, (channel === null || channel === void 0 ? void 0 : channel.myRole) === 'operator' && (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: function () {
                                toggleDropdown();
                            } },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { disable: currentUser === member.userId, onClick: function () {
                                    if ((member.role !== 'operator')) {
                                        channel === null || channel === void 0 ? void 0 : channel.addOperators([member.userId]).then(function () {
                                            setMembers(members.map(function (m) {
                                                if (m.userId === member.userId) {
                                                    return __assign(__assign({}, member), { role: 'operator' });
                                                }
                                                return m;
                                            }));
                                            closeDropdown();
                                        });
                                    }
                                    else {
                                        channel === null || channel === void 0 ? void 0 : channel.removeOperators([member.userId]).then(function () {
                                            setMembers(members.map(function (m) {
                                                if (m.userId === member.userId) {
                                                    return __assign(__assign({}, member), { role: '' });
                                                }
                                                return m;
                                            }));
                                            closeDropdown();
                                        });
                                    }
                                }, dataSbId: "channel_setting_member_context_menu_".concat((member.role !== 'operator') ? 'register_as_operator' : 'unregister_operator') }, member.role !== 'operator'
                                ? stringSet.CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
                                : stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR),
                            // No muted members in broadcast channel
                            !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React__default.createElement(MenuItem, { onClick: function () {
                                    if (member.isMuted) {
                                        channel === null || channel === void 0 ? void 0 : channel.unmuteUser(member).then(function () {
                                            setMembers(members.map(function (m) {
                                                if (m.userId === member.userId) {
                                                    return __assign(__assign({}, member), { isMuted: false });
                                                }
                                                return m;
                                            }));
                                            closeDropdown();
                                        });
                                    }
                                    else {
                                        channel === null || channel === void 0 ? void 0 : channel.muteUser(member).then(function () {
                                            setMembers(members.map(function (m) {
                                                if (m.userId === member.userId) {
                                                    return __assign(__assign({}, member), { isMuted: true });
                                                }
                                                return m;
                                            }));
                                            closeDropdown();
                                        });
                                    }
                                }, dataSbId: "channel_setting_member_context_menu_".concat((member.isMuted) ? 'unmute' : 'mute') }, member.isMuted
                                ? stringSet.CHANNEL_SETTING__MODERATION__UNMUTE
                                : stringSet.CHANNEL_SETTING__MODERATION__MUTE)),
                            React__default.createElement(MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.banUser(member, -1, '').then(function () {
                                        setMembers(members.filter(function (_a) {
                                            var userId = _a.userId;
                                            return userId !== member.userId;
                                        }));
                                    });
                                }, dataSbId: "channel_setting_member_context_menu_ban" }, stringSet.CHANNEL_SETTING__MODERATION__BAN))); } }))));
                } })); })))));
}

function InviteUsers(_a) {
    var _this = this;
    var _b, _c, _d;
    var onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var _e = useState([]), users = _e[0], setUsers = _e[1];
    var _f = useState(null), userListQuery = _f[0], setUserListQuery = _f[1];
    var _g = useState({}), selectedUsers = _g[0], setSelectedUsers = _g[1];
    var state = useSendbirdStateContext();
    var sdk = (_c = (_b = state === null || state === void 0 ? void 0 : state.stores) === null || _b === void 0 ? void 0 : _b.sdkStore) === null || _c === void 0 ? void 0 : _c.sdk;
    var globalUserListQuery = (_d = state === null || state === void 0 ? void 0 : state.config) === null || _d === void 0 ? void 0 : _d.userListQuery;
    var _h = useChannelSettingsContext(), channel = _h.channel, overrideInviteUser = _h.overrideInviteUser, queries = _h.queries;
    var stringSet = useLocalization().stringSet;
    var onScroll = useOnScrollPositionChangeDetector({
        onReachedBottom: function () {
            return __awaiter(this, void 0, void 0, function () {
                var users_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(userListQuery === null || userListQuery === void 0 ? void 0 : userListQuery.hasNext)) return [3 /*break*/, 2];
                            return [4 /*yield*/, userListQuery.next()];
                        case 1:
                            users_1 = _a.sent();
                            setUsers(function (prev) { return __spreadArray(__spreadArray([], prev, true), users_1, true); });
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        },
    });
    var onInviteUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var userIdsToInvite;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userIdsToInvite = Object.keys(selectedUsers);
                    if (!(typeof overrideInviteUser === 'function')) return [3 /*break*/, 1];
                    overrideInviteUser({ users: userIdsToInvite, onClose: onCancel, channel: channel });
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (channel === null || channel === void 0 ? void 0 : channel.inviteWithUserIds(userIdsToInvite))];
                case 2:
                    _a.sent();
                    onSubmit(userIdsToInvite);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var onSelectUser = function (user) {
        setSelectedUsers(function (_a) {
            var draft = __rest(_a, []);
            if (draft[user.userId]) {
                delete draft[user.userId];
            }
            else {
                draft[user.userId] = user;
            }
            return draft;
        });
    };
    var membersMap = useMemo(function () {
        var _a;
        // UIKit policy: In a super or broadcast channel, do not check the members when inviting users.
        if ((channel === null || channel === void 0 ? void 0 : channel.isSuper) || (channel === null || channel === void 0 ? void 0 : channel.isBroadcast))
            return _a = {}, _a[sdk.currentUser.userId] = sdk.currentUser, _a;
        return channel === null || channel === void 0 ? void 0 : channel.members.reduce(function (acc, cur) {
            acc[cur.userId] = cur;
            return acc;
        }, {});
    }, [channel === null || channel === void 0 ? void 0 : channel.members.length]);
    useEffect(function () {
        var fetchUsersAndSetQuery = function () { return __awaiter(_this, void 0, void 0, function () {
            var query, users_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = (_a = globalUserListQuery === null || globalUserListQuery === void 0 ? void 0 : globalUserListQuery()) !== null && _a !== void 0 ? _a : sdk === null || sdk === void 0 ? void 0 : sdk.createApplicationUserListQuery(queries === null || queries === void 0 ? void 0 : queries.applicationUserListQuery);
                        if (!query) return [3 /*break*/, 2];
                        return [4 /*yield*/, query.next()];
                    case 1:
                        users_2 = _b.sent();
                        setUserListQuery(query);
                        setUsers(users_2);
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        fetchUsersAndSetQuery();
    }, [sdk]);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, disabled: Object.keys(selectedUsers).length === 0, submitText: stringSet.BUTTON__INVITE, type: ButtonTypes.PRIMARY, onCancel: function () { return onCancel(); }, onSubmit: onInviteUsers, titleText: stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: onScroll },
                React__default.createElement("div", { className: "sendbird-more-members__popup-scroll__inner" }, users.map(function (user) {
                    var isMember = Boolean(membersMap[user.userId]);
                    var isSelected = Boolean(selectedUsers[user.userId]);
                    return (React__default.createElement(UserListItem, { key: user.userId, checkBox: true, checked: isMember || isSelected, disabled: isMember, user: user, onChange: function () { return onSelectUser(user); } }));
                }))))));
}

var MemberList = function () {
    var _a, _b, _c;
    var _d = useState([]), members = _d[0], setMembers = _d[1];
    var _e = useState(false), hasNext = _e[0], setHasNext = _e[1];
    var _f = useState(false), showAllMembers = _f[0], setShowAllMembers = _f[1];
    var _g = useState(false), showInviteUsers = _g[0], setShowInviteUsers = _g[1];
    var state = useSendbirdStateContext();
    var _h = useChannelSettingsContext(), channel = _h.channel, setChannelUpdateId = _h.setChannelUpdateId;
    var stringSet = useContext(LocalizationContext).stringSet;
    var sdk = (_b = (_a = state === null || state === void 0 ? void 0 : state.stores) === null || _a === void 0 ? void 0 : _a.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk;
    var userId = (_c = state === null || state === void 0 ? void 0 : state.config) === null || _c === void 0 ? void 0 : _c.userId;
    useEffect(function () {
        if (!channel) {
            setMembers([]);
            return;
        }
        var memberUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({ limit: 10 });
        memberUserListQuery.next().then(function (members) {
            setMembers(members);
            setHasNext(memberUserListQuery.hasNext);
        });
    }, [channel]);
    var refreshList = useCallback(function () {
        if (!channel) {
            setMembers([]);
            return;
        }
        var memberUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({ limit: 10 });
        memberUserListQuery.next().then(function (members) {
            setMembers(members);
            setHasNext(memberUserListQuery.hasNext);
            setChannelUpdateId(uuidv4());
        });
    }, [channel]);
    return (React__default.createElement("div", { className: "sendbird-channel-settings-member-list sendbird-accordion" },
        members.map(function (member) { return (React__default.createElement(UserListItem$1, { key: member.userId, user: member, currentUser: sdk.currentUser.userId, action: ((channel === null || channel === void 0 ? void 0 : channel.myRole) === 'operator' && userId !== member.userId)
                ? function (_a) {
                    var actionRef = _a.actionRef, parentRef = _a.parentRef;
                    return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { onClick: function () {
                                    if ((member.role !== 'operator')) {
                                        channel === null || channel === void 0 ? void 0 : channel.addOperators([member.userId]).then(function () {
                                            refreshList();
                                            closeDropdown();
                                        });
                                    }
                                    else {
                                        channel === null || channel === void 0 ? void 0 : channel.removeOperators([member.userId]).then(function () {
                                            refreshList();
                                            closeDropdown();
                                        });
                                    }
                                }, dataSbId: "channel_setting_member_context_menu_".concat((member.role !== 'operator') ? 'register_as_operator' : 'unregister_operator') }, member.role !== 'operator'
                                ? stringSet.CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
                                : stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR),
                            // No muted members in broadcast channel
                            !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React__default.createElement(MenuItem, { onClick: function () {
                                    if (member.isMuted) {
                                        channel === null || channel === void 0 ? void 0 : channel.unmuteUser(member).then(function () {
                                            refreshList();
                                            closeDropdown();
                                        });
                                    }
                                    else {
                                        channel === null || channel === void 0 ? void 0 : channel.muteUser(member).then(function () {
                                            refreshList();
                                            closeDropdown();
                                        });
                                    }
                                }, dataSbId: "channel_setting_member_context_menu_".concat((member.isMuted) ? 'unmute' : 'mute') }, member.isMuted
                                ? stringSet.CHANNEL_SETTING__MODERATION__UNMUTE
                                : stringSet.CHANNEL_SETTING__MODERATION__MUTE)),
                            React__default.createElement(MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.banUser(member, -1, '').then(function () {
                                        refreshList();
                                        closeDropdown();
                                    });
                                }, dataSbId: "channel_setting_member_context_menu_ban" }, stringSet.CHANNEL_SETTING__MODERATION__BAN))); } }));
                }
                : null })); }),
        React__default.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            hasNext && (React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () { return setShowAllMembers(true); } }, stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS)),
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () { return setShowInviteUsers(true); } }, stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER)),
        showAllMembers && (React__default.createElement(MembersModal, { onCancel: function () {
                setShowAllMembers(false);
                refreshList();
            } })),
        showInviteUsers && (React__default.createElement(InviteUsers, { onSubmit: function () {
                setShowInviteUsers(false);
                refreshList();
            }, onCancel: function () { return setShowInviteUsers(false); } }))));
};

export { MemberList as M };
//# sourceMappingURL=bundle-3E8xSyj7.js.map
