'use strict';

var React = require('react');
var OpenChannelList_components_OpenChannelListUI = require('./OpenChannelList/components/OpenChannelListUI.js');
var OpenChannelList_context = require('./chunks/bundle-878WIoZr.js');
require('./OpenChannelList/components/OpenChannelPreview.js');
require('./chunks/bundle--jUKLwRX.js');
require('./chunks/bundle-xbdnJE9-.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-jCTpndN0.js');
require('./chunks/bundle-kftX5Dbs.js');
require('./ui/Icon.js');
require('./chunks/bundle-KkCwxjVN.js');
require('./chunks/bundle-Yzhiyr0t.js');
require('./ui/PlaceHolder.js');
require('./chunks/bundle-WKa05h0_.js');
require('./chunks/bundle-HY8cubCp.js');
require('./ui/Loader.js');
require('./ui/IconButton.js');
require('./CreateOpenChannel.js');
require('./CreateOpenChannel/components/CreateOpenChannelUI.js');
require('./ui/Button.js');
require('./chunks/bundle-6hGNMML2.js');
require('react-dom');
require('./chunks/bundle-4WvE40Un.js');
require('./ui/Input.js');
require('./ui/TextButton.js');
require('./chunks/bundle-0uk8Bfy0.js');
require('./CreateOpenChannel/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-Atn5EZwu.js');
require('./chunks/bundle-VqRllkVd.js');

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
