'use strict';

var React = require('react');
var ui_Button = require('../ui/Button.js');
var ui_IconButton = require('../ui/IconButton.js');
var ui_Icon = require('../ui/Icon.js');
var ui_ContextMenu = require('../ui/ContextMenu.js');
var ChannelSettings_components_UserListItem = require('../ChannelSettings/components/UserListItem.js');
var _tslib = require('./bundle-xbdnJE9-.js');
var ui_Modal = require('./bundle-6hGNMML2.js');
var ui_UserListItem = require('../ui/UserListItem.js');
var utils = require('./bundle-jCTpndN0.js');
var ChannelSettings_context = require('../ChannelSettings/context.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');
require('./bundle-KkCwxjVN.js');
var index = require('./bundle-48AiK3oz.js');
var uuid = require('./bundle-SOIkTCep.js');

function MembersModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = React.useState([]), members = _c[0], setMembers = _c[1];
    var _d = React.useState(null), memberQuery = _d[0], setMemberQuery = _d[1];
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var currentUser = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    React.useEffect(function () {
        var memberListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            limit: 20,
        });
        memberListQuery.next().then(function (members) {
            setMembers(members);
        });
        setMemberQuery(memberListQuery);
    }, []);
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: utils.noop, titleText: stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS },
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(_tslib.__spreadArray(_tslib.__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React.createElement(ui_UserListItem, { user: member, key: member.userId, currentUser: currentUser, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return (React.createElement(React.Fragment, null, (channel === null || channel === void 0 ? void 0 : channel.myRole) === 'operator' && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: function () {
                                toggleDropdown();
                            } },
                            React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React.createElement(ui_ContextMenu.MenuItem, { disable: currentUser === member.userId, onClick: function () {
                                    if ((member.role !== 'operator')) {
                                        channel === null || channel === void 0 ? void 0 : channel.addOperators([member.userId]).then(function () {
                                            setMembers(members.map(function (m) {
                                                if (m.userId === member.userId) {
                                                    return _tslib.__assign(_tslib.__assign({}, member), { role: 'operator' });
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
                                                    return _tslib.__assign(_tslib.__assign({}, member), { role: '' });
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
                            !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                    if (member.isMuted) {
                                        channel === null || channel === void 0 ? void 0 : channel.unmuteUser(member).then(function () {
                                            setMembers(members.map(function (m) {
                                                if (m.userId === member.userId) {
                                                    return _tslib.__assign(_tslib.__assign({}, member), { isMuted: false });
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
                                                    return _tslib.__assign(_tslib.__assign({}, member), { isMuted: true });
                                                }
                                                return m;
                                            }));
                                            closeDropdown();
                                        });
                                    }
                                }, dataSbId: "channel_setting_member_context_menu_".concat((member.isMuted) ? 'unmute' : 'mute') }, member.isMuted
                                ? stringSet.CHANNEL_SETTING__MODERATION__UNMUTE
                                : stringSet.CHANNEL_SETTING__MODERATION__MUTE)),
                            React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
    var _e = React.useState([]), users = _e[0], setUsers = _e[1];
    var _f = React.useState(null), userListQuery = _f[0], setUserListQuery = _f[1];
    var _g = React.useState({}), selectedUsers = _g[0], setSelectedUsers = _g[1];
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var sdk = (_c = (_b = state === null || state === void 0 ? void 0 : state.stores) === null || _b === void 0 ? void 0 : _b.sdkStore) === null || _c === void 0 ? void 0 : _c.sdk;
    var globalUserListQuery = (_d = state === null || state === void 0 ? void 0 : state.config) === null || _d === void 0 ? void 0 : _d.userListQuery;
    var _h = ChannelSettings_context.useChannelSettingsContext(), channel = _h.channel, overrideInviteUser = _h.overrideInviteUser, queries = _h.queries;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var onScroll = index.useOnScrollPositionChangeDetector({
        onReachedBottom: function () {
            return _tslib.__awaiter(this, void 0, void 0, function () {
                var users_1;
                return _tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(userListQuery === null || userListQuery === void 0 ? void 0 : userListQuery.hasNext)) return [3 /*break*/, 2];
                            return [4 /*yield*/, userListQuery.next()];
                        case 1:
                            users_1 = _a.sent();
                            setUsers(function (prev) { return _tslib.__spreadArray(_tslib.__spreadArray([], prev, true), users_1, true); });
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        },
    });
    var onInviteUsers = function () { return _tslib.__awaiter(_this, void 0, void 0, function () {
        var userIdsToInvite;
        return _tslib.__generator(this, function (_a) {
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
            var draft = _tslib.__rest(_a, []);
            if (draft[user.userId]) {
                delete draft[user.userId];
            }
            else {
                draft[user.userId] = user;
            }
            return draft;
        });
    };
    var membersMap = React.useMemo(function () {
        var _a;
        // UIKit policy: In a super or broadcast channel, do not check the members when inviting users.
        if ((channel === null || channel === void 0 ? void 0 : channel.isSuper) || (channel === null || channel === void 0 ? void 0 : channel.isBroadcast))
            return _a = {}, _a[sdk.currentUser.userId] = sdk.currentUser, _a;
        return channel === null || channel === void 0 ? void 0 : channel.members.reduce(function (acc, cur) {
            acc[cur.userId] = cur;
            return acc;
        }, {});
    }, [channel === null || channel === void 0 ? void 0 : channel.members.length]);
    React.useEffect(function () {
        var fetchUsersAndSetQuery = function () { return _tslib.__awaiter(_this, void 0, void 0, function () {
            var query, users_2;
            var _a;
            return _tslib.__generator(this, function (_b) {
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
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, disabled: Object.keys(selectedUsers).length === 0, submitText: stringSet.BUTTON__INVITE, type: ui_Button.ButtonTypes.PRIMARY, onCancel: function () { return onCancel(); }, onSubmit: onInviteUsers, titleText: stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE },
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: onScroll },
                React.createElement("div", { className: "sendbird-more-members__popup-scroll__inner" }, users.map(function (user) {
                    var isMember = Boolean(membersMap[user.userId]);
                    var isSelected = Boolean(selectedUsers[user.userId]);
                    return (React.createElement(ui_UserListItem, { key: user.userId, checkBox: true, checked: isMember || isSelected, disabled: isMember, user: user, onChange: function () { return onSelectUser(user); } }));
                }))))));
}

var MemberList = function () {
    var _a, _b, _c;
    var _d = React.useState([]), members = _d[0], setMembers = _d[1];
    var _e = React.useState(false), hasNext = _e[0], setHasNext = _e[1];
    var _f = React.useState(false), showAllMembers = _f[0], setShowAllMembers = _f[1];
    var _g = React.useState(false), showInviteUsers = _g[0], setShowInviteUsers = _g[1];
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var _h = ChannelSettings_context.useChannelSettingsContext(), channel = _h.channel, setChannelUpdateId = _h.setChannelUpdateId;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var sdk = (_b = (_a = state === null || state === void 0 ? void 0 : state.stores) === null || _a === void 0 ? void 0 : _a.sdkStore) === null || _b === void 0 ? void 0 : _b.sdk;
    var userId = (_c = state === null || state === void 0 ? void 0 : state.config) === null || _c === void 0 ? void 0 : _c.userId;
    React.useEffect(function () {
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
    var refreshList = React.useCallback(function () {
        if (!channel) {
            setMembers([]);
            return;
        }
        var memberUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({ limit: 10 });
        memberUserListQuery.next().then(function (members) {
            setMembers(members);
            setHasNext(memberUserListQuery.hasNext);
            setChannelUpdateId(uuid.uuidv4());
        });
    }, [channel]);
    return (React.createElement("div", { className: "sendbird-channel-settings-member-list sendbird-accordion" },
        members.map(function (member) { return (React.createElement(ChannelSettings_components_UserListItem, { key: member.userId, user: member, currentUser: sdk.currentUser.userId, action: ((channel === null || channel === void 0 ? void 0 : channel.myRole) === 'operator' && userId !== member.userId)
                ? function (_a) {
                    var actionRef = _a.actionRef, parentRef = _a.parentRef;
                    return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
                            !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
                            React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.banUser(member, -1, '').then(function () {
                                        refreshList();
                                        closeDropdown();
                                    });
                                }, dataSbId: "channel_setting_member_context_menu_ban" }, stringSet.CHANNEL_SETTING__MODERATION__BAN))); } }));
                }
                : null })); }),
        React.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            hasNext && (React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () { return setShowAllMembers(true); } }, stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS)),
            React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () { return setShowInviteUsers(true); } }, stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER)),
        showAllMembers && (React.createElement(MembersModal, { onCancel: function () {
                setShowAllMembers(false);
                refreshList();
            } })),
        showInviteUsers && (React.createElement(InviteUsers, { onSubmit: function () {
                setShowInviteUsers(false);
                refreshList();
            }, onCancel: function () { return setShowInviteUsers(false); } }))));
};

exports.MemberList = MemberList;
//# sourceMappingURL=bundle-H2dGaKZQ.js.map
