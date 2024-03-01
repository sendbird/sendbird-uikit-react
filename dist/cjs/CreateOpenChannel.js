'use strict';

var React = require('react');
var CreateOpenChannel_components_CreateOpenChannelUI = require('./CreateOpenChannel/components/CreateOpenChannelUI.js');
var CreateOpenChannel_context = require('./CreateOpenChannel/context.js');
require('./chunks/bundle-WKa05h0_.js');
require('./chunks/bundle-Yzhiyr0t.js');
require('./chunks/bundle-HY8cubCp.js');
require('./chunks/bundle--jUKLwRX.js');
require('./chunks/bundle-xbdnJE9-.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-jCTpndN0.js');
require('./chunks/bundle-kftX5Dbs.js');
require('./ui/Icon.js');
require('./chunks/bundle-KkCwxjVN.js');
require('./ui/Button.js');
require('./chunks/bundle-6hGNMML2.js');
require('react-dom');
require('./chunks/bundle-4WvE40Un.js');
require('./ui/IconButton.js');
require('./ui/Input.js');
require('./ui/TextButton.js');
require('./chunks/bundle-0uk8Bfy0.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');

function CreateOpenChannel(_a) {
    var className = _a.className, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel, closeModal = _a.closeModal, renderHeader = _a.renderHeader, renderProfileInput = _a.renderProfileInput;
    return (React.createElement(CreateOpenChannel_context.CreateOpenChannelProvider, { className: className, onCreateChannel: onCreateChannel, onBeforeCreateChannel: onBeforeCreateChannel },
        React.createElement(CreateOpenChannel_components_CreateOpenChannelUI, { closeModal: closeModal, renderHeader: renderHeader, renderProfileInput: renderProfileInput })));
}

module.exports = CreateOpenChannel;
//# sourceMappingURL=CreateOpenChannel.js.map
