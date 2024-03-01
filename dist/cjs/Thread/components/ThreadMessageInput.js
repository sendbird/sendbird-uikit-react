'use strict';

var _tslib = require('../../chunks/bundle-2dG9SU7T.js');
var React = require('react');
var groupChannel = require('@sendbird/chat/groupChannel');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var MediaQueryContext = require('../../chunks/bundle-MZHOyRuu.js');
var Thread_context = require('../context.js');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var ui_MessageInput = require('../../ui/MessageInput.js');
var _const = require('../../chunks/bundle-m-c1V2jE.js');
var SuggestedMentionList = require('../../chunks/bundle-Zp3OkE8e.js');
var MessageInputWrapperView = require('../../chunks/bundle-ANsbY5YP.js');
require('../../GroupChannel/context.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-wzulmlgb.js');
var types = require('../../chunks/bundle-a0KHaUDZ.js');
var Message_hooks_useDirtyGetMentions = require('../../Message/hooks/useDirtyGetMentions.js');
var Channel_hooks_useHandleUploadFiles = require('../../Channel/hooks/useHandleUploadFiles.js');
var utils = require('../../chunks/bundle-eDrjbSc-.js');
require('../../withSendbird.js');
require('../../chunks/bundle-xgiAxHSr.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../context/types.js');
require('@sendbird/chat');
require('../../chunks/bundle-XgxbsHav.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('@sendbird/chat/message');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../chunks/bundle-jh--qeoy.js');
require('dompurify');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-q13fOZ_V.js');
require('../../chunks/bundle-TCEkQl9R.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-Q2J-7okW.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-isZYiJlA.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../chunks/bundle-MGhVSK7j.js');
require('../../GroupChannel/components/SuggestedMentionList.js');
require('../../ui/QuoteMessageInput.js');
require('../../chunks/bundle-38g4arE5.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-C8zLDVXs.js');
require('../../VoiceRecorder/context.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../VoiceRecorder/useVoiceRecorder.js');
require('../../chunks/bundle-1LKSecgr.js');
require('../../ui/PlaybackTime.js');
require('../../ui/ProgressBar.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-KNt569rP.js');
require('../../GroupChannel/hooks/useHandleUploadFiles.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-Z1BkfIY5.js');
require('../../chunks/bundle-U874nqiD.js');
require('../../chunks/bundle-2Ou4ZIu0.js');
require('../../chunks/bundle-A90WNbHn.js');
require('../../chunks/bundle-Gu74ZSrJ.js');
require('../../chunks/bundle-4TXS0UcW.js');

