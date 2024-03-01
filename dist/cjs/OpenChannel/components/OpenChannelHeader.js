'use strict';

var React = require('react');
var ui_Avatar = require('../../chunks/bundle--jUKLwRX.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_IconButton = require('../../ui/IconButton.js');
var ui_Label = require('../../chunks/bundle-KkCwxjVN.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var OpenChannel_context = require('../../chunks/bundle-T5IkV5L8.js');
var MediaQueryContext = require('../../chunks/bundle-4WvE40Un.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-VqRllkVd.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../ui/Button.js');
require('../../chunks/bundle-Atn5EZwu.js');

function OpenchannelConversationHeader() {
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var _a = OpenChannel_context.useOpenChannelContext(), currentOpenChannel = _a.currentOpenChannel, onChatHeaderActionClick = _a.onChatHeaderActionClick, amIOperator = _a.amIOperator, onBackClick = _a.onBackClick;
    var title = currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.name;
    var subTitle = "".concat(OpenChannel_context.kFormatter(currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.participantCount), " ").concat(stringSet.OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS);
    var coverImage = currentOpenChannel === null || currentOpenChannel === void 0 ? void 0 : currentOpenChannel.coverUrl;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    return (React.createElement("div", { className: "sendbird-openchannel-conversation-header" },
        React.createElement("div", { className: "sendbird-openchannel-conversation-header__left" },
            isMobile && (React.createElement(ui_Icon.default, { className: "sendbird-oepnchannel-header__icon_back", onClick: onBackClick, fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px", type: ui_Icon.IconTypes.ARROW_LEFT })),
            coverImage ? (React.createElement(ui_Avatar.Avatar, { className: "sendbird-openchannel-conversation-header__left__cover-image", src: coverImage, alt: "channel cover image", width: "32px", height: "32px" })) : (React.createElement("div", { className: "sendbird-openchannel-conversation-header__left__cover-image--icon", style: { width: 32, height: 32 } },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CHANNELS, fillColor: ui_Icon.IconColors.CONTENT, width: "18px", height: "18px" }))),
            React.createElement(ui_Label.Label, { className: "sendbird-openchannel-conversation-header__left__title", type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, title || stringSet.NO_TITLE),
            React.createElement(ui_Label.Label, { className: "sendbird-openchannel-conversation-header__left__sub-title", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, subTitle || stringSet.NO_TITLE)),
        React.createElement("div", { className: "sendbird-openchannel-conversation-header__right" },
            React.createElement(ui_IconButton, { className: "sendbird-openchannel-conversation-header__right__trigger", width: "32px", height: "32px", onClick: onChatHeaderActionClick },
                React.createElement(ui_Icon.default, { type: (amIOperator
                        ? ui_Icon.IconTypes.INFO
                        : ui_Icon.IconTypes.MEMBERS), fillColor: ui_Icon.IconColors.PRIMARY, width: "24px", height: "24px" })))));
}

module.exports = OpenchannelConversationHeader;
//# sourceMappingURL=OpenChannelHeader.js.map
