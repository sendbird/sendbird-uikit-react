'use strict';

var React = require('react');
var Thread_context = require('./Thread/context.js');
var Thread_components_ThreadUI = require('./Thread/components/ThreadUI.js');
require('./chunks/bundle-uyZV0VMO.js');
require('./chunks/bundle-NfUcey5s.js');
require('./chunks/bundle-CPnHexJQ.js');
require('./chunks/bundle-zYqQA3cT.js');
require('@sendbird/chat/message');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-4jVvOUfV.js');
require('./chunks/bundle-HnlcCy36.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./Thread/context/types.js');
require('@sendbird/chat');
require('./chunks/bundle-vxARP6GP.js');
require('@sendbird/chat/groupChannel');
require('./chunks/bundle-NNEanMqk.js');
require('./chunks/bundle-vmQPp-90.js');
require('./chunks/bundle-Nz6fSUye.js');
require('./chunks/bundle-xYV6cL9E.js');
require('./chunks/bundle-eyiJykZ-.js');
require('./chunks/bundle-uzP6MTD5.js');
require('./chunks/bundle-2Pq38lvD.js');
require('./Thread/components/ParentMessageInfo.js');
require('./chunks/bundle-T9gnzy2i.js');
require('./chunks/bundle-Z55ii8J-.js');
require('./chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('./chunks/bundle-Xwl4gw4D.js');
require('./chunks/bundle-37dz9yoi.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./ui/Icon.js');
require('./chunks/bundle-Ri0nZ4E4.js');
require('./chunks/bundle-bjSez2lv.js');
require('./chunks/bundle-8G36Z6Or.js');
require('./Thread/components/ParentMessageInfoItem.js');
require('./ui/ImageRenderer.js');
require('./ui/TextButton.js');
require('./chunks/bundle-oaDSLq17.js');
require('./ui/EmojiReactions.js');
require('./ui/ReactionBadge.js');
require('./ui/ReactionButton.js');
require('./chunks/bundle-l768-Ldg.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./ui/BottomSheet.js');
require('./hooks/useModal.js');
require('./ui/UserListItem.js');
require('./chunks/bundle-PoiZwjvJ.js');
require('./chunks/bundle-5mXB6h1C.js');
require('./ui/MutedAvatarOverlay.js');
require('./ui/Checkbox.js');
require('./ui/UserProfile.js');
require('./sendbirdSelectors.js');
require('./ui/Tooltip.js');
require('./ui/TooltipWrapper.js');
require('./Message/context.js');
require('./ui/VoiceMessageItemBody.js');
require('./ui/ProgressBar.js');
require('./VoicePlayer/useVoicePlayer.js');
require('./chunks/bundle-RZEbRa4M.js');
require('./VoiceRecorder/context.js');
require('./ui/PlaybackTime.js');
require('./ui/Loader.js');
require('./chunks/bundle-zswKzOJx.js');
require('./chunks/bundle-URV6GLmd.js');
require('./ui/MentionLabel.js');
require('./ui/LinkLabel.js');
require('./chunks/bundle-GJsJRUXc.js');
require('./chunks/bundle-9DG1byjg.js');
require('./chunks/bundle-mO4Gb6oX.js');
require('@sendbird/uikit-tools');
require('./chunks/bundle-M4WNZlHL.js');
require('./chunks/bundle-qjBqtuP3.js');
require('./chunks/bundle-QLdAEK3e.js');
require('./chunks/bundle-2FdL4aA6.js');
require('./chunks/bundle-Ka3VBiNF.js');
require('./ui/MessageItemMenu.js');
require('./chunks/bundle-qKiW2e44.js');
require('./ui/MessageItemReactionMenu.js');
require('./ui/MessageInput.js');
require('./chunks/bundle-vnNrprB3.js');
require('dompurify');
require('./chunks/bundle-suIvps1I.js');
require('./chunks/bundle-bXe-_rig.js');
require('./chunks/bundle-scYpz-Ln.js');
require('./chunks/bundle-Y93r8Xy_.js');
require('./Message/hooks/useDirtyGetMentions.js');
require('./Thread/components/ThreadHeader.js');
require('./Thread/components/ThreadList.js');
require('./Thread/components/ThreadListItem.js');
require('./ui/DateSeparator.js');
require('./chunks/bundle-vsw2g6d5.js');
require('./chunks/bundle-k4IOvwe9.js');
require('./chunks/bundle-r8DyENxy.js');
require('./ui/TextMessageItemBody.js');
require('./ui/OGMessageItemBody.js');
require('./ui/FileMessageItemBody.js');
require('./ui/ThumbnailMessageItemBody.js');
require('./chunks/bundle-Oijs10ng.js');
require('./ui/UnknownMessageItemBody.js');
require('./Channel/utils/compareMessagesForGrouping.js');
require('date-fns');
require('./Thread/components/ThreadMessageInput.js');
require('./chunks/bundle-T_i-7yWX.js');
require('./chunks/bundle-6wRNuySu.js');
require('./GroupChannel/components/SuggestedMentionList.js');
require('./ui/QuoteMessageInput.js');
require('./VoiceRecorder/useVoiceRecorder.js');
require('./chunks/bundle-S1jItXMj.js');
require('./GroupChannel/hooks/useHandleUploadFiles.js');
require('./chunks/bundle-izlAxQOw.js');
require('./GroupChannel/context.js');
require('./chunks/bundle-b-DMr0gw.js');
require('./chunks/bundle-5ucHJjT6.js');
require('./chunks/bundle-FgihvR5h.js');
require('./chunks/bundle-hWEZzs4y.js');
require('./chunks/bundle-6zBpI6FB.js');
require('./Channel/hooks/useHandleUploadFiles.js');
require('./ui/PlaceHolder.js');

var Thread = function (props) {
    var 
    // props
    className = props.className, 
    // ThreadProviderProps
    channelUrl = props.channelUrl, message = props.message, onHeaderActionClick = props.onHeaderActionClick, onMoveToParentMessage = props.onMoveToParentMessage, isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled, 
    // onBeforeSend~~~Message
    onBeforeSendUserMessage = props.onBeforeSendUserMessage, onBeforeSendFileMessage = props.onBeforeSendFileMessage, onBeforeSendVoiceMessage = props.onBeforeSendVoiceMessage, onBeforeSendMultipleFilesMessage = props.onBeforeSendMultipleFilesMessage, 
    // ThreadUIProps
    renderHeader = props.renderHeader, renderParentMessageInfo = props.renderParentMessageInfo, renderMessage = props.renderMessage, renderMessageInput = props.renderMessageInput, renderCustomSeparator = props.renderCustomSeparator, renderParentMessageInfoPlaceholder = props.renderParentMessageInfoPlaceholder, renderThreadListPlaceHolder = props.renderThreadListPlaceHolder, renderFileUploadIcon = props.renderFileUploadIcon, renderVoiceMessageIcon = props.renderVoiceMessageIcon, renderSendMessageIcon = props.renderSendMessageIcon;
    return (React.createElement("div", { className: "sendbird-thread ".concat(className) },
        React.createElement(Thread_context.ThreadProvider, { channelUrl: channelUrl, message: message, onHeaderActionClick: onHeaderActionClick, onMoveToParentMessage: onMoveToParentMessage, onBeforeSendUserMessage: onBeforeSendUserMessage, onBeforeSendFileMessage: onBeforeSendFileMessage, onBeforeSendVoiceMessage: onBeforeSendVoiceMessage, onBeforeSendMultipleFilesMessage: onBeforeSendMultipleFilesMessage, isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled },
            React.createElement(Thread_components_ThreadUI, { renderHeader: renderHeader, renderParentMessageInfo: renderParentMessageInfo, renderMessage: renderMessage, renderMessageInput: renderMessageInput, renderCustomSeparator: renderCustomSeparator, renderParentMessageInfoPlaceholder: renderParentMessageInfoPlaceholder, renderThreadListPlaceHolder: renderThreadListPlaceHolder, renderFileUploadIcon: renderFileUploadIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, renderSendMessageIcon: renderSendMessageIcon }))));
};

module.exports = Thread;
//# sourceMappingURL=Thread.js.map
