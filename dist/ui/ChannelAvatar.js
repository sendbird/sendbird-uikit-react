import React__default, { useMemo } from 'react';
import { A as Avatar } from '../chunks/bundle-LbQw2cVx.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import { g as generateDefaultAvatar, a as getChannelAvatarSource } from '../chunks/bundle-k8wZLjPN.js';
import '../chunks/bundle-UnAcr6wX.js';
import './ImageRenderer.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-fNigAmmf.js';

function ChannelAvatar(_a) {
    var channel = _a.channel, userId = _a.userId, theme = _a.theme, _b = _a.width, width = _b === void 0 ? 56 : _b, _c = _a.height, height = _c === void 0 ? 56 : _c;
    var isBroadcast = channel === null || channel === void 0 ? void 0 : channel.isBroadcast;
    var memoizedAvatar = useMemo(function () { return (isBroadcast
        ? (generateDefaultAvatar(channel)
            ? (React__default.createElement("div", { className: "sendbird-chat-header--default-avatar", style: {
                    width: width,
                    height: height,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                } },
                React__default.createElement(Icon, { type: IconTypes.BROADCAST, fillColor: IconColors.CONTENT, width: width * 0.575, height: height * 0.575 })))
            : (React__default.createElement(Avatar, { className: "sendbird-chat-header--avatar--broadcast-channel", src: getChannelAvatarSource(channel, userId), width: width, height: height, alt: channel === null || channel === void 0 ? void 0 : channel.name })))
        : (React__default.createElement(Avatar, { className: "sendbird-chat-header--avatar--group-channel", src: getChannelAvatarSource(channel, userId), width: "".concat(width, "px"), height: "".concat(height, "px"), alt: channel === null || channel === void 0 ? void 0 : channel.name }))); }, [getChannelAvatarSource(channel, userId), theme]);
    return (React__default.createElement(React__default.Fragment, null, memoizedAvatar));
}

export { ChannelAvatar as default };
//# sourceMappingURL=ChannelAvatar.js.map
