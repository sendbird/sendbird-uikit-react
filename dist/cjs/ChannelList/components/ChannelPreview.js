'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ChannelList_context = require('../../chunks/bundle-0sfo9lj4.js');
var ui_MessageStatus = require('../../chunks/bundle-VehpyAT7.js');
var GroupChannelListItemView = require('../../chunks/bundle-blsUz0A6.js');
require('../../withSendbird.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-W24S10k5.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-_wF3sJvp.js');
require('../../chunks/bundle-iPt3h7ba.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../GroupChannel/components/TypingIndicator.js');
require('../../ui/Badge.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-aadmp473.js');
require('../../ui/MentionUserLabel.js');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');

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
