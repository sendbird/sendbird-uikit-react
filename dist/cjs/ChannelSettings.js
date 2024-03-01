'use strict';

var React = require('react');
var ChannelSettings_components_ChannelSettingsUI = require('./ChannelSettings/components/ChannelSettingsUI.js');
var ChannelSettings_context = require('./ChannelSettings/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-2dG9SU7T.js');
require('./ui/PlaceHolder.js');
require('./chunks/bundle-60kIt9Rq.js');
require('./chunks/bundle-eH49AisR.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./ui/Icon.js');
require('./chunks/bundle-QStqvuCY.js');
require('./chunks/bundle-26QzFMMl.js');
require('./ui/Loader.js');
require('./ui/IconButton.js');
require('./ChannelSettings/components/ChannelProfile.js');
require('./ui/ChannelAvatar.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-uGaTvmsl.js');
require('./chunks/bundle-T049Npsh.js');
require('./ui/TextButton.js');
require('./chunks/bundle-KNt569rP.js');
require('./ChannelSettings/components/EditDetailsModal.js');
require('./chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('./chunks/bundle-MZHOyRuu.js');
require('./ui/Button.js');
require('./ui/Input.js');
require('./chunks/bundle-Gzug-R-w.js');
require('./ChannelSettings/components/ModerationPanel.js');
require('./ui/Accordion.js');
require('./ui/AccordionGroup.js');
require('./chunks/bundle-pJROJet0.js');
require('./ui/Badge.js');
require('./ui/Toggle.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-3fb9w4KI.js');
require('./ChannelSettings/components/UserListItem.js');
require('./chunks/bundle-DKcL-93i.js');
require('./ui/MutedAvatarOverlay.js');
require('./ui/UserProfile.js');
require('./sendbirdSelectors.js');
require('./chunks/bundle-LutGJd7y.js');
require('./ui/UserListItem.js');
require('./ui/Checkbox.js');
require('./chunks/bundle-6uS64qTy.js');
require('./chunks/bundle-A90WNbHn.js');
require('./chunks/bundle-I79mHo_2.js');
require('./chunks/bundle-eDrjbSc-.js');
require('@sendbird/chat/message');
require('@sendbird/uikit-tools');
require('./chunks/bundle-Gu74ZSrJ.js');
require('./ChannelSettings/components/LeaveChannel.js');
require('./ChannelSettings/components/UserPanel.js');

var ChannelSettings = function (props) {
    return (React.createElement(ChannelSettings_context.ChannelSettingsProvider, { overrideInviteUser: props === null || props === void 0 ? void 0 : props.overrideInviteUser, channelUrl: props.channelUrl, onCloseClick: props === null || props === void 0 ? void 0 : props.onCloseClick, onLeaveChannel: props === null || props === void 0 ? void 0 : props.onLeaveChannel, onChannelModified: props === null || props === void 0 ? void 0 : props.onChannelModified, onBeforeUpdateChannel: props === null || props === void 0 ? void 0 : props.onBeforeUpdateChannel, queries: props === null || props === void 0 ? void 0 : props.queries, className: props === null || props === void 0 ? void 0 : props.className, disableUserProfile: props === null || props === void 0 ? void 0 : props.disableUserProfile, renderUserProfile: props === null || props === void 0 ? void 0 : props.renderUserProfile },
        React.createElement(ChannelSettings_components_ChannelSettingsUI, { renderPlaceholderError: props === null || props === void 0 ? void 0 : props.renderPlaceholderError, renderChannelProfile: props === null || props === void 0 ? void 0 : props.renderChannelProfile, renderModerationPanel: props === null || props === void 0 ? void 0 : props.renderModerationPanel, renderLeaveChannel: props === null || props === void 0 ? void 0 : props.renderLeaveChannel })));
};

module.exports = ChannelSettings;
//# sourceMappingURL=ChannelSettings.js.map
