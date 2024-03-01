'use strict';

var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var ChannelList_context = require('../../chunks/bundle-33cx5rNA.js');
var ui_MessageStatus = require('../../chunks/bundle-vsw2g6d5.js');
var GroupChannelListItemView = require('../../chunks/bundle-2qhx9zdL.js');
require('../../withSendbird.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-NfUcey5s.js');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-bjSez2lv.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-ZngtlfeR.js');
require('../../chunks/bundle-T9gnzy2i.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-k4IOvwe9.js');
require('../../chunks/bundle-r8DyENxy.js');
require('../../chunks/bundle-l768-Ldg.js');
require('../../chunks/bundle-37dz9yoi.js');
require('../../GroupChannel/components/TypingIndicator.js');
require('../../ui/Badge.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../chunks/bundle-dQYtPkLv.js');
require('../../ui/MentionUserLabel.js');
require('../../chunks/bundle-suIvps1I.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-oaDSLq17.js');

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
