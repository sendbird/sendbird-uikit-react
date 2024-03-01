import React__default from 'react';
import { ThreadProvider } from './Thread/context.js';
import ThreadUI from './Thread/components/ThreadUI.js';
import './chunks/bundle-sZUcD6H6.js';
import './chunks/bundle-yarrTY_z.js';
import './chunks/bundle-LgR-0X7v.js';
import './chunks/bundle-xhjHZ041.js';
import '@sendbird/chat/message';
import './utils/message/getOutgoingMessageState.js';
import './chunks/bundle-UKdN0Ihw.js';
import './chunks/bundle-9GBao6H-.js';
import './useSendbirdStateContext.js';
import './withSendbird.js';
import './Thread/context/types.js';
import '@sendbird/chat';
import './chunks/bundle-4isra95J.js';
import '@sendbird/chat/groupChannel';
import './chunks/bundle-BZ3hPsJ8.js';
import './chunks/bundle-qPq2iACJ.js';
import './chunks/bundle-1inZXcUV.js';
import './chunks/bundle--MbN9aKT.js';
import './chunks/bundle-V_fO-GlK.js';
import './chunks/bundle-yo9mJeAv.js';
import './chunks/bundle-sR62lMVk.js';
import './Thread/components/ParentMessageInfo.js';
import './chunks/bundle-o-FVZr_e.js';
import './chunks/bundle-VcqF4vOu.js';
import './chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import './chunks/bundle-IDH-OOHE.js';
import './chunks/bundle-pjLq9qJd.js';
import './ui/IconButton.js';
import './ui/Button.js';
import './ui/Icon.js';
import './chunks/bundle-9qb1BPMn.js';
import './chunks/bundle-Jwc7mleJ.js';
import './chunks/bundle-AN6QCsUL.js';
import './Thread/components/ParentMessageInfoItem.js';
import './ui/ImageRenderer.js';
import './ui/TextButton.js';
import './chunks/bundle-nMxV4WMS.js';
import './ui/EmojiReactions.js';
import './ui/ReactionBadge.js';
import './ui/ReactionButton.js';
import './chunks/bundle-FgXHPuhY.js';
import './ui/ContextMenu.js';
import './ui/SortByRow.js';
import './ui/BottomSheet.js';
import './hooks/useModal.js';
import './ui/UserListItem.js';
import './chunks/bundle-VE0ige0C.js';
import './chunks/bundle-3a5xXUZv.js';
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
import './chunks/bundle-JkSXeub7.js';
import './VoiceRecorder/context.js';
import './ui/PlaybackTime.js';
import './ui/Loader.js';
import './chunks/bundle-wKuesro0.js';
import './chunks/bundle-IqjS0ok_.js';
import './ui/MentionLabel.js';
import './ui/LinkLabel.js';
import './chunks/bundle-jdHt0GId.js';
import './chunks/bundle-mMigBvPD.js';
import './chunks/bundle-2hneibdl.js';
import '@sendbird/uikit-tools';
import './chunks/bundle-6T5vB4lV.js';
import './chunks/bundle-u6vxbRWx.js';
import './chunks/bundle-Xqf5M3Yn.js';
import './chunks/bundle-tIdypo_v.js';
import './chunks/bundle-8RTviqdm.js';
import './ui/MessageItemMenu.js';
import './chunks/bundle-K3cm7JxF.js';
import './ui/MessageItemReactionMenu.js';
import './ui/MessageInput.js';
import './chunks/bundle-p0_Jj2xm.js';
import 'dompurify';
import './chunks/bundle-zp72gyE3.js';
import './chunks/bundle-kgn8HcWj.js';
import './chunks/bundle-_MABCkOp.js';
import './chunks/bundle-p4vToXS1.js';
import './Message/hooks/useDirtyGetMentions.js';
import './Thread/components/ThreadHeader.js';
import './Thread/components/ThreadList.js';
import './Thread/components/ThreadListItem.js';
import './ui/DateSeparator.js';
import './chunks/bundle-Vt_Z-0RJ.js';
import './chunks/bundle--WYMGSfi.js';
import './chunks/bundle-RfBkMeJ1.js';
import './ui/TextMessageItemBody.js';
import './ui/OGMessageItemBody.js';
import './ui/FileMessageItemBody.js';
import './ui/ThumbnailMessageItemBody.js';
import './chunks/bundle-NGtuBFFS.js';
import './ui/UnknownMessageItemBody.js';
import './Channel/utils/compareMessagesForGrouping.js';
import 'date-fns';
import './Thread/components/ThreadMessageInput.js';
import './chunks/bundle-nzfPi40W.js';
import './chunks/bundle-QzNkWqn-.js';
import './GroupChannel/components/SuggestedMentionList.js';
import './ui/QuoteMessageInput.js';
import './VoiceRecorder/useVoiceRecorder.js';
import './chunks/bundle-1AXEYxoC.js';
import './GroupChannel/hooks/useHandleUploadFiles.js';
import './chunks/bundle-FmRroF-I.js';
import './GroupChannel/context.js';
import './chunks/bundle-jbaxtoFd.js';
import './chunks/bundle-2FjmmgQK.js';
import './chunks/bundle-WP5dHmdm.js';
import './chunks/bundle-p0z4OS-3.js';
import './chunks/bundle-ycx-QBOb.js';
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
