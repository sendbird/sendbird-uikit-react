import React__default, { useContext, useMemo } from 'react';
import { A as Avatar } from '../chunks/bundle-OJq071GK.js';
import { L as LocalizationContext } from '../chunks/bundle-msnuMA4R.js';
import { b as getOpenChannelAvatar } from '../chunks/bundle-E4eEah-U.js';
import '../chunks/bundle-KMsJXUN2.js';
import './ImageRenderer.js';
import '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-DhS-f2ZT.js';
import './Icon.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '../chunks/bundle-CsWYoRVd.js';

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
