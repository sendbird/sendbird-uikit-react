import { _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { M as MessageInputWrapperView } from '../../chunks/bundle-zv656l7I.js';
export { V as VoiceMessageInputWrapper } from '../../chunks/bundle-zv656l7I.js';
import { useGroupChannelContext } from '../context.js';
import { useIIFE } from '@sendbird/uikit-tools';
import { g as getSuggestedReplies, f as isSendableMessage } from '../../chunks/bundle-ZnLsMTHr.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import '../../chunks/bundle-38Dx0S9V.js';
import '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import './SuggestedMentionList.js';
import '../../chunks/bundle-CLnDoxQc.js';
import '../../chunks/bundle-kMMCn6GE.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-7YRb7CRq.js';
import '../../chunks/bundle-OJq071GK.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-DhS-f2ZT.js';
import '../../chunks/bundle-4_6x-RiC.js';
import '../../chunks/bundle-hKmRj7Ck.js';
import '../../chunks/bundle-NOh3ukH6.js';
import '../../withSendbird.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/QuoteMessageInput.js';
import '../../chunks/bundle--jWawO0i.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-8TMXvllw.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../VoiceRecorder/context.js';
import '../../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../VoiceRecorder/useVoiceRecorder.js';
import '../../chunks/bundle-M3g0UgDk.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ProgressBar.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nGuCRoDK.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-1uBgZh_D.js';
import 'dompurify';
import '../../chunks/bundle-qauKidkr.js';
import '../../chunks/bundle-wf7f-9LT.js';
import '../../chunks/bundle-cMznkLt0.js';
import '../../chunks/bundle-pODFB39J.js';
import '../hooks/useHandleUploadFiles.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-J4Twjc27.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-lPKA2RTf.js';
import '../../chunks/bundle-fO5XIU5Y.js';
import '../../chunks/bundle-JMVaVraV.js';
import '../../chunks/bundle-i4OMePA5.js';
import '../../chunks/bundle-THTV9S18.js';

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
