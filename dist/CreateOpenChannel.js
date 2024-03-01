import React__default from 'react';
import CreateOpenChannelUI from './CreateOpenChannel/components/CreateOpenChannelUI.js';
import { CreateOpenChannelProvider } from './CreateOpenChannel/context.js';
import './chunks/bundle-1inZXcUV.js';
import './chunks/bundle--MbN9aKT.js';
import './chunks/bundle-V_fO-GlK.js';
import './chunks/bundle-VE0ige0C.js';
import './chunks/bundle-xhjHZ041.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-IDH-OOHE.js';
import './chunks/bundle-3a5xXUZv.js';
import './ui/Icon.js';
import './chunks/bundle-sR62lMVk.js';
import './ui/Button.js';
import './chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import './chunks/bundle-pjLq9qJd.js';
import './ui/IconButton.js';
import './ui/Input.js';
import './ui/TextButton.js';
import './chunks/bundle-nMxV4WMS.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';

function CreateOpenChannel(_a) {
    var className = _a.className, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel, closeModal = _a.closeModal, renderHeader = _a.renderHeader, renderProfileInput = _a.renderProfileInput;
    return (React__default.createElement(CreateOpenChannelProvider, { className: className, onCreateChannel: onCreateChannel, onBeforeCreateChannel: onBeforeCreateChannel },
        React__default.createElement(CreateOpenChannelUI, { closeModal: closeModal, renderHeader: renderHeader, renderProfileInput: renderProfileInput })));
}

export { CreateOpenChannel as default };
//# sourceMappingURL=CreateOpenChannel.js.map
