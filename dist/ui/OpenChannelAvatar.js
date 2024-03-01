import React__default, { useContext, useMemo } from 'react';
import { A as Avatar } from '../chunks/bundle-LbQw2cVx.js';
import { L as LocalizationContext } from '../chunks/bundle-hS8Jw8F1.js';
import { b as getOpenChannelAvatar } from '../chunks/bundle-k8wZLjPN.js';
import '../chunks/bundle-UnAcr6wX.js';
import './ImageRenderer.js';
import '../chunks/bundle-CRwhglru.js';
import '../chunks/bundle-fNigAmmf.js';
import './Icon.js';
import '../chunks/bundle-PIrj5Rm1.js';
import '../chunks/bundle-8u3PnqsX.js';

function ChannelAvatar(_a) {
    var channel = _a.channel, theme = _a.theme, _b = _a.height, height = _b === void 0 ? 56 : _b, _c = _a.width, width = _c === void 0 ? 56 : _c;
    var stringSet = useContext(LocalizationContext).stringSet;
    var memoizedAvatar = useMemo(function () {
        return (React__default.createElement(Avatar, { className: "sendbird-chat-header__avatar--open-channel", src: getOpenChannelAvatar(channel), width: "".concat(width, "px"), height: "".concat(height, "px"), alt: (channel === null || channel === void 0 ? void 0 : channel.name) || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE }));
    }, [channel === null || channel === void 0 ? void 0 : channel.coverUrl, theme]);
    return (React__default.createElement(React__default.Fragment, null, memoizedAvatar));
}

export { ChannelAvatar as default };
//# sourceMappingURL=OpenChannelAvatar.js.map
