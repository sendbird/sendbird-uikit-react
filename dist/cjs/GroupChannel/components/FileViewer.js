'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var FileViewerView = require('../../chunks/bundle-dIspFdXr.js');
var GroupChannel_context = require('../context.js');
require('react-dom');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('../../chunks/bundle-Nz6fSUye.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-37dz9yoi.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('@sendbird/chat/message');
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

var FileViewer = function (props) {
    var deleteMessage = GroupChannel_context.useGroupChannelContext().deleteMessage;
    return React.createElement(FileViewerView.FileViewerView, _tslib.__assign({}, props, { deleteMessage: deleteMessage }));
};

exports.FileViewer = FileViewer;
exports.default = FileViewer;
//# sourceMappingURL=FileViewer.js.map
