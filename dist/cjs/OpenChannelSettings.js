'use strict';

var React = require('react');
var OpenChannelSettings_components_OpenChannelSettingsUI = require('./OpenChannelSettings/components/OpenChannelSettingsUI.js');
var OpenChannelSettings_context = require('./OpenChannelSettings/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-zYqQA3cT.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./ui/Icon.js');
require('./chunks/bundle-Xwl4gw4D.js');
require('./ui/PlaceHolder.js');
require('./ui/Loader.js');
require('./OpenChannelSettings/components/OperatorUI.js');
require('./OpenChannelSettings/components/OpenChannelProfile.js');
require('./ui/TextButton.js');
require('./chunks/bundle-oaDSLq17.js');
require('./ui/OpenChannelAvatar.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./chunks/bundle-dQYtPkLv.js');
require('./OpenChannelSettings/components/EditDetailsModal.js');
require('./chunks/bundle-NfUcey5s.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./chunks/bundle-37dz9yoi.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./ui/Input.js');
require('./chunks/bundle-1rM-cAS7.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-NNEanMqk.js');
require('./chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-8G36Z6Or.js');
require('./chunks/bundle-HnlcCy36.js');
require('./chunks/bundle-o6ZMXHG_.js');
require('./ui/MutedAvatarOverlay.js');
require('./ui/UserProfile.js');
require('./sendbirdSelectors.js');
require('./ui/UserListItem.js');
require('./ui/Checkbox.js');
require('./ui/Accordion.js');
require('./ui/AccordionGroup.js');
require('@sendbird/chat/openChannel');

var OpenChannelSetting = function (props) {
    return (React.createElement(OpenChannelSettings_context.OpenChannelSettingsProvider, { channelUrl: props === null || props === void 0 ? void 0 : props.channelUrl, onCloseClick: props === null || props === void 0 ? void 0 : props.onCloseClick, onBeforeUpdateChannel: props === null || props === void 0 ? void 0 : props.onBeforeUpdateChannel, onChannelModified: props === null || props === void 0 ? void 0 : props.onChannelModified, onDeleteChannel: props === null || props === void 0 ? void 0 : props.onDeleteChannel, disableUserProfile: props === null || props === void 0 ? void 0 : props.disableUserProfile, renderUserProfile: props === null || props === void 0 ? void 0 : props.renderUserProfile },
        React.createElement(OpenChannelSettings_components_OpenChannelSettingsUI, { renderOperatorUI: props === null || props === void 0 ? void 0 : props.renderOperatorUI, renderParticipantList: props === null || props === void 0 ? void 0 : props.renderParticipantList })));
};

module.exports = OpenChannelSetting;
//# sourceMappingURL=OpenChannelSettings.js.map
