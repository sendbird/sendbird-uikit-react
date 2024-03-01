'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var SuggestedMentionListView = require('../../chunks/bundle-rYFzQpzQ.js');
var Channel_context = require('../context.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../chunks/bundle-uzKywAVp.js');
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
require('../../chunks/bundle-W24S10k5.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-Q5GNNUqM.js');

var SuggestedMentionList = function (props) {
    var currentGroupChannel = Channel_context.useChannelContext().currentGroupChannel;
    return (React.createElement(SuggestedMentionListView.SuggestedMentionListView, _tslib.__assign({}, props, { currentChannel: currentGroupChannel })));
};

exports.SuggestedMentionList = SuggestedMentionList;
exports.default = SuggestedMentionList;
//# sourceMappingURL=SuggestedMentionList.js.map
