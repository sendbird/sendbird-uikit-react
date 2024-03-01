import { c as __spreadArray } from './bundle-xhjHZ041.js';
import React__default, { useRef, useState, useEffect } from 'react';
import { i as isDisabledBecauseFrozen, a as isDisabledBecauseMuted } from './bundle-QzNkWqn-.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { u as useLocalization } from './bundle-1inZXcUV.js';
import { SuggestedMentionList } from '../GroupChannel/components/SuggestedMentionList.js';
import { useDirtyGetMentions } from '../Message/hooks/useDirtyGetMentions.js';
import QuoteMessageInput from '../ui/QuoteMessageInput.js';
import { useVoicePlayer } from '../VoicePlayer/useVoicePlayer.js';
import { useVoiceRecorder, VoiceRecorderStatus } from '../VoiceRecorder/useVoiceRecorder.js';
import { V as VoiceMessageInputStatus, a as VoiceMessageInput } from './bundle-1AXEYxoC.js';
import { M as Modal } from './bundle-ixiL_3Ds.js';
import Button, { ButtonTypes, ButtonSizes } from '../ui/Button.js';
import { f as VOICE_RECORDER_DEFAULT_MIN } from './bundle-UKdN0Ihw.js';
import { V as VOICE_PLAYER_STATUS } from './bundle-JkSXeub7.js';
import { u as uuidv4 } from './bundle-BZ3hPsJ8.js';
import MessageInput from '../ui/MessageInput.js';
import { u as useMediaQueryContext } from './bundle-pjLq9qJd.js';
import { M as MessageInputKeys } from './bundle-8RTviqdm.js';
import { useHandleUploadFiles } from '../GroupChannel/hooks/useHandleUploadFiles.js';

var VoiceMessageInputWrapper = function (_a) {
    var _b;
    var channel = _a.channel, onCancelClick = _a.onCancelClick, onSubmitClick = _a.onSubmitClick;
    var uuid = useRef(uuidv4()).current;
    var _c = useState(null), audioFile = _c[0], setAudioFile = _c[1];
    var _d = useState(VoiceMessageInputStatus.READY_TO_RECORD), voiceInputState = _d[0], setVoiceInputState = _d[1];
    var _e = useState(false), isSubmitted = _e[0], setSubmit = _e[1];
    var _f = useState(false), isDisabled = _f[0], setDisabled = _f[1];
    var _g = useState(false), showModal = _g[0], setShowModal = _g[1];
    var stringSet = useLocalization().stringSet;
    var config = useSendbirdStateContext().config;
    var minRecordingTime = ((_b = config === null || config === void 0 ? void 0 : config.voiceRecord) === null || _b === void 0 ? void 0 : _b.minRecordingTime) || VOICE_RECORDER_DEFAULT_MIN;
    var _h = useVoiceRecorder({
        onRecordingStarted: function () {
            setVoiceInputState(VoiceMessageInputStatus.RECORDING);
        },
        onRecordingEnded: function (audioFile) {
            setAudioFile(audioFile);
        },
    }), start = _h.start, stop = _h.stop, cancel = _h.cancel, recordingTime = _h.recordingTime, recordingStatus = _h.recordingStatus, recordingLimit = _h.recordingLimit;
    var voicePlayer = useVoicePlayer({
        channelUrl: channel === null || channel === void 0 ? void 0 : channel.url,
        key: uuid,
        audioFile: audioFile,
    });
    var play = voicePlayer.play, pause = voicePlayer.pause, playbackTime = voicePlayer.playbackTime, playingStatus = voicePlayer.playingStatus;
    var stopVoicePlayer = voicePlayer.stop;
    // disabled state: muted & frozen
    useEffect(function () {
        if (isDisabledBecauseFrozen(channel) || isDisabledBecauseMuted(channel)) {
            setDisabled(true);
        }
        else {
            setDisabled(false);
        }
    }, [channel === null || channel === void 0 ? void 0 : channel.myRole, channel === null || channel === void 0 ? void 0 : channel.isFrozen, channel === null || channel === void 0 ? void 0 : channel.myMutedState]);
    // call onSubmitClick when submit button is clicked and recorded audio file is created
    useEffect(function () {
        if (isSubmitted && audioFile) {
            onSubmitClick(audioFile, recordingTime);
            setSubmit(false);
            setAudioFile(null);
        }
    }, [isSubmitted, audioFile, recordingTime]);
    // operate which control button should be displayed
    useEffect(function () {
        if (audioFile) {
            if (recordingTime < minRecordingTime) {
                setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
                setAudioFile(null);
            }
            else if (playingStatus === VOICE_PLAYER_STATUS.PLAYING) {
                setVoiceInputState(VoiceMessageInputStatus.PLAYING);
            }
            else {
                setVoiceInputState(VoiceMessageInputStatus.READY_TO_PLAY);
            }
        }
    }, [audioFile, recordingTime, playingStatus]);
    return (React__default.createElement("div", { className: "sendbird-voice-message-input-wrapper" },
        React__default.createElement(VoiceMessageInput, { currentValue: recordingStatus === VoiceRecorderStatus.COMPLETED ? playbackTime : recordingTime, maximumValue: recordingStatus === VoiceRecorderStatus.COMPLETED ? recordingTime : recordingLimit, currentType: voiceInputState, onCancelClick: function () {
                onCancelClick();
                cancel();
                stopVoicePlayer();
            }, onSubmitClick: function () {
                if (isDisabled) {
                    setShowModal(true);
                    setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
                }
                else {
                    stop();
                    pause();
                    setSubmit(true);
                }
            }, onControlClick: function (type) {
                switch (type) {
                    case VoiceMessageInputStatus.READY_TO_RECORD: {
                        stopVoicePlayer();
                        start();
                        break;
                    }
                    case VoiceMessageInputStatus.RECORDING: {
                        if (recordingTime >= minRecordingTime && !isDisabled) {
                            stop();
                        }
                        else if (isDisabled) {
                            cancel();
                            setShowModal(true);
                            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
                        }
                        else {
                            cancel();
                            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
                        }
                        break;
                    }
                    case VoiceMessageInputStatus.READY_TO_PLAY: {
                        play();
                        break;
                    }
                    case VoiceMessageInputStatus.PLAYING: {
                        pause();
                        break;
                    }
                }
            } }),
        showModal && (React__default.createElement(Modal, { className: "sendbird-voice-message-input-wrapper-alert", titleText: isDisabledBecauseMuted(channel)
                ? stringSet.MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED
                : stringSet.MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN, hideFooter: true, isCloseOnClickOutside: true, onCancel: function () {
                setShowModal(false);
                onCancelClick();
            } },
            React__default.createElement("div", { className: "sendbird-voice-message-input-wrapper-alert__body" },
                React__default.createElement(Button, { className: "sendbird-voice-message-input-wrapper-alert__body__ok-button", type: ButtonTypes.PRIMARY, size: ButtonSizes.BIG, onClick: function () {
                        setShowModal(false);
                        onCancelClick();
                    } }, stringSet.BUTTON__OK))))));
};

