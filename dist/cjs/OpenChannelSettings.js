'use strict';

var React = require('react');
var OpenChannelSettings_components_OpenChannelSettingsUI = require('./OpenChannelSettings/components/OpenChannelSettingsUI.js');
var OpenChannelSettings_context = require('./OpenChannelSettings/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-xbdnJE9-.js');
require('./chunks/bundle-WKa05h0_.js');
require('./chunks/bundle-Yzhiyr0t.js');
require('./chunks/bundle-HY8cubCp.js');
require('./chunks/bundle-KkCwxjVN.js');
require('./ui/Icon.js');
require('./chunks/bundle-jCTpndN0.js');
require('./ui/PlaceHolder.js');
require('./ui/Loader.js');
require('./OpenChannelSettings/components/OperatorUI.js');
require('./OpenChannelSettings/components/OpenChannelProfile.js');
require('./ui/TextButton.js');
require('./chunks/bundle-0uk8Bfy0.js');
require('./ui/OpenChannelAvatar.js');
require('./chunks/bundle--jUKLwRX.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-kftX5Dbs.js');
require('./chunks/bundle-aadmp473.js');
require('./OpenChannelSettings/components/EditDetailsModal.js');
require('./chunks/bundle-VqRllkVd.js');
require('./chunks/bundle-6hGNMML2.js');
require('react-dom');
require('./chunks/bundle-4WvE40Un.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./ui/Input.js');
require('./chunks/bundle-zPWX89Fn.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-SOIkTCep.js');
require('./chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-tNuJSOqI.js');
require('./chunks/bundle-uzKywAVp.js');
require('./chunks/bundle-Oq4We4Jl.js');
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
