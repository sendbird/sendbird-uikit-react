'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var ChannelList_context = require('../../chunks/bundle-DfDBkt_w.js');
var ui_MessageStatus = require('../../chunks/bundle-1dlTcCK5.js');
var GroupChannelListItemView = require('../../chunks/bundle-4sJ3fvYt.js');
require('../../withSendbird.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-wzulmlgb.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-vtSSgUjy.js');
require('../../chunks/bundle-Ny3NKw-X.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-Z1maM5mk.js');
require('../../chunks/bundle-LQQkMjKl.js');
require('../../chunks/bundle-Kz-b8WGm.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../GroupChannel/components/TypingIndicator.js');
require('../../ui/Badge.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../chunks/bundle-T049Npsh.js');
require('../../ui/MentionUserLabel.js');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-KNt569rP.js');

var ChannelPreview = function (_a) {
    var _b, _c, _d, _e;
    var channel = _a.channel, _f = _a.isActive, isActive = _f === void 0 ? false : _f, _g = _a.isSelected, isSelected = _g === void 0 ? false : _g, _h = _a.isTyping, isTyping = _h === void 0 ? false : _h, renderChannelAction = _a.renderChannelAction, onLeaveChannel = _a.onLeaveChannel, onClick = _a.onClick, tabIndex = _a.tabIndex;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _j = ChannelList_context.useChannelListContext(), _k = _j.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _k === void 0 ? false : _k, _l = _j.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _l === void 0 ? false : _l;
    var userId = config.userId;
    var isMessageStatusEnabled = isMessageReceiptStatusEnabled
        && (((_b = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _b === void 0 ? void 0 : _b.messageType) === 'user' || ((_c = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _c === void 0 ? void 0 : _c.messageType) === 'file')
        && ((_e = (_d = channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null || _d === void 0 ? void 0 : _d.sender) === null || _e === void 0 ? void 0 : _e.userId) === userId;
    return (React.createElement(GroupChannelListItemView.GroupChannelListItemView, { channel: channel, tabIndex: tabIndex, isTyping: isTypingIndicatorEnabled && isTyping, isSelected: isSelected !== null && isSelected !== void 0 ? isSelected : isActive, channelName: ui_MessageStatus.getChannelTitle(channel, userId, stringSet), isMessageStatusEnabled: isMessageStatusEnabled, onClick: onClick, onLeaveChannel: onLeaveChannel, renderChannelAction: renderChannelAction }));
};

module.exports = ChannelPreview;
//# sourceMappingURL=ChannelPreview.js.map
