import React__default, { useContext, useState } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useChannelSettingsContext } from '../context.js';
import ChannelAvatar from '../../ui/ChannelAvatar.js';
import TextButton from '../../ui/TextButton.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import EditDetails from './EditDetailsModal.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../withSendbird.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-k8wZLjPN.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Input.js';

var ChannelProfile = function () {
    var _a, _b, _c;
    var state = useSendbirdStateContext();
    var channelSettingStore = useChannelSettingsContext();
    var stringSet = useContext(LocalizationContext).stringSet;
    var _d = useState(false), showModal = _d[0], setShowModal = _d[1];
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
    return (React__default.createElement("div", { className: "sendbird-channel-profile" },
        React__default.createElement("div", { className: "sendbird-channel-profile--inner" },
            React__default.createElement("div", { className: "sendbird-channel-profile__avatar" },
                React__default.createElement(ChannelAvatar, { channel: channel, userId: userId, theme: theme, width: 80, height: 80 })),
            React__default.createElement(Label, { className: "sendbird-channel-profile__title", type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_1 }, getChannelName()),
            React__default.createElement(TextButton, { disabled: disabled, className: "sendbird-channel-profile__edit", onClick: function () {
                    if (disabled) {
                        return;
                    }
                    setShowModal(true);
                }, disableUnderline: true },
                React__default.createElement(Label, { type: LabelTypography.BUTTON_1, color: disabled ? LabelColors.ONBACKGROUND_2 : LabelColors.PRIMARY }, stringSet.CHANNEL_SETTING__PROFILE__EDIT)),
            showModal && (React__default.createElement(EditDetails, { onCancel: function () { return setShowModal(false); }, onSubmit: function () { return setShowModal(false); } })))));
};

export { ChannelProfile as default };
//# sourceMappingURL=ChannelProfile.js.map
