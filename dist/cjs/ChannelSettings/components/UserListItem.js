'use strict';

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var UserProfileContext = require('../../chunks/bundle-DKcL-93i.js');
var ui_Avatar = require('../../chunks/bundle-OfFu3N1i.js');
var ui_MutedAvatarOverlay = require('../../ui/MutedAvatarOverlay.js');
var ui_Label = require('../../chunks/bundle-26QzFMMl.js');
var ui_UserProfile = require('../../ui/UserProfile.js');
var ui_ContextMenu = require('../../ui/ContextMenu.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../ui/Icon.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../ui/Button.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');

var UserListItem = function (_a) {
    var user = _a.user, className = _a.className, currentUser = _a.currentUser, action = _a.action;
    var actionRef = React.useRef(null);
    var parentRef = React.useRef(null);
    var avatarRef = React.useRef(null);
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _b = React.useContext(UserProfileContext.UserProfileContext), disableUserProfile = _b.disableUserProfile, renderUserProfile = _b.renderUserProfile;
    var injectingClassNames = Array.isArray(className) ? className : [className];
    return (React.createElement("div", { ref: parentRef, className: _tslib.__spreadArray([
            'sendbird-user-list-item--small'
        ], injectingClassNames, true).join(' ') },
        React.createElement(ui_ContextMenu.default, { menuTrigger: function (toggleDropdown) { return (React.createElement(React.Fragment, null,
                React.createElement(ui_Avatar.Avatar, { onClick: function () {
                        if (!disableUserProfile) {
                            toggleDropdown();
                        }
                    }, ref: avatarRef, className: "sendbird-user-list-item--small__avatar", src: user.profileUrl, width: 24, height: 24 }),
                user.isMuted && (React.createElement(ui_MutedAvatarOverlay, null)))); }, menuItems: function (closeDropdown) { return (renderUserProfile
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
                    React.createElement(ui_UserProfile, { user: user, currentUserId: currentUser, onSuccess: closeDropdown })))); } }),
        React.createElement(ui_Label.Label, { className: "sendbird-user-list-item--small__title", type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 },
            user.nickname || stringSet.NO_NAME,
            (currentUser === user.userId) && (stringSet.CHANNEL_SETTING__MEMBERS__YOU)),
        !user.nickname && (React.createElement(ui_Label.Label, { className: "sendbird-user-list-item--small__subtitle", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, user.userId)),
        user.role === 'operator' && (React.createElement(ui_Label.Label, { className: "sendbird-user-list-item--small__operator", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.CHANNEL_SETTING__MEMBERS__OPERATOR)),
        action && (React.createElement("div", { ref: actionRef, className: "sendbird-user-list-item--small__action" }, action({ actionRef: actionRef, parentRef: parentRef })))));
};

module.exports = UserListItem;
//# sourceMappingURL=UserListItem.js.map