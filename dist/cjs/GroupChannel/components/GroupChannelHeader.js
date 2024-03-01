'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var GroupChannelHeaderView = require('../../chunks/bundle-b7rN7c0a.js');
var GroupChannel_context = require('../context.js');
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
require('@sendbird/chat/message');
require('@sendbird/chat/groupChannel');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-MGhVSK7j.js');
require('../../chunks/bundle-A90WNbHn.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('../../chunks/bundle-Gu74ZSrJ.js');
require('../../chunks/bundle-4TXS0UcW.js');
require('../../chunks/bundle-LutGJd7y.js');

var GroupChannelHeader = function (_a) {
    var className = _a.className;
    var context = GroupChannel_context.useGroupChannelContext();
    return (React.createElement(GroupChannelHeaderView.GroupChannelHeaderView, _tslib.__assign({}, context, { className: className, currentChannel: context.currentChannel })));
};

exports.GroupChannelHeader = GroupChannelHeader;
exports.default = GroupChannelHeader;
//# sourceMappingURL=GroupChannelHeader.js.map
