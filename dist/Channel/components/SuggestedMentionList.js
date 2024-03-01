import { _ as __assign } from '../../chunks/bundle-xhjHZ041.js';
import React__default from 'react';
import { S as SuggestedMentionListView } from '../../chunks/bundle-Xqf5M3Yn.js';
import { useChannelContext } from '../context.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../chunks/bundle-1inZXcUV.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-tIdypo_v.js';
import '../../chunks/bundle-8RTviqdm.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-LgR-0X7v.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-6T5vB4lV.js';
import '../../chunks/bundle-o-FVZr_e.js';
import '../../chunks/bundle-AN6QCsUL.js';
import '../../chunks/bundle-4isra95J.js';
import '../../chunks/bundle-qPq2iACJ.js';
import '../../chunks/bundle-OORCcdCm.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-04HABYsS.js';
import '../../chunks/bundle-yarrTY_z.js';
import '../../chunks/bundle-jbaxtoFd.js';
import '../../chunks/bundle-2FjmmgQK.js';
import '../../chunks/bundle-sZUcD6H6.js';

var SuggestedMentionList = function (props) {
    var currentGroupChannel = useChannelContext().currentGroupChannel;
    return (React__default.createElement(SuggestedMentionListView, __assign({}, props, { currentChannel: currentGroupChannel })));
};

export { SuggestedMentionList, SuggestedMentionList as default };
//# sourceMappingURL=SuggestedMentionList.js.map
