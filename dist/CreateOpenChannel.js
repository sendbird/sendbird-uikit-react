import React__default from 'react';
import CreateOpenChannelUI from './CreateOpenChannel/components/CreateOpenChannelUI.js';
import { CreateOpenChannelProvider } from './CreateOpenChannel/context.js';
import './chunks/bundle-hS8Jw8F1.js';
import './chunks/bundle-PIrj5Rm1.js';
import './chunks/bundle-8u3PnqsX.js';
import './chunks/bundle-LbQw2cVx.js';
import './chunks/bundle-UnAcr6wX.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-CRwhglru.js';
import './chunks/bundle-fNigAmmf.js';
import './ui/Icon.js';
import './chunks/bundle-ljRDDTki.js';
import './ui/Button.js';
import './chunks/bundle--BlhOpUS.js';
import 'react-dom';
import './chunks/bundle-qlkGlvyT.js';
import './ui/IconButton.js';
import './ui/Input.js';
import './ui/TextButton.js';
import './chunks/bundle-02rQraFs.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';

function CreateOpenChannel(_a) {
    var className = _a.className, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel, closeModal = _a.closeModal, renderHeader = _a.renderHeader, renderProfileInput = _a.renderProfileInput;
    return (React__default.createElement(CreateOpenChannelProvider, { className: className, onCreateChannel: onCreateChannel, onBeforeCreateChannel: onBeforeCreateChannel },
        React__default.createElement(CreateOpenChannelUI, { closeModal: closeModal, renderHeader: renderHeader, renderProfileInput: renderProfileInput })));
}

export { CreateOpenChannel as default };
//# sourceMappingURL=CreateOpenChannel.js.map
