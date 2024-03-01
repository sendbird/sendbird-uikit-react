'use strict';

var React = require('react');
var LocalizationContext = require('../chunks/bundle-Nz6fSUye.js');
var UserProfileContext = require('../chunks/bundle-HnlcCy36.js');
var sendbirdSelectors = require('../sendbirdSelectors.js');
var ui_Avatar = require('../chunks/bundle-PoiZwjvJ.js');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
var ui_Button = require('./Button.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-eyiJykZ-.js');
require('../chunks/bundle-NfUcey5s.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('../chunks/bundle-zYqQA3cT.js');
require('./ImageRenderer.js');
require('../chunks/bundle-5mXB6h1C.js');
require('./Icon.js');
require('../withSendbird.js');

function UserProfile(_a) {
    var _b, _c;
    var user = _a.user, currentUserId = _a.currentUserId, _d = _a.disableMessaging, disableMessaging = _d === void 0 ? false : _d, onSuccess = _a.onSuccess;
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var createChannel = sendbirdSelectors.getCreateGroupChannel(store);
    var logger = (_b = store === null || store === void 0 ? void 0 : store.config) === null || _b === void 0 ? void 0 : _b.logger;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var currentUserId_ = currentUserId || ((_c = store === null || store === void 0 ? void 0 : store.config) === null || _c === void 0 ? void 0 : _c.userId);
    var onUserProfileMessage = React.useContext(UserProfileContext.UserProfileContext).onUserProfileMessage;
    return (React.createElement("div", { className: "sendbird__user-profile" },
        React.createElement("section", { className: "sendbird__user-profile-avatar" },
            React.createElement(ui_Avatar.Avatar, { height: "80px", width: "80px", src: user === null || user === void 0 ? void 0 : user.profileUrl })),
        React.createElement("section", { className: "sendbird__user-profile-name" },
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, (user === null || user === void 0 ? void 0 : user.nickname) || stringSet.NO_NAME)),
        ((user === null || user === void 0 ? void 0 : user.userId) !== currentUserId_) && !disableMessaging && (React.createElement("section", { className: "sendbird__user-profile-message" },
            React.createElement(ui_Button.default, { type: ui_Button.ButtonTypes.SECONDARY, onClick: function () {
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
        React.createElement("div", { className: "sendbird__user-profile-separator" }),
        React.createElement("section", { className: "sendbird__user-profile-userId" },
            React.createElement(ui_Label.Label, { className: "sendbird__user-profile-userId--label", type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, stringSet.USER_PROFILE__USER_ID),
            React.createElement(ui_Label.Label, { className: "sendbird__user-profile-userId--value", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, user === null || user === void 0 ? void 0 : user.userId))));
}

module.exports = UserProfile;
//# sourceMappingURL=UserProfile.js.map
