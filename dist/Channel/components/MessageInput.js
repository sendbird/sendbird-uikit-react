import { _ as __assign } from '../../chunks/bundle-KMsJXUN2.js';
import React__default from 'react';
import { g as getSuggestedReplies } from '../../chunks/bundle-ZnLsMTHr.js';
import { M as MessageInputWrapperView } from '../../chunks/bundle-zv656l7I.js';
import { useChannelContext } from '../context.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-LZemF1A7.js';
import '../../chunks/bundle-38Dx0S9V.js';
import '../../chunks/bundle-msnuMA4R.js';
import '../../chunks/bundle-Tg3CrpQU.js';
import '../../chunks/bundle-CsWYoRVd.js';
import '../../GroupChannel/components/SuggestedMentionList.js';
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
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/QuoteMessageInput.js';
import '../../chunks/bundle--jWawO0i.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-8TMXvllw.js';
import '../../chunks/bundle-AFXr5NmI.js';
import '../../VoiceRecorder/context.js';
import '../../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../../chunks/bundle-ZTmwWu_-.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../withSendbird.js';
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
import '../../GroupChannel/hooks/useHandleUploadFiles.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-J4Twjc27.js';
import '../../chunks/bundle-x78eEPy7.js';
import '../../chunks/bundle-fO5XIU5Y.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-ay4_3U9k.js';
import '../../chunks/bundle-vbGNKQpe.js';
import '../../chunks/bundle-Vkdvpta0.js';
import '../../chunks/bundle-xlx3bBW8.js';
import '../../chunks/bundle-1653azYX.js';
import '../../chunks/bundle-9zSaTC1n.js';
import '../../chunks/bundle-THTV9S18.js';
import '../../chunks/bundle-TLAngIsc.js';
import '../../chunks/bundle-4Q6J8UBD.js';
import '../../chunks/bundle-DJdbc2nP.js';

var MessageInputWrapper = function (props) {
    var _a, _b;
    var config = useSendbirdStateContext().config;
    var context = useChannelContext();
    var quoteMessage = context.quoteMessage, localMessages = context.localMessages, currentGroupChannel = context.currentGroupChannel, sendMessage = context.sendMessage, sendFileMessage = context.sendFileMessage, sendVoiceMessage = context.sendVoiceMessage, sendMultipleFilesMessage = context.sendMultipleFilesMessage;
    var lastMessage = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.lastMessage;
    var isLastMessageSuggestedRepliesEnabled = ((_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableSuggestedReplies)
        && getSuggestedReplies(lastMessage).length > 0
        && (localMessages === null || localMessages === void 0 ? void 0 : localMessages.length) === 0;
    var disableMessageInput = props.disabled
        || isLastMessageSuggestedRepliesEnabled && !!((_b = lastMessage.extendedMessagePayload) === null || _b === void 0 ? void 0 : _b['disable_chat_input']);
    return (React__default.createElement(MessageInputWrapperView, __assign({}, props, context, { disabled: disableMessageInput, currentChannel: currentGroupChannel, sendUserMessage: function (params) {
            return sendMessage({
                message: params.message,
                mentionTemplate: params.mentionedMessageTemplate,
                mentionedUsers: params.mentionedUsers,
                quoteMessage: quoteMessage,
            });
        }, sendFileMessage: function (params) {
            return sendFileMessage(params.file, quoteMessage);
        }, sendVoiceMessage: function (_a, duration) {
            var file = _a.file;
            return sendVoiceMessage(file, duration, quoteMessage);
        }, sendMultipleFilesMessage: function (_a) {
            var fileInfoList = _a.fileInfoList;
            return sendMultipleFilesMessage(fileInfoList.map(function (fileInfo) { return fileInfo.file; }), quoteMessage);
        } })));
};

export { MessageInputWrapper, MessageInputWrapper as default };
//# sourceMappingURL=MessageInput.js.map
