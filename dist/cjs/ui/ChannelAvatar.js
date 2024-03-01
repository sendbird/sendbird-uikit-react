'use strict';

var React = require('react');
var ui_Avatar = require('../chunks/bundle-OfFu3N1i.js');
var ui_Icon = require('./Icon.js');
var utils = require('../chunks/bundle-T049Npsh.js');
require('../chunks/bundle-2dG9SU7T.js');
require('./ImageRenderer.js');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-uGaTvmsl.js');

function ChannelAvatar(_a) {
    var channel = _a.channel, userId = _a.userId, theme = _a.theme, _b = _a.width, width = _b === void 0 ? 56 : _b, _c = _a.height, height = _c === void 0 ? 56 : _c;
    var isBroadcast = channel === null || channel === void 0 ? void 0 : channel.isBroadcast;
    var memoizedAvatar = React.useMemo(function () { return (isBroadcast
        ? (utils.generateDefaultAvatar(channel)
            ? (React.createElement("div", { className: "sendbird-chat-header--default-avatar", style: {
                    width: width,
                    height: height,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                } },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.BROADCAST, fillColor: ui_Icon.IconColors.CONTENT, width: width * 0.575, height: height * 0.575 })))
            : (React.createElement(ui_Avatar.Avatar, { className: "sendbird-chat-header--avatar--broadcast-channel", src: utils.getChannelAvatarSource(channel, userId), width: width, height: height, alt: channel === null || channel === void 0 ? void 0 : channel.name })))
        : (React.createElement(ui_Avatar.Avatar, { className: "sendbird-chat-header--avatar--group-channel", src: utils.getChannelAvatarSource(channel, userId), width: "".concat(width, "px"), height: "".concat(height, "px"), alt: channel === null || channel === void 0 ? void 0 : channel.name }))); }, [utils.getChannelAvatarSource(channel, userId), theme]);
    return (React.createElement(React.Fragment, null, memoizedAvatar));
}

module.exports = ChannelAvatar;
//# sourceMappingURL=ChannelAvatar.js.map
