'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var FileViewerView = require('../../chunks/bundle-dIspFdXr.js');
var Channel_context = require('../context.js');
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
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-2FdL4aA6.js');
require('../../chunks/bundle-CPnHexJQ.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-M4WNZlHL.js');
require('../../chunks/bundle-T9gnzy2i.js');
require('../../chunks/bundle-vxARP6GP.js');
require('../../chunks/bundle-vmQPp-90.js');
require('../../chunks/bundle-8TphtY0G.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-ZngtlfeR.js');
require('../../chunks/bundle-NfUcey5s.js');
require('../../chunks/bundle-b-DMr0gw.js');
require('../../chunks/bundle-5ucHJjT6.js');
require('../../chunks/bundle-uyZV0VMO.js');

var FileViewer = function (props) {
    var deleteMessage = Channel_context.useChannelContext().deleteMessage;
    return React.createElement(FileViewerView.FileViewerView, _tslib.__assign({}, props, { deleteMessage: deleteMessage }));
};

exports.FileViewer = FileViewer;
exports.default = FileViewer;
//# sourceMappingURL=FileViewer.js.map
