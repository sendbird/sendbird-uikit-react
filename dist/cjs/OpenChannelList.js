'use strict';

var React = require('react');
var OpenChannelList_components_OpenChannelListUI = require('./OpenChannelList/components/OpenChannelListUI.js');
var OpenChannelList_context = require('./chunks/bundle-1jk-UWl7.js');
require('./OpenChannelList/components/OpenChannelPreview.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./chunks/bundle-zYqQA3cT.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-Xwl4gw4D.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./ui/Icon.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./ui/PlaceHolder.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./ui/Loader.js');
require('./ui/IconButton.js');
require('./CreateOpenChannel.js');
require('./CreateOpenChannel/components/CreateOpenChannelUI.js');
require('./ui/Button.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./chunks/bundle-37dz9yoi.js');
require('./ui/Input.js');
require('./ui/TextButton.js');
require('./chunks/bundle-oaDSLq17.js');
require('./CreateOpenChannel/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-4jVvOUfV.js');
require('./chunks/bundle-NfUcey5s.js');

function OpenChannelList(_a) {
    var 
    // provider
    className = _a.className, queries = _a.queries, onChannelSelected = _a.onChannelSelected, 
    // ui
    renderHeader = _a.renderHeader, renderChannelPreview = _a.renderChannelPreview, renderPlaceHolderEmpty = _a.renderPlaceHolderEmpty, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading;
    return (React.createElement(OpenChannelList_context.OpenChannelListProvider, { className: className, queries: queries, onChannelSelected: onChannelSelected },
        React.createElement(OpenChannelList_components_OpenChannelListUI, { renderHeader: renderHeader, renderChannelPreview: renderChannelPreview, renderPlaceHolderEmpty: renderPlaceHolderEmpty, renderPlaceHolderError: renderPlaceHolderError, renderPlaceHolderLoading: renderPlaceHolderLoading })));
}

module.exports = OpenChannelList;
//# sourceMappingURL=OpenChannelList.js.map
