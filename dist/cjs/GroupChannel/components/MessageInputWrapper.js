'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var MessageInputWrapperView = require('../../chunks/bundle-Xa3hXyhu.js');
var GroupChannel_context = require('../context.js');
var uikitTools = require('@sendbird/uikit-tools');
var index = require('../../chunks/bundle-Uw6P-cM9.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
require('../../chunks/bundle-U2YYVRfT.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('./SuggestedMentionList.js');
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
require('../../withSendbird.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/QuoteMessageInput.js');
require('../../chunks/bundle--4Ob_RGQ.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-jXnX-7jH.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../VoiceRecorder/context.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
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
require('../hooks/useHandleUploadFiles.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-48AiK3oz.js');
require('../../chunks/bundle-6xWNZugu.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-2xXFQXmk.js');
require('../../chunks/bundle-VqRllkVd.js');

var MessageInputWrapper = function (props) {
    var _a;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var context = GroupChannel_context.useGroupChannelContext();
    var messages = context.messages, currentChannel = context.currentChannel;
    var lastMessage = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.lastMessage;
    var isLastMessageSuggestedRepliesEnabled = uikitTools.useIIFE(function () {
        var _a;
        if (!((_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableSuggestedReplies))
            return false;
        if (index.getSuggestedReplies(lastMessage).length === 0)
            return false;
        var lastMessageInContext = messages[messages.length - 1];
        if (index.isSendableMessage(lastMessageInContext) && lastMessageInContext.sendingStatus !== 'succeeded')
            return false;
        return true;
    });
    var disableMessageInput = props.disabled
        || isLastMessageSuggestedRepliesEnabled && !!((_a = lastMessage.extendedMessagePayload) === null || _a === void 0 ? void 0 : _a['disable_chat_input']);
    return (React.createElement(MessageInputWrapperView.MessageInputWrapperView, _tslib.__assign({}, props, context, { disabled: disableMessageInput })));
};

exports.VoiceMessageInputWrapper = MessageInputWrapperView.VoiceMessageInputWrapper;
exports.MessageInputWrapper = MessageInputWrapper;
exports.default = MessageInputWrapper;
//# sourceMappingURL=MessageInputWrapper.js.map
