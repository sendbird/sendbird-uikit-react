import React__default, { useContext } from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useOpenChannelSettingsContext } from '../context.js';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-ljRDDTki.js';
import Icon, { IconTypes } from '../../ui/Icon.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import { OperatorUI } from './OperatorUI.js';
import { P as ParticipantList } from '../../chunks/bundle-LDivREwY.js';
import '../../withSendbird.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../ui/Loader.js';
import './OpenChannelProfile.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/OpenChannelAvatar.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-k8wZLjPN.js';
import './EditDetailsModal.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Input.js';
import '../../ui/Accordion.js';
import '../../ui/AccordionGroup.js';
import '../../chunks/bundle-0AnE5qN8.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../ui/UserListItem.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';

function InvalidChannel(_a) {
    var onCloseClick = _a.onCloseClick;
    var stringSet = useContext(LocalizationContext).stringSet;
    return (React__default.createElement("div", { className: "sendbird-openchannel-settings" },
        React__default.createElement("div", { className: "sendbird-openchannel-settings__header" },
            React__default.createElement(Label, { type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__HEADER__TITLE),
            React__default.createElement(Icon, { type: IconTypes.CLOSE, className: "sendbird-openchannel-settings__close-icon", height: "24px", width: "24px", onClick: function () {
                    onCloseClick();
                } })),
        React__default.createElement("div", { className: "sendbird-openchannel-settings__placeholder" },
            React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.WRONG }))));
}

var OpenChannelUI = function (_a) {
    var _b, _c, _d;
    var renderOperatorUI = _a.renderOperatorUI, renderParticipantList = _a.renderParticipantList;
    var _e = useOpenChannelSettingsContext(), channel = _e.channel, onCloseClick = _e.onCloseClick, isChannelInitialized = _e.isChannelInitialized;
    var globalStore = useSendbirdStateContext();
    var logger = (_b = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config) === null || _b === void 0 ? void 0 : _b.logger;
    var user = (_d = (_c = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _c === void 0 ? void 0 : _c.userStore) === null || _d === void 0 ? void 0 : _d.user;
    var stringSet = useContext(LocalizationContext).stringSet;
    if (isChannelInitialized && !channel) {
        return (React__default.createElement(InvalidChannel, { onCloseClick: function () {
                logger.info('OpenChannelSettings: Click close');
                if (onCloseClick) {
                    onCloseClick();
                }
            } }));
    }
    return (React__default.createElement("div", { className: 'sendbird-openchannel-settings' },
        (channel === null || channel === void 0 ? void 0 : channel.isOperator(user)) && ((renderOperatorUI === null || renderOperatorUI === void 0 ? void 0 : renderOperatorUI()) || (React__default.createElement(OperatorUI, null))),
        !(channel === null || channel === void 0 ? void 0 : channel.isOperator(user)) && (React__default.createElement("div", { className: "sendbird-openchannel-settings__participant" },
            React__default.createElement("div", { className: "sendbird-openchannel-settings__header" },
                React__default.createElement(Label, { type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE),
                React__default.createElement(Icon, { type: IconTypes.CLOSE, className: "sendbird-openchannel-settings__close-icon", height: "24px", width: "24px", onClick: function () {
                        onCloseClick();
                    } })),
            (renderParticipantList === null || renderParticipantList === void 0 ? void 0 : renderParticipantList()) || (React__default.createElement(ParticipantList, null))))));
};

export { OpenChannelUI as default };
//# sourceMappingURL=OpenChannelSettingsUI.js.map
