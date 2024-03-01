import { _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { useGroupChannelContext } from '../context.js';
import { R as RemoveMessageModalView } from '../../chunks/bundle-JMkFT5Td.js';
import '@sendbird/chat/message';
import '@sendbird/chat/groupChannel';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-x78eEPy7.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-38Dx0S9V.js';
import '../../chunks/bundle-lPKA2RTf.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../chunks/bundle-fO5XIU5Y.js';
import '../../chunks/bundle-JMVaVraV.js';
import '../../chunks/bundle-i4OMePA5.js';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-pZ049TQg.js';
import '../../chunks/bundle-ZnLsMTHr.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-LZemF1A7.js';

var RemoveMessageModal = function (props) {
    var deleteMessage = useGroupChannelContext().deleteMessage;
    return React__default.createElement(RemoveMessageModalView, __assign({}, props, { deleteMessage: deleteMessage }));
};

export { RemoveMessageModal, RemoveMessageModal as default };
//# sourceMappingURL=RemoveMessageModal.js.map
