'use strict';

var React = require('react');
var OpenChannelSettings_components_OpenChannelSettingsUI = require('./OpenChannelSettings/components/OpenChannelSettingsUI.js');
var OpenChannelSettings_context = require('./OpenChannelSettings/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-2dG9SU7T.js');
require('./chunks/bundle-60kIt9Rq.js');
require('./chunks/bundle-eH49AisR.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./chunks/bundle-26QzFMMl.js');
require('./ui/Icon.js');
require('./chunks/bundle-QStqvuCY.js');
require('./ui/PlaceHolder.js');
require('./ui/Loader.js');
require('./OpenChannelSettings/components/OperatorUI.js');
require('./OpenChannelSettings/components/OpenChannelProfile.js');
require('./ui/TextButton.js');
require('./chunks/bundle-KNt569rP.js');
require('./ui/OpenChannelAvatar.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-uGaTvmsl.js');
require('./chunks/bundle-T049Npsh.js');
require('./OpenChannelSettings/components/EditDetailsModal.js');
require('./chunks/bundle-LutGJd7y.js');
require('./chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('./chunks/bundle-MZHOyRuu.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./ui/Input.js');
require('./chunks/bundle-bUP0wwxU.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-Gzug-R-w.js');
require('./chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-3fb9w4KI.js');
require('./chunks/bundle-DKcL-93i.js');
require('./chunks/bundle-pJROJet0.js');
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
