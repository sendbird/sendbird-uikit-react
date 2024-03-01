import { _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { G as GroupChannelHeaderView } from '../../chunks/bundle-6uJ_roBM.js';
import { useChannelContext } from '../context.js';
import '../../ui/IconButton.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-k8wZLjPN.js';
import '../../chunks/bundle-_9Y5-6si.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle--NfXT-0k.js';
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
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-5c9A2KLX.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-EHXBDBJS.js';

var ChannelHeader = function (_a) {
    var className = _a.className;
    var context = useChannelContext();
    return (React__default.createElement(GroupChannelHeaderView, __assign({}, context, { className: className, currentChannel: context.currentGroupChannel })));
};

export { ChannelHeader, ChannelHeader as default };
//# sourceMappingURL=ChannelHeader.js.map
