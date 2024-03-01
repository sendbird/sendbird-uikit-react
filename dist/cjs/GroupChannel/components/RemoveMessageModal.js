'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var GroupChannel_context = require('../context.js');
var RemoveMessageModalView = require('../../chunks/bundle-L8T4CdY4.js');
require('@sendbird/chat/message');
require('@sendbird/chat/groupChannel');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-uzKywAVp.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-U2YYVRfT.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-6xWNZugu.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-2xXFQXmk.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-gOYUXAiI.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');

var RemoveMessageModal = function (props) {
    var deleteMessage = GroupChannel_context.useGroupChannelContext().deleteMessage;
    return React.createElement(RemoveMessageModalView.RemoveMessageModalView, _tslib.__assign({}, props, { deleteMessage: deleteMessage }));
};

exports.RemoveMessageModal = RemoveMessageModal;
exports.default = RemoveMessageModal;
//# sourceMappingURL=RemoveMessageModal.js.map
