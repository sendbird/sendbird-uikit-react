'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var ChannelSettings_context = require('../context.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var ui_Label = require('../../chunks/bundle-2Pq38lvD.js');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_IconButton = require('../../ui/IconButton.js');
var ChannelSettings_components_ChannelProfile = require('./ChannelProfile.js');
var ChannelSettings_components_ModerationPanel = require('./ModerationPanel.js');
var ChannelSettings_components_LeaveChannel = require('./LeaveChannel.js');
var ChannelSettings_components_UserPanel = require('./UserPanel.js');
require('../../withSendbird.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-NNEanMqk.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../chunks/bundle-dQYtPkLv.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-oaDSLq17.js');
require('./EditDetailsModal.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('../../chunks/bundle-37dz9yoi.js');
require('../../ui/Button.js');
require('../../ui/Input.js');
require('../../ui/Accordion.js');
require('../../ui/AccordionGroup.js');
require('../../chunks/bundle-o6ZMXHG_.js');
require('../../ui/Badge.js');
require('../../ui/Toggle.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('./UserListItem.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-NfUcey5s.js');
require('../../ui/UserListItem.js');
require('../../ui/Checkbox.js');
require('../../chunks/bundle-zraEYh7E.js');
require('../../chunks/bundle-FgihvR5h.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('../../chunks/bundle-CPnHexJQ.js');
require('@sendbird/chat/message');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-hWEZzs4y.js');

var ChannelSettingsUI = function (_a) {
    var _b, _c;
    var renderLeaveChannel = _a.renderLeaveChannel, renderChannelProfile = _a.renderChannelProfile, renderModerationPanel = _a.renderModerationPanel, renderPlaceholderError = _a.renderPlaceholderError, renderPlaceholderLoading = _a.renderPlaceholderLoading;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var state = useSendbirdStateContext.useSendbirdStateContext();
    var _d = ChannelSettings_context.useChannelSettingsContext(), channel = _d.channel, invalidChannel = _d.invalidChannel, onCloseClick = _d.onCloseClick, loading = _d.loading;
    var _e = React.useState(false), showLeaveChannelModal = _e[0], setShowLeaveChannelModal = _e[1];
    var isOnline = (_b = state === null || state === void 0 ? void 0 : state.config) === null || _b === void 0 ? void 0 : _b.isOnline;
    var logger = (_c = state === null || state === void 0 ? void 0 : state.config) === null || _c === void 0 ? void 0 : _c.logger;
    var renderHeaderArea = function () {
        return (React.createElement("div", { className: "sendbird-channel-settings__header" },
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__HEADER__TITLE),
            React.createElement("div", { className: "sendbird-channel-settings__header-icon" },
                React.createElement(ui_IconButton, { width: "32px", height: "32px", onClick: function () {
                        logger.info('ChannelSettings: Click close');
                        onCloseClick === null || onCloseClick === void 0 ? void 0 : onCloseClick();
                    } },
                    React.createElement(ui_Icon.default, { className: "sendbird-channel-settings__close-icon", type: ui_Icon.IconTypes.CLOSE, height: "22px", width: "22px" })))));
    };
    if (loading) {
        if (renderPlaceholderLoading)
            return renderPlaceholderLoading();
        return React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.LOADING });
    }
    if (invalidChannel || !channel) {
        return (React.createElement("div", null,
            renderHeaderArea(),
            React.createElement("div", null, renderPlaceholderError ? renderPlaceholderError() : React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.WRONG }))));
    }
    return (React.createElement(React.Fragment, null,
        renderHeaderArea(),
        React.createElement("div", { className: "sendbird-channel-settings__scroll-area" },
            (renderChannelProfile === null || renderChannelProfile === void 0 ? void 0 : renderChannelProfile()) || React.createElement(ChannelSettings_components_ChannelProfile, null),
            (renderModerationPanel === null || renderModerationPanel === void 0 ? void 0 : renderModerationPanel()) || ((channel === null || channel === void 0 ? void 0 : channel.myRole) === 'operator' ? React.createElement(ChannelSettings_components_ModerationPanel, null) : React.createElement(ChannelSettings_components_UserPanel, null)),
            (renderLeaveChannel === null || renderLeaveChannel === void 0 ? void 0 : renderLeaveChannel()) || (React.createElement("div", { className: [
                    'sendbird-channel-settings__panel-item',
                    'sendbird-channel-settings__leave-channel',
                    !isOnline ? 'sendbird-channel-settings__panel-item__disabled' : '',
                ].join(' '), role: "button", onKeyDown: function () {
                    if (!isOnline) {
                        return;
                    }
                    setShowLeaveChannelModal(true);
                }, onClick: function () {
                    if (!isOnline) {
                        return;
                    }
                    setShowLeaveChannelModal(true);
                }, tabIndex: 0 },
                React.createElement(ui_Icon.default, { className: ['sendbird-channel-settings__panel-icon-left', 'sendbird-channel-settings__panel-icon__leave'].join(' '), type: ui_Icon.IconTypes.LEAVE, fillColor: ui_Icon.IconColors.ERROR, height: "24px", width: "24px" }),
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE))),
            showLeaveChannelModal && (React.createElement(ChannelSettings_components_LeaveChannel, { onCancel: function () {
                    setShowLeaveChannelModal(false);
                }, onSubmit: function () {
                    setShowLeaveChannelModal(false);
                    onCloseClick === null || onCloseClick === void 0 ? void 0 : onCloseClick();
                } })))));
};

module.exports = ChannelSettingsUI;
//# sourceMappingURL=ChannelSettingsUI.js.map
