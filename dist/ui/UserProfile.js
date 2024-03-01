import React__default, { useContext } from 'react';
import { L as LocalizationContext } from '../chunks/bundle-1inZXcUV.js';
import { a as UserProfileContext } from '../chunks/bundle-9GBao6H-.js';
import { getCreateGroupChannel } from '../sendbirdSelectors.js';
import { A as Avatar } from '../chunks/bundle-VE0ige0C.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-sR62lMVk.js';
import Button, { ButtonTypes } from './Button.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import '../chunks/bundle--MbN9aKT.js';
import '../chunks/bundle-V_fO-GlK.js';
import '../chunks/bundle-yarrTY_z.js';
import '../chunks/bundle-IDH-OOHE.js';
import '../chunks/bundle-xhjHZ041.js';
import './ImageRenderer.js';
import '../chunks/bundle-3a5xXUZv.js';
import './Icon.js';
import '../withSendbird.js';

function UserProfile(_a) {
    var _b, _c;
    var user = _a.user, currentUserId = _a.currentUserId, _d = _a.disableMessaging, disableMessaging = _d === void 0 ? false : _d, onSuccess = _a.onSuccess;
    var store = useSendbirdStateContext();
    var createChannel = getCreateGroupChannel(store);
    var logger = (_b = store === null || store === void 0 ? void 0 : store.config) === null || _b === void 0 ? void 0 : _b.logger;
    var stringSet = useContext(LocalizationContext).stringSet;
    var currentUserId_ = currentUserId || ((_c = store === null || store === void 0 ? void 0 : store.config) === null || _c === void 0 ? void 0 : _c.userId);
    var onUserProfileMessage = useContext(UserProfileContext).onUserProfileMessage;
    return (React__default.createElement("div", { className: "sendbird__user-profile" },
        React__default.createElement("section", { className: "sendbird__user-profile-avatar" },
            React__default.createElement(Avatar, { height: "80px", width: "80px", src: user === null || user === void 0 ? void 0 : user.profileUrl })),
        React__default.createElement("section", { className: "sendbird__user-profile-name" },
            React__default.createElement(Label, { type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, (user === null || user === void 0 ? void 0 : user.nickname) || stringSet.NO_NAME)),
        ((user === null || user === void 0 ? void 0 : user.userId) !== currentUserId_) && !disableMessaging && (React__default.createElement("section", { className: "sendbird__user-profile-message" },
            React__default.createElement(Button, { type: ButtonTypes.SECONDARY, onClick: function () {
                    // Create 1:1 channel
                    var params = {
                        isDistinct: false,
                        invitedUserIds: [user === null || user === void 0 ? void 0 : user.userId],
                        operatorUserIds: [currentUserId_],
                    };
                    onSuccess();
                    createChannel(params)
                        .then(function (groupChannel) {
                        logger.info('UserProfile, channel create', groupChannel);
                        if (typeof onUserProfileMessage === 'function') {
                            onUserProfileMessage === null || onUserProfileMessage === void 0 ? void 0 : onUserProfileMessage(groupChannel);
                        }
                    });
                } }, stringSet.USER_PROFILE__MESSAGE))),
        React__default.createElement("div", { className: "sendbird__user-profile-separator" }),
        React__default.createElement("section", { className: "sendbird__user-profile-userId" },
            React__default.createElement(Label, { className: "sendbird__user-profile-userId--label", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, stringSet.USER_PROFILE__USER_ID),
            React__default.createElement(Label, { className: "sendbird__user-profile-userId--value", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_1 }, user === null || user === void 0 ? void 0 : user.userId))));
}

export { UserProfile as default };
//# sourceMappingURL=UserProfile.js.map
