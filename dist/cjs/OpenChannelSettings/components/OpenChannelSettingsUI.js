'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var OpenChannelSettings_context = require('../context.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var OpenChannelSettings_components_OperatorUI = require('./OperatorUI.js');
var OpenChannelSettings_components_ParticipantUI = require('../../chunks/bundle-zPWX89Fn.js');
require('../../withSendbird.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../ui/Loader.js');
require('./OpenChannelProfile.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../ui/OpenChannelAvatar.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-aadmp473.js');
require('./EditDetailsModal.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/Input.js');
require('../../ui/Accordion.js');
require('../../ui/AccordionGroup.js');
require('../../chunks/bundle-Oq4We4Jl.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../ui/UserListItem.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');

function InvalidChannel(_a) {
    var onCloseClick = _a.onCloseClick;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    return (React.createElement("div", { className: "sendbird-openchannel-settings" },
        React.createElement("div", { className: "sendbird-openchannel-settings__header" },
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_SETTING__HEADER__TITLE),
            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CLOSE, className: "sendbird-openchannel-settings__close-icon", height: "24px", width: "24px", onClick: function () {
                    onCloseClick();
                } })),
        React.createElement("div", { className: "sendbird-openchannel-settings__placeholder" },
            React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.WRONG }))));
}

var OpenChannelUI = function (_a) {
    var _b, _c, _d;
    var renderOperatorUI = _a.renderOperatorUI, renderParticipantList = _a.renderParticipantList;
    var _e = OpenChannelSettings_context.useOpenChannelSettingsContext(), channel = _e.channel, onCloseClick = _e.onCloseClick, isChannelInitialized = _e.isChannelInitialized;
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var logger = (_b = globalStore === null || globalStore === void 0 ? void 0 : globalStore.config) === null || _b === void 0 ? void 0 : _b.logger;
    var user = (_d = (_c = globalStore === null || globalStore === void 0 ? void 0 : globalStore.stores) === null || _c === void 0 ? void 0 : _c.userStore) === null || _d === void 0 ? void 0 : _d.user;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    if (isChannelInitialized && !channel) {
        return (React.createElement(InvalidChannel, { onCloseClick: function () {
                logger.info('OpenChannelSettings: Click close');
                if (onCloseClick) {
                    onCloseClick();
                }
            } }));
    }
    return (React.createElement("div", { className: 'sendbird-openchannel-settings' },
        (channel === null || channel === void 0 ? void 0 : channel.isOperator(user)) && ((renderOperatorUI === null || renderOperatorUI === void 0 ? void 0 : renderOperatorUI()) || (React.createElement(OpenChannelSettings_components_OperatorUI.OperatorUI, null))),
        !(channel === null || channel === void 0 ? void 0 : channel.isOperator(user)) && (React.createElement("div", { className: "sendbird-openchannel-settings__participant" },
            React.createElement("div", { className: "sendbird-openchannel-settings__header" },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE),
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CLOSE, className: "sendbird-openchannel-settings__close-icon", height: "24px", width: "24px", onClick: function () {
                        onCloseClick();
                    } })),
            (renderParticipantList === null || renderParticipantList === void 0 ? void 0 : renderParticipantList()) || (React.createElement(OpenChannelSettings_components_ParticipantUI.ParticipantList, null))))));
};

module.exports = OpenChannelUI;
//# sourceMappingURL=OpenChannelSettingsUI.js.map
