'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var index = require('../../chunks/bundle-wzulmlgb.js');
var MessageInputWrapperView = require('../../chunks/bundle-ANsbY5YP.js');
var Channel_context = require('../context.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-MGhVSK7j.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../GroupChannel/components/SuggestedMentionList.js');
require('../../chunks/bundle-isZYiJlA.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../chunks/bundle-m-c1V2jE.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/QuoteMessageInput.js');
require('../../chunks/bundle-38g4arE5.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-C8zLDVXs.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../VoiceRecorder/context.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../withSendbird.js');
require('../../VoiceRecorder/useVoiceRecorder.js');
require('../../chunks/bundle-1LKSecgr.js');
require('../../ui/PlaybackTime.js');
require('../../ui/ProgressBar.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-KNt569rP.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-jh--qeoy.js');
require('dompurify');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-q13fOZ_V.js');
require('../../chunks/bundle-TCEkQl9R.js');
require('../../chunks/bundle-Q2J-7okW.js');
require('../../GroupChannel/hooks/useHandleUploadFiles.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-Z1BkfIY5.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-FMwBmvVd.js');
require('../../chunks/bundle-Ny3NKw-X.js');
require('../../chunks/bundle-XgxbsHav.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('../../chunks/bundle-Tcz7Ubz9.js');
require('../../chunks/bundle-vtSSgUjy.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-xgiAxHSr.js');

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
