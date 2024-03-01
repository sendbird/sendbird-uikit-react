'use strict';

var React = require('react');
var ChannelSettings_components_ChannelSettingsUI = require('./ChannelSettings/components/ChannelSettingsUI.js');
var ChannelSettings_context = require('./ChannelSettings/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-xbdnJE9-.js');
require('./ui/PlaceHolder.js');
require('./chunks/bundle-WKa05h0_.js');
require('./chunks/bundle-Yzhiyr0t.js');
require('./chunks/bundle-HY8cubCp.js');
require('./ui/Icon.js');
require('./chunks/bundle-jCTpndN0.js');
require('./chunks/bundle-KkCwxjVN.js');
require('./ui/Loader.js');
require('./ui/IconButton.js');
require('./ChannelSettings/components/ChannelProfile.js');
require('./ui/ChannelAvatar.js');
require('./chunks/bundle--jUKLwRX.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-kftX5Dbs.js');
require('./chunks/bundle-aadmp473.js');
require('./ui/TextButton.js');
require('./chunks/bundle-0uk8Bfy0.js');
require('./ChannelSettings/components/EditDetailsModal.js');
require('./chunks/bundle-6hGNMML2.js');
require('react-dom');
require('./chunks/bundle-4WvE40Un.js');
require('./ui/Button.js');
require('./ui/Input.js');
require('./chunks/bundle-SOIkTCep.js');
require('./ChannelSettings/components/ModerationPanel.js');
require('./ui/Accordion.js');
require('./ui/AccordionGroup.js');
require('./chunks/bundle-Oq4We4Jl.js');
require('./ui/Badge.js');
require('./ui/Toggle.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-tNuJSOqI.js');
require('./ChannelSettings/components/UserListItem.js');
require('./chunks/bundle-uzKywAVp.js');
require('./ui/MutedAvatarOverlay.js');
require('./ui/UserProfile.js');
require('./sendbirdSelectors.js');
require('./chunks/bundle-VqRllkVd.js');
require('./ui/UserListItem.js');
require('./ui/Checkbox.js');
require('./chunks/bundle-H2dGaKZQ.js');
require('./chunks/bundle-48AiK3oz.js');
require('./chunks/bundle-Atn5EZwu.js');
require('./chunks/bundle-6xWNZugu.js');
require('@sendbird/chat/message');
require('@sendbird/uikit-tools');
require('./chunks/bundle-Zw2P8RwZ.js');
require('./ChannelSettings/components/LeaveChannel.js');
require('./ChannelSettings/components/UserPanel.js');

var ChannelSettings = function (props) {
    return (React.createElement(ChannelSettings_context.ChannelSettingsProvider, { overrideInviteUser: props === null || props === void 0 ? void 0 : props.overrideInviteUser, channelUrl: props.channelUrl, onCloseClick: props === null || props === void 0 ? void 0 : props.onCloseClick, onLeaveChannel: props === null || props === void 0 ? void 0 : props.onLeaveChannel, onChannelModified: props === null || props === void 0 ? void 0 : props.onChannelModified, onBeforeUpdateChannel: props === null || props === void 0 ? void 0 : props.onBeforeUpdateChannel, queries: props === null || props === void 0 ? void 0 : props.queries, className: props === null || props === void 0 ? void 0 : props.className, disableUserProfile: props === null || props === void 0 ? void 0 : props.disableUserProfile, renderUserProfile: props === null || props === void 0 ? void 0 : props.renderUserProfile },
        React.createElement(ChannelSettings_components_ChannelSettingsUI, { renderPlaceholderError: props === null || props === void 0 ? void 0 : props.renderPlaceholderError, renderChannelProfile: props === null || props === void 0 ? void 0 : props.renderChannelProfile, renderModerationPanel: props === null || props === void 0 ? void 0 : props.renderModerationPanel, renderLeaveChannel: props === null || props === void 0 ? void 0 : props.renderLeaveChannel })));
};

module.exports = ChannelSettings;
//# sourceMappingURL=ChannelSettings.js.map