var MessageInputWrapperView = React__default.forwardRef(function (props, ref) {
    // Props
    var currentChannel = props.currentChannel, localIsMFMEnabled = props.isMultipleFilesMessageEnabled, loading = props.loading, quoteMessage = props.quoteMessage, setQuoteMessage = props.setQuoteMessage, messageInputRef = props.messageInputRef, sendUserMessage = props.sendUserMessage, sendFileMessage = props.sendFileMessage, sendVoiceMessage = props.sendVoiceMessage, sendMultipleFilesMessage = props.sendMultipleFilesMessage, 
    // render
    renderUserMentionItem = props.renderUserMentionItem, renderFileUploadIcon = props.renderFileUploadIcon, renderVoiceMessageIcon = props.renderVoiceMessageIcon, renderSendMessageIcon = props.renderSendMessageIcon, acceptableMimeTypes = props.acceptableMimeTypes, disabled = props.disabled;
    var stringSet = useLocalization().stringSet;
    var isMobile = useMediaQueryContext().isMobile;
    var _a = useSendbirdStateContext(), stores = _a.stores, config = _a.config;
    var isOnline = config.isOnline, isMentionEnabled = config.isMentionEnabled, isVoiceMessageEnabled = config.isVoiceMessageEnabled, globalIsMFMenabled = config.isMultipleFilesMessageEnabled, userMention = config.userMention, logger = config.logger;
    var sdk = stores.sdkStore.sdk;
    var maxMentionCount = userMention.maxMentionCount, maxSuggestionCount = userMention.maxSuggestionCount;
    var isBroadcast = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast;
    var isOperator = (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === 'operator';
    // States
    var _b = useState(''), mentionNickname = _b[0], setMentionNickname = _b[1];
    var _c = useState([]), mentionedUsers = _c[0], setMentionedUsers = _c[1];
    var _d = useState([]), mentionedUserIds = _d[0], setMentionedUserIds = _d[1];
    var _e = useState(null), selectedUser = _e[0], setSelectedUser = _e[1];
    var _f = useState([]), mentionSuggestedUsers = _f[0], setMentionSuggestedUsers = _f[1];
    var _g = useState(null), messageInputEvent = _g[0], setMessageInputEvent = _g[1];
    var _h = useState(false), showVoiceMessageInput = _h[0], setShowVoiceMessageInput = _h[1];
    // Conditions
    var isMessageInputDisabled = loading
        || !currentChannel
        || isDisabledBecauseFrozen(currentChannel)
        || isDisabledBecauseMuted(currentChannel)
        || (!isOnline && !(sdk === null || sdk === void 0 ? void 0 : sdk.isCacheEnabled))
        || disabled;
    var showSuggestedMentionList = !isMessageInputDisabled
        && isMentionEnabled
        && mentionNickname.length > 0
        && !isBroadcast;
    var isMultipleFilesMessageEnabled = localIsMFMEnabled !== null && localIsMFMEnabled !== void 0 ? localIsMFMEnabled : globalIsMFMenabled;
    var mentionNodes = useDirtyGetMentions({ ref: ref || messageInputRef }, { logger: logger });
    var ableMention = (mentionNodes === null || mentionNodes === void 0 ? void 0 : mentionNodes.length) < maxMentionCount;
    // Operate states
    useEffect(function () {
        setMentionNickname('');
        setMentionedUsers([]);
        setMentionedUserIds([]);
        setSelectedUser(null);
        setMentionSuggestedUsers([]);
        setMessageInputEvent(null);
        setShowVoiceMessageInput(false);
    }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
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
    // Callbacks
    var handleUploadFiles = useHandleUploadFiles({
        sendFileMessage: sendFileMessage,
        sendMultipleFilesMessage: sendMultipleFilesMessage,
        quoteMessage: quoteMessage,
    }, { logger: logger });
    if (isBroadcast && !isOperator) {
        /* Only `Operator` can send messages in the Broadcast channel */
        return null;
    }
    // other conditions
    return (React__default.createElement("div", { className: "sendbird-message-input-wrapper".concat(showVoiceMessageInput ? '--voice-message' : '') },
        showSuggestedMentionList && (React__default.createElement(SuggestedMentionList, { currentChannel: currentChannel, targetNickname: mentionNickname, inputEvent: messageInputEvent, renderUserMentionItem: renderUserMentionItem, onUserItemClick: function (user) {
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
            }, ableAddMention: ableMention, maxMentionCount: maxMentionCount, maxSuggestionCount: maxSuggestionCount })),
        quoteMessage && (React__default.createElement("div", { className: "sendbird-message-input-wrapper__quote-message-input" },
            React__default.createElement(QuoteMessageInput, { replyingMessage: quoteMessage, onClose: function () { return setQuoteMessage(null); } }))),
        showVoiceMessageInput ? (React__default.createElement(VoiceMessageInputWrapper, { channel: currentChannel, onSubmitClick: function (recordedFile, duration) {
                sendVoiceMessage({ file: recordedFile, parentMessageId: quoteMessage === null || quoteMessage === void 0 ? void 0 : quoteMessage.messageId }, duration);
                setQuoteMessage(null);
                setShowVoiceMessageInput(false);
            }, onCancelClick: function () {
                setShowVoiceMessageInput(false);
            } })) : (React__default.createElement(MessageInput, { className: "sendbird-message-input-wrapper__message-input", channel: currentChannel, channelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url, isMobile: isMobile, acceptableMimeTypes: acceptableMimeTypes, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, isVoiceMessageEnabled: isVoiceMessageEnabled, isSelectingMultipleFilesEnabled: isMultipleFilesMessageEnabled, onVoiceMessageIconClick: function () {
                setShowVoiceMessageInput(true);
            }, setMentionedUsers: setMentionedUsers, placeholder: (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
                || ((disabled || isDisabledBecauseFrozen(currentChannel)) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
                || (isDisabledBecauseMuted(currentChannel)
                    && (isMobile ? stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT : stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED)), ref: ref || messageInputRef, disabled: isMessageInputDisabled, renderFileUploadIcon: renderFileUploadIcon, renderSendMessageIcon: renderSendMessageIcon, renderVoiceMessageIcon: renderVoiceMessageIcon, onStartTyping: function () {
                currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.startTyping();
            }, onSendMessage: function (_a) {
                var _b;
                var message = _a.message, mentionTemplate = _a.mentionTemplate;
                sendUserMessage({
                    message: message,
                    mentionedUsers: mentionedUsers,
                    mentionedMessageTemplate: mentionTemplate,
                    parentMessageId: quoteMessage === null || quoteMessage === void 0 ? void 0 : quoteMessage.messageId,
                });
                setMentionNickname('');
                setMentionedUsers([]);
                setQuoteMessage(null);
                (_b = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.endTyping) === null || _b === void 0 ? void 0 : _b.call(currentChannel);
            }, onFileUpload: function (fileList) {
                handleUploadFiles(fileList);
                setQuoteMessage(null);
            }, onUserMentioned: function (user) {
                if ((selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.userId) === (user === null || user === void 0 ? void 0 : user.userId)) {
                    setSelectedUser(null);
                    setMentionNickname('');
                }
            }, onMentionStringChange: function (mentionText) {
                setMentionNickname(mentionText);
            }, onMentionedUserIdsUpdated: function (userIds) {
                setMentionedUserIds(userIds);
            }, onKeyDown: function (e) {
                if (showSuggestedMentionList
                    && (mentionSuggestedUsers === null || mentionSuggestedUsers === void 0 ? void 0 : mentionSuggestedUsers.length) > 0
                    && ((e.key === MessageInputKeys.Enter && ableMention)
                        || e.key === MessageInputKeys.ArrowUp
                        || e.key === MessageInputKeys.ArrowDown)) {
                    setMessageInputEvent(e);
                    return true;
                }
                return false;
            } }))));
});

export { MessageInputWrapperView as M, VoiceMessageInputWrapper as V };
//# sourceMappingURL=bundle-nzfPi40W.js.map
