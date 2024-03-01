import { _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { M as MessageInputWrapperView } from '../../chunks/bundle-RbS_k--P.js';
export { V as VoiceMessageInputWrapper } from '../../chunks/bundle-RbS_k--P.js';
import { useGroupChannelContext } from '../context.js';
import { useIIFE } from '@sendbird/uikit-tools';
import { g as getSuggestedReplies, f as isSendableMessage } from '../../chunks/bundle-WrTlYypL.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import '../../chunks/bundle-7nLQi_YH.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import './SuggestedMentionList.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../withSendbird.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/QuoteMessageInput.js';
import '../../chunks/bundle-S6OaNh10.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../VoiceRecorder/context.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../VoiceRecorder/useVoiceRecorder.js';
import '../../chunks/bundle-Syx3NAbT.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ProgressBar.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../hooks/useHandleUploadFiles.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-QJa2lTJw.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-H77M-_wK.js';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../chunks/bundle-_6EZcp4H.js';
import '../../chunks/bundle-7BSf_PUT.js';

var MessageInputWrapper = function (props) {
    var _a;
    var config = useSendbirdStateContext().config;
    var context = useGroupChannelContext();
    var messages = context.messages, currentChannel = context.currentChannel;
    var lastMessage = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.lastMessage;
    var isLastMessageSuggestedRepliesEnabled = useIIFE(function () {
        var _a;
        if (!((_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableSuggestedReplies))
            return false;
        if (getSuggestedReplies(lastMessage).length === 0)
            return false;
        var lastMessageInContext = messages[messages.length - 1];
        if (isSendableMessage(lastMessageInContext) && lastMessageInContext.sendingStatus !== 'succeeded')
            return false;
        return true;
    });
    var disableMessageInput = props.disabled
        || isLastMessageSuggestedRepliesEnabled && !!((_a = lastMessage.extendedMessagePayload) === null || _a === void 0 ? void 0 : _a['disable_chat_input']);
    return (React__default.createElement(MessageInputWrapperView, __assign({}, props, context, { disabled: disableMessageInput })));
};

export { MessageInputWrapper, MessageInputWrapper as default };
//# sourceMappingURL=MessageInputWrapper.js.map
