'use strict';

var React = require('react');
var ui_MessageStatus = require('../../chunks/bundle-VehpyAT7.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var GroupChannelList_context = require('../context.js');
var GroupChannelListItemView = require('../../chunks/bundle-blsUz0A6.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-_wF3sJvp.js');
require('../../chunks/bundle-iPt3h7ba.js');
require('../../withSendbird.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-Fj06oDBD.js');
require('@sendbird/chat');
require('../../chunks/bundle-SOIkTCep.js');
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

var GroupChannelListItem = function (_a) {
    var _b, _c, _d;
    var channel = _a.channel, isSelected = _a.isSelected, isTyping = _a.isTyping, renderChannelAction = _a.renderChannelAction, onLeaveChannel = _a.onLeaveChannel, onClick = _a.onClick, tabIndex = _a.tabIndex;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _e = GroupChannelList_context.useGroupChannelListContext(), _f = _e.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _f === void 0 ? false : _f, _g = _e.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _g === void 0 ? false : _g;
    var userId = config.userId;
    var isMessageStatusEnabled = isMessageReceiptStatusEnabled
        && (!((_b = channel.lastMessage) === null || _b === void 0 ? void 0 : _b.isAdminMessage()))
        && ((_d = (_c = channel.lastMessage) === null || _c === void 0 ? void 0 : _c.sender) === null || _d === void 0 ? void 0 : _d.userId) === userId;
    return (React.createElement(GroupChannelListItemView.GroupChannelListItemView, { channel: channel, tabIndex: tabIndex, channelName: ui_MessageStatus.getChannelTitle(channel, userId, stringSet), isTyping: isTypingIndicatorEnabled && isTyping, isSelected: isSelected, isMessageStatusEnabled: isMessageStatusEnabled, onClick: onClick, onLeaveChannel: onLeaveChannel, renderChannelAction: renderChannelAction }));
};

exports.GroupChannelListItem = GroupChannelListItem;
//# sourceMappingURL=GroupChannelListItem.js.map
