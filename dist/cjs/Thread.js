'use strict';

var React = require('react');
var Thread_context = require('./Thread/context.js');
var Thread_components_ThreadUI = require('./Thread/components/ThreadUI.js');
require('./chunks/bundle-Q5GNNUqM.js');
require('./chunks/bundle-VqRllkVd.js');
require('./chunks/bundle-6xWNZugu.js');
require('./chunks/bundle-xbdnJE9-.js');
require('@sendbird/chat/message');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-Atn5EZwu.js');
require('./chunks/bundle-uzKywAVp.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./Thread/context/types.js');
require('@sendbird/chat');
require('./chunks/bundle-a7LVpeCR.js');
require('@sendbird/chat/groupChannel');
require('./chunks/bundle-SOIkTCep.js');
require('./chunks/bundle-kLoWlyQs.js');
require('./chunks/bundle-WKa05h0_.js');
require('./chunks/bundle-Yzhiyr0t.js');
require('./chunks/bundle-HY8cubCp.js');
require('./chunks/bundle-ZXiz-rp_.js');
require('./chunks/bundle-KkCwxjVN.js');
require('./Thread/components/ParentMessageInfo.js');
require('./chunks/bundle-KOig1nUx.js');
require('./chunks/bundle-Wt6H25kL.js');
require('./chunks/bundle-6hGNMML2.js');
require('react-dom');
require('./chunks/bundle-jCTpndN0.js');
require('./chunks/bundle-4WvE40Un.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./ui/Icon.js');
require('./chunks/bundle-gOYUXAiI.js');
require('./chunks/bundle-Uw6P-cM9.js');
require('./chunks/bundle-tNuJSOqI.js');
require('./Thread/components/ParentMessageInfoItem.js');
require('./ui/ImageRenderer.js');
require('./ui/TextButton.js');
require('./chunks/bundle-0uk8Bfy0.js');
require('./ui/EmojiReactions.js');
require('./ui/ReactionBadge.js');
require('./ui/ReactionButton.js');
require('./chunks/bundle-pOf7PZ4G.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./ui/BottomSheet.js');
require('./hooks/useModal.js');
require('./ui/UserListItem.js');
require('./chunks/bundle--jUKLwRX.js');
require('./chunks/bundle-kftX5Dbs.js');
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
require('./chunks/bundle-jXnX-7jH.js');
require('./VoiceRecorder/context.js');
require('./ui/PlaybackTime.js');
require('./ui/Loader.js');
require('./chunks/bundle-DqKLlsGU.js');
require('./chunks/bundle-2_j4r1Cc.js');
require('./ui/MentionLabel.js');
require('./ui/LinkLabel.js');
require('./chunks/bundle-wezC76id.js');
require('./chunks/bundle-s5WIvT8N.js');
require('./chunks/bundle-noP7JXqE.js');
require('@sendbird/uikit-tools');
require('./chunks/bundle-JLP3WF2h.js');
require('./chunks/bundle-vs1IDbbN.js');
require('./chunks/bundle-rYFzQpzQ.js');
require('./chunks/bundle-pi-jk3re.js');
require('./chunks/bundle-ZK5PhDxY.js');
require('./ui/MessageItemMenu.js');
require('./chunks/bundle-K3wEmKTu.js');
require('./ui/MessageItemReactionMenu.js');
require('./ui/MessageInput.js');
require('./chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('./chunks/bundle-h9YDQxpQ.js');
require('./chunks/bundle-fqNhuMna.js');
require('./chunks/bundle-yk__vyz_.js');
require('./chunks/bundle-m5pFb_tZ.js');
require('./Message/hooks/useDirtyGetMentions.js');
require('./Thread/components/ThreadHeader.js');
require('./Thread/components/ThreadList.js');
require('./Thread/components/ThreadListItem.js');
require('./ui/DateSeparator.js');
require('./chunks/bundle-VehpyAT7.js');
require('./chunks/bundle-_wF3sJvp.js');
require('./chunks/bundle-iPt3h7ba.js');
require('./ui/TextMessageItemBody.js');
require('./ui/OGMessageItemBody.js');
require('./ui/FileMessageItemBody.js');
require('./ui/ThumbnailMessageItemBody.js');
require('./chunks/bundle--4Ob_RGQ.js');
require('./ui/UnknownMessageItemBody.js');
require('./Channel/utils/compareMessagesForGrouping.js');
require('date-fns');
require('./Thread/components/ThreadMessageInput.js');
require('./chunks/bundle-Xa3hXyhu.js');
require('./chunks/bundle-U2YYVRfT.js');
require('./GroupChannel/components/SuggestedMentionList.js');
require('./ui/QuoteMessageInput.js');
require('./VoiceRecorder/useVoiceRecorder.js');
require('./chunks/bundle-pKCe2hVu.js');
require('./GroupChannel/hooks/useHandleUploadFiles.js');
require('./chunks/bundle-a5LHhP6m.js');
require('./GroupChannel/context.js');
require('./chunks/bundle-H29alxvs.js');
require('./chunks/bundle-MK0CJsqZ.js');
require('./chunks/bundle-48AiK3oz.js');
require('./chunks/bundle-Zw2P8RwZ.js');
require('./chunks/bundle-2xXFQXmk.js');
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
