'use strict';

var React = require('react');
var index = require('./index-da9d29e1.js');
var utils = require('./utils-630d41d3.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ChannelAvatar(_a) {
  var channel = _a.channel,
      userId = _a.userId,
      theme = _a.theme,
      _b = _a.width,
      width = _b === void 0 ? 56 : _b,
      _c = _a.height,
      height = _c === void 0 ? 56 : _c;
  var isBroadcast = channel.isBroadcast;
  var memoizedAvatar = React.useMemo(function () {
    return isBroadcast ? utils.useDefaultAvatar(channel) ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-chat-header--default-avatar",
      style: {
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
      type: index.IconTypes.BROADCAST,
      fillColor: index.IconColors.CONTENT,
      width: width * 0.575,
      height: height * 0.575
    })) : /*#__PURE__*/React__default["default"].createElement(index.Avatar, {
      className: "sendbird-chat-header--avatar--broadcast-channel",
      src: utils.getChannelAvatarSource(channel, userId),
      width: width,
      height: height,
      alt: channel.name
    }) : /*#__PURE__*/React__default["default"].createElement(index.Avatar, {
      className: "sendbird-chat-header--avatar--group-channel",
      src: utils.getChannelAvatarSource(channel, userId),
      width: width + "px",
      height: height + "px",
      alt: channel.name
    });
  }, [channel.members, channel.coverUrl, theme]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, memoizedAvatar);
}

exports.ChannelAvatar = ChannelAvatar;
//# sourceMappingURL=index-a0397272.js.map
