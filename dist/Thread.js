import React__default from 'react';
import { ThreadProvider } from './Thread/context.js';
import ThreadUI from './Thread/components/ThreadUI.js';
import './chunks/bundle-DJdbc2nP.js';
import './chunks/bundle-THTV9S18.js';
import './chunks/bundle-fO5XIU5Y.js';
import './chunks/bundle-KMsJXUN2.js';
import '@sendbird/chat/message';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-AFXr5NmI.js';
import './chunks/bundle-x78eEPy7.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './Thread/context/types.js';
import '@sendbird/chat';
import './chunks/bundle-Vkdvpta0.js';
import '@sendbird/chat/groupChannel';
import './chunks/bundle-4_6x-RiC.js';
import './chunks/bundle-xlx3bBW8.js';
import './chunks/bundle-msnuMA4R.js';
import './chunks/bundle-Tg3CrpQU.js';
import './chunks/bundle-CsWYoRVd.js';
import './chunks/bundle-YvC6HhRC.js';
import './chunks/bundle-kMMCn6GE.js';
import './Thread/components/ParentMessageInfo.js';
import './chunks/bundle-vbGNKQpe.js';
import './chunks/bundle-kzKqUU0b.js';
import './chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import './chunks/bundle-7YRb7CRq.js';
import './chunks/bundle-ZTmwWu_-.js';
import './ui/IconButton.js';
import './ui/Button.js';
import './ui/Icon.js';
import './chunks/bundle-pZ049TQg.js';
import './chunks/bundle-ZnLsMTHr.js';
import './chunks/bundle-LZemF1A7.js';
import './Thread/components/ParentMessageInfoItem.js';
import './ui/ImageRenderer.js';
import './ui/TextButton.js';
import './chunks/bundle-nGuCRoDK.js';
import './ui/EmojiReactions.js';
import './ui/ReactionBadge.js';
import './ui/ReactionButton.js';
import './chunks/bundle-3iFqiLDd.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './ui/BottomSheet.js';
import './hooks/useModal.js';
import './ui/UserListItem.js';
import './chunks/bundle-OJq071GK.js';
import './chunks/bundle-DhS-f2ZT.js';
import './ui/MutedAvatarOverlay.js';
import './ui/Checkbox.js';
import './ui/UserProfile.js';
import './sendbirdSelectors.js';
import './ui/Tooltip.js';
import './ui/TooltipWrapper.js';
import './Message/context.js';
import './ui/VoiceMessageItemBody.js';
import './ui/ProgressBar.js';
import './VoicePlayer/useVoicePlayer.js';
import './chunks/bundle-8TMXvllw.js';
import './VoiceRecorder/context.js';
import './ui/PlaybackTime.js';
import './ui/Loader.js';
import './chunks/bundle-AjBmMBJ5.js';
import './chunks/bundle-pODFB39J.js';
import './ui/MentionLabel.js';
import './ui/LinkLabel.js';
import './chunks/bundle-pWK0f3qD.js';
import './chunks/bundle-13MqUbIu.js';
import './chunks/bundle-HUsfnqzD.js';
import '@sendbird/uikit-tools';
import './chunks/bundle-ay4_3U9k.js';
import './chunks/bundle-6HzeOqth.js';
import './chunks/bundle-CLnDoxQc.js';
import './chunks/bundle-hKmRj7Ck.js';
import './chunks/bundle-NOh3ukH6.js';
import './ui/MessageItemMenu.js';
import './chunks/bundle-lJ2SrsKF.js';
import './ui/MessageItemReactionMenu.js';
import './ui/MessageInput.js';
import './chunks/bundle-1uBgZh_D.js';
import 'dompurify';
import './chunks/bundle-qauKidkr.js';
import './chunks/bundle-wf7f-9LT.js';
import './chunks/bundle-cMznkLt0.js';
import './chunks/bundle-m-u0cD67.js';
import './Message/hooks/useDirtyGetMentions.js';
import './Thread/components/ThreadHeader.js';
import './Thread/components/ThreadList.js';
import './Thread/components/ThreadListItem.js';
import './ui/DateSeparator.js';
import './chunks/bundle-GQ4rK0ER.js';
import './chunks/bundle-vWrgNSvP.js';
import './chunks/bundle-SpfAN5pr.js';
import './ui/TextMessageItemBody.js';
import './ui/OGMessageItemBody.js';
import './ui/FileMessageItemBody.js';
import './ui/ThumbnailMessageItemBody.js';
import './chunks/bundle--jWawO0i.js';
import './ui/UnknownMessageItemBody.js';
import './Channel/utils/compareMessagesForGrouping.js';
import 'date-fns';
import './Thread/components/ThreadMessageInput.js';
import './chunks/bundle-zv656l7I.js';
import './chunks/bundle-38Dx0S9V.js';
import './GroupChannel/components/SuggestedMentionList.js';
import './ui/QuoteMessageInput.js';
import './VoiceRecorder/useVoiceRecorder.js';
import './chunks/bundle-M3g0UgDk.js';
import './GroupChannel/hooks/useHandleUploadFiles.js';
import './chunks/bundle-J4Twjc27.js';
import './GroupChannel/context.js';
import './chunks/bundle-TLAngIsc.js';
import './chunks/bundle-4Q6J8UBD.js';
import './chunks/bundle-lPKA2RTf.js';
import './chunks/bundle-JMVaVraV.js';
import './chunks/bundle-i4OMePA5.js';
import './Channel/hooks/useHandleUploadFiles.js';
import './ui/PlaceHolder.js';

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
    return (React__default.createElement("div", { className: "sendbird-thread ".concat(className) },
        React__default.createElement(ThreadProvider, { channelUrl: channelUrl, message: message, onHeaderActionClick: onHeaderActionClick, onMoveToParentMessage: onMoveToParentMessage, onBeforeSendUserMessage: onBeforeSendUserMessage, onBeforeSendFileMessage: onBeforeSendFileMessage, onBeforeSendVoiceMessage: onBeforeSendVoiceMessage, onBeforeSendMultipleFilesMessage: onBeforeSendMultipleFilesMessage, isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled },
            React__default.createElement(ThreadUI, { renderHeader: renderHeader, renderParentMessageInfo: renderParentMessageInfo, renderMessage: renderMessage, renderMessageInput: renderMessageInput, renderCustomSeparator: renderCustomSeparator, renderParentMessageInfoPlaceholder: renderParentMessageInfoPlaceholder, renderThreadListPlaceHolder: renderThreadListPlaceHolder, renderFileUploadIcon: renderFileUploadIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, renderSendMessageIcon: renderSendMessageIcon }))));
};

export { Thread as default };
//# sourceMappingURL=Thread.js.map
