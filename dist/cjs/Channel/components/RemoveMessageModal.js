'use strict';

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var RemoveMessageModalView = require('../../chunks/bundle-QXahRsy6.js');
var Channel_context = require('../context.js');
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
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-FMwBmvVd.js');
require('../../chunks/bundle-Ny3NKw-X.js');
require('../../chunks/bundle-XgxbsHav.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('../../chunks/bundle-Tcz7Ubz9.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-vtSSgUjy.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-xgiAxHSr.js');

var RemoveMessageModal = function (props) {
    var deleteMessage = Channel_context.useChannelContext().deleteMessage;
    return React.createElement(RemoveMessageModalView.RemoveMessageModalView, _tslib.__assign({}, props, { deleteMessage: deleteMessage }));
};

module.exports = RemoveMessageModal;
//# sourceMappingURL=RemoveMessageModal.js.map
