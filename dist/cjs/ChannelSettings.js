'use strict';

var React = require('react');
var ChannelSettings_components_ChannelSettingsUI = require('./ChannelSettings/components/ChannelSettingsUI.js');
var ChannelSettings_context = require('./ChannelSettings/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-zYqQA3cT.js');
require('./ui/PlaceHolder.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./ui/Icon.js');
require('./chunks/bundle-Xwl4gw4D.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./ui/Loader.js');
require('./ui/IconButton.js');
require('./ChannelSettings/components/ChannelProfile.js');
require('./ui/ChannelAvatar.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./chunks/bundle-dQYtPkLv.js');
require('./ui/TextButton.js');
require('./chunks/bundle-oaDSLq17.js');
require('./ChannelSettings/components/EditDetailsModal.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./chunks/bundle-37dz9yoi.js');
require('./ui/Button.js');
require('./ui/Input.js');
require('./chunks/bundle-NNEanMqk.js');
require('./ChannelSettings/components/ModerationPanel.js');
require('./ui/Accordion.js');
require('./ui/AccordionGroup.js');
require('./chunks/bundle-o6ZMXHG_.js');
require('./ui/Badge.js');
require('./ui/Toggle.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-8G36Z6Or.js');
require('./ChannelSettings/components/UserListItem.js');
require('./chunks/bundle-HnlcCy36.js');
require('./ui/MutedAvatarOverlay.js');
require('./ui/UserProfile.js');
require('./sendbirdSelectors.js');
require('./chunks/bundle-NfUcey5s.js');
require('./ui/UserListItem.js');
require('./ui/Checkbox.js');
require('./chunks/bundle-zraEYh7E.js');
require('./chunks/bundle-FgihvR5h.js');
require('./chunks/bundle-4jVvOUfV.js');
require('./chunks/bundle-CPnHexJQ.js');
require('@sendbird/chat/message');
require('@sendbird/uikit-tools');
require('./chunks/bundle-hWEZzs4y.js');
require('./ChannelSettings/components/LeaveChannel.js');
require('./ChannelSettings/components/UserPanel.js');

var ChannelSettings = function (props) {
    return (React.createElement(ChannelSettings_context.ChannelSettingsProvider, { overrideInviteUser: props === null || props === void 0 ? void 0 : props.overrideInviteUser, channelUrl: props.channelUrl, onCloseClick: props === null || props === void 0 ? void 0 : props.onCloseClick, onLeaveChannel: props === null || props === void 0 ? void 0 : props.onLeaveChannel, onChannelModified: props === null || props === void 0 ? void 0 : props.onChannelModified, onBeforeUpdateChannel: props === null || props === void 0 ? void 0 : props.onBeforeUpdateChannel, queries: props === null || props === void 0 ? void 0 : props.queries, className: props === null || props === void 0 ? void 0 : props.className, disableUserProfile: props === null || props === void 0 ? void 0 : props.disableUserProfile, renderUserProfile: props === null || props === void 0 ? void 0 : props.renderUserProfile },
        React.createElement(ChannelSettings_components_ChannelSettingsUI, { renderPlaceholderError: props === null || props === void 0 ? void 0 : props.renderPlaceholderError, renderChannelProfile: props === null || props === void 0 ? void 0 : props.renderChannelProfile, renderModerationPanel: props === null || props === void 0 ? void 0 : props.renderModerationPanel, renderLeaveChannel: props === null || props === void 0 ? void 0 : props.renderLeaveChannel })));
};

module.exports = ChannelSettings;
//# sourceMappingURL=ChannelSettings.js.map
