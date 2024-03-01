'use strict';

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var Channel_context = require('../context.js');
var index = require('../../chunks/bundle-Uw6P-cM9.js');
var utils = require('../../chunks/bundle-6xWNZugu.js');
var MessageView = require('../../chunks/bundle-Q3LgnX7F.js');
var Channel_components_FileViewer = require('./FileViewer.js');
var Channel_components_RemoveMessageModal = require('./RemoveMessageModal.js');
require('../../withSendbird.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-JLP3WF2h.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-HY8cubCp.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-a7LVpeCR.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-40zdhNFy.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('@sendbird/chat/groupChannel');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-W24S10k5.js');
require('../../chunks/bundle-VqRllkVd.js');
require('../../chunks/bundle-H29alxvs.js');
require('../../chunks/bundle-MK0CJsqZ.js');
require('../../chunks/bundle-Q5GNNUqM.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-U2YYVRfT.js');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../ui/MessageContent.js');
require('../../chunks/bundle-VehpyAT7.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-_wF3sJvp.js');
require('../../chunks/bundle-iPt3h7ba.js');
require('../../ui/MessageItemMenu.js');
require('../../ui/ContextMenu.js');
require('react-dom');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-K3wEmKTu.js');
require('../../ui/MessageItemReactionMenu.js');
require('../../ui/ImageRenderer.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/BottomSheet.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-6hGNMML2.js');
require('../../ui/UserListItem.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../Message/context.js');
require('../../ui/AdminMessage.js');
require('../../ui/QuoteMessage.js');
require('../../chunks/bundle--4Ob_RGQ.js');
require('../../chunks/bundle-m5pFb_tZ.js');
require('../../ui/ThreadReplies.js');
require('../../ui/OGMessageItemBody.js');
require('../../chunks/bundle-DqKLlsGU.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../ui/TextMessageItemBody.js');
require('../../ui/FileMessageItemBody.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-wezC76id.js');
require('../../chunks/bundle-s5WIvT8N.js');
require('../../chunks/bundle-noP7JXqE.js');
require('@sendbird/uikit-tools');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-jXnX-7jH.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../ui/ThumbnailMessageItemBody.js');
require('../../ui/UnknownMessageItemBody.js');
require('../../ui/FeedbackIconButton.js');
require('../../ui/MobileFeedbackMenu.js');
require('./MessageFeedbackModal.js');
require('../../ui/Input.js');
require('../../GroupChannel/components/SuggestedReplies.js');
require('../../chunks/bundle-rYFzQpzQ.js');
require('../../chunks/bundle-JARyNexc.js');
require('../../chunks/bundle-L8T4CdY4.js');
require('../../chunks/bundle-gOYUXAiI.js');

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
