import React__default from 'react';
import OpenChannelUI from './OpenChannelSettings/components/OpenChannelSettingsUI.js';
import { OpenChannelSettingsProvider } from './OpenChannelSettings/context.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './chunks/bundle-KMsJXUN2.js';
import './chunks/bundle-msnuMA4R.js';
import './chunks/bundle-Tg3CrpQU.js';
import './chunks/bundle-CsWYoRVd.js';
import './chunks/bundle-kMMCn6GE.js';
import './ui/Icon.js';
import './chunks/bundle-7YRb7CRq.js';
import './ui/PlaceHolder.js';
import './ui/Loader.js';
import './OpenChannelSettings/components/OperatorUI.js';
import './OpenChannelSettings/components/OpenChannelProfile.js';
import './ui/TextButton.js';
import './chunks/bundle-nGuCRoDK.js';
import './ui/OpenChannelAvatar.js';
import './chunks/bundle-OJq071GK.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-DhS-f2ZT.js';
import './chunks/bundle-E4eEah-U.js';
import './OpenChannelSettings/components/EditDetailsModal.js';
import './chunks/bundle-THTV9S18.js';
import './chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import './chunks/bundle-ZTmwWu_-.js';
import './ui/IconButton.js';
import './ui/Button.js';
import './ui/Input.js';
import './chunks/bundle-NrZT-X9Z.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './chunks/bundle-4_6x-RiC.js';
import './chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-LZemF1A7.js';
import './chunks/bundle-x78eEPy7.js';
import './chunks/bundle-JjzC7gJ9.js';
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
