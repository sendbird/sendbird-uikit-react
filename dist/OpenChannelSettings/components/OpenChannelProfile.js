import React__default, { useState, useContext } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import TextButton from '../../ui/TextButton.js';
import ChannelAvatar from '../../ui/OpenChannelAvatar.js';
import EditDetails from './EditDetailsModal.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useOpenChannelSettingsContext } from '../context.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-k8wZLjPN.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Input.js';
import '../../withSendbird.js';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-0Kp88b8b.js';

function ChannelProfile() {
    var _a, _b;
    var globalState = useSendbirdStateContext();
    var disabled = !((_a = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _a === void 0 ? void 0 : _a.isOnline);
    var theme = (_b = globalState === null || globalState === void 0 ? void 0 : globalState.config) === null || _b === void 0 ? void 0 : _b.theme;
    var channel = useOpenChannelSettingsContext().channel;
    var title = channel === null || channel === void 0 ? void 0 : channel.name;
    var _c = useState(false), showModal = _c[0], setShowModal = _c[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-openchannel-profile" },
        React__default.createElement("div", { className: "sendbird-openchannel-profile--inner" },
            React__default.createElement("div", { className: "sendbird-openchannel-profile__avatar" },
                React__default.createElement(ChannelAvatar, { channel: channel, theme: theme, height: 80, width: 80 })),
            React__default.createElement(Label, { type: LabelTypography.SUBTITLE_2, color: LabelColors.ONBACKGROUND_1, className: "sendbird-openchannel-profile__title" }, title || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE),
            React__default.createElement(TextButton, { disabled: disabled, className: "sendbird-openchannel-profile__edit", onClick: function () {
                    if (disabled) {
                        return;
                    }
                    setShowModal(true);
                }, disableUnderline: true },
                React__default.createElement(Label, { type: LabelTypography.BUTTON_1, color: disabled ? LabelColors.ONBACKGROUND_2 : LabelColors.PRIMARY }, stringSet.CHANNEL_SETTING__PROFILE__EDIT)),
            showModal && (React__default.createElement(EditDetails, { onCancel: function () { return setShowModal(false); } })))));
}

export { ChannelProfile as default };
//# sourceMappingURL=OpenChannelProfile.js.map
