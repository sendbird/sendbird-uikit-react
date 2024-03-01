'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var MessageInputWrapperView = require('../../chunks/bundle-ANsbY5YP.js');
var GroupChannel_context = require('../context.js');
var uikitTools = require('@sendbird/uikit-tools');
var index = require('../../chunks/bundle-wzulmlgb.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
require('../../chunks/bundle-MGhVSK7j.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('./SuggestedMentionList.js');
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
require('../../withSendbird.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/QuoteMessageInput.js');
require('../../chunks/bundle-38g4arE5.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-C8zLDVXs.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../VoiceRecorder/context.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
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
require('../hooks/useHandleUploadFiles.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-Z1BkfIY5.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-A90WNbHn.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('../../chunks/bundle-Gu74ZSrJ.js');
require('../../chunks/bundle-4TXS0UcW.js');
require('../../chunks/bundle-LutGJd7y.js');

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
