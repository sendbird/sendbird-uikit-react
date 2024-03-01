'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Accordion = require('../../ui/Accordion.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_Badge = require('../../ui/Badge.js');
var ui_Toggle = require('../../ui/Toggle.js');
var ui_Button = require('../../ui/Button.js');
var ui_IconButton = require('../../ui/IconButton.js');
var ui_ContextMenu = require('../../ui/ContextMenu.js');
var ChannelSettings_components_UserListItem = require('./UserListItem.js');
var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var ui_Modal = require('../../chunks/bundle-6hGNMML2.js');
var ui_UserListItem = require('../../ui/UserListItem.js');
var ChannelSettings_context = require('../context.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var groupChannel = require('@sendbird/chat/groupChannel');
var MemberList = require('../../chunks/bundle-H2dGaKZQ.js');
var utils = require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../ui/AccordionGroup.js');
require('../../chunks/bundle-Oq4We4Jl.js');
require('../../withSendbird.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/Checkbox.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-6xWNZugu.js');
require('@sendbird/chat/message');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-Zw2P8RwZ.js');

function OperatorsModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = React.useState([]), operators = _c[0], setOperators = _c[1];
    var _d = React.useState(null), operatorQuery = _d[0], setOperatorQuery = _d[1];
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var currentUserId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    React.useEffect(function () {
        var operatorListQuery = channel === null || channel === void 0 ? void 0 : channel.createOperatorListQuery({
            limit: 20,
        });
        operatorListQuery.next().then(function (operators) {
            setOperators(operators);
        });
        setOperatorQuery(operatorListQuery);
    }, []);
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, hideFooter: true, titleText: stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL, onCancel: onCancel },
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = operatorQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        operatorQuery.next().then(function (o) {
                            setOperators(_tslib.__spreadArray(_tslib.__spreadArray([], operators, true), o, true));
                        });
                    }
                } }, operators.map(function (member) { return (React.createElement(ui_UserListItem, { currentUser: currentUserId, user: member, key: member.userId, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return ((member === null || member === void 0 ? void 0 : member.userId) !== currentUserId && (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.removeOperators([member.userId]).then(function () {
                                        setOperators(operators.filter(function (_a) {
                                            var userId = _a.userId;
                                            return userId !== member.userId;
                                        }));
                                    });
                                    closeDropdown();
                                }, dataSbId: "channel_setting_operator_context_menu_unregister_unregister_operator" }, stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR))); } })));
                } })); })))));
}

function AddOperatorsModal(_a) {
    var onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var _b = React.useState([]), members = _b[0], setMembers = _b[1];
    var _c = React.useState({}), selectedMembers = _c[0], setSelectedMembers = _c[1];
    var _d = React.useState(null), memberQuery = _d[0], setMemberQuery = _d[1];
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    React.useEffect(function () {
        var memberListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            operatorFilter: groupChannel.OperatorFilter.NONOPERATOR,
            limit: 20,
        });
        memberListQuery.next().then(function (members) {
            setMembers(members);
        });
        setMemberQuery(memberListQuery);
    }, []);
    var selectedCount = Object.keys(selectedMembers).filter(function (m) { return selectedMembers[m]; }).length;
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, type: ui_Button.ButtonTypes.PRIMARY, submitText: stringSet.CHANNEL_SETTING__OPERATORS__ADD_BUTTON, onCancel: onCancel, onSubmit: function () {
                var members = Object.keys(selectedMembers).filter(function (m) { return selectedMembers[m]; });
                channel === null || channel === void 0 ? void 0 : channel.addOperators(members).then(function () {
                    onSubmit(members);
                });
            }, titleText: stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE },
            React.createElement(ui_Label.Label, { color: (selectedCount > 0) ? ui_Label.LabelColors.PRIMARY : ui_Label.LabelColors.ONBACKGROUND_3, type: ui_Label.LabelTypography.CAPTION_1 }, "".concat(selectedCount, " ").concat(stringSet.MODAL__INVITE_MEMBER__SELECTED)),
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(_tslib.__spreadArray(_tslib.__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React.createElement(ui_UserListItem, { checkBox: true, checked: selectedMembers[member.userId], isOperator: (member === null || member === void 0 ? void 0 : member.role) === 'operator', disabled: (member === null || member === void 0 ? void 0 : member.role) === 'operator', onChange: function (event) {
                    var _a;
                    var modifiedSelectedMembers = _tslib.__assign(_tslib.__assign({}, selectedMembers), (_a = {}, _a[event.target.id] = event.target.checked, _a));
                    if (!event.target.checked) {
                        delete modifiedSelectedMembers[event.target.id];
                    }
                    setSelectedMembers(modifiedSelectedMembers);
                }, user: member, key: member.userId })); })))));
}

