import { c as __spreadArray, _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default, { useState, useContext, useEffect } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { u as useCreateChannelContext } from '../../chunks/bundle-rpehLlJe.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useMediaQueryContext } from '../../chunks/bundle-qlkGlvyT.js';
import { M as Modal } from '../../chunks/bundle--BlhOpUS.js';
import { L as Label, b as LabelColors, a as LabelTypography } from '../../chunks/bundle-ljRDDTki.js';
import { ButtonTypes } from '../../ui/Button.js';
import UserListItem from '../../ui/UserListItem.js';
import { n as noop } from '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../withSendbird.js';
import 'react-dom';
import '../../ui/IconButton.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';

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
    var _e = useCreateChannelContext(), onCreateChannelClick = _e.onCreateChannelClick, onBeforeCreateChannel = _e.onBeforeCreateChannel, onChannelCreated = _e.onChannelCreated, createChannel = _e.createChannel, onCreateChannel = _e.onCreateChannel, overrideInviteUser = _e.overrideInviteUser, type = _e.type;
    var globalStore = useSendbirdStateContext();
    var userId = (_b = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config) === null || _b === void 0 ? void 0 : _b.userId;
    var sdk = (_d = (_c = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _c === void 0 ? void 0 : _c.sdkStore) === null || _d === void 0 ? void 0 : _d.sdk;
    var idsToFilter = [userId];
    var _f = useState([]), users = _f[0], setUsers = _f[1];
    var _g = useState({}), selectedUsers = _g[0], setSelectedUsers = _g[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var _h = useState(null), usersDataSource = _h[0], setUsersDataSource = _h[1];
    var selectedCount = Object.keys(selectedUsers).length;
    var titleText = stringSet.MODAL__CREATE_CHANNEL__TITLE;
    var submitText = stringSet.BUTTON__CREATE;
    var isMobile = useMediaQueryContext().isMobile;
    var _j = useState(window.innerHeight), scrollableAreaHeight = _j[0], setScrollableAreaHeight = _j[1];
    var userQueryCreator = userListQuery ? userListQuery() : createDefaultUserListQuery({ sdk: sdk });
    useEffect(function () {
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
    useEffect(function () {
        var scrollableAreaHeight = function () {
            setScrollableAreaHeight(window.innerHeight);
        };
        window.addEventListener('resize', scrollableAreaHeight);
        return function () {
            window.removeEventListener('resize', scrollableAreaHeight);
        };
    }, []);
    return (React__default.createElement(Modal, { isFullScreenOnMobile: true, titleText: titleText, submitText: submitText, type: ButtonTypes.PRIMARY, 
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
                    onClose: onCancel !== null && onCancel !== void 0 ? onCancel : noop,
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
        React__default.createElement("div", null,
            React__default.createElement(Label, { color: (selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3, type: LabelTypography.CAPTION_1 }, "".concat(selectedCount, " ").concat(stringSet.MODAL__INVITE_MEMBER__SELECTED)),
            React__default.createElement("div", { className: "sendbird-create-channel--scroll", style: isMobile ? { height: "calc(".concat(scrollableAreaHeight, "px - 200px)") } : {}, onScroll: function (e) {
                    if (!usersDataSource)
                        return;
                    var eventTarget = e.target;
                    var hasNext = usersDataSource.hasNext, isLoading = usersDataSource.isLoading;
                    var fetchMore = ((eventTarget.clientHeight + eventTarget.scrollTop + BUFFER) > eventTarget.scrollHeight);
                    if (hasNext && fetchMore && !isLoading) {
                        usersDataSource.next().then(function (usersBatch) {
                            setUsers(__spreadArray(__spreadArray([], users, true), usersBatch, true));
                        });
                    }
                } }, users.map(function (user) { return (!filterUser(idsToFilter)(user.userId)) && (React__default.createElement(UserListItem, { key: user.userId, user: user, checkBox: true, checked: selectedUsers[user.userId], onChange: function (event) {
                    var _a;
                    var modifiedSelectedUsers = __assign(__assign({}, selectedUsers), (_a = {}, _a[event.target.id] = event.target.checked, _a));
                    if (!event.target.checked) {
                        delete modifiedSelectedUsers[event.target.id];
                    }
                    setSelectedUsers(modifiedSelectedUsers);
                } })); })))));
};

export { InviteUsers as default };
//# sourceMappingURL=InviteUsers.js.map
