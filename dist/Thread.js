import React__default from 'react';
import { ThreadProvider } from './Thread/context.js';
import ThreadUI from './Thread/components/ThreadUI.js';
import './chunks/bundle-EHXBDBJS.js';
import './chunks/bundle-7BSf_PUT.js';
import './chunks/bundle-H77M-_wK.js';
import './chunks/bundle-UnAcr6wX.js';
import '@sendbird/chat/message';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-1CfFFBx9.js';
import './chunks/bundle-jDtVwIPR.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './Thread/context/types.js';
import '@sendbird/chat';
import './chunks/bundle-iWB7G7Jl.js';
import '@sendbird/chat/groupChannel';
import './chunks/bundle-0Kp88b8b.js';
import './chunks/bundle-_WuZnpi-.js';
import './chunks/bundle-hS8Jw8F1.js';
import './chunks/bundle-PIrj5Rm1.js';
import './chunks/bundle-8u3PnqsX.js';
import './chunks/bundle-_9Y5-6si.js';
import './chunks/bundle-ljRDDTki.js';
import './Thread/components/ParentMessageInfo.js';
import './chunks/bundle-ePTRDi6d.js';
import './chunks/bundle-zKLRntCV.js';
import './chunks/bundle--BlhOpUS.js';
import 'react-dom';
import './chunks/bundle-CRwhglru.js';
import './chunks/bundle-qlkGlvyT.js';
import './ui/IconButton.js';
import './ui/Button.js';
import './ui/Icon.js';
import './chunks/bundle-zcfKjxS7.js';
import './chunks/bundle-WrTlYypL.js';
import './chunks/bundle-UuydkZ4A.js';
import './Thread/components/ParentMessageInfoItem.js';
import './ui/ImageRenderer.js';
import './ui/TextButton.js';
import './chunks/bundle-02rQraFs.js';
import './ui/EmojiReactions.js';
import './ui/ReactionBadge.js';
import './ui/ReactionButton.js';
import './chunks/bundle-okHpD60h.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './ui/BottomSheet.js';
import './hooks/useModal.js';
import './ui/UserListItem.js';
import './chunks/bundle-LbQw2cVx.js';
import './chunks/bundle-fNigAmmf.js';
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
import './chunks/bundle-r7HG_ptO.js';
import './VoiceRecorder/context.js';
import './ui/PlaybackTime.js';
import './ui/Loader.js';
import './chunks/bundle-1q5AhvE7.js';
import './chunks/bundle-coC6nc_5.js';
import './ui/MentionLabel.js';
import './ui/LinkLabel.js';
import './chunks/bundle-2C9iP99S.js';
import './chunks/bundle-YfeG6LQ5.js';
import './chunks/bundle-KL4mvVMo.js';
import '@sendbird/uikit-tools';
import './chunks/bundle-inBt684F.js';
import './chunks/bundle-P_s1ZfLh.js';
import './chunks/bundle-VwofrwBu.js';
import './chunks/bundle--NfXT-0k.js';
import './chunks/bundle-NK74hfcu.js';
import './ui/MessageItemMenu.js';
import './chunks/bundle-AGNrfX7p.js';
import './ui/MessageItemReactionMenu.js';
import './ui/MessageInput.js';
import './chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import './chunks/bundle-v7DbCTsH.js';
import './chunks/bundle-BInhYJCq.js';
import './chunks/bundle-D_x1OSEQ.js';
import './chunks/bundle-Z-iEmjEQ.js';
import './Message/hooks/useDirtyGetMentions.js';
import './Thread/components/ThreadHeader.js';
import './Thread/components/ThreadList.js';
import './Thread/components/ThreadListItem.js';
import './ui/DateSeparator.js';
import './chunks/bundle-FTNAU8Uq.js';
import './chunks/bundle-uq2crLI0.js';
import './chunks/bundle-6_aRz_Ld.js';
import './ui/TextMessageItemBody.js';
import './ui/OGMessageItemBody.js';
import './ui/FileMessageItemBody.js';
import './ui/ThumbnailMessageItemBody.js';
import './chunks/bundle-S6OaNh10.js';
import './ui/UnknownMessageItemBody.js';
import './Channel/utils/compareMessagesForGrouping.js';
import 'date-fns';
import './Thread/components/ThreadMessageInput.js';
import './chunks/bundle-RbS_k--P.js';
import './chunks/bundle-7nLQi_YH.js';
import './GroupChannel/components/SuggestedMentionList.js';
import './ui/QuoteMessageInput.js';
import './VoiceRecorder/useVoiceRecorder.js';
import './chunks/bundle-Syx3NAbT.js';
import './GroupChannel/hooks/useHandleUploadFiles.js';
import './chunks/bundle-QJa2lTJw.js';
import './GroupChannel/context.js';
import './chunks/bundle-XFxecIn0.js';
import './chunks/bundle-iU7PXFos.js';
import './chunks/bundle-WFlcI9AO.js';
import './chunks/bundle-6aMfjTWv.js';
import './chunks/bundle-_6EZcp4H.js';
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
