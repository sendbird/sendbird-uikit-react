'use strict';

var _tslib = require('../../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var CreateChannel_context = require('../../chunks/bundle-RWfI6raz.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var MediaQueryContext = require('../../chunks/bundle-37dz9yoi.js');
var ui_Modal = require('../../chunks/bundle-NeYvE4zX.js');
var ui_Label = require('../../chunks/bundle-2Pq38lvD.js');
var ui_Button = require('../../ui/Button.js');
var ui_UserListItem = require('../../ui/UserListItem.js');
var utils = require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-NfUcey5s.js');
require('../../withSendbird.js');
require('react-dom');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-8G36Z6Or.js');

var filterUser = function (idsToFilter) { return function (currentId) { return idsToFilter === null || idsToFilter === void 0 ? void 0 : idsToFilter.includes(currentId); }; };
var setChannelType = function (params, type) {
    if (type === 'broadcast') {
        // eslint-disable-next-line no-param-reassign
        params.isBroadcast = true;
    }
    if (type === 'supergroup') {
        // eslint-disable-next-line no-param-reassign
        params.isSuper = true;
    }
    return params;
};
var createDefaultUserListQuery = function (_a) {
    var sdk = _a.sdk, userFilledApplicationUserListQuery = _a.userFilledApplicationUserListQuery;
    if (sdk === null || sdk === void 0 ? void 0 : sdk.createApplicationUserListQuery) {
        var params_1 = sdk === null || sdk === void 0 ? void 0 : sdk.createApplicationUserListQuery();
        if (userFilledApplicationUserListQuery) {
            Object.keys(userFilledApplicationUserListQuery).forEach(function (key) {
                params_1[key] = userFilledApplicationUserListQuery[key];
            });
        }
        return params_1;
    }
};

var BUFFER = 50;
var InviteUsers = function (_a) {
    var _b, _c, _d;
    var onCancel = _a.onCancel, userListQuery = _a.userListQuery;
    var _e = CreateChannel_context.useCreateChannelContext(), onCreateChannelClick = _e.onCreateChannelClick, onBeforeCreateChannel = _e.onBeforeCreateChannel, onChannelCreated = _e.onChannelCreated, createChannel = _e.createChannel, onCreateChannel = _e.onCreateChannel, overrideInviteUser = _e.overrideInviteUser, type = _e.type;
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var userId = (_b = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config) === null || _b === void 0 ? void 0 : _b.userId;
    var sdk = (_d = (_c = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _c === void 0 ? void 0 : _c.sdkStore) === null || _d === void 0 ? void 0 : _d.sdk;
    var idsToFilter = [userId];
    var _f = React.useState([]), users = _f[0], setUsers = _f[1];
    var _g = React.useState({}), selectedUsers = _g[0], setSelectedUsers = _g[1];
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _h = React.useState(null), usersDataSource = _h[0], setUsersDataSource = _h[1];
    var selectedCount = Object.keys(selectedUsers).length;
    var titleText = stringSet.MODAL__CREATE_CHANNEL__TITLE;
    var submitText = stringSet.BUTTON__CREATE;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var _j = React.useState(window.innerHeight), scrollableAreaHeight = _j[0], setScrollableAreaHeight = _j[1];
    var userQueryCreator = userListQuery ? userListQuery() : createDefaultUserListQuery({ sdk: sdk });
    React.useEffect(function () {
        var applicationUserListQuery = userQueryCreator;
        setUsersDataSource(applicationUserListQuery);
        // @ts-ignore
        if (!(applicationUserListQuery === null || applicationUserListQuery === void 0 ? void 0 : applicationUserListQuery.isLoading)) {
            applicationUserListQuery.next().then(function (users_) {
                setUsers(users_);
            });
        }
    }, []);
    // To fix navbar break in mobile we set dynamic height to the scrollable area
    React.useEffect(function () {
        var scrollableAreaHeight = function () {
            setScrollableAreaHeight(window.innerHeight);
        };
        window.addEventListener('resize', scrollableAreaHeight);
        return function () {
            window.removeEventListener('resize', scrollableAreaHeight);
        };
    }, []);
    return (React.createElement(ui_Modal.Modal, { isFullScreenOnMobile: true, titleText: titleText, submitText: submitText, type: ui_Button.ButtonTypes.PRIMARY, 
        // Disable the create button if no users are selected,
        // but if there's only the logged-in user in the user list,
        // then the create button should be enabled
        disabled: users.length > 1 && Object.keys(selectedUsers).length === 0, onCancel: onCancel, onSubmit: function () {
            var selectedUserList = Object.keys(selectedUsers).length > 0
                ? Object.keys(selectedUsers)
                : [userId];
            var _onChannelCreated = onChannelCreated !== null && onChannelCreated !== void 0 ? onChannelCreated : onCreateChannel;
            var _onCreateChannelClick = onCreateChannelClick !== null && onCreateChannelClick !== void 0 ? onCreateChannelClick : overrideInviteUser;
            if (typeof _onCreateChannelClick === 'function') {
                _onCreateChannelClick({
                    users: selectedUserList,
                    onClose: onCancel !== null && onCancel !== void 0 ? onCancel : utils.noop,
                    channelType: type,
                });
                return;
            }
            if (onBeforeCreateChannel) {
                var params = onBeforeCreateChannel(selectedUserList);
                setChannelType(params, type);
                createChannel(params).then(function (channel) { return _onChannelCreated === null || _onChannelCreated === void 0 ? void 0 : _onChannelCreated(channel); });
            }
            else {
                var params = {};
                params.invitedUserIds = selectedUserList;
                params.isDistinct = false;
                if (userId) {
                    params.operatorUserIds = [userId];
                }
                setChannelType(params, type);
                // do not have custom params
                createChannel(params).then(function (channel) { return _onChannelCreated === null || _onChannelCreated === void 0 ? void 0 : _onChannelCreated(channel); });
            }
            onCancel === null || onCancel === void 0 ? void 0 : onCancel();
        } },
        React.createElement("div", null,
            React.createElement(ui_Label.Label, { color: (selectedCount > 0) ? ui_Label.LabelColors.PRIMARY : ui_Label.LabelColors.ONBACKGROUND_3, type: ui_Label.LabelTypography.CAPTION_1 }, "".concat(selectedCount, " ").concat(stringSet.MODAL__INVITE_MEMBER__SELECTED)),
            React.createElement("div", { className: "sendbird-create-channel--scroll", style: isMobile ? { height: "calc(".concat(scrollableAreaHeight, "px - 200px)") } : {}, onScroll: function (e) {
                    if (!usersDataSource)
                        return;
                    var eventTarget = e.target;
                    var hasNext = usersDataSource.hasNext, isLoading = usersDataSource.isLoading;
                    var fetchMore = ((eventTarget.clientHeight + eventTarget.scrollTop + BUFFER) > eventTarget.scrollHeight);
                    if (hasNext && fetchMore && !isLoading) {
                        usersDataSource.next().then(function (usersBatch) {
                            setUsers(_tslib.__spreadArray(_tslib.__spreadArray([], users, true), usersBatch, true));
                        });
                    }
                } }, users.map(function (user) { return (!filterUser(idsToFilter)(user.userId)) && (React.createElement(ui_UserListItem, { key: user.userId, user: user, checkBox: true, checked: selectedUsers[user.userId], onChange: function (event) {
                    var _a;
                    var modifiedSelectedUsers = _tslib.__assign(_tslib.__assign({}, selectedUsers), (_a = {}, _a[event.target.id] = event.target.checked, _a));
                    if (!event.target.checked) {
                        delete modifiedSelectedUsers[event.target.id];
                    }
                    setSelectedUsers(modifiedSelectedUsers);
                } })); })))));
};

module.exports = InviteUsers;
//# sourceMappingURL=InviteUsers.js.map
