import { _ as __assign } from '../../chunks/bundle-xhjHZ041.js';
import React__default from 'react';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { useChannelContext } from '../context.js';
import { g as getSuggestedReplies } from '../../chunks/bundle-Jwc7mleJ.js';
import { a as isDisabledBecauseFrozen, b as isDisabledBecauseMuted } from '../../chunks/bundle-LgR-0X7v.js';
import { M as MessageView } from '../../chunks/bundle-oPPgR68J.js';
import { FileViewer } from './FileViewer.js';
import RemoveMessageModal from './RemoveMessageModal.js';
import '../../withSendbird.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-tIdypo_v.js';
import '../../chunks/bundle-6T5vB4lV.js';
import '../../chunks/bundle-o-FVZr_e.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-AN6QCsUL.js';
import '../../chunks/bundle-4isra95J.js';
import '../../chunks/bundle-qPq2iACJ.js';
import '../../chunks/bundle-OORCcdCm.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '@sendbird/chat/groupChannel';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../chunks/bundle-04HABYsS.js';
import '../../chunks/bundle-yarrTY_z.js';
import '../../chunks/bundle-jbaxtoFd.js';
import '../../chunks/bundle-2FjmmgQK.js';
import '../../chunks/bundle-sZUcD6H6.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-1inZXcUV.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-QzNkWqn-.js';
import '../../Message/hooks/useDirtyGetMentions.js';
import '../../ui/DateSeparator.js';
import '../../chunks/bundle-nMxV4WMS.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-8RTviqdm.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-p0_Jj2xm.js';
import 'dompurify';
import '../../chunks/bundle-zp72gyE3.js';
import '../../chunks/bundle-kgn8HcWj.js';
import '../../chunks/bundle-_MABCkOp.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-IqjS0ok_.js';
import '../../ui/MessageContent.js';
import '../../chunks/bundle-Vt_Z-0RJ.js';
import '../../ui/Loader.js';
import '../../chunks/bundle--WYMGSfi.js';
import '../../chunks/bundle-RfBkMeJ1.js';
import '../../ui/MessageItemMenu.js';
import '../../ui/ContextMenu.js';
import 'react-dom';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-K3cm7JxF.js';
import '../../ui/MessageItemReactionMenu.js';
import '../../ui/ImageRenderer.js';
import '../../ui/ReactionButton.js';
import '../../chunks/bundle-FgXHPuhY.js';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/EmojiReactions.js';
import '../../ui/ReactionBadge.js';
import '../../ui/BottomSheet.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import '../../ui/UserListItem.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../ui/Tooltip.js';
import '../../ui/TooltipWrapper.js';
import '../../Message/context.js';
import '../../ui/AdminMessage.js';
import '../../ui/QuoteMessage.js';
import '../../chunks/bundle-NGtuBFFS.js';
import '../../chunks/bundle-p4vToXS1.js';
import '../../ui/ThreadReplies.js';
import '../../ui/OGMessageItemBody.js';
import '../../chunks/bundle-wKuesro0.js';
import '../../ui/MentionLabel.js';
import '../../ui/LinkLabel.js';
import '../../ui/TextMessageItemBody.js';
import '../../ui/FileMessageItemBody.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-jdHt0GId.js';
import '../../chunks/bundle-mMigBvPD.js';
import '../../chunks/bundle-2hneibdl.js';
import '@sendbird/uikit-tools';
import '../../ui/VoiceMessageItemBody.js';
import '../../ui/ProgressBar.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-JkSXeub7.js';
import '../../VoiceRecorder/context.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ThumbnailMessageItemBody.js';
import '../../ui/UnknownMessageItemBody.js';
import '../../ui/FeedbackIconButton.js';
import '../../ui/MobileFeedbackMenu.js';
import './MessageFeedbackModal.js';
import '../../ui/Input.js';
import '../../GroupChannel/components/SuggestedReplies.js';
import '../../chunks/bundle-Xqf5M3Yn.js';
import '../../chunks/bundle-cTgQo7nT.js';
import '../../chunks/bundle-0g_j3SgI.js';
import '../../chunks/bundle-9qb1BPMn.js';

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
