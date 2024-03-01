import { _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { G as GroupChannelHeaderView } from '../../chunks/bundle-yWUWCKD5.js';
import { useChannelContext } from '../context.js';
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
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-hKmRj7Ck.js';
import '../../chunks/bundle-fO5XIU5Y.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-ay4_3U9k.js';
import '../../chunks/bundle-vbGNKQpe.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-Vkdvpta0.js';
import '../../chunks/bundle-xlx3bBW8.js';
import '../../chunks/bundle-1653azYX.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-9zSaTC1n.js';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-DJdbc2nP.js';

var ChannelHeader = function (_a) {
    var className = _a.className;
    var context = useChannelContext();
    return (React__default.createElement(GroupChannelHeaderView, __assign({}, context, { className: className, currentChannel: context.currentGroupChannel })));
};

export { ChannelHeader, ChannelHeader as default };
//# sourceMappingURL=ChannelHeader.js.map
