import React__default, { useState, useContext } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-1inZXcUV.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-sR62lMVk.js';
import TextButton from '../../ui/TextButton.js';
import ChannelAvatar from '../../ui/OpenChannelAvatar.js';
import EditDetails from './EditDetailsModal.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useOpenChannelSettingsContext } from '../context.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle-nMxV4WMS.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-gIGIUJq-.js';
import '../../chunks/bundle-yarrTY_z.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Input.js';
import '../../withSendbird.js';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-BZ3hPsJ8.js';

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