var ThreadMessageInput = function (props, ref) {
    var _a;
    var className = props.className, renderFileUploadIcon = props.renderFileUploadIcon, renderVoiceMessageIcon = props.renderVoiceMessageIcon, renderSendMessageIcon = props.renderSendMessageIcon, acceptableMimeTypes = props.acceptableMimeTypes;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var isMentionEnabled = config.isMentionEnabled, isOnline = config.isOnline, userMention = config.userMention, isVoiceMessageEnabled = config.isVoiceMessageEnabled, logger = config.logger;
    var threadContext = Thread_context.useThreadContext();
    var currentChannel = threadContext.currentChannel, parentMessage = threadContext.parentMessage, sendMessage = threadContext.sendMessage, sendFileMessage = threadContext.sendFileMessage, sendVoiceMessage = threadContext.sendVoiceMessage, sendMultipleFilesMessage = threadContext.sendMultipleFilesMessage, isMuted = threadContext.isMuted, isChannelFrozen = threadContext.isChannelFrozen, allThreadMessages = threadContext.allThreadMessages;
    var messageInputRef = React.useRef();
    var isMultipleFilesMessageEnabled = ((_a = threadContext.isMultipleFilesMessageEnabled) !== null && _a !== void 0 ? _a : config.isMultipleFilesMessageEnabled);
    var threadInputDisabled = props.disabled
        || !isOnline
        || isMuted
        || (!((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === types.Role.OPERATOR) && isChannelFrozen) || parentMessage === null;
    // MFM
    var handleUploadFiles = Channel_hooks_useHandleUploadFiles.useHandleUploadFiles({
        sendFileMessage: sendFileMessage,
        sendMultipleFilesMessage: sendMultipleFilesMessage,
        quoteMessage: parentMessage,
    }, {
        logger: logger,
    });
    // mention
    var _b = React.useState(''), mentionNickname = _b[0], setMentionNickname = _b[1];
    var _c = React.useState([]), mentionedUsers = _c[0], setMentionedUsers = _c[1];
    var _d = React.useState([]), mentionedUserIds = _d[0], setMentionedUserIds = _d[1];
    var _e = React.useState(null), selectedUser = _e[0], setSelectedUser = _e[1];
    var _f = React.useState([]), mentionSuggestedUsers = _f[0], setMentionSuggestedUsers = _f[1];
    var _g = React.useState(null), messageInputEvent = _g[0], setMessageInputEvent = _g[1];
    var _h = React.useState(false), showVoiceMessageInput = _h[0], setShowVoiceMessageInput = _h[1];
    var displaySuggestedMentionList = isOnline
        && isMentionEnabled
        && mentionNickname.length > 0
        && !utils.isDisabledBecauseFrozen(currentChannel)
        && !utils.isDisabledBecauseMuted(currentChannel)
        && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast);
    // Reset when changing channel
    React.useEffect(function () {
        setShowVoiceMessageInput(false);
    }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
    var mentionNodes = Message_hooks_useDirtyGetMentions.useDirtyGetMentions({ ref: ref || messageInputRef }, { logger: logger });
    var ableMention = (mentionNodes === null || mentionNodes === void 0 ? void 0 : mentionNodes.length) < (userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount);
    React.useEffect(function () {
        setMentionedUsers(mentionedUsers.filter(function (_a) {
            var userId = _a.userId;
            var i = mentionedUserIds.indexOf(userId);
            if (i < 0) {
                return false;
            }
            else {
                mentionedUserIds.splice(i, 1);
                return true;
            }
        }));
    }, [mentionedUserIds]);
    if ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast) && (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) !== types.Role.OPERATOR) {
        return null;
    }
    return (React.createElement("div", { className: "sendbird-thread-message-input".concat(showVoiceMessageInput ? '--voice-message' : '', " ").concat(className) },
        displaySuggestedMentionList && (React.createElement(SuggestedMentionList.SuggestedMentionList, { targetNickname: mentionNickname, inputEvent: messageInputEvent, 
            // renderUserMentionItem={renderUserMentionItem}
            onUserItemClick: function (user) {
                if (user) {
                    setMentionedUsers(_tslib.__spreadArray(_tslib.__spreadArray([], mentionedUsers, true), [user], false));
                }
                setMentionNickname('');
                setSelectedUser(user);
                setMessageInputEvent(null);
            }, onFocusItemChange: function () {
                setMessageInputEvent(null);
            }, onFetchUsers: function (users) {
                setMentionSuggestedUsers(users);
            }, ableAddMention: ableMention, maxMentionCount: userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount, maxSuggestionCount: userMention === null || userMention === void 0 ? void 0 : userMention.maxSuggestionCount })),
        showVoiceMessageInput
            ? (React.createElement(MessageInputWrapperView.VoiceMessageInputWrapper, { channel: currentChannel, onSubmitClick: function (recordedFile, duration) {
                    sendVoiceMessage(recordedFile, duration, parentMessage);
                    setShowVoiceMessageInput(false);
                }, onCancelClick: function () {
                    setShowVoiceMessageInput(false);
                } }))
            : (React.createElement(ui_MessageInput, { className: "sendbird-thread-message-input__message-input", messageFieldId: "sendbird-message-input-text-field--thread", channel: currentChannel, channelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url, isMobile: isMobile, disabled: threadInputDisabled, acceptableMimeTypes: acceptableMimeTypes, setMentionedUsers: setMentionedUsers, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, isVoiceMessageEnabled: isVoiceMessageEnabled, isSelectingMultipleFilesEnabled: isMultipleFilesMessageEnabled, onVoiceMessageIconClick: function () {
                    setShowVoiceMessageInput(true);
                }, renderFileUploadIcon: renderFileUploadIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, renderSendMessageIcon: renderSendMessageIcon, ref: ref || messageInputRef, placeholder: ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isFrozen) && !((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === types.Role.OPERATOR) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
                    || ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myMutedState) === groupChannel.MutedState.MUTED && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT)
                    || (allThreadMessages.length > 0
                        ? stringSet.THREAD__INPUT__REPLY_TO_THREAD
                        : stringSet.THREAD__INPUT__REPLY_IN_THREAD), onStartTyping: function () {
                    var _a;
                    (_a = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.startTyping) === null || _a === void 0 ? void 0 : _a.call(currentChannel);
                }, onSendMessage: function (_a) {
                    var _b;
                    var message = _a.message, mentionTemplate = _a.mentionTemplate;
                    sendMessage({
                        message: message,
                        mentionedUsers: mentionedUsers,
                        mentionTemplate: mentionTemplate,
                        quoteMessage: parentMessage,
                    });
                    setMentionNickname('');
                    setMentionedUsers([]);
                    (_b = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.endTyping) === null || _b === void 0 ? void 0 : _b.call(currentChannel);
                }, onFileUpload: handleUploadFiles, onUserMentioned: function (user) {
                    if ((selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.userId) === (user === null || user === void 0 ? void 0 : user.userId)) {
                        setSelectedUser(null);
                        setMentionNickname('');
                    }
                }, onMentionStringChange: function (mentionText) {
                    setMentionNickname(mentionText);
                }, onMentionedUserIdsUpdated: function (userIds) {
                    setMentionedUserIds(userIds);
                }, onKeyDown: function (e) {
                    if (displaySuggestedMentionList && (mentionSuggestedUsers === null || mentionSuggestedUsers === void 0 ? void 0 : mentionSuggestedUsers.length) > 0
                        && ((e.key === _const.MessageInputKeys.Enter && ableMention) || e.key === _const.MessageInputKeys.ArrowUp || e.key === _const.MessageInputKeys.ArrowDown)) {
                        setMessageInputEvent(e);
                        return true;
                    }
                    return false;
                } }))));
};
var ThreadMessageInput$1 = React.forwardRef(ThreadMessageInput);

module.exports = ThreadMessageInput$1;
//# sourceMappingURL=ThreadMessageInput.js.map
