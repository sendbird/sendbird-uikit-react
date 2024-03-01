'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var ChannelSettings_context = require('../context.js');
var ui_ChannelAvatar = require('../../ui/ChannelAvatar.js');
var ui_TextButton = require('../../ui/TextButton.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ChannelSettings_components_EditDetailsModal = require('./EditDetailsModal.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../withSendbird.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-aadmp473.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/Input.js');

var ChannelProfile = function () {
    var _a, _b, _c;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var channelSettingStore = ChannelSettings_context.useChannelSettingsContext();
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _d = React.useState(false), showModal = _d[0], setShowModal = _d[1];
    var userId = (_a = state === null || state === void 0 ? void 0 : state.config) === null || _a === void 0 ? void 0 : _a.userId;
    var theme = ((_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.theme) || 'light';
    var isOnline = (_c = state === null || state === void 0 ? void 0 : state.config) === null || _c === void 0 ? void 0 : _c.isOnline;
    var disabled = !isOnline;
    var channel = channelSettingStore.channel;
    var getChannelName = function () {
        if ((channel === null || channel === void 0 ? void 0 : channel.name) && (channel === null || channel === void 0 ? void 0 : channel.name) !== 'Group Channel') {
            return channel.name;
        }
        if ((channel === null || channel === void 0 ? void 0 : channel.name) === 'Group Channel' || !(channel === null || channel === void 0 ? void 0 : channel.name)) {
            return ((channel === null || channel === void 0 ? void 0 : channel.members) || []).map(function (member) { return member.nickname || stringSet.NO_NAME; }).join(', ');
        }
        return stringSet.NO_TITLE;
    };
    return (React.createElement("div", { className: "sendbird-channel-profile" },
        React.createElement("div", { className: "sendbird-channel-profile--inner" },
            React.createElement("div", { className: "sendbird-channel-profile__avatar" },
                React.createElement(ui_ChannelAvatar, { channel: channel, userId: userId, theme: theme, width: 80, height: 80 })),
            React.createElement(ui_Label.Label, { className: "sendbird-channel-profile__title", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, getChannelName()),
            React.createElement(ui_TextButton, { disabled: disabled, className: "sendbird-channel-profile__edit", onClick: function () {
                    if (disabled) {
                        return;
                    }
                    setShowModal(true);
                }, disableUnderline: true },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_1, color: disabled ? ui_Label.LabelColors.ONBACKGROUND_2 : ui_Label.LabelColors.PRIMARY }, stringSet.CHANNEL_SETTING__PROFILE__EDIT)),
            showModal && (React.createElement(ChannelSettings_components_EditDetailsModal, { onCancel: function () { return setShowModal(false); }, onSubmit: function () { return setShowModal(false); } })))));
};

module.exports = ChannelProfile;
//# sourceMappingURL=ChannelProfile.js.map
