'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var FileViewerView = require('../../chunks/bundle--6X7xVFW.js');
var GroupChannel_context = require('../context.js');
require('react-dom');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('@sendbird/chat/message');
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

var FileViewer = function (props) {
    var deleteMessage = GroupChannel_context.useGroupChannelContext().deleteMessage;
    return React.createElement(FileViewerView.FileViewerView, _tslib.__assign({}, props, { deleteMessage: deleteMessage }));
};

exports.FileViewer = FileViewer;
exports.default = FileViewer;
//# sourceMappingURL=FileViewer.js.map
