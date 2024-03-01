import React__default from 'react';
import CreateOpenChannelUI from './CreateOpenChannel/components/CreateOpenChannelUI.js';
import { CreateOpenChannelProvider } from './CreateOpenChannel/context.js';
import './chunks/bundle-msnuMA4R.js';
import './chunks/bundle-Tg3CrpQU.js';
import './chunks/bundle-CsWYoRVd.js';
import './chunks/bundle-OJq071GK.js';
import './chunks/bundle-KMsJXUN2.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-7YRb7CRq.js';
import './chunks/bundle-DhS-f2ZT.js';
import './ui/Icon.js';
import './chunks/bundle-kMMCn6GE.js';
import './ui/Button.js';
import './chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import './chunks/bundle-ZTmwWu_-.js';
import './ui/IconButton.js';
import './ui/Input.js';
import './ui/TextButton.js';
import './chunks/bundle-nGuCRoDK.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';

function CreateOpenChannel(_a) {
    var className = _a.className, onCreateChannel = _a.onCreateChannel, onBeforeCreateChannel = _a.onBeforeCreateChannel, closeModal = _a.closeModal, renderHeader = _a.renderHeader, renderProfileInput = _a.renderProfileInput;
    return (React__default.createElement(CreateOpenChannelProvider, { className: className, onCreateChannel: onCreateChannel, onBeforeCreateChannel: onBeforeCreateChannel },
        React__default.createElement(CreateOpenChannelUI, { closeModal: closeModal, renderHeader: renderHeader, renderProfileInput: renderProfileInput })));
}

export { CreateOpenChannel as default };
//# sourceMappingURL=CreateOpenChannel.js.map
