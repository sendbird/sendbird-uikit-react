'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_Badge = require('../../ui/Badge.js');
var MemberList = require('../../chunks/bundle-H2dGaKZQ.js');
var ChannelSettings_context = require('../context.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../ui/Button.js');
require('../../ui/IconButton.js');
require('../../ui/ContextMenu.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('./UserListItem.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-6hGNMML2.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/UserListItem.js');
require('../../ui/Checkbox.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-6xWNZugu.js');
require('@sendbird/chat/message');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-Zw2P8RwZ.js');

var kFormatter = function (num) {
    return Math.abs(num) > 999
        ? "".concat((Math.abs(num) / 1000).toFixed(1), "K")
        : num;
};
var UserPanel = function () {
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _a = React.useState(false), showAccordion = _a[0], setShowAccordion = _a[1];
    var channel = ChannelSettings_context.useChannelSettingsContext().channel;
    return (React.createElement("div", { className: 'sendbird-channel-settings__user-panel' },
        React.createElement("div", { className: [
                'sendbird-channel-settings__panel-item',
                'sendbird-channel-settings__members',
            ].join(' '), role: "switch", "aria-checked": showAccordion, onKeyDown: function () { return setShowAccordion(!showAccordion); }, onClick: function () { return setShowAccordion(!showAccordion); }, tabIndex: 0 },
            React.createElement(ui_Icon.default, { className: "sendbird-channel-settings__panel-icon-left", type: ui_Icon.IconTypes.MEMBERS, fillColor: ui_Icon.IconColors.PRIMARY, height: "24px", width: "24px" }),
            React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 },
                stringSet.CHANNEL_SETTING__MEMBERS__TITLE,
                React.createElement(ui_Badge, { className: 'sendbird-channel-settings__badge', count: kFormatter(channel === null || channel === void 0 ? void 0 : channel.memberCount) })),
            React.createElement(ui_Icon.default, { className: [
                    'sendbird-channel-settings__panel-icon-right',
                    'sendbird-channel-settings__panel-icon--chevron',
                    (showAccordion ? 'sendbird-channel-settings__panel-icon--open' : ''),
                ].join(' '), type: ui_Icon.IconTypes.CHEVRON_RIGHT, height: "24px", width: "24px" })),
        showAccordion && (React.createElement(MemberList.MemberList, null))));
};

module.exports = UserPanel;
//# sourceMappingURL=UserPanel.js.map
