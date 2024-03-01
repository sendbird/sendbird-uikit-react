'use strict';

var React = require('react');
var ui_IconButton = require('../ui/IconButton.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Label = require('./bundle-KkCwxjVN.js');
var ui_ChannelAvatar = require('../ui/ChannelAvatar.js');
var utils = require('./bundle-ZXiz-rp_.js');
var MediaQueryContext = require('./bundle-4WvE40Un.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');

var GroupChannelHeaderView = function (_a) {
    var _b;
    var className = _a.className, currentChannel = _a.currentChannel, showSearchIcon = _a.showSearchIcon, onBackClick = _a.onBackClick, onSearchClick = _a.onSearchClick, onChatHeaderActionClick = _a.onChatHeaderActionClick;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var userId = config.userId, theme = config.theme;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var isMuted = (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myMutedState) === 'muted';
    var subTitle = ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members)
        && ((_b = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) === null || _b === void 0 ? void 0 : _b.length) !== 2);
    return (React.createElement("div", { className: "sendbird-chat-header ".concat(className) },
        React.createElement("div", { className: "sendbird-chat-header__left" },
            isMobile && (React.createElement(ui_Icon.default, { className: "sendbird-chat-header__icon_back", onClick: onBackClick, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px", type: ui_Icon.IconTypes.ARROW_LEFT })),
            React.createElement(ui_ChannelAvatar, { theme: theme, channel: currentChannel, userId: userId, height: 32, width: 32 }),
            React.createElement(ui_Label.Label, { className: "sendbird-chat-header__left__title", type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, utils.getChannelTitle(currentChannel, userId, stringSet)),
            React.createElement(ui_Label.Label, { className: "sendbird-chat-header__left__subtitle", type: ui_Label.LabelTypography.BODY_1, color: ui_Label.LabelColors.ONBACKGROUND_2 }, subTitle)),
        React.createElement("div", { className: "sendbird-chat-header__right" },
            isMuted && (React.createElement(ui_Icon.default, { className: "sendbird-chat-header__right__mute", type: ui_Icon.IconTypes.NOTIFICATIONS_OFF_FILLED, fillColor: ui_Icon.IconColors.ON_BACKGROUND_2, width: "24px", height: "24px" })),
            (showSearchIcon && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isEphemeral)) && (React.createElement(ui_IconButton, { className: "sendbird-chat-header__right__search", width: "32px", height: "32px", onClick: onSearchClick },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.SEARCH, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" }))),
            React.createElement(ui_IconButton, { className: "sendbird-chat-header__right__info", width: "32px", height: "32px", onClick: onChatHeaderActionClick },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.INFO, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" })))));
};

exports.GroupChannelHeaderView = GroupChannelHeaderView;
//# sourceMappingURL=bundle-7NDZV1cp.js.map
