import React__default, { useState, useContext, useEffect, useCallback } from 'react';
import { L as LocalizationContext, u as useLocalization } from '../../chunks/bundle-msnuMA4R.js';
import Accordion, { AccordionGroup } from '../../ui/Accordion.js';
import { L as Label, b as LabelColors, a as LabelTypography } from '../../chunks/bundle-kMMCn6GE.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import Badge from '../../ui/Badge.js';
import { Toggle } from '../../ui/Toggle.js';
import Button, { ButtonTypes, ButtonSizes } from '../../ui/Button.js';
import IconButton from '../../ui/IconButton.js';
import ContextMenu, { MenuItems, MenuItem } from '../../ui/ContextMenu.js';
import UserListItem$1 from './UserListItem.js';
import { c as __spreadArray, _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import { M as Modal } from '../../chunks/bundle-O8mkJ7az.js';
import UserListItem from '../../ui/UserListItem.js';
import { useChannelSettingsContext } from '../context.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { OperatorFilter } from '@sendbird/chat/groupChannel';
import { M as MemberList } from '../../chunks/bundle-boGfCX_e.js';
import { n as noop } from '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../ui/AccordionGroup.js';
import '../../chunks/bundle-JjzC7gJ9.js';
import '../../withSendbird.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/Checkbox.js';
import '../../chunks/bundle-lPKA2RTf.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../chunks/bundle-fO5XIU5Y.js';
import '@sendbird/chat/message';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-JMVaVraV.js';

function OperatorsModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = useState([]), operators = _c[0], setOperators = _c[1];
    var _d = useState(null), operatorQuery = _d[0], setOperatorQuery = _d[1];
    var channel = useChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUserId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = useContext(LocalizationContext).stringSet;
    useEffect(function () {
        var operatorListQuery = channel === null || channel === void 0 ? void 0 : channel.createOperatorListQuery({
            limit: 20,
        });
        operatorListQuery.next().then(function (operators) {
            setOperators(operators);
        });
        setOperatorQuery(operatorListQuery);
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, hideFooter: true, titleText: stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL, onCancel: onCancel },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = operatorQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        operatorQuery.next().then(function (o) {
                            setOperators(__spreadArray(__spreadArray([], operators, true), o, true));
                        });
                    }
                } }, operators.map(function (member) { return (React__default.createElement(UserListItem, { currentUser: currentUserId, user: member, key: member.userId, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return ((member === null || member === void 0 ? void 0 : member.userId) !== currentUserId && (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { onClick: function () {
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
    var _b = useState([]), members = _b[0], setMembers = _b[1];
    var _c = useState({}), selectedMembers = _c[0], setSelectedMembers = _c[1];
    var _d = useState(null), memberQuery = _d[0], setMemberQuery = _d[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var channel = useChannelSettingsContext().channel;
    useEffect(function () {
        var memberListQuery = channel === null || channel === void 0 ? void 0 : channel.createMemberListQuery({
            operatorFilter: OperatorFilter.NONOPERATOR,
            limit: 20,
        });
        memberListQuery.next().then(function (members) {
            setMembers(members);
        });
        setMemberQuery(memberListQuery);
    }, []);
    var selectedCount = Object.keys(selectedMembers).filter(function (m) { return selectedMembers[m]; }).length;
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, type: ButtonTypes.PRIMARY, submitText: stringSet.CHANNEL_SETTING__OPERATORS__ADD_BUTTON, onCancel: onCancel, onSubmit: function () {
                var members = Object.keys(selectedMembers).filter(function (m) { return selectedMembers[m]; });
                channel === null || channel === void 0 ? void 0 : channel.addOperators(members).then(function () {
                    onSubmit(members);
                });
            }, titleText: stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE },
            React__default.createElement(Label, { color: (selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3, type: LabelTypography.CAPTION_1 }, "".concat(selectedCount, " ").concat(stringSet.MODAL__INVITE_MEMBER__SELECTED)),
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(__spreadArray(__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React__default.createElement(UserListItem, { checkBox: true, checked: selectedMembers[member.userId], isOperator: (member === null || member === void 0 ? void 0 : member.role) === 'operator', disabled: (member === null || member === void 0 ? void 0 : member.role) === 'operator', onChange: function (event) {
                    var _a;
                    var modifiedSelectedMembers = __assign(__assign({}, selectedMembers), (_a = {}, _a[event.target.id] = event.target.checked, _a));
                    if (!event.target.checked) {
                        delete modifiedSelectedMembers[event.target.id];
                    }
                    setSelectedMembers(modifiedSelectedMembers);
                }, user: member, key: member.userId })); })))));
}

var OperatorList = function () {
    var _a;
    var _b = useState([]), operators = _b[0], setOperators = _b[1];
    var _c = useState(false), showMore = _c[0], setShowMore = _c[1];
    var _d = useState(false), showAdd = _d[0], setShowAdd = _d[1];
    var _e = useState(false), hasNext = _e[0], setHasNext = _e[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var state = useSendbirdStateContext();
    var channel = useChannelSettingsContext().channel;
    var userId = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    useEffect(function () {
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
    var refreshList = useCallback(function () {
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
    return (React__default.createElement(React__default.Fragment, null,
        operators.map(function (operator) { return (React__default.createElement(UserListItem$1, { key: operator.userId, user: operator, currentUser: userId, action: function (_a) {
                var actionRef = _a.actionRef;
                if ((operator === null || operator === void 0 ? void 0 : operator.userId) === userId) {
                    return null;
                }
                return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                        React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                        React__default.createElement(MenuItem, { onClick: function () {
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
        React__default.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowAdd(true);
                } }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ADD),
            hasNext && (React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowMore(true);
                } }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL))),
        showMore && (React__default.createElement(OperatorsModal, { onCancel: function () {
                setShowMore(false);
                refreshList();
            } })),
        showAdd && (React__default.createElement(AddOperatorsModal, { onCancel: function () { return setShowAdd(false); }, onSubmit: function () {
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
    var _b = useState([]), members = _b[0], setMembers = _b[1];
    var _c = useState(null), memberQuery = _c[0], setMemberQuery = _c[1];
    var channel = useChannelSettingsContext().channel;
    var stringSet = useLocalization().stringSet;
    useEffect(function () {
        var bannedUserListQuery = channel === null || channel === void 0 ? void 0 : channel.createBannedUserListQuery();
        bannedUserListQuery.next().then(function (users) {
            setMembers(users);
        });
        setMemberQuery(bannedUserListQuery);
    }, []);
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: noop, titleText: stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(__spreadArray(__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React__default.createElement(UserListItem, { user: member, key: member.userId, action: function (_a) {
                    var parentRef = _a.parentRef, actionRef = _a.actionRef;
                    return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { onClick: function () {
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
    var _a = useState([]), members = _a[0], setMembers = _a[1];
    var _b = useState(false), hasNext = _b[0], setHasNext = _b[1];
    var _c = useState(false), showModal = _c[0], setShowModal = _c[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var channel = useChannelSettingsContext().channel;
    var bannedUserListQueryParams = { limit: 10 };
    useEffect(function () {
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
    var refreshList = useCallback(function () {
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
    return (React__default.createElement(React__default.Fragment, null,
        members.map(function (member) { return (React__default.createElement(UserListItem$1, { key: member.userId, user: member, action: function (_a) {
                var actionRef = _a.actionRef, parentRef = _a.parentRef;
                return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                        React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                        React__default.createElement(MenuItem, { onClick: function () {
                                channel === null || channel === void 0 ? void 0 : channel.unbanUser(member).then(function () {
                                    closeDropdown();
                                    refreshList();
                                });
                            }, dataSbId: "channel_setting_banned_user_context_menu_unban" }, stringSet.CHANNEL_SETTING__MODERATION__UNBAN))); } }));
            } })); }),
        members && members.length === 0 && (React__default.createElement(Label, { className: "sendbird-channel-settings__empty-list", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_3 }, stringSet.CHANNEL_SETTING__MODERATION__EMPTY_BAN)),
        hasNext && (React__default.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowModal(true);
                } }, stringSet.CHANNEL_SETTING__MODERATION__ALL_BAN))),
        showModal && (React__default.createElement(BannedUsersModal, { onCancel: function () {
                setShowModal(false);
                refreshList();
            } }))));
};

function MutedMembersModal(_a) {
    var _b;
    var onCancel = _a.onCancel;
    var _c = useState([]), members = _c[0], setMembers = _c[1];
    var _d = useState(null), memberQuery = _d[0], setMemberQuery = _d[1];
    var channel = useChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUser = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var stringSet = useLocalization().stringSet;
    useEffect(function () {
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
    return (React__default.createElement("div", null,
        React__default.createElement(Modal, { isFullScreenOnMobile: true, hideFooter: true, onCancel: function () { return onCancel(); }, onSubmit: noop, titleText: stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE },
            React__default.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = memberQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        memberQuery.next().then(function (o) {
                            setMembers(__spreadArray(__spreadArray([], members, true), o, true));
                        });
                    }
                } }, members.map(function (member) { return (React__default.createElement(UserListItem, { currentUser: currentUser, user: member, key: member.userId, action: function (_a) {
                    var actionRef = _a.actionRef, parentRef = _a.parentRef;
                    return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                            React__default.createElement(MenuItem, { onClick: function () {
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
    var _b = useState([]), members = _b[0], setMembers = _b[1];
    var _c = useState(false), hasNext = _c[0], setHasNext = _c[1];
    var _d = useState(false), showModal = _d[0], setShowModal = _d[1];
    var stringSet = useLocalization().stringSet;
    var channel = useChannelSettingsContext().channel;
    var state = useSendbirdStateContext();
    var currentUser = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    useEffect(function () {
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
    var refreshList = useCallback(function () {
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
    return (React__default.createElement(React__default.Fragment, null,
        members.map(function (member) { return (React__default.createElement(UserListItem$1, { key: member.userId, user: member, currentUser: currentUser, action: function (_a) {
                var actionRef = _a.actionRef, parentRef = _a.parentRef;
                return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                        React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.MORE, fillColor: IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React__default.createElement(MenuItems, { closeDropdown: closeDropdown, openLeft: true, parentContainRef: parentRef, parentRef: actionRef },
                        React__default.createElement(MenuItem, { onClick: function () {
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
        members && members.length === 0 && (React__default.createElement(Label, { className: "sendbird-channel-settings__empty-list", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_3 }, stringSet.CHANNEL_SETTING__NO_UNMUTED)),
        hasNext && (React__default.createElement("div", { className: "sendbird-channel-settings-accordion__footer" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: function () {
                    setShowModal(true);
                } }, stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE_ALL))),
        showModal && (React__default.createElement(MutedMembersModal, { onCancel: function () {
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
    var _a = useState(false), frozen = _a[0], setFrozen = _a[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var channel = useChannelSettingsContext().channel;
    // work around for
    // https://sendbird.slack.com/archives/G01290GCDCN/p1595922832000900
    // SDK bug - after frozen/unfrozen myRole becomes "none"
    useEffect(function () {
        setFrozen(channel === null || channel === void 0 ? void 0 : channel.isFrozen);
    }, [channel]);
    return (React__default.createElement(AccordionGroup, { className: "sendbird-channel-settings__operator" },
        React__default.createElement(Accordion, { className: "sendbird-channel-settings__operators-list", id: "operators", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(Icon, { type: IconTypes.OPERATOR, fillColor: IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(OperatorList, null))); } }),
        React__default.createElement(Accordion, { className: "sendbird-channel-settings__members-list", id: "members", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(Icon, { type: IconTypes.MEMBERS, fillColor: IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__MEMBERS__TITLE),
                React__default.createElement(Badge, { count: kFormatter(channel === null || channel === void 0 ? void 0 : channel.memberCount) }))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(MemberList, null))); } }),
        // No muted members in broadcast channel
        !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React__default.createElement(Accordion, { id: "mutedMembers", className: "sendbird-channel-settings__muted-members-list", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(Icon, { type: IconTypes.MUTE, fillColor: IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(MutedMemberList, null))); } })),
        React__default.createElement(Accordion, { className: "sendbird-channel-settings__banned-members-list", id: "bannedUsers", renderTitle: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(Icon, { type: IconTypes.BAN, fillColor: IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
                React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE))); }, renderContent: function () { return (React__default.createElement(React__default.Fragment, null,
                React__default.createElement(BannedMemberList, null))); } }),
        // cannot freeze broadcast channel
        !(channel === null || channel === void 0 ? void 0 : channel.isBroadcast) && (React__default.createElement("div", { className: "sendbird-channel-settings__freeze" },
            React__default.createElement(Icon, { type: IconTypes.FREEZE, fillColor: IconColors.PRIMARY, width: 24, height: 24, className: "sendbird-channel-settings__accordion-icon" }),
            React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__FREEZE_CHANNEL),
            React__default.createElement(Toggle, { className: "sendbird-channel-settings__frozen-icon", checked: frozen, onChange: function () {
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

export { AdminPannel as default };
//# sourceMappingURL=ModerationPanel.js.map
