import React__default from 'react';
import IconButton from '../ui/IconButton.js';
import Icon, { IconColors, IconTypes } from '../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from './bundle-kMMCn6GE.js';
import ChannelAvatar from '../ui/ChannelAvatar.js';
import { g as getChannelTitle } from './bundle-YvC6HhRC.js';
import { u as useMediaQueryContext } from './bundle-ZTmwWu_-.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { u as useLocalization } from './bundle-msnuMA4R.js';

var GroupChannelHeaderView = function (_a) {
    var _b;
    var className = _a.className, currentChannel = _a.currentChannel, showSearchIcon = _a.showSearchIcon, onBackClick = _a.onBackClick, onSearchClick = _a.onSearchClick, onChatHeaderActionClick = _a.onChatHeaderActionClick;
    var config = useSendbirdStateContext().config;
    var userId = config.userId, theme = config.theme;
    var isMobile = useMediaQueryContext().isMobile;
    var stringSet = useLocalization().stringSet;
    var isMuted = (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myMutedState) === 'muted';
    var subTitle = ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members)
        && ((_b = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.members) === null || _b === void 0 ? void 0 : _b.length) !== 2);
    return (React__default.createElement("div", { className: "sendbird-chat-header ".concat(className) },
        React__default.createElement("div", { className: "sendbird-chat-header__left" },
            isMobile && (React__default.createElement(Icon, { className: "sendbird-chat-header__icon_back", onClick: onBackClick, fillColor: IconColors.PRIMARY, width: "24px", height: "24px", type: IconTypes.ARROW_LEFT })),
            React__default.createElement(ChannelAvatar, { theme: theme, channel: currentChannel, userId: userId, height: 32, width: 32 }),
            React__default.createElement(Label, { className: "sendbird-chat-header__left__title", type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, getChannelTitle(currentChannel, userId, stringSet)),
            React__default.createElement(Label, { className: "sendbird-chat-header__left__subtitle", type: LabelTypography.BODY_1, color: LabelColors.ONBACKGROUND_2 }, subTitle)),
        React__default.createElement("div", { className: "sendbird-chat-header__right" },
            isMuted && (React__default.createElement(Icon, { className: "sendbird-chat-header__right__mute", type: IconTypes.NOTIFICATIONS_OFF_FILLED, fillColor: IconColors.ON_BACKGROUND_2, width: "24px", height: "24px" })),
            (showSearchIcon && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isEphemeral)) && (React__default.createElement(IconButton, { className: "sendbird-chat-header__right__search", width: "32px", height: "32px", onClick: onSearchClick },
                React__default.createElement(Icon, { type: IconTypes.SEARCH, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" }))),
            React__default.createElement(IconButton, { className: "sendbird-chat-header__right__info", width: "32px", height: "32px", onClick: onChatHeaderActionClick },
                React__default.createElement(Icon, { type: IconTypes.INFO, fillColor: IconColors.PRIMARY, width: "24px", height: "24px" })))));
};

export { GroupChannelHeaderView as G };
//# sourceMappingURL=bundle-yWUWCKD5.js.map
