'use strict';

var React = require('react');
var CreateOpenChannel_components_CreateOpenChannelUI = require('./CreateOpenChannel/components/CreateOpenChannelUI.js');
var CreateOpenChannel_context = require('./CreateOpenChannel/context.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./chunks/bundle-zYqQA3cT.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-Xwl4gw4D.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./ui/Icon.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./ui/Button.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./chunks/bundle-37dz9yoi.js');
require('./ui/IconButton.js');
require('./ui/Input.js');
require('./ui/TextButton.js');
require('./chunks/bundle-oaDSLq17.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');

function CreateOpenChannel(_a) {
    var className = _a.className, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel, closeModal = _a.closeModal, renderHeader = _a.renderHeader, renderProfileInput = _a.renderProfileInput;
    return (React.createElement(CreateOpenChannel_context.CreateOpenChannelProvider, { className: className, onCreateChannel: onCreateChannel, onBeforeCreateChannel: onBeforeCreateChannel },
        React.createElement(CreateOpenChannel_components_CreateOpenChannelUI, { closeModal: closeModal, renderHeader: renderHeader, renderProfileInput: renderProfileInput })));
}

module.exports = CreateOpenChannel;
//# sourceMappingURL=CreateOpenChannel.js.map
