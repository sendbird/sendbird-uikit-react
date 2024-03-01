import React__default, { useContext } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-1inZXcUV.js';
import MessageInput from '../../ui/MessageInput.js';
import { u as useOpenChannelContext } from '../../chunks/bundle-QqSGl9UA.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle-8RTviqdm.js';
import '../../chunks/bundle-tIdypo_v.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../chunks/bundle-p0_Jj2xm.js';
import 'dompurify';
import '../../chunks/bundle-zp72gyE3.js';
import '../../chunks/bundle-kgn8HcWj.js';
import '../../chunks/bundle-_MABCkOp.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-AN6QCsUL.js';
import '../../chunks/bundle-IqjS0ok_.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-qPq2iACJ.js';
import '../../chunks/bundle-yarrTY_z.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../chunks/bundle-FmRroF-I.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../chunks/bundle-UKdN0Ihw.js';

var OpenChannelInput = React__default.forwardRef(function (props, ref) {
    var _a = useOpenChannelContext(), currentOpenChannel = _a.currentOpenChannel, disabled = _a.disabled, handleSendMessage = _a.handleSendMessage, handleFileUpload = _a.handleFileUpload, amIMuted = _a.amIMuted;
    var channel = currentOpenChannel;
    var stringSet = useContext(LocalizationContext).stringSet;
    var value = props.value;
    function getPlaceHolderString() {
        if (amIMuted) {
            return stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED;
        }
        if (disabled) {
            return stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED;
        }
        return '';
    }
    if (!channel) {
        return null;
    }
    return (React__default.createElement("div", { className: "sendbird-openchannel-footer" },
        React__default.createElement(MessageInput, { channel: currentOpenChannel, ref: ref, value: value, disabled: disabled, isVoiceMessageEnabled: false, onSendMessage: handleSendMessage, onFileUpload: handleFileUpload, placeholder: getPlaceHolderString() })));
});

export { OpenChannelInput as default };
//# sourceMappingURL=OpenChannelInput.js.map
