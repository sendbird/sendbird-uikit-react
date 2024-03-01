'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var GroupChannel_context = require('../context.js');
var RemoveMessageModalView = require('../../chunks/bundle-QXahRsy6.js');
require('@sendbird/chat/message');
require('@sendbird/chat/groupChannel');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-DKcL-93i.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-MGhVSK7j.js');
require('../../chunks/bundle-A90WNbHn.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('../../chunks/bundle-Gu74ZSrJ.js');
require('../../chunks/bundle-4TXS0UcW.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-_t5Ozfpd.js');
require('../../chunks/bundle-wzulmlgb.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');

var RemoveMessageModal = function (props) {
    var deleteMessage = GroupChannel_context.useGroupChannelContext().deleteMessage;
    return React.createElement(RemoveMessageModalView.RemoveMessageModalView, _tslib.__assign({}, props, { deleteMessage: deleteMessage }));
};

exports.RemoveMessageModal = RemoveMessageModal;
exports.default = RemoveMessageModal;
//# sourceMappingURL=RemoveMessageModal.js.map