var OperatorList = function () {
    var _a;
    var _b = React.useState([]), operators = _b[0], setOperators = _b[1];
    var _c = React.useState(false), showMore = _c[0], setShowMore = _c[1];
    var _d = React.useState(false), showAdd = _d[0], setShowAdd = _d[1];
    var _e = React.useState(false), hasNext = _e[0], setHasNext = _e[1];
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var userId = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    React.useEffect(function () {
        if (!channel) {
            setOperators([]);
            return;
        }
        var operatorListQuery = channel === null || channel === void 0 ? void 0 : channel.createOperatorListQuery({
            limit: 10,
        });
        operatorListQuery.next().then(function (operators) {
            setOperators(operators);
            setHasNext(operatorListQuery.hasNext);
        });
    }, [channel]);
    var refreshList = React.useCallback(function () {
        if (!channel) {
            setOperators([]);
            return;
        }
        var operatorListQuery = channel === null || channel === void 0 ? void 0 : channel.createOperatorListQuery({
            limit: 10,
        });
        operatorListQuery.next().then(function (operators) {
            setOperators(operators);
            setHasNext(operatorListQuery.hasNext);
        });
    }, [channel]);
    return (React.createElement(React.Fragment, null,
        operators.map(function (operator) { return (React.createElement(ChannelSettings_components_UserListItem, { key: operator.userId, user: operator, currentUser: userId, action: function (_a) {
                var actionRef = _a.actionRef;
                if ((operator === null || operator === void 0 ? void 0 : operator.userId) === userId) {
                    return null;
                }
                return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                        React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                        React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                channel === null || channel === void 0 ? void 0 : channel.removeOperators([operator.userId]).then(function () {
                                    /**
                                     * Limitation to server-side table update delay.
                                     */
                                    setTimeout(function () {
                                        refreshList();
                                    }, 500);
                                });
                                closeDropdown();
                            }, dataSbId: "channel_setting_operator_context_menu_unregister_operator" }, stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR))); } }));
            } })); }),
        React.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () {
                    setShowAdd(true);
                } }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ADD),
            hasNext && (React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () {
                    setShowMore(true);
                } }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL))),
        showMore && (React.createElement(OperatorsModal, { onCancel: function () {
                setShowMore(false);
                refreshList();
            } })),
        showAdd && (React.createElement(AddOperatorsModal, { onCancel: function () { return setShowAdd(false); }, onSubmit: function () {
                /**
                 * Limitation to server-side table update delay.
                 */
                setTimeout(function () {
                    refreshList();
                }, 500);
                setShowAdd(false);
            } }))));
};

function BannedUsersModal(_a) {
    var onCancel = _a.onCancel;
    var _b = React.useState([]), members = _b[0], setMembers = _b[1];
    var _c = React.useState(null), memberQuery = _c[0], setMemberQuery = _c[1];
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    React.useEffect(function () {
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery();
        bannedUserListQuery.next().then(function (users) {
            setMembers(users);
        });
        setMemberQuery(bannedUserListQuery);
    }, []);
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: utils.noop, titleText: stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE },
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(_tslib.__spreadArray(_tslib.__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React.createElement(ui_UserListItem, { user: member, key: member.userId, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.unbanUser(member).then(function () {
                                        closeDropdown();
                                        setMembers(members.filter(function (m) {
                                            return (m.userId !== member.userId);
                                        }));
                                    });
                                }, dataSbId: "channel_setting_banned_user_context_menu_ban" }, stringSet.CHANNEL_SETTING__MODERATION__BAN))); } }));
                } })); })))));
}

