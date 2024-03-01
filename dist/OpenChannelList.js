import React__default from 'react';
import OpenChannelListUI from './OpenChannelList/components/OpenChannelListUI.js';
import { O as OpenChannelListProvider } from './chunks/bundle-DbqC0Hc4.js';
import './OpenChannelList/components/OpenChannelPreview.js';
import './chunks/bundle-LbQw2cVx.js';
import './chunks/bundle-UnAcr6wX.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-CRwhglru.js';
import './chunks/bundle-fNigAmmf.js';
import './ui/Icon.js';
import './chunks/bundle-ljRDDTki.js';
import './chunks/bundle-PIrj5Rm1.js';
import './ui/PlaceHolder.js';
import './chunks/bundle-hS8Jw8F1.js';
import './chunks/bundle-8u3PnqsX.js';
import './ui/Loader.js';
import './ui/IconButton.js';
import './CreateOpenChannel.js';
import './CreateOpenChannel/components/CreateOpenChannelUI.js';
import './ui/Button.js';
import './chunks/bundle--BlhOpUS.js';
import 'react-dom';
import './chunks/bundle-qlkGlvyT.js';
import './ui/Input.js';
import './ui/TextButton.js';
import './chunks/bundle-02rQraFs.js';
import './CreateOpenChannel/context.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './chunks/bundle-1CfFFBx9.js';
import './chunks/bundle-7BSf_PUT.js';

function OpenChannelList(_a) {
    var 
    // provider
    className = _a.className, queries = _a.queries, onChannelSelected = _a.onChannelSelected, 
    // ui
    renderHeader = _a.renderHeader, renderChannelPreview = _a.renderChannelPreview, renderPlaceHolderEmpty = _a.renderPlaceHolderEmpty, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading;
    return (React__default.createElement(OpenChannelListProvider, { className: className, queries: queries, onChannelSelected: onChannelSelected },
        React__default.createElement(OpenChannelListUI, { renderHeader: renderHeader, renderChannelPreview: renderChannelPreview, renderPlaceHolderEmpty: renderPlaceHolderEmpty, renderPlaceHolderError: renderPlaceHolderError, renderPlaceHolderLoading: renderPlaceHolderLoading })));
}

export { OpenChannelList as default };
//# sourceMappingURL=OpenChannelList.js.map
