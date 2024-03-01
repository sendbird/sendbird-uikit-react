'use strict';

var React = require('react');
var Thread_context = require('./Thread/context.js');
var Thread_components_ThreadUI = require('./Thread/components/ThreadUI.js');
require('./chunks/bundle-xgiAxHSr.js');
require('./chunks/bundle-LutGJd7y.js');
require('./chunks/bundle-eDrjbSc-.js');
require('./chunks/bundle-2dG9SU7T.js');
require('@sendbird/chat/message');
require('./utils/message/getOutgoingMessageState.js');
require('./chunks/bundle-I79mHo_2.js');
require('./chunks/bundle-DKcL-93i.js');
require('./useSendbirdStateContext.js');
require('./withSendbird.js');
require('./Thread/context/types.js');
require('@sendbird/chat');
require('./chunks/bundle-XgxbsHav.js');
require('@sendbird/chat/groupChannel');
require('./chunks/bundle-Gzug-R-w.js');
require('./chunks/bundle-ZoEtk6Hz.js');
require('./chunks/bundle-60kIt9Rq.js');
require('./chunks/bundle-eH49AisR.js');
require('./chunks/bundle-gDA5XZ0C.js');
require('./chunks/bundle-sMN62IQs.js');
require('./chunks/bundle-26QzFMMl.js');
require('./Thread/components/ParentMessageInfo.js');
require('./chunks/bundle-Ny3NKw-X.js');
require('./chunks/bundle-ulZ-c4e6.js');
require('./chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('./chunks/bundle-QStqvuCY.js');
require('./chunks/bundle-MZHOyRuu.js');
require('./ui/IconButton.js');
require('./ui/Button.js');
require('./ui/Icon.js');
require('./chunks/bundle-_t5Ozfpd.js');
require('./chunks/bundle-wzulmlgb.js');
require('./chunks/bundle-3fb9w4KI.js');
require('./Thread/components/ParentMessageInfoItem.js');
require('./ui/ImageRenderer.js');
require('./ui/TextButton.js');
require('./chunks/bundle-KNt569rP.js');
require('./ui/EmojiReactions.js');
require('./ui/ReactionBadge.js');
require('./ui/ReactionButton.js');
require('./chunks/bundle-Kz-b8WGm.js');
require('./ui/ContextMenu.js');
require('./ui/SortByRow.js');
require('./ui/BottomSheet.js');
require('./hooks/useModal.js');
require('./ui/UserListItem.js');
require('./chunks/bundle-OfFu3N1i.js');
require('./chunks/bundle-uGaTvmsl.js');
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
require('./chunks/bundle-C8zLDVXs.js');
require('./VoiceRecorder/context.js');
require('./ui/PlaybackTime.js');
require('./ui/Loader.js');
require('./chunks/bundle-TSHHC3WX.js');
require('./chunks/bundle-Q2J-7okW.js');
require('./ui/MentionLabel.js');
require('./ui/LinkLabel.js');
require('./chunks/bundle-Oj0T8nIQ.js');
require('./chunks/bundle-x2xJziaA.js');
require('./chunks/bundle-A_ipX_Gf.js');
require('@sendbird/uikit-tools');
require('./chunks/bundle-FMwBmvVd.js');
require('./chunks/bundle-Zp3OkE8e.js');
require('./chunks/bundle-isZYiJlA.js');
require('./chunks/bundle-eBZWCIEU.js');
require('./chunks/bundle-m-c1V2jE.js');
require('./ui/MessageItemMenu.js');
require('./chunks/bundle-a0KHaUDZ.js');
require('./ui/MessageItemReactionMenu.js');
require('./ui/MessageInput.js');
require('./chunks/bundle-jh--qeoy.js');
require('dompurify');
require('./chunks/bundle-9O_6GMbC.js');
require('./chunks/bundle-q13fOZ_V.js');
require('./chunks/bundle-TCEkQl9R.js');
require('./chunks/bundle-VLUCx6pj.js');
require('./Message/hooks/useDirtyGetMentions.js');
require('./Thread/components/ThreadHeader.js');
require('./Thread/components/ThreadList.js');
require('./Thread/components/ThreadListItem.js');
require('./ui/DateSeparator.js');
require('./chunks/bundle-1dlTcCK5.js');
require('./chunks/bundle-Z1maM5mk.js');
require('./chunks/bundle-LQQkMjKl.js');
require('./ui/TextMessageItemBody.js');
require('./ui/OGMessageItemBody.js');
require('./ui/FileMessageItemBody.js');
require('./ui/ThumbnailMessageItemBody.js');
require('./chunks/bundle-38g4arE5.js');
require('./ui/UnknownMessageItemBody.js');
require('./Channel/utils/compareMessagesForGrouping.js');
require('date-fns');
require('./Thread/components/ThreadMessageInput.js');
require('./chunks/bundle-ANsbY5YP.js');
require('./chunks/bundle-MGhVSK7j.js');
require('./GroupChannel/components/SuggestedMentionList.js');
require('./ui/QuoteMessageInput.js');
require('./VoiceRecorder/useVoiceRecorder.js');
require('./chunks/bundle-1LKSecgr.js');
require('./GroupChannel/hooks/useHandleUploadFiles.js');
require('./chunks/bundle-Z1BkfIY5.js');
require('./GroupChannel/context.js');
require('./chunks/bundle-U874nqiD.js');
require('./chunks/bundle-2Ou4ZIu0.js');
require('./chunks/bundle-A90WNbHn.js');
require('./chunks/bundle-Gu74ZSrJ.js');
require('./chunks/bundle-4TXS0UcW.js');
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
