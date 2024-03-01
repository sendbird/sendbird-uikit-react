'use strict';

var _tslib = require('./bundle-2dG9SU7T.js');
var React = require('react');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var useLongPress = require('./bundle-Kz-b8WGm.js');
var LocalizationContext = require('./bundle-60kIt9Rq.js');
var MediaQueryContext = require('./bundle-MZHOyRuu.js');
var utils = require('./bundle-QStqvuCY.js');
var index = require('./bundle-wzulmlgb.js');
var ui_MessageStatus = require('./bundle-1dlTcCK5.js');
var GroupChannel_components_TypingIndicator = require('../GroupChannel/components/TypingIndicator.js');
var ui_Badge = require('../ui/Badge.js');
var ui_ChannelAvatar = require('../ui/ChannelAvatar.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Label = require('./bundle-26QzFMMl.js');
var ui_MentionUserLabel = require('../ui/MentionUserLabel.js');
var ui_Modal = require('./bundle-CfdtYkhL.js');
var ui_TextButton = require('../ui/TextButton.js');

var GroupChannelListItemView = function (_a) {
    var channel = _a.channel, tabIndex = _a.tabIndex, isTyping = _a.isTyping, isSelected = _a.isSelected, channelName = _a.channelName, _b = _a.isMessageStatusEnabled, isMessageStatusEnabled = _b === void 0 ? true : _b, _c = _a.onClick, onClick = _c === void 0 ? utils.noop : _c, _d = _a.onLeaveChannel, onLeaveChannel = _d === void 0 ? function () { return Promise.resolve(); } : _d, renderChannelAction = _a.renderChannelAction;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var theme = config.theme, isMentionEnabled = config.isMentionEnabled, userId = config.userId;
    var _e = LocalizationContext.useLocalization(), dateLocale = _e.dateLocale, stringSet = _e.stringSet;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var _f = React.useState(false), showMobileLeave = _f[0], setShowMobileLeave = _f[1];
    var onLongPress = useLongPress.useLongPress({
        onLongPress: function () {
            if (isMobile) {
                setShowMobileLeave(true);
            }
        },
        onClick: onClick,
    }, {
        delay: 1000,
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", _tslib.__assign({ className: [
                'sendbird-channel-preview',
                isSelected ? 'sendbird-channel-preview--active' : '',
            ].join(' '), role: "link", tabIndex: tabIndex }, (isMobile ? _tslib.__assign({}, onLongPress) : { onClick: onClick })),
            React.createElement("div", { className: "sendbird-channel-preview__avatar" },
                React.createElement(ui_ChannelAvatar, { channel: channel, userId: userId, theme: theme })),
            React.createElement("div", { className: "sendbird-channel-preview__content" },
                React.createElement("div", { className: "sendbird-channel-preview__content__upper" },
                    React.createElement("div", { className: "sendbird-channel-preview__content__upper__header" },
                        (channel.isBroadcast || false) && (React.createElement("div", { className: "sendbird-channel-preview__content__upper__header__broadcast-icon" },
                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.BROADCAST, fillColor: ui_Icon.IconColors.SECONDARY, height: "16px", width: "16px" }))),
                        React.createElement(ui_Label.Label, { className: "sendbird-channel-preview__content__upper__header__channel-name", type: ui_Label.LabelTypography.SUBTITLE_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, channelName),
                        React.createElement(ui_Label.Label, { className: "sendbird-channel-preview__content__upper__header__total-members", type: ui_Label.LabelTypography.CAPTION_2, color: ui_Label.LabelColors.ONBACKGROUND_2 }, ui_MessageStatus.getTotalMembers(channel)),
                        (channel.isFrozen) && (React.createElement("div", { title: "Frozen", className: "sendbird-channel-preview__content__upper__header__frozen-icon" },
                            React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.FREEZE, fillColor: ui_Icon.IconColors.PRIMARY, height: 12, width: 12 })))),
                    !channel.isEphemeral && isMessageStatusEnabled && (React.createElement(ui_MessageStatus.MessageStatus, { className: "sendbird-channel-preview__content__upper__last-message-at", channel: channel, message: channel.lastMessage, isDateSeparatorConsidered: false })),
                    !channel.isEphemeral && !isMessageStatusEnabled && (React.createElement(ui_Label.Label, { className: "sendbird-channel-preview__content__upper__last-message-at", type: ui_Label.LabelTypography.CAPTION_3, color: ui_Label.LabelColors.ONBACKGROUND_2 }, ui_MessageStatus.getLastMessageCreatedAt({
                        channel: channel,
                        locale: dateLocale,
                        stringSet: stringSet,
                    })))),
                React.createElement("div", { className: "sendbird-channel-preview__content__lower" },
                    React.createElement(ui_Label.Label, { className: "sendbird-channel-preview__content__lower__last-message", type: ui_Label.LabelTypography.BODY_2, color: ui_Label.LabelColors.ONBACKGROUND_3 },
                        isTyping && (React.createElement(GroupChannel_components_TypingIndicator.TypingIndicatorText, { members: channel.getTypingUsers() })),
                        !isTyping
                            && !index.isVoiceMessage(channel.lastMessage)
                            && ui_MessageStatus.getLastMessage(channel, stringSet),
                        !isTyping
                            && index.isVoiceMessage(channel.lastMessage)
                            && stringSet.VOICE_MESSAGE),
                    /**
                     * Do not show unread count for focused channel. This is because of the limitation where
                     * isScrollBottom and hasNext states needs to be added globally but they are from channel context
                     * so channel list cannot see them with the current architecture.
                     */
                    !isSelected && !channel.isEphemeral && (React.createElement("div", { className: "sendbird-channel-preview__content__lower__unread-message-count" },
                        isMentionEnabled && channel.unreadMentionCount > 0 ? (React.createElement(ui_MentionUserLabel, { className: "sendbird-channel-preview__content__lower__unread-message-count__mention", color: "purple" }, '@')) : null,
                        ui_MessageStatus.getChannelUnreadMessageCount(channel) ? ( // return number
                        React.createElement(ui_Badge, { count: ui_MessageStatus.getChannelUnreadMessageCount(channel) })) : null)))),
            !isMobile && (React.createElement("div", { className: "sendbird-channel-preview__action" }, renderChannelAction({ channel: channel })))),
        showMobileLeave && isMobile && (React.createElement(ui_Modal.Modal, { className: "sendbird-channel-preview__leave--mobile", titleText: channelName, hideFooter: true, isCloseOnClickOutside: true, onCancel: function () { return setShowMobileLeave(false); } },
            React.createElement(ui_TextButton, { onClick: function () {
                    onLeaveChannel();
                    setShowMobileLeave(false);
                }, className: "sendbird-channel-preview__leave-label--mobile" },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.SUBTITLE_1, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.CHANNEL_PREVIEW_MOBILE_LEAVE))))));
};

exports.GroupChannelListItemView = GroupChannelListItemView;
//# sourceMappingURL=bundle-4sJ3fvYt.js.map
