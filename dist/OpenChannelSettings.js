import React__default from 'react';
import OpenChannelUI from './OpenChannelSettings/components/OpenChannelSettingsUI.js';
import { OpenChannelSettingsProvider } from './OpenChannelSettings/context.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './chunks/bundle-xhjHZ041.js';
import './chunks/bundle-1inZXcUV.js';
import './chunks/bundle--MbN9aKT.js';
import './chunks/bundle-V_fO-GlK.js';
import './chunks/bundle-sR62lMVk.js';
import './ui/Icon.js';
import './chunks/bundle-IDH-OOHE.js';
import './ui/PlaceHolder.js';
import './ui/Loader.js';
import './OpenChannelSettings/components/OperatorUI.js';
import './OpenChannelSettings/components/OpenChannelProfile.js';
import './ui/TextButton.js';
import './chunks/bundle-nMxV4WMS.js';
import './ui/OpenChannelAvatar.js';
import './chunks/bundle-VE0ige0C.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-3a5xXUZv.js';
import './chunks/bundle-gIGIUJq-.js';
import './OpenChannelSettings/components/EditDetailsModal.js';
import './chunks/bundle-yarrTY_z.js';
import './chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import './chunks/bundle-pjLq9qJd.js';
import './ui/IconButton.js';
import './ui/Button.js';
import './ui/Input.js';
import './chunks/bundle-xJUaYu1v.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './chunks/bundle-BZ3hPsJ8.js';
import './chunks/bundle-Jwc7mleJ.js';
import '@sendbird/chat/groupChannel';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-AN6QCsUL.js';
import './chunks/bundle-9GBao6H-.js';
import './chunks/bundle-jaRNBP5f.js';
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
