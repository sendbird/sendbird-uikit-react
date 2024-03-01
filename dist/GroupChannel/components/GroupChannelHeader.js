import { _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { G as GroupChannelHeaderView } from '../../chunks/bundle-yWUWCKD5.js';
import { useGroupChannelContext } from '../context.js';
import '../../ui/IconButton.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../chunks/bundle-E4eEah-U.js';
import '../../chunks/bundle-YvC6HhRC.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '@sendbird/chat/message';
import '@sendbird/chat/groupChannel';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-38Dx0S9V.js';
import '../../chunks/bundle-lPKA2RTf.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../chunks/bundle-fO5XIU5Y.js';
import '../../chunks/bundle-JMVaVraV.js';
import '../../chunks/bundle-i4OMePA5.js';
import '../../chunks/bundle-THTV9S18.js';

var GroupChannelHeader = function (_a) {
    var className = _a.className;
    var context = useGroupChannelContext();
    return (React__default.createElement(GroupChannelHeaderView, __assign({}, context, { className: className, currentChannel: context.currentChannel })));
};

export { GroupChannelHeader, GroupChannelHeader as default };
//# sourceMappingURL=GroupChannelHeader.js.map