var BannedMemberList = function () {
    var _a = React.useState([]), members = _a[0], setMembers = _a[1];
    var _b = React.useState(false), hasNext = _b[0], setHasNext = _b[1];
    var _c = React.useState(false), showModal = _c[0], setShowModal = _c[1];
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var bannedUserListQueryParams = { limit: 10 };
    React.useEffect(function () {
        if (!channel) {
            setMembers([]);
            return;
        }
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery(bannedUserListQueryParams);
        bannedUserListQuery.next().then(function (users) {
            setMembers(users);
            setHasNext(bannedUserListQuery.hasNext);
        });
    }, [channel]);
    var refreshList = React.useCallback(function () {
        if (!channel) {
            setMembers([]);
            return;
        }
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery(bannedUserListQueryParams);
        bannedUserListQuery.next().then(function (users) {
            setMembers(users);
            setHasNext(bannedUserListQuery.hasNext);
        });
    }, [channel]);
    return (React.createElement(React.Fragment, null,
        members.map(function (member) { return (React.createElement(ChannelSettings_components_UserListItem, { key: member.userId, user: member, action: function (_a) {
                var actionRef = _a.actionRef, parentRef = _a.parentRef;
                return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                        React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                        React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                channel === null || channel === void 0 ? void 0 : channel.unbanUser(member).then(function () {
                                    closeDropdown();
                                    refreshList();
                                });
                            }, dataSbId: "channel_setting_banned_user_context_menu_unban" }, stringSet.CHANNEL_SETTING__MODERATION__UNBAN))); } }));
            } })); }),
        members && members.length === 0 && (React.createElement(ui_Label.Label, { className: "sendbird-channel-settings__empty-list", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_3 }, stringSet.CHANNEL_SETTING__MODERATION__EMPTY_BAN)),
        hasNext && (React.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () {
                    setShowModal(true);
                } }, stringSet.CHANNEL_SETTING__MODERATION__ALL_BAN))),
        showModal && (React.createElement(BannedUsersModal, { onCancel: function () {
                setShowModal(false);
                refreshList();
            } }))));
};

function MutedMembersModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = React.useState([]), members = _c[0], setMembers = _c[1];
    var _d = React.useState(null), memberQuery = _d[0], setMemberQuery = _d[1];
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var currentUser = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    React.useEffect(function () {
        var memberUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            limit: 10,
            // @ts-ignore
            mutedMemberFilter: 'muted',
        });
        memberUserListQuery.next().then(function (members) {
            setMembers(members);
        });
        setMemberQuery(memberUserListQuery);
    }, []);
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: utils.noop, titleText: stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE },
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(_tslib.__spreadArray(_tslib.__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React.createElement(ui_UserListItem, { currentUser: currentUser, user: member, key: member.userId, action: function (_a) {
                    var actionRef = _a.actionRef, parentRef = _a.parentRef;
                    return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                    channel === null || channel === void 0 ? void 0 : channel.unmuteUser(member).then(function () {
                                        closeDropdown();
                                        setMembers(members.filter(function (m) {
                                            return (m.userId !== member.userId);
                                        }));
                                    });
                                }, dataSbId: "channel_setting_muted_member_context_menu_unmute" }, stringSet.CHANNEL_SETTING__MODERATION__UNMUTE))); } }));
                } })); })))));
}

var MutedMemberList = function () {
    var _a;
    var _b = React.useState([]), members = _b[0], setMembers = _b[1];
    var _c = React.useState(false), hasNext = _c[0], setHasNext = _c[1];
    var _d = React.useState(false), showModal = _d[0], setShowModal = _d[1];
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var currentUser = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    React.useEffect(function () {
        if (!channel) {
            setMembers([]);
            return;
        }
        var memberUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            limit: 10,
            // @ts-ignore
            mutedMemberFilter: 'muted',
        });
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
        var memberUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            limit: 10,
            // @ts-ignore
            mutedMemberFilter: 'muted',
        });
        memberUserListQuery.next().then(function (members) {
            setMembers(members);
            setHasNext(memberUserListQuery.hasNext);
        });
    }, [channel]);
    return (React.createElement(React.Fragment, null,
        members.map(function (member) { return (React.createElement(ChannelSettings_components_UserListItem, { key: member.userId, user: member, currentUser: currentUser, action: function (_a) {
                var actionRef = _a.actionRef, parentRef = _a.parentRef;
                return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                        React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { closeDropdown: closeDropdown, openLeft: true, parentContainRef: parentRef, parentRef: actionRef },
                        React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                channel === null || channel === void 0 ? void 0 : channel.unmuteUser(member).then(function () {
                                    /**
                                     * Limitation to server-side table update delay.
                                     */
                                    setTimeout(function () {
                                        refreshList();
                                    }, 500);
                                    closeDropdown();
                                });
                            }, dataSbId: "channel_setting_muted_member_context_menu_unmute" }, (stringSet === null || stringSet === void 0 ? void 0 : stringSet.CHANNEL_SETTING__UNMUTE) || stringSet.CHANNEL_SETTING__MODERATION__UNMUTE))); } }));
            } })); }),
        members && members.length === 0 && (React.createElement(ui_Label.Label, { className: "sendbird-channel-settings__empty-list", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_3 }, stringSet.CHANNEL_SETTING__NO_UNMUTED)),
        hasNext && (React.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () {
                    setShowModal(true);
                } }, stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE_ALL))),
        showModal && (React.createElement(MutedMembersModal, { onCancel: function () {
                setShowModal(false);
                refreshList();
            } }))));
};

