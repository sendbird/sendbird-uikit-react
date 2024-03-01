'use strict';

var React = require('react');
var CreateOpenChannel_components_CreateOpenChannelUI = require('./CreateOpenChannel/components/CreateOpenChannelUI.js');
var CreateOpenChannel_context = require('./CreateOpenChannel/context.js');
require('./chunks/bundle-60kIt9Rq.js');
require('./chunks/bundle-eH49AisR.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./chunks/bundle-2dG9SU7T.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-QStqvuCY.js');
require('./chunks/bundle-uGaTvmsl.js');
require('./ui/Icon.js');
require('./chunks/bundle-26QzFMMl.js');
require('./ui/Button.js');
require('./chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('./chunks/bundle-MZHOyRuu.js');
require('./ui/IconButton.js');
require('./ui/Input.js');
require('./ui/TextButton.js');
require('./chunks/bundle-KNt569rP.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');

function CreateOpenChannel(_a) {
    var className = _a.className, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel, closeModal = _a.closeModal, renderHeader = _a.renderHeader, renderProfileInput = _a.renderProfileInput;
    return (React.createElement(CreateOpenChannel_context.CreateOpenChannelProvider, { className: className, onCreateChannel: onCreateChannel, onBeforeCreateChannel: onBeforeCreateChannel },
        React.createElement(CreateOpenChannel_components_CreateOpenChannelUI, { closeModal: closeModal, renderHeader: renderHeader, renderProfileInput: renderProfileInput })));
}

module.exports = CreateOpenChannel;
//# sourceMappingURL=CreateOpenChannel.js.map
