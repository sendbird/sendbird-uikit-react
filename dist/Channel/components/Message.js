import { _ as __assign } from '../../chunks/bundle-UnAcr6wX.js';
import React__default from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useChannelContext } from '../context.js';
import { g as getSuggestedReplies } from '../../chunks/bundle-WrTlYypL.js';
import { a as isDisabledBecauseFrozen, b as isDisabledBecauseMuted } from '../../chunks/bundle-H77M-_wK.js';
import { M as MessageView } from '../../chunks/bundle-Dv-ua0wB.js';
import { FileViewer } from './FileViewer.js';
import RemoveMessageModal from './RemoveMessageModal.js';
import '../../withSendbird.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../chunks/bundle-inBt684F.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-iWB7G7Jl.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '../../chunks/bundle-SReX4IhW.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-5c9A2KLX.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-EHXBDBJS.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-7nLQi_YH.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-NK74hfcu.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../ui/MessageContent.js';
import '../../chunks/bundle-FTNAU8Uq.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../ui/MessageItemMenu.js';
import '../../ui/ContextMenu.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-AGNrfX7p.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/ImageRenderer.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle--BlhOpUS.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../Message/context.js';
import '../../ui/AdminMessage.js';
import '../../ui/QuoteMessage.js';
import '../../chunks/bundle-S6OaNh10.js';
import '../../chunks/bundle-Z-iEmjEQ.js';
import '../../ui/ThreadReplies.js';
import '../../ui/OGMessageItemBody.js';
import '../../chunks/bundle-1q5AhvE7.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../ui/TextMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-2C9iP99S.js';
import '../../chunks/bundle-YfeG6LQ5.js';
import '../../chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../ui/FeedbackIconButton.js';
import '../../ui/MobileFeedbackMenu.js';
import './MessageFeedbackModal.js';
import '../../ui/Input.js';
import '../../GroupChannel/components/SuggestedReplies.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle-thfg3MZH.js';
import '../../chunks/bundle-4fSjujOF.js';
import '../../chunks/bundle-zcfKjxS7.js';

var Message = function (props) {
    var _a, _b;
    var config = useSendbirdStateContext().config;
    var _c = useChannelContext(), initialized = _c.initialized, currentGroupChannel = _c.currentGroupChannel, highLightedMessageId = _c.highLightedMessageId, setHighLightedMessageId = _c.setHighLightedMessageId, animatedMessageId = _c.animatedMessageId, setAnimatedMessageId = _c.setAnimatedMessageId, updateMessage = _c.updateMessage, scrollToMessage = _c.scrollToMessage, replyType = _c.replyType, threadReplySelectType = _c.threadReplySelectType, isReactionEnabled = _c.isReactionEnabled, toggleReaction = _c.toggleReaction, emojiContainer = _c.emojiContainer, nicknamesMap = _c.nicknamesMap, setQuoteMessage = _c.setQuoteMessage, resendMessage = _c.resendMessage, deleteMessage = _c.deleteMessage, renderUserMentionItem = _c.renderUserMentionItem, onReplyInThread = _c.onReplyInThread, onQuoteMessageClick = _c.onQuoteMessageClick, onMessageAnimated = _c.onMessageAnimated, onMessageHighlighted = _c.onMessageHighlighted, sendMessage = _c.sendMessage, localMessages = _c.localMessages;
    var message = props.message;
    return (React__default.createElement(MessageView, __assign({}, props, { channel: currentGroupChannel, emojiContainer: emojiContainer, editInputDisabled: !initialized || isDisabledBecauseFrozen(currentGroupChannel) || isDisabledBecauseMuted(currentGroupChannel) || !config.isOnline, shouldRenderSuggestedReplies: ((_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableSuggestedReplies)
            && message.messageId === ((_b = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.lastMessage) === null || _b === void 0 ? void 0 : _b.messageId)
            // the options should appear only when there's no failed or pending messages
            && (localMessages === null || localMessages === void 0 ? void 0 : localMessages.length) === 0
            && getSuggestedReplies(message).length > 0, isReactionEnabled: isReactionEnabled, replyType: replyType, threadReplySelectType: threadReplySelectType, nicknamesMap: nicknamesMap, renderUserMentionItem: renderUserMentionItem, scrollToMessage: scrollToMessage, toggleReaction: toggleReaction, setQuoteMessage: setQuoteMessage, onQuoteMessageClick: onQuoteMessageClick, onReplyInThreadClick: onReplyInThread, sendUserMessage: function (params) {
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
        }, resendMessage: resendMessage, deleteMessage: deleteMessage, animatedMessageId: animatedMessageId, setAnimatedMessageId: setAnimatedMessageId, onMessageAnimated: onMessageAnimated, highLightedMessageId: highLightedMessageId, setHighLightedMessageId: setHighLightedMessageId, onMessageHighlighted: onMessageHighlighted, renderFileViewer: function (props) { return React__default.createElement(FileViewer, __assign({}, props)); }, renderRemoveMessageModal: function (props) { return React__default.createElement(RemoveMessageModal, __assign({}, props)); } })));
};

export { Message as default };
//# sourceMappingURL=Message.js.map
