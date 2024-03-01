import { _ as __assign } from '../../chunks/bundle-xhjHZ041.js';
import React__default from 'react';
import { useGroupChannelContext } from '../context.js';
import { R as RemoveMessageModalView } from '../../chunks/bundle-0g_j3SgI.js';
import '@sendbird/chat/message';
import '@sendbird/chat/groupChannel';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-9GBao6H-.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-jbaxtoFd.js';
import '../../chunks/bundle-2FjmmgQK.js';
import '../../chunks/bundle-QzNkWqn-.js';
import '../../chunks/bundle-WP5dHmdm.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '../../chunks/bundle-LgR-0X7v.js';
import '../../chunks/bundle-p0z4OS-3.js';
import '../../chunks/bundle-ycx-QBOb.js';
import '../../chunks/bundle-yarrTY_z.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-1inZXcUV.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-9qb1BPMn.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-AN6QCsUL.js';

var RemoveMessageModal = function (props) {
    var deleteMessage = useGroupChannelContext().deleteMessage;
    return React__default.createElement(RemoveMessageModalView, __assign({}, props, { deleteMessage: deleteMessage }));
};

export { RemoveMessageModal, RemoveMessageModal as default };
//# sourceMappingURL=RemoveMessageModal.js.map
