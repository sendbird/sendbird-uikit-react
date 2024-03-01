import React__default from 'react';
import OpenChannelUI from './OpenChannelSettings/components/OpenChannelSettingsUI.js';
import { OpenChannelSettingsProvider } from './OpenChannelSettings/context.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './chunks/bundle-UnAcr6wX.js';
import './chunks/bundle-hS8Jw8F1.js';
import './chunks/bundle-PIrj5Rm1.js';
import './chunks/bundle-8u3PnqsX.js';
import './chunks/bundle-ljRDDTki.js';
import './ui/Icon.js';
import './chunks/bundle-CRwhglru.js';
import './ui/PlaceHolder.js';
import './ui/Loader.js';
import './OpenChannelSettings/components/OperatorUI.js';
import './OpenChannelSettings/components/OpenChannelProfile.js';
import './ui/TextButton.js';
import './chunks/bundle-02rQraFs.js';
import './ui/OpenChannelAvatar.js';
import './chunks/bundle-LbQw2cVx.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-fNigAmmf.js';
import './chunks/bundle-k8wZLjPN.js';
import './OpenChannelSettings/components/EditDetailsModal.js';
import './chunks/bundle-7BSf_PUT.js';
import './chunks/bundle--BlhOpUS.js';
import 'react-dom';
import './chunks/bundle-qlkGlvyT.js';
import './ui/IconButton.js';
import './ui/Button.js';
import './ui/Input.js';
import './chunks/bundle-LDivREwY.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './chunks/bundle-0Kp88b8b.js';
import './chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-UuydkZ4A.js';
import './chunks/bundle-jDtVwIPR.js';
import './chunks/bundle-0AnE5qN8.js';
import './ui/MutedAvatarOverlay.js';
import './ui/UserProfile.js';
import './sendbirdSelectors.js';
import './ui/UserListItem.js';
import './ui/Checkbox.js';
import './ui/Accordion.js';
import './ui/AccordionGroup.js';
import '@sendbird/chat/openChannel';

var OpenChannelSetting = function (props) {
    return (React__default.createElement(OpenChannelSettingsProvider, { channelUrl: props === null || props === void 0 ? void 0 : props.channelUrl, onCloseClick: props === null || props === void 0 ? void 0 : props.onCloseClick, onBeforeUpdateChannel: props === null || props === void 0 ? void 0 : props.onBeforeUpdateChannel, onChannelModified: props === null || props === void 0 ? void 0 : props.onChannelModified, onDeleteChannel: props === null || props === void 0 ? void 0 : props.onDeleteChannel, disableUserProfile: props === null || props === void 0 ? void 0 : props.disableUserProfile, renderUserProfile: props === null || props === void 0 ? void 0 : props.renderUserProfile },
        React__default.createElement(OpenChannelUI, { renderOperatorUI: props === null || props === void 0 ? void 0 : props.renderOperatorUI, renderParticipantList: props === null || props === void 0 ? void 0 : props.renderParticipantList })));
};

export { OpenChannelSetting as default };
//# sourceMappingURL=OpenChannelSettings.js.map
