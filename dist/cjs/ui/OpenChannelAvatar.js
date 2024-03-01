'use strict';

var React = require('react');
var ui_Avatar = require('../chunks/bundle-PoiZwjvJ.js');
var LocalizationContext = require('../chunks/bundle-Nz6fSUye.js');
var utils = require('../chunks/bundle-dQYtPkLv.js');
require('../chunks/bundle-zYqQA3cT.js');
require('./ImageRenderer.js');
require('../chunks/bundle-Xwl4gw4D.js');
require('../chunks/bundle-5mXB6h1C.js');
require('./Icon.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-eyiJykZ-.js');

function ChannelAvatar(_a) {
    var channel = _a.channel, theme = _a.theme, _b = _a.height, height = _b === void 0 ? 56 : _b, _c = _a.width, width = _c === void 0 ? 56 : _c;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var memoizedAvatar = React.useMemo(function () {
        return (React.createElement(ui_Avatar.Avatar, { className: "sendbird-chat-header__avatar--open-channel", src: utils.getOpenChannelAvatar(channel), width: "".concat(width, "px"), height: "".concat(height, "px"), alt: (channel === null || channel === void 0 ? void 0 : channel.name) || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE }));
    }, [channel === null || channel === void 0 ? void 0 : channel.coverUrl, theme]);
    return (React.createElement(React.Fragment, null, memoizedAvatar));
}

module.exports = ChannelAvatar;
//# sourceMappingURL=OpenChannelAvatar.js.map
