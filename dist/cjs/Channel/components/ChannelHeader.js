'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var GroupChannelHeaderView = require('../../chunks/bundle-b7rN7c0a.js');
var Channel_context = require('../context.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../ui/ChannelAvatar.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../chunks/bundle-T049Npsh.js');
require('../../chunks/bundle-sMN62IQs.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-FMwBmvVd.js');
require('../../chunks/bundle-Ny3NKw-X.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-XgxbsHav.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('../../chunks/bundle-Tcz7Ubz9.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-vtSSgUjy.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-xgiAxHSr.js');

var ChannelHeader = function (_a) {
    var className = _a.className;
    var context = Channel_context.useChannelContext();
    return (React.createElement(GroupChannelHeaderView.GroupChannelHeaderView, _tslib.__assign({}, context, { className: className, currentChannel: context.currentGroupChannel })));
};

exports.ChannelHeader = ChannelHeader;
exports.default = ChannelHeader;
//# sourceMappingURL=ChannelHeader.js.map
