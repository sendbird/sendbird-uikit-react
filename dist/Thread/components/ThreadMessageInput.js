import { c as __spreadArray } from '../../chunks/bundle-UnAcr6wX.js';
import React__default, { useRef, useState, useEffect } from 'react';
import { MutedState } from '@sendbird/chat/groupChannel';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useMediaQueryContext } from '../../chunks/bundle-qlkGlvyT.js';
import { useThreadContext } from '../context.js';
import { u as useLocalization } from '../../chunks/bundle-hS8Jw8F1.js';
import MessageInput from '../../ui/MessageInput.js';
import { M as MessageInputKeys } from '../../chunks/bundle-NK74hfcu.js';
import { S as SuggestedMentionList } from '../../chunks/bundle-P_s1ZfLh.js';
import { V as VoiceMessageInputWrapper } from '../../chunks/bundle-RbS_k--P.js';
import '../../GroupChannel/context.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-WrTlYypL.js';
import { R as Role } from '../../chunks/bundle-AGNrfX7p.js';
import { useDirtyGetMentions } from '../../Message/hooks/useDirtyGetMentions.js';
import { useHandleUploadFiles } from '../../Channel/hooks/useHandleUploadFiles.js';
import { a as isDisabledBecauseFrozen, b as isDisabledBecauseMuted } from '../../chunks/bundle-H77M-_wK.js';
import '../../withSendbird.js';
import '../../chunks/bundle-EHXBDBJS.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-jDtVwIPR.js';
import '../context/types.js';
import '@sendbird/chat';
import '../../chunks/bundle-iWB7G7Jl.js';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-_WuZnpi-.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle--NfXT-0k.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../chunks/bundle-i3GNeBO2.js';
import 'dompurify';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-BInhYJCq.js';
import '../../chunks/bundle-D_x1OSEQ.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-CRwhglru.js';
import '../../chunks/bundle-coC6nc_5.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../chunks/bundle-VwofrwBu.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../chunks/bundle-7nLQi_YH.js';
import '../../GroupChannel/components/SuggestedMentionList.js';
import '../../ui/QuoteMessageInput.js';
import '../../chunks/bundle-S6OaNh10.js';
import '../../VoicePlayer/useVoicePlayer.js';
import '../../chunks/bundle-r7HG_ptO.js';
import '../../VoiceRecorder/context.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../VoiceRecorder/useVoiceRecorder.js';
import '../../chunks/bundle-Syx3NAbT.js';
import '../../ui/PlaybackTime.js';
import '../../ui/ProgressBar.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../GroupChannel/hooks/useHandleUploadFiles.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-QJa2lTJw.js';
import '../../chunks/bundle-XFxecIn0.js';
import '../../chunks/bundle-iU7PXFos.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../chunks/bundle-_6EZcp4H.js';

