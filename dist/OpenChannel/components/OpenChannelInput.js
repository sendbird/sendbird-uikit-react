import React__default, { useContext } from 'react';
import { L as LocalizationContext } from '../../chunks/bundle-hS8Jw8F1.js';
import MessageInput from '../../ui/MessageInput.js';
import { u as useOpenChannelContext } from '../../chunks/bundle-qsYpqw_E.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-UnAcr6wX.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../chunks/bundle-WrTlYypL.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-QJa2lTJw.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../chunks/bundle-1CfFFBx9.js';

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
