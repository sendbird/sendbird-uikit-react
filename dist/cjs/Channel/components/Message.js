'use strict';

var _tslib = require('../../chunks/bundle-zYqQA3cT.js');
var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var Channel_context = require('../context.js');
var index = require('../../chunks/bundle-bjSez2lv.js');
var utils = require('../../chunks/bundle-CPnHexJQ.js');
var MessageView = require('../../chunks/bundle-Eh1XQ7zf.js');
var Channel_components_FileViewer = require('./FileViewer.js');
var Channel_components_RemoveMessageModal = require('./RemoveMessageModal.js');
require('../../withSendbird.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-2FdL4aA6.js');
require('../../chunks/bundle-M4WNZlHL.js');
require('../../chunks/bundle-T9gnzy2i.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-vxARP6GP.js');
require('../../chunks/bundle-vmQPp-90.js');
require('../../chunks/bundle-8TphtY0G.js');
require('../../chunks/bundle-4jVvOUfV.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-ZngtlfeR.js');
require('../../chunks/bundle-NfUcey5s.js');
require('../../chunks/bundle-b-DMr0gw.js');
require('../../chunks/bundle-5ucHJjT6.js');
require('../../chunks/bundle-uyZV0VMO.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-Nz6fSUye.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-6wRNuySu.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-oaDSLq17.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-Ka3VBiNF.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-vnNrprB3.js');
require('dompurify');
require('../../chunks/bundle-suIvps1I.js');
require('../../chunks/bundle-bXe-_rig.js');
require('../../chunks/bundle-scYpz-Ln.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-URV6GLmd.js');
require('../../ui/MessageContent.js');
require('../../chunks/bundle-vsw2g6d5.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-k4IOvwe9.js');
require('../../chunks/bundle-r8DyENxy.js');
require('../../ui/MessageItemMenu.js');
require('../../ui/ContextMenu.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-qKiW2e44.js');
require('../../ui/MessageItemReactionMenu.js');
require('../../ui/ImageRenderer.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-l768-Ldg.js');
require('../../chunks/bundle-37dz9yoi.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../Message/context.js');
require('../../ui/AdminMessage.js');
require('../../ui/QuoteMessage.js');
require('../../chunks/bundle-Oijs10ng.js');
require('../../chunks/bundle-Y93r8Xy_.js');
require('../../ui/ThreadReplies.js');
require('../../ui/OGMessageItemBody.js');
require('../../chunks/bundle-zswKzOJx.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../ui/TextMessageItemBody.js');
require('../../ui/FileMessageItemBody.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-GJsJRUXc.js');
require('../../chunks/bundle-9DG1byjg.js');
require('../../chunks/bundle-mO4Gb6oX.js');
require('@sendbird/uikit-tools');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-RZEbRa4M.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/ThumbnailMessageItemBody.js');
require('../../ui/UnknownMessageItemBody.js');
require('../../ui/FeedbackIconButton.js');
require('../../ui/MobileFeedbackMenu.js');
require('./MessageFeedbackModal.js');
require('../../ui/Input.js');
require('../../GroupChannel/components/SuggestedReplies.js');
require('../../chunks/bundle-QLdAEK3e.js');
require('../../chunks/bundle-dIspFdXr.js');
require('../../chunks/bundle-Nn9qAcpF.js');
require('../../chunks/bundle-Ri0nZ4E4.js');

var Message = function (props) {
    var _a, _b;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var _c = Channel_context.useChannelContext(), initialized = _c.initialized, currentGroupChannel = _c.currentGroupChannel, highLightedMessageId = _c.highLightedMessageId, setHighLightedMessageId = _c.setHighLightedMessageId, animatedMessageId = _c.animatedMessageId, setAnimatedMessageId = _c.setAnimatedMessageId, updateMessage = _c.updateMessage, scrollToMessage = _c.scrollToMessage, replyType = _c.replyType, threadReplySelectType = _c.threadReplySelectType, isReactionEnabled = _c.isReactionEnabled, toggleReaction = _c.toggleReaction, emojiContainer = _c.emojiContainer, nicknamesMap = _c.nicknamesMap, setQuoteMessage = _c.setQuoteMessage, resendMessage = _c.resendMessage, deleteMessage = _c.deleteMessage, renderUserMentionItem = _c.renderUserMentionItem, onReplyInThread = _c.onReplyInThread, onQuoteMessageClick = _c.onQuoteMessageClick, onMessageAnimated = _c.onMessageAnimated, onMessageHighlighted = _c.onMessageHighlighted, sendMessage = _c.sendMessage, localMessages = _c.localMessages;
    var message = props.message;
    return (React.createElement(MessageView.MessageView, _tslib.__assign({}, props, { channel: currentGroupChannel, emojiContainer: emojiContainer, editInputDisabled: !initialized || utils.isDisabledBecauseFrozen(currentGroupChannel) || utils.isDisabledBecauseMuted(currentGroupChannel) || !config.isOnline, shouldRenderSuggestedReplies: ((_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableSuggestedReplies)
            && message.messageId === ((_b = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.lastMessage) === null || _b === void 0 ? void 0 : _b.messageId)
            // the options should appear only when there's no failed or pending messages
            && (localMessages === null || localMessages === void 0 ? void 0 : localMessages.length) === 0
            && index.getSuggestedReplies(message).length > 0, isReactionEnabled: isReactionEnabled, replyType: replyType, threadReplySelectType: threadReplySelectType, nicknamesMap: nicknamesMap, renderUserMentionItem: renderUserMentionItem, scrollToMessage: scrollToMessage, toggleReaction: toggleReaction, setQuoteMessage: setQuoteMessage, onQuoteMessageClick: onQuoteMessageClick, onReplyInThreadClick: onReplyInThread, sendUserMessage: function (params) {
            sendMessage({
                message: params.message,
                mentionedUsers: params.mentionedUsers,
                mentionTemplate: params.mentionedMessageTemplate,
            });
        }, updateUserMessage: function (messageId, params) {
            updateMessage({
                messageId: messageId,
                message: params.message,
                mentionedUsers: params.mentionedUsers,
                mentionTemplate: params.mentionedMessageTemplate,
            });
        }, resendMessage: resendMessage, deleteMessage: deleteMessage, animatedMessageId: animatedMessageId, setAnimatedMessageId: setAnimatedMessageId, onMessageAnimated: onMessageAnimated, highLightedMessageId: highLightedMessageId, setHighLightedMessageId: setHighLightedMessageId, onMessageHighlighted: onMessageHighlighted, renderFileViewer: function (props) { return React.createElement(Channel_components_FileViewer.FileViewer, _tslib.__assign({}, props)); }, renderRemoveMessageModal: function (props) { return React.createElement(Channel_components_RemoveMessageModal, _tslib.__assign({}, props)); } })));
};

module.exports = Message;
//# sourceMappingURL=Message.js.map
