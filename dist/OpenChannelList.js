import React__default from 'react';
import OpenChannelListUI from './OpenChannelList/components/OpenChannelListUI.js';
import { O as OpenChannelListProvider } from './chunks/bundle-qNXj9tD2.js';
import './OpenChannelList/components/OpenChannelPreview.js';
import './chunks/bundle-VE0ige0C.js';
import './chunks/bundle-xhjHZ041.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-IDH-OOHE.js';
import './chunks/bundle-3a5xXUZv.js';
import './ui/Icon.js';
import './chunks/bundle-sR62lMVk.js';
import './chunks/bundle--MbN9aKT.js';
import './ui/PlaceHolder.js';
import './chunks/bundle-1inZXcUV.js';
import './chunks/bundle-V_fO-GlK.js';
import './ui/Loader.js';
import './ui/IconButton.js';
import './CreateOpenChannel.js';
import './CreateOpenChannel/components/CreateOpenChannelUI.js';
import './ui/Button.js';
import './chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import './chunks/bundle-pjLq9qJd.js';
import './ui/Input.js';
import './ui/TextButton.js';
import './chunks/bundle-nMxV4WMS.js';
import './CreateOpenChannel/context.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './chunks/bundle-UKdN0Ihw.js';
import './chunks/bundle-yarrTY_z.js';

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
