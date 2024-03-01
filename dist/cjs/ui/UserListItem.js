'use strict';

var _tslib = require('../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var UserProfileContext = require('../chunks/bundle-DKcL-93i.js');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_MutedAvatarOverlay = require('./MutedAvatarOverlay.js');
var ui_Checkbox = require('./Checkbox.js');
var ui_UserProfile = require('./UserProfile.js');
var ui_ContextMenu = require('./ContextMenu.js');
var ui_Label = require('../chunks/bundle-26QzFMMl.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('./ImageRenderer.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-uGaTvmsl.js');
require('./Icon.js');
require('../sendbirdSelectors.js');
require('../chunks/bundle-LutGJd7y.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');
require('react-dom');
require('./SortByRow.js');
require('../chunks/bundle-Gzug-R-w.js');
require('../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../utils/message/getOutgoingMessageState.js');
require('../chunks/bundle-3fb9w4KI.js');

function UserListItem(_a) {
    var user = _a.user, className = _a.className, checked = _a.checked, checkBox = _a.checkBox, isOperator = _a.isOperator, disabled = _a.disabled, disableMessaging = _a.disableMessaging, currentUser = _a.currentUser, action = _a.action, onChange = _a.onChange, _b = _a.avatarSize, avatarSize = _b === void 0 ? '40px' : _b, onClick = _a.onClick;
    var uniqueKey = user.userId;
    var actionRef = React.useRef(null);
    var parentRef = React.useRef(null);
    var avatarRef = React.useRef(null);
    var _c = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _c.disableUserProfile, renderUserProfile = _c.renderUserProfile;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: _tslib.__spreadArray(_tslib.__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-user-list-item',
        ], false).join(' '), ref: parentRef },
        (user === null || user === void 0 ? void 0 : user.isMuted) && (React.createElement(ui_MutedAvatarOverlay, { height: 40, width: 40 })),
        React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-user-list-item__avatar", ref: avatarRef, src: user.profileUrl, width: avatarSize, height: avatarSize, onClick: function () {
                    if (!disableUserProfile) {
                        toggleDropdown();
                        onClick === null || onClick === void 0 ? void 0 : onClick();
                    }
                } })); }, menuItems: function (closeDropdown) { return (renderUserProfile
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
                    React.createElement(ui_UserProfile, { disableMessaging: disableMessaging, user: user, currentUserId: currentUser, onSuccess: closeDropdown })))); } }),
        React.createElement(ui_Label.Label, { className: "sendbird-user-list-item__title", type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 },
            user.nickname || stringSet.NO_NAME,
            (currentUser === user.userId) && (' (You)')),
        !user.nickname && (React.createElement(ui_Label.Label, { className: "sendbird-user-list-item__subtitle", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, user.userId)),
        checkBox && (React.createElement("label", { className: "sendbird-user-list-item__checkbox", htmlFor: uniqueKey },
            React.createElement(ui_Checkbox, { id: uniqueKey, checked: checked, disabled: disabled, onChange: function (event) { return onChange(event); } }))),
        isOperator && (React.createElement(ui_Label.Label, { className: [
                'sendbird-user-list-item__operator',
                checkBox ? 'checkbox' : '',
            ].join(' '), type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.LABEL__OPERATOR)),
        action && (React.createElement("div", { className: "sendbird-user-list-item__action", ref: actionRef }, action({ actionRef: actionRef, parentRef: parentRef })))));
}

module.exports = UserListItem;
//# sourceMappingURL=UserListItem.js.map