var ThreadMessageInput = function (props, ref) {
    var _a;
    var className = props.className, renderFileUploadIcon = props.renderFileUploadIcon, renderVoiceMessageIcon = props.renderVoiceMessageIcon, renderSendMessageIcon = props.renderSendMessageIcon, acceptableMimeTypes = props.acceptableMimeTypes;
    var config = useSendbirdStateContext().config;
    var isMobile = useMediaQueryContext().isMobile;
    var stringSet = useLocalization().stringSet;
    var isMentionEnabled = config.isMentionEnabled, isOnline = config.isOnline, userMention = config.userMention, isVoiceMessageEnabled = config.isVoiceMessageEnabled, logger = config.logger;
    var threadContext = useThreadContext();
    var currentChannel = threadContext.currentChannel, parentMessage = threadContext.parentMessage, sendMessage = threadContext.sendMessage, sendFileMessage = threadContext.sendFileMessage, sendVoiceMessage = threadContext.sendVoiceMessage, sendMultipleFilesMessage = threadContext.sendMultipleFilesMessage, isMuted = threadContext.isMuted, isChannelFrozen = threadContext.isChannelFrozen, allThreadMessages = threadContext.allThreadMessages;
    var messageInputRef = useRef();
    var isMultipleFilesMessageEnabled = ((_a = threadContext.isMultipleFilesMessageEnabled) !== null && _a !== void 0 ? _a : config.isMultipleFilesMessageEnabled);
    var threadInputDisabled = props.disabled
        || !isOnline
        || isMuted
        || (!((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === Role.OPERATOR) && isChannelFrozen) || parentMessage === null;
    // MFM
    var handleUploadFiles = useHandleUploadFiles({
        sendFileMessage: sendFileMessage,
        sendMultipleFilesMessage: sendMultipleFilesMessage,
        quoteMessage: parentMessage,
    }, {
        logger: logger,
    });
    // mention
    var _b = useState(''), mentionNickname = _b[0], setMentionNickname = _b[1];
    var _c = useState([]), mentionedUsers = _c[0], setMentionedUsers = _c[1];
    var _d = useState([]), mentionedUserIds = _d[0], setMentionedUserIds = _d[1];
    var _e = useState(null), selectedUser = _e[0], setSelectedUser = _e[1];
    var _f = useState([]), mentionSuggestedUsers = _f[0], setMentionSuggestedUsers = _f[1];
    var _g = useState(null), messageInputEvent = _g[0], setMessageInputEvent = _g[1];
    var _h = useState(false), showVoiceMessageInput = _h[0], setShowVoiceMessageInput = _h[1];
    var displaySuggestedMentionList = isOnline
        && isMentionEnabled
        && mentionNickname.length > 0
        && !isDisabledBecauseFrozen(currentChannel)
        && !isDisabledBecauseMuted(currentChannel)
        && !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast);
    // Reset when changing channel
    useEffect(function () {
        setShowVoiceMessageInput(false);
    }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
    var mentionNodes = useDirtyGetMentions({ ref: ref || messageInputRef }, { logger: logger });
    var ableMention = (mentionNodes === null || mentionNodes === void 0 ? void 0 : mentionNodes.length) < (userMention === null || userMention === void 0 ? void 0 : userMention.maxMentionCount);
    useEffect(function () {
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
    if ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast) && (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) !== Role.OPERATOR) {
        return null;
    }
    return (React__default.createElement("div", { className: "sendbird-thread-message-input".concat(showVoiceMessageInput ? '--voice-message' : '', " ").concat(className) },
        displaySuggestedMentionList && (React__default.createElement(SuggestedMentionList, { targetNickname: mentionNickname, inputEvent: messageInputEvent, 
            // renderUserMentionItem={renderUserMentionItem}
            onUserItemClick: function (user) {
                if (user) {
                    setMentionedUsers(__spreadArray(__spreadArray([], mentionedUsers, true), [user], false));
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
            ? (React__default.createElement(VoiceMessageInputWrapper, { channel: currentChannel, onSubmitClick: function (recordedFile, duration) {
                    sendVoiceMessage(recordedFile, duration, parentMessage);
                    setShowVoiceMessageInput(false);
                }, onCancelClick: function () {
                    setShowVoiceMessageInput(false);
                } }))
            : (React__default.createElement(MessageInput, { className: "sendbird-thread-message-input__message-input", messageFieldId: "sendbird-message-input-text-field--thread", channel: currentChannel, channelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url, isMobile: isMobile, disabled: threadInputDisabled, acceptableMimeTypes: acceptableMimeTypes, setMentionedUsers: setMentionedUsers, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, isVoiceMessageEnabled: isVoiceMessageEnabled, isSelectingMultipleFilesEnabled: isMultipleFilesMessageEnabled, onVoiceMessageIconClick: function () {
                    setShowVoiceMessageInput(true);
                }, renderFileUploadIcon: renderFileUploadIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, renderSendMessageIcon: renderSendMessageIcon, ref: ref || messageInputRef, placeholder: ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isFrozen) && !((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === Role.OPERATOR) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
                    || ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myMutedState) === MutedState.MUTED && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT)
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
                        && ((e.key === MessageInputKeys.Enter && ableMention) || e.key === MessageInputKeys.ArrowUp || e.key === MessageInputKeys.ArrowDown)) {
                        setMessageInputEvent(e);
                        return true;
                    }
                    return false;
                } }))));
};
var ThreadMessageInput$1 = React__default.forwardRef(ThreadMessageInput);

export { ThreadMessageInput$1 as default };
//# sourceMappingURL=ThreadMessageInput.js.map
