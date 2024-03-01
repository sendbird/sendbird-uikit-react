import React__default from 'react';
import OpenChannelListUI from './OpenChannelList/components/OpenChannelListUI.js';
import { O as OpenChannelListProvider } from './chunks/bundle-TpDtgvz4.js';
import './OpenChannelList/components/OpenChannelPreview.js';
import './chunks/bundle-OJq071GK.js';
import './chunks/bundle-KMsJXUN2.js';
import './ui/ImageRenderer.js';
import './chunks/bundle-7YRb7CRq.js';
import './chunks/bundle-DhS-f2ZT.js';
import './ui/Icon.js';
import './chunks/bundle-kMMCn6GE.js';
import './chunks/bundle-Tg3CrpQU.js';
import './ui/PlaceHolder.js';
import './chunks/bundle-msnuMA4R.js';
import './chunks/bundle-CsWYoRVd.js';
import './ui/Loader.js';
import './ui/IconButton.js';
import './CreateOpenChannel.js';
import './CreateOpenChannel/components/CreateOpenChannelUI.js';
import './ui/Button.js';
import './chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import './chunks/bundle-ZTmwWu_-.js';
import './ui/Input.js';
import './ui/TextButton.js';
import './chunks/bundle-nGuCRoDK.js';
import './CreateOpenChannel/context.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './chunks/bundle-AFXr5NmI.js';
import './chunks/bundle-THTV9S18.js';

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
