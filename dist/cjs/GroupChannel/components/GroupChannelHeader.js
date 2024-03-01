'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var GroupChannelHeaderView = require('../../chunks/bundle-nLUlh2UO.js');
var GroupChannel_context = require('../context.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../chunks/bundle-dQYtPkLv.js');
require('../../chunks/bundle-uzP6MTD5.js');
require('../../chunks/bundle-37dz9yoi.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-Nz6fSUye.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('@sendbird/chat/message');
require('@sendbird/chat/groupChannel');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-b-DMr0gw.js');
require('../../chunks/bundle-5ucHJjT6.js');
require('../../chunks/bundle-6wRNuySu.js');
require('../../chunks/bundle-FgihvR5h.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('../../chunks/bundle-CPnHexJQ.js');
require('../../chunks/bundle-hWEZzs4y.js');
require('../../chunks/bundle-6zBpI6FB.js');
require('../../chunks/bundle-NfUcey5s.js');

var GroupChannelHeader = function (_a) {
    var className = _a.className;
    var context = GroupChannel_context.useGroupChannelContext();
    return (React.createElement(GroupChannelHeaderView.GroupChannelHeaderView, _tslib.__assign({}, context, { className: className, currentChannel: context.currentChannel })));
};

exports.GroupChannelHeader = GroupChannelHeader;
exports.default = GroupChannelHeader;
//# sourceMappingURL=GroupChannelHeader.js.map
