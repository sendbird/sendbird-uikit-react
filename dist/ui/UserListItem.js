import { c as __spreadArray } from '../chunks/bundle-UnAcr6wX.js';
import React__default, { useContext } from 'react';
import { a as UserProfileContext } from '../chunks/bundle-jDtVwIPR.js';
import { L as LocalizationContext } from '../chunks/bundle-hS8Jw8F1.js';
import { A as Avatar } from '../chunks/bundle-LbQw2cVx.js';
import MutedAvatarOverlay from './MutedAvatarOverlay.js';
import Checkbox from './Checkbox.js';
import UserProfile from './UserProfile.js';
import ContextMenu, { MenuItems } from './ContextMenu.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../chunks/bundle-8u3PnqsX.js';
import './ImageRenderer.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-fNigAmmf.js';
import './Icon.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-7BSf_PUT.js';
import './Button.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-0Kp88b8b.js';
import '../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-UuydkZ4A.js';

function UserListItem(_a) {
    var user = _a.user, className = _a.className, checked = _a.checked, checkBox = _a.checkBox, isOperator = _a.isOperator, disabled = _a.disabled, disableMessaging = _a.disableMessaging, currentUser = _a.currentUser, action = _a.action, onChange = _a.onChange, _b = _a.avatarSize, avatarSize = _b === void 0 ? '40px' : _b, onClick = _a.onClick;
    var uniqueKey = user.userId;
    var actionRef = React__default.useRef(null);
    var parentRef = React__default.useRef(null);
    var avatarRef = React__default.useRef(null);
    var _c = useContext(UserProfileContext), disableUserProfile = _c.disableUserProfile, renderUserProfile = _c.renderUserProfile;
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-user-list-item',
        ], false).join(' '), ref: parentRef },
        (user === null || user === void 0 ? void 0 : user.isMuted) && (React__default.createElement(MutedAvatarOverlay, { height: 40, width: 40 })),
        React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) { return (React__default.createElement(Avatar, { className: "sendbird-user-list-item__avatar", ref: avatarRef, src: user.profileUrl, width: avatarSize, height: avatarSize, onClick: function () {
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
                : (React__default.createElement(MenuItems, { openLeft: true, parentRef: avatarRef, 
                    // for catching location(x, y) of MenuItems
                    parentContainRef: avatarRef, 
                    // for toggling more options(menus & reactions)
                    closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
                    React__default.createElement(UserProfile, { disableMessaging: disableMessaging, user: user, currentUserId: currentUser, onSuccess: closeDropdown })))); } }),
        React__default.createElement(Label, { className: "sendbird-user-list-item__title", type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 },
            user.nickname || stringSet.NO_NAME,
            (currentUser === user.userId) && (' (You)')),
        !user.nickname && (React__default.createElement(Label, { className: "sendbird-user-list-item__subtitle", type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, user.userId)),
        checkBox && (React__default.createElement("label", { className: "sendbird-user-list-item__checkbox", htmlFor: uniqueKey },
            React__default.createElement(Checkbox, { id: uniqueKey, checked: checked, disabled: disabled, onChange: function (event) { return onChange(event); } }))),
        isOperator && (React__default.createElement(Label, { className: [
                'sendbird-user-list-item__operator',
                checkBox ? 'checkbox' : '',
            ].join(' '), type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_2 }, stringSet.LABEL__OPERATOR)),
        action && (React__default.createElement("div", { className: "sendbird-user-list-item__action", ref: actionRef }, action({ actionRef: actionRef, parentRef: parentRef })))));
}

export { UserListItem as default };
//# sourceMappingURL=UserListItem.js.map
