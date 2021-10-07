import React__default, { useMemo } from 'react';
import { I as Icon, c as IconTypes, d as IconColors, A as Avatar } from './index-6a3b6a4c.js';
import { u as useDefaultAvatar, a as getChannelAvatarSource } from './utils-69421060.js';

function ChannelAvatar(_a) {
  var channel = _a.channel,
      userId = _a.userId,
      theme = _a.theme,
      _b = _a.width,
      width = _b === void 0 ? 56 : _b,
      _c = _a.height,
      height = _c === void 0 ? 56 : _c;
  var isBroadcast = channel.isBroadcast;
  var memoizedAvatar = useMemo(function () {
    return isBroadcast ? useDefaultAvatar(channel) ? /*#__PURE__*/React__default.createElement("div", {
      className: "sendbird-chat-header--default-avatar",
      style: {
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default.createElement(Icon, {
      type: IconTypes.BROADCAST,
      fillColor: IconColors.CONTENT,
      width: width * 0.575,
      height: height * 0.575
    })) : /*#__PURE__*/React__default.createElement(Avatar, {
      className: "sendbird-chat-header--avatar--broadcast-channel",
      src: getChannelAvatarSource(channel, userId),
      width: width,
      height: height,
      alt: channel.name
    }) : /*#__PURE__*/React__default.createElement(Avatar, {
      className: "sendbird-chat-header--avatar--group-channel",
      src: getChannelAvatarSource(channel, userId),
      width: width + "px",
      height: height + "px",
      alt: channel.name
    });
  }, [channel.members, channel.coverUrl, theme]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, memoizedAvatar);
}

export { ChannelAvatar as C };
//# sourceMappingURL=index-f6b9f869.js.map
