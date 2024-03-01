import React__default, { useContext, useState } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import Badge from '../../ui/Badge.js';
import { M as MemberList } from '../../chunks/bundle-3E8xSyj7.js';
import { useChannelSettingsContext } from '../context.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../ui/Button.js';
import '../../ui/IconButton.js';
import '../../ui/ContextMenu.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import './UserListItem.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle--BlhOpUS.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/UserListItem.js';
import '../../ui/Checkbox.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat/message';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-6aMfjTWv.js';

var kFormatter = function (num) {
    return Math.abs(num) > 999
        ? "".concat((Math.abs(num) / 1000).toFixed(1), "K")
        : num;
};
var UserPanel = function () {
    var stringSet = useContext(LocalizationContext).stringSet;
    var _a = useState(false), showAccordion = _a[0], setShowAccordion = _a[1];
    var channel = useChannelSettingsContext().channel;
    return (React__default.createElement("div", { className: 'sendbird-channel-settings__user-panel' },
        React__default.createElement("div", { className: [
                'sendbird-channel-settings__panel-item',
                'sendbird-channel-settings__members',
            ].join(' '), role: "switch", "aria-checked": showAccordion, onKeyDown: function () { return setShowAccordion(!showAccordion); }, onClick: function () { return setShowAccordion(!showAccordion); }, tabIndex: 0 },
            React__default.createElement(Icon, { className: "sendbird-channel-settings__panel-icon-left", type: IconTypes.MEMBERS, fillColor: IconColors.PRIMARY, height: "24px", width: "24px" }),
            React__default.createElement(Label, { type: LabelTypography.SUBTITLE_1, color: LabelColors.ONBACKGROUND_1 },
                stringSet.CHANNEL_SETTING__MEMBERS__TITLE,
                React__default.createElement(Badge, { className: 'sendbird-channel-settings__badge', count: kFormatter(channel === null || channel === void 0 ? void 0 : channel.memberCount) })),
            React__default.createElement(Icon, { className: [
                    'sendbird-channel-settings__panel-icon-right',
                    'sendbird-channel-settings__panel-icon--chevron',
                    (showAccordion ? 'sendbird-channel-settings__panel-icon--open' : ''),
                ].join(' '), type: IconTypes.CHEVRON_RIGHT, height: "24px", width: "24px" })),
        showAccordion && (React__default.createElement(MemberList, null))));
};

export { UserPanel as default };
//# sourceMappingURL=UserPanel.js.map