var kFormatter = function (num) {
    return Math.abs(num) > 999
        ? "".concat((Math.abs(num) / 1000).toFixed(1), "K")
        : num;
};
function AdminPannel() {
    var _a = React.useState(false), frozen = _a[0], setFrozen = _a[1];
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    // work around for
    // https://sendbird.slack.com/archives/G01290GCDCN/p1595922832000900
    // SDK bug - after frozen/unfrozen myRole becomes "none"
    React.useEffect(function () {
        setFrozen(channel === null || channel === void 0 ? void 0 : channel.isFrozen);
    }, [channel]);
    return (React.createElement(ui_Accordion.AccordionGroup, { className: "sendbird-channel-settings__operator" },
        React.createElement(ui_Accordion.default, { className: "sendbird-channel-settings__operators-list", id: "operators", renderTitle: function () { return (React.createElement(React.Fragment, null,
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.OPERATOR, fillColor: ui_Icon.IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE))); }, renderContent: function () { return (React.createElement(React.Fragment, null,
                React.createElement(OperatorList, null))); } }),
        React.createElement(ui_Accordion.default, { className: "sendbird-channel-settings__members-list", id: "members", renderTitle: function () { return (React.createElement(React.Fragment, null,
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.MEMBERS, fillColor: ui_Icon.IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__MEMBERS__TITLE),
                React.createElement(ui_Badge, { count: kFormatter(channel === null || channel === void 0 ? void 0 : channel.memberCount) }))); }, renderContent: function () { return (React.createElement(React.Fragment, null,
                React.createElement(MemberList.MemberList, null))); } }),
        // No muted members in broadcast channel
        !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React.createElement(ui_Accordion.default, { id: "mutedMembers", className: "sendbird-channel-settings__muted-members-list", renderTitle: function () { return (React.createElement(React.Fragment, null,
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.MUTE, fillColor: ui_Icon.IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE))); }, renderContent: function () { return (React.createElement(React.Fragment, null,
                React.createElement(MutedMemberList, null))); } })),
        React.createElement(ui_Accordion.default, { className: "sendbird-channel-settings__banned-members-list", id: "bannedUsers", renderTitle: function () { return (React.createElement(React.Fragment, null,
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.BAN, fillColor: ui_Icon.IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE))); }, renderContent: function () { return (React.createElement(React.Fragment, null,
                React.createElement(BannedMemberList, null))); } }),
        // cannot freeze broadcast channel
        !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React.createElement("div", { className: "sendbird-channel-settings__freeze" },
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.FREEZE, fillColor: ui_Icon.IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__FREEZE_CHANNEL),
            React.createElement(ui_Toggle.Toggle, { className: "sendbird-channel-settings__frozen-icon", checked: frozen, onChange: function () {
                    if (frozen) {
                        channel === null || channel === void 0 ? void 0 : channel.unfreeze().then(function () {
                            setFrozen(function (prev) { return !prev; });
                        });
                    }
                    else {
                        channel === null || channel === void 0 ? void 0 : channel.freeze().then(function () {
                            setFrozen(function (prev) { return !prev; });
                        });
                    }
                } })))));
}

module.exports = AdminPannel;
//# sourceMappingURL=ModerationPanel.js.map
