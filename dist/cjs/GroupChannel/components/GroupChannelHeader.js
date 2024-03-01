'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var GroupChannelHeaderView = require('../../chunks/bundle-7NDZV1cp.js');
var GroupChannel_context = require('../context.js');
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
require('@sendbird/chat/message');
require('@sendbird/chat/groupChannel');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-U2YYVRfT.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../chunks/bundle-6xWNZugu.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-2xXFQXmk.js');
require('../../chunks/bundle-VqRllkVd.js');

var GroupChannelHeader = function (_a) {
    var className = _a.className;
    var context = GroupChannel_context.useGroupChannelContext();
    return (React.createElement(GroupChannelHeaderView.GroupChannelHeaderView, _tslib.__assign({}, context, { className: className, currentChannel: context.currentChannel })));
};

exports.GroupChannelHeader = GroupChannelHeader;
exports.default = GroupChannelHeader;
//# sourceMappingURL=GroupChannelHeader.js.map
