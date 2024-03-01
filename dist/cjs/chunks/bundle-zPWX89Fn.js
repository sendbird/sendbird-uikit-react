'use strict';

var _tslib = require('./bundle-xbdnJE9-.js');
var React = require('react');
var ui_Button = require('../ui/Button.js');
var ui_ContextMenu = require('../ui/ContextMenu.js');
var ui_Icon = require('../ui/Icon.js');
var ui_IconButton = require('../ui/IconButton.js');
var ui_Label = require('./bundle-KkCwxjVN.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');
var UserProfileContext = require('./bundle-uzKywAVp.js');
require('./bundle-Oq4We4Jl.js');
var ui_Avatar = require('./bundle--jUKLwRX.js');
require('react-dom');
require('./bundle-4WvE40Un.js');
var ui_MutedAvatarOverlay = require('../ui/MutedAvatarOverlay.js');
var ui_UserProfile = require('../ui/UserProfile.js');
var OpenChannelSettings_context = require('../OpenChannelSettings/context.js');
require('../withSendbird.js');
var ui_Modal = require('./bundle-6hGNMML2.js');
var ui_UserListItem = require('../ui/UserListItem.js');
var utils = require('./bundle-jCTpndN0.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');

function ParticipantsModal(_a) {
    var _b, _c, _d;
    var onCancel = _a.onCancel;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var channel = OpenChannelSettings_context.useOpenChannelSettingsContext().channel;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _e = React.useState([]), participants = _e[0], setParticipants = _e[1];
    var _f = React.useState(null), participantListQuery = _f[0], setParticipantListQuery = _f[1];
    var userId = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.userId;
    var sdk = (_d = (_c = state === null || state === void 0 ? void 0 : state.stores) === null || _c === void 0 ? void 0 : _c.sdkStore) === null || _d === void 0 ? void 0 : _d.sdk;
    var isOperatorView = channel === null || channel === void 0 ? void 0 : channel.isOperator(userId);
    React.useEffect(function () {
        if (!channel || !(channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery)) {
            return;
        }
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({});
        setParticipantListQuery(participantListQuery);
        participantListQuery.next().then(function (participantList) {
            setParticipants(participantList);
        });
    }, []);
    return (React.createElement("div", null,
        React.createElement(ui_Modal.Modal, { hideFooter: true, isFullScreenOnMobile: true, onCancel: function () { return onCancel(); }, onSubmit: utils.noop, titleText: stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE },
            React.createElement("div", { className: "sendbird-more-members__popup-scroll", onScroll: function (e) {
                    var hasNext = participantListQuery.hasNext;
                    var target = e.target;
                    var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
                    if (hasNext && fetchMore) {
                        participantListQuery.next().then(function (fetchedParticipants) {
                            setParticipants(_tslib.__spreadArray(_tslib.__spreadArray([], participants, true), fetchedParticipants, true));
                        });
                    }
                } }, participants.map(function (p) {
                var _a;
                var isOperator = channel === null || channel === void 0 ? void 0 : channel.isOperator(p.userId);
                return (React.createElement(ui_UserListItem, { user: p, key: p.userId, currentUser: (_a = sdk === null || sdk === void 0 ? void 0 : sdk.currentUser) === null || _a === void 0 ? void 0 : _a.userId, action: (userId !== p.userId && isOperatorView)
                        ? function (_a) {
                            var actionRef = _a.actionRef, parentRef = _a.parentRef;
                            return (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-user-message__more__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                    React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentContainRef: parentRef, parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                    React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
                                    React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
                                    React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
    var avatarRef = React.useRef(null);
    var actionRef = React.useRef(null);
    var _b = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _b.disableUserProfile, renderUserProfile = _b.renderUserProfile;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-participants-accordion__member" },
        React.createElement("div", { className: "sendbird-participants-accordion__member-avatar" },
            React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(React.Fragment, null,
                    React.createElement(ui_Avatar.Avatar, { className: "sendbird-participants-accordion__member-avatar__avatar", onClick: function () {
                            if (!disableUserProfile) {
                                toggleDropdown();
                            }
                        }, ref: avatarRef, src: user.profileUrl, width: 24, height: 24 }),
                    (user === null || user === void 0 ? void 0 : user.isMuted) ? (React.createElement(ui_MutedAvatarOverlay, null)) : '')); }, menuItems: function (closeDropdown) { return (renderUserProfile
                    ? renderUserProfile({
                        user: user,
                        currentUserId: currentUser,
                        close: closeDropdown,
                        avatarRef: avatarRef,
                    })
                    : (React.createElement(ui_ContextMenu.MenuItems, { openLeft: true, parentRef: avatarRef, 
                        // for catching location(x, y) of MenuItems
                        parentContainRef: avatarRef, 
                        // for toggling more options(menus & reactions)
                        closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                        React.createElement(ui_UserProfile, { disableMessaging: true, user: user, currentUserId: currentUser, onSuccess: closeDropdown })))); } })),
        React.createElement(ui_Label.Label, { className: "sendbird-participants-accordion__member__title", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_1 },
            user.nickname || stringSet.NO_NAME,
            (currentUser === user.userId) && (stringSet.OPEN_CHANNEL_SETTINGS__MEMBERS__YOU)),
        !user.nickname && (React.createElement(ui_Label.Label, { className: "sendbird-participants-accordion__member__title user-id", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, user.userId)),
        isOperator && (React.createElement(ui_Label.Label, { className: "sendbird-participants-accordion__member__title\n                ".concat((user === null || user === void 0 ? void 0 : user.userId) !== currentUser ? 'operator' : '', "\n                ").concat((user === null || user === void 0 ? void 0 : user.userId) === currentUser ? 'self-operator' : '', "\n              "), type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.OPEN_CHANNEL_SETTINGS__MEMBERS__OPERATOR)),
        action && (React.createElement("div", { className: "sendbird-participants-accordion__member__action", ref: actionRef }, action({ actionRef: actionRef })))));
};

function ParticipantList(_a) {
    var _b;
    var _c = _a.isOperatorView, isOperatorView = _c === void 0 ? false : _c;
    var globalState = useSendbirdStateContext.useSendbirdStateContext();
    var currentUserId = (_b = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _b === void 0 ? void 0 : _b.userId;
    var channel = OpenChannelSettings_context.useOpenChannelSettingsContext().channel;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _d = React.useState(null), participants = _d[0], setParticipants = _d[1];
    var _e = React.useState(null), participantListQuery = _e[0], setParticipantListQuery = _e[1];
    var _f = React.useState(false), showParticipantsModal = _f[0], setShowParticipantsModal = _f[1];
    React.useEffect(function () {
        if (!channel || !(channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery)) {
            return;
        }
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({ limit: 10 });
        setParticipantListQuery(participantListQuery);
        participantListQuery.next().then(function (participants) {
            setParticipants(participants);
        });
    }, [channel]);
    var refreshList = React.useCallback(function () {
        if (!channel) {
            setParticipants([]);
            return;
        }
        var participantListQuery = channel === null || channel === void 0 ? void 0 : channel.createParticipantListQuery({ limit: 10 });
        participantListQuery.next().then(function (participants) {
            setParticipants(participants);
        });
    }, [channel]);
    return (React.createElement("div", { className: "sendbird-openchannel-settings__participant-list", onScroll: function (e) {
            var hasNext = participantListQuery.hasNext;
            var target = e.target;
            var fetchMore = (target.clientHeight + target.scrollTop === target.scrollHeight);
            if (hasNext && fetchMore) {
                participantListQuery.next().then(function (fetchedParticipants) {
                    setParticipants(_tslib.__spreadArray(_tslib.__spreadArray([], participants, true), fetchedParticipants, true));
                });
            }
        } },
        React.createElement("div", null, participants === null || participants === void 0 ? void 0 :
            participants.map(function (p) {
                var isOperator = channel === null || channel === void 0 ? void 0 : channel.isOperator(p.userId);
                return (React.createElement(UserListItem, { user: p, currentUser: currentUserId, key: p.userId, isOperator: isOperator, action: function (_a) {
                        var actionRef = _a.actionRef;
                        return ((isOperatorView && currentUserId !== (p === null || p === void 0 ? void 0 : p.userId))
                            ? (React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_IconButton, { className: "sendbird-openchannel-participant-list__menu", width: "32px", height: "32px", onClick: toggleDropdown },
                                    React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.MORE, fillColor: ui_Icon.IconColors.CONTENT_INVERSE }))); }, menuItems: function (closeDropdown) { return (React.createElement(ui_ContextMenu.MenuItems, { parentRef: actionRef, closeDropdown: closeDropdown, openLeft: true },
                                    React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
                                    React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
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
                                    React.createElement(ui_ContextMenu.MenuItem, { onClick: function () {
                                            channel === null || channel === void 0 ? void 0 : channel.banUser(p).then(function () {
                                                closeDropdown();
                                                refreshList();
                                            });
                                        }, dataSbId: "open_channel_setting_partitipant_conext_menu_ban" }, stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN))); } }))
                            : null);
                    } }));
            }),
            (participants && participants.length === 0)
                ? (React.createElement(ui_Label.Label, { className: "sendbird-channel-settings__empty-list", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_3 }, stringSet.OPEN_CHANNEL_SETTINGS__EMPTY_LIST)) : null,
            React.createElement("div", { className: "sendbird-openchannel-participant-list__footer" }, (participantListQuery === null || participantListQuery === void 0 ? void 0 : participantListQuery.hasNext) && (React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, size: ui_Button.ButtonSizes.SMALL, onClick: function () { return setShowParticipantsModal(true); } }, stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE))),
            showParticipantsModal && (React.createElement(ParticipantsModal, { onCancel: function () {
                    setShowParticipantsModal(false);
                    refreshList();
                } })))));
}

exports.ParticipantList = ParticipantList;
exports.UserListItem = UserListItem;
//# sourceMappingURL=bundle-zPWX89Fn.js.map
