import { _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { useGroupChannelContext } from '../context.js';
import { R as RemoveMessageModalView } from '../../chunks/bundle-4fSjujOF.js';
import '@sendbird/chat/message';
import '@sendbird/chat/groupChannel';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-7nLQi_YH.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-H77M-_wK.js';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../chunks/bundle-_6EZcp4H.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-zcfKjxS7.js';
import '../../chunks/bundle-WrTlYypL.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';

var RemoveMessageModal = function (props) {
    var deleteMessage = useGroupChannelContext().deleteMessage;
    return React__default.createElement(RemoveMessageModalView, __assign({}, props, { deleteMessage: deleteMessage }));
};

export { RemoveMessageModal, RemoveMessageModal as default };
//# sourceMappingURL=RemoveMessageModal.js.map
