'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var index = require('../../chunks/bundle-Uw6P-cM9.js');
var MessageInputWrapperView = require('../../chunks/bundle-Xa3hXyhu.js');
var Channel_context = require('../context.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-U2YYVRfT.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../GroupChannel/components/SuggestedMentionList.js');
require('../../chunks/bundle-rYFzQpzQ.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/QuoteMessageInput.js');
require('../../chunks/bundle--4Ob_RGQ.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-jXnX-7jH.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../VoiceRecorder/context.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../withSendbird.js');
require('../../VoiceRecorder/useVoiceRecorder.js');
require('../../chunks/bundle-pKCe2hVu.js');
require('../../ui/PlaybackTime.js');
require('../../ui/ProgressBar.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../GroupChannel/hooks/useHandleUploadFiles.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-6xWNZugu.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-JLP3WF2h.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-a7LVpeCR.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-40zdhNFy.js');
require('../../chunks/bundle-W24S10k5.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-Q5GNNUqM.js');

var MessageInputWrapper = function (props) {
    var _a, _b;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var context = Channel_context.useChannelContext();
    var quoteMessage = context.quoteMessage, localMessages = context.localMessages, currentGroupChannel = context.currentGroupChannel, sendMessage = context.sendMessage, sendFileMessage = context.sendFileMessage, sendVoiceMessage = context.sendVoiceMessage, sendMultipleFilesMessage = context.sendMultipleFilesMessage;
    var lastMessage = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.lastMessage;
    var isLastMessageSuggestedRepliesEnabled = ((_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableSuggestedReplies)
        && index.getSuggestedReplies(lastMessage).length > 0
        && (localMessages === null || localMessages === void 0 ? void 0 : localMessages.length) === 0;
    var disableMessageInput = props.disabled
        || isLastMessageSuggestedRepliesEnabled && !!((_b = lastMessage.extendedMessagePayload) === null || _b === void 0 ? void 0 : _b['disable_chat_input']);
    return (React.createElement(MessageInputWrapperView.MessageInputWrapperView, _tslib.__assign({}, props, context, { disabled: disableMessageInput, currentChannel: currentGroupChannel, sendUserMessage: function (params) {
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

exports.MessageInputWrapper = MessageInputWrapper;
exports.default = MessageInputWrapper;
//# sourceMappingURL=MessageInput.js.map
