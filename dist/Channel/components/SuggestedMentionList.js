import { _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { S as SuggestedMentionListView } from '../../chunks/bundle-VwofrwBu.js';
import { useChannelContext } from '../context.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-inBt684F.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-iWB7G7Jl.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../chunks/bundle-SReX4IhW.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-5c9A2KLX.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-EHXBDBJS.js';

var SuggestedMentionList = function (props) {
    var currentGroupChannel = useChannelContext().currentGroupChannel;
    return (React__default.createElement(SuggestedMentionListView, __assign({}, props, { currentChannel: currentGroupChannel })));
};

export { SuggestedMentionList, SuggestedMentionList as default };
//# sourceMappingURL=SuggestedMentionList.js.map
