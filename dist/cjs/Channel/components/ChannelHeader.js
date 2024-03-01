'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var GroupChannelHeaderView = require('../../chunks/bundle-7NDZV1cp.js');
var Channel_context = require('../context.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-aadmp473.js');
require('../../chunks/bundle-ZXiz-rp_.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-6xWNZugu.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-JLP3WF2h.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-a7LVpeCR.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-40zdhNFy.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-W24S10k5.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-Q5GNNUqM.js');

var ChannelHeader = function (_a) {
    var className = _a.className;
    var context = Channel_context.useChannelContext();
    return (React.createElement(GroupChannelHeaderView.GroupChannelHeaderView, _tslib.__assign({}, context, { className: className, currentChannel: context.currentGroupChannel })));
};

exports.ChannelHeader = ChannelHeader;
exports.default = ChannelHeader;
//# sourceMappingURL=ChannelHeader.js.map
