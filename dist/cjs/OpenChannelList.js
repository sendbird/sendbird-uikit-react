'use strict';

var React = require('react');
var OpenChannelList_components_OpenChannelListUI = require('./OpenChannelList/components/OpenChannelListUI.js');
var OpenChannelList_context = require('./chunks/bundle-5vChdsLE.js');
require('./OpenChannelList/components/OpenChannelPreview.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./chunks/bundle-2dG9SU7T.js');
require('./ui/ImageRenderer.js');
require('./chunks/bundle-QStqvuCY.js');
require('./chunks/bundle-uGaTvmsl.js');
require('./ui/Icon.js');
require('./chunks/bundle-26QzFMMl.js');
require('./chunks/bundle-eH49AisR.js');
require('./ui/PlaceHolder.js');
require('./chunks/bundle-60kIt9Rq.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./ui/Loader.js');
require('./ui/IconButton.js');
require('./CreateOpenChannel.js');
require('./CreateOpenChannel/components/CreateOpenChannelUI.js');
require('./ui/Button.js');
require('./chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('./chunks/bundle-MZHOyRuu.js');
require('./ui/Input.js');
require('./ui/TextButton.js');
require('./chunks/bundle-KNt569rP.js');
require('./CreateOpenChannel/context.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./chunks/bundle-I79mHo_2.js');
require('./chunks/bundle-LutGJd7y.js');

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
