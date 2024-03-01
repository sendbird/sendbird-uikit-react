'use strict';

var _tslib = require('./bundle-xbdnJE9-.js');
var React = require('react');
var utils = require('./bundle-U2YYVRfT.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var LocalizationContext = require('./bundle-WKa05h0_.js');
var GroupChannel_components_SuggestedMentionList = require('../GroupChannel/components/SuggestedMentionList.js');
var Message_hooks_useDirtyGetMentions = require('../Message/hooks/useDirtyGetMentions.js');
var ui_QuoteMessageInput = require('../ui/QuoteMessageInput.js');
var VoicePlayer_useVoicePlayer = require('../VoicePlayer/useVoicePlayer.js');
var VoiceRecorder_useVoiceRecorder = require('../VoiceRecorder/useVoiceRecorder.js');
var ui_VoiceMessageInput = require('./bundle-pKCe2hVu.js');
var ui_Modal = require('./bundle-6hGNMML2.js');
var ui_Button = require('../ui/Button.js');
var consts = require('./bundle-Atn5EZwu.js');
var VoicePlayer_context = require('./bundle-jXnX-7jH.js');
var uuid = require('./bundle-SOIkTCep.js');
var ui_MessageInput = require('../ui/MessageInput.js');
var MediaQueryContext = require('./bundle-4WvE40Un.js');
var _const = require('./bundle-ZK5PhDxY.js');
var GroupChannel_hooks_useHandleUploadFiles = require('../GroupChannel/hooks/useHandleUploadFiles.js');

var VoiceMessageInputWrapper = function (_a) {
    var _b;
    var channel = _a.channel, onCancelClick = _a.onCancelClick, onSubmitClick = _a.onSubmitClick;
    var uuid$1 = React.useRef(uuid.uuidv4()).current;
    var _c = React.useState(null), audioFile = _c[0], setAudioFile = _c[1];
    var _d = React.useState(ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_RECORD), voiceInputState = _d[0], setVoiceInputState = _d[1];
    var _e = React.useState(false), isSubmitted = _e[0], setSubmit = _e[1];
    var _f = React.useState(false), isDisabled = _f[0], setDisabled = _f[1];
    var _g = React.useState(false), showModal = _g[0], setShowModal = _g[1];
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var minRecordingTime = ((_b = config === null || config === void 0 ? void 0 : config.voiceRecord) === null || _b === void 0 ? void 0 : _b.minRecordingTime) || consts.VOICE_RECORDER_DEFAULT_MIN;
    var _h = VoiceRecorder_useVoiceRecorder.useVoiceRecorder({
        onRecordingStarted: function () {
            setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.RECORDING);
        },
        onRecordingEnded: function (audioFile) {
            setAudioFile(audioFile);
        },
    }), start = _h.start, stop = _h.stop, cancel = _h.cancel, recordingTime = _h.recordingTime, recordingStatus = _h.recordingStatus, recordingLimit = _h.recordingLimit;
    var voicePlayer = VoicePlayer_useVoicePlayer.useVoicePlayer({
        channelUrl: channel === null || channel === void 0 ? void 0 : channel.url,
        key: uuid$1,
        audioFile: audioFile,
    });
    var play = voicePlayer.play, pause = voicePlayer.pause, playbackTime = voicePlayer.playbackTime, playingStatus = voicePlayer.playingStatus;
    var stopVoicePlayer = voicePlayer.stop;
    // disabled state: muted & frozen
    React.useEffect(function () {
        if (utils.isDisabledBecauseFrozen(channel) || utils.isDisabledBecauseMuted(channel)) {
            setDisabled(true);
        }
        else {
            setDisabled(false);
        }
    }, [channel === null || channel === void 0 ? void 0 : channel.myRole, channel === null || channel === void 0 ? void 0 : channel.isFrozen, channel === null || channel === void 0 ? void 0 : channel.myMutedState]);
    // call onSubmitClick when submit button is clicked and recorded audio file is created
    React.useEffect(function () {
        if (isSubmitted && audioFile) {
            onSubmitClick(audioFile, recordingTime);
            setSubmit(false);
            setAudioFile(null);
        }
    }, [isSubmitted, audioFile, recordingTime]);
    // operate which control button should be displayed
    React.useEffect(function () {
        if (audioFile) {
            if (recordingTime < minRecordingTime) {
                setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_RECORD);
                setAudioFile(null);
            }
            else if (playingStatus === VoicePlayer_context.VOICE_PLAYER_STATUS.PLAYING) {
                setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.PLAYING);
            }
            else {
                setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_PLAY);
            }
        }
    }, [audioFile, recordingTime, playingStatus]);
    return (React.createElement("div", { className: "sendbird-voice-message-input-wrapper" },
        React.createElement(ui_VoiceMessageInput.VoiceMessageInput, { currentValue: recordingStatus === VoiceRecorder_useVoiceRecorder.VoiceRecorderStatus.COMPLETED ? playbackTime : recordingTime, maximumValue: recordingStatus === VoiceRecorder_useVoiceRecorder.VoiceRecorderStatus.COMPLETED ? recordingTime : recordingLimit, currentType: voiceInputState, onCancelClick: function () {
                onCancelClick();
                cancel();
                stopVoicePlayer();
            }, onSubmitClick: function () {
                if (isDisabled) {
                    setShowModal(true);
                    setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_RECORD);
                }
                else {
                    stop();
                    pause();
                    setSubmit(true);
                }
            }, onControlClick: function (type) {
                switch (type) {
                    case ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_RECORD: {
                        stopVoicePlayer();
                        start();
                        break;
                    }
                    case ui_VoiceMessageInput.VoiceMessageInputStatus.RECORDING: {
                        if (recordingTime >= minRecordingTime && !isDisabled) {
                            stop();
                        }
                        else if (isDisabled) {
                            cancel();
                            setShowModal(true);
                            setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_RECORD);
                        }
                        else {
                            cancel();
                            setVoiceInputState(ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_RECORD);
                        }
                        break;
                    }
                    case ui_VoiceMessageInput.VoiceMessageInputStatus.READY_TO_PLAY: {
                        play();
                        break;
                    }
                    case ui_VoiceMessageInput.VoiceMessageInputStatus.PLAYING: {
                        pause();
                        break;
                    }
                }
            } }),
        showModal && (React.createElement(ui_Modal.Modal, { className: "sendbird-voice-message-input-wrapper-alert", titleText: utils.isDisabledBecauseMuted(channel)
                ? stringSet.MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED
                : stringSet.MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN, hideFooter: true, isCloseOnClickOutside: true, onCancel: function () {
                setShowModal(false);
                onCancelClick();
            } },
            React.createElement("div", { className: "sendbird-voice-message-input-wrapper-alert__body" },
                React.createElement(ui_Button.default, { className: "sendbird-voice-message-input-wrapper-alert__body__ok-button", type: ui_Button.ButtonTypes.PRIMARY, size: ui_Button.ButtonSizes.BIG, onClick: function () {
                        setShowModal(false);
                        onCancelClick();
                    } }, stringSet.BUTTON__OK))))));
};

var MessageInputWrapperView = React.forwardRef(function (props, ref) {
    // Props
    var currentChannel = props.currentChannel, localIsMFMEnabled = props.isMultipleFilesMessageEnabled, loading = props.loading, quoteMessage = props.quoteMessage, setQuoteMessage = props.setQuoteMessage, messageInputRef = props.messageInputRef, sendUserMessage = props.sendUserMessage, sendFileMessage = props.sendFileMessage, sendVoiceMessage = props.sendVoiceMessage, sendMultipleFilesMessage = props.sendMultipleFilesMessage, 
    // render
    renderUserMentionItem = props.renderUserMentionItem, renderFileUploadIcon = props.renderFileUploadIcon, renderVoiceMessageIcon = props.renderVoiceMessageIcon, renderSendMessageIcon = props.renderSendMessageIcon, acceptableMimeTypes = props.acceptableMimeTypes, disabled = props.disabled;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var isMobile = MediaQueryContext.useMediaQueryContext().isMobile;
    var _a = useSendbirdStateContext.useSendbirdStateContext(), stores = _a.stores, config = _a.config;
    var isOnline = config.isOnline, isMentionEnabled = config.isMentionEnabled, isVoiceMessageEnabled = config.isVoiceMessageEnabled, globalIsMFMenabled = config.isMultipleFilesMessageEnabled, userMention = config.userMention, logger = config.logger;
    var sdk = stores.sdkStore.sdk;
    var maxMentionCount = userMention.maxMentionCount, maxSuggestionCount = userMention.maxSuggestionCount;
    var isBroadcast = currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.isBroadcast;
    var isOperator = (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.myRole) === 'operator';
    // States
    var _b = React.useState(''), mentionNickname = _b[0], setMentionNickname = _b[1];
    var _c = React.useState([]), mentionedUsers = _c[0], setMentionedUsers = _c[1];
    var _d = React.useState([]), mentionedUserIds = _d[0], setMentionedUserIds = _d[1];
    var _e = React.useState(null), selectedUser = _e[0], setSelectedUser = _e[1];
    var _f = React.useState([]), mentionSuggestedUsers = _f[0], setMentionSuggestedUsers = _f[1];
    var _g = React.useState(null), messageInputEvent = _g[0], setMessageInputEvent = _g[1];
    var _h = React.useState(false), showVoiceMessageInput = _h[0], setShowVoiceMessageInput = _h[1];
    // Conditions
    var isMessageInputDisabled = loading
        || !currentChannel
        || utils.isDisabledBecauseFrozen(currentChannel)
        || utils.isDisabledBecauseMuted(currentChannel)
        || (!isOnline && !(sdk === null || sdk === void 0 ? void 0 : sdk.isCacheEnabled))
        || disabled;
    var showSuggestedMentionList = !isMessageInputDisabled
        && isMentionEnabled
        && mentionNickname.length > 0
        && !isBroadcast;
    var isMultipleFilesMessageEnabled = localIsMFMEnabled !== null && localIsMFMEnabled !== void 0 ? localIsMFMEnabled : globalIsMFMenabled;
    var mentionNodes = Message_hooks_useDirtyGetMentions.useDirtyGetMentions({ ref: ref || messageInputRef }, { logger: logger });
    var ableMention = (mentionNodes === null || mentionNodes === void 0 ? void 0 : mentionNodes.length) < maxMentionCount;
    // Operate states
    React.useEffect(function () {
        setMentionNickname('');
        setMentionedUsers([]);
        setMentionedUserIds([]);
        setSelectedUser(null);
        setMentionSuggestedUsers([]);
        setMessageInputEvent(null);
        setShowVoiceMessageInput(false);
    }, [currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url]);
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
    // Callbacks
    var handleUploadFiles = GroupChannel_hooks_useHandleUploadFiles.useHandleUploadFiles({
        sendFileMessage: sendFileMessage,
        sendMultipleFilesMessage: sendMultipleFilesMessage,
        quoteMessage: quoteMessage,
    }, { logger: logger });
    if (isBroadcast && !isOperator) {
        /* Only `Operator` can send messages in the Broadcast channel */
        return null;
    }
    // other conditions
    return (React.createElement("div", { className: "sendbird-message-input-wrapper".concat(showVoiceMessageInput ? '--voice-message' : '') },
        showSuggestedMentionList && (React.createElement(GroupChannel_components_SuggestedMentionList.SuggestedMentionList, { currentChannel: currentChannel, targetNickname: mentionNickname, inputEvent: messageInputEvent, renderUserMentionItem: renderUserMentionItem, onUserItemClick: function (user) {
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
            }, ableAddMention: ableMention, maxMentionCount: maxMentionCount, maxSuggestionCount: maxSuggestionCount })),
        quoteMessage && (React.createElement("div", { className: "sendbird-message-input-wrapper__quote-message-input" },
            React.createElement(ui_QuoteMessageInput, { replyingMessage: quoteMessage, onClose: function () { return setQuoteMessage(null); } }))),
        showVoiceMessageInput ? (React.createElement(VoiceMessageInputWrapper, { channel: currentChannel, onSubmitClick: function (recordedFile, duration) {
                sendVoiceMessage({ file: recordedFile, parentMessageId: quoteMessage === null || quoteMessage === void 0 ? void 0 : quoteMessage.messageId }, duration);
                setQuoteMessage(null);
                setShowVoiceMessageInput(false);
            }, onCancelClick: function () {
                setShowVoiceMessageInput(false);
            } })) : (React.createElement(ui_MessageInput, { className: "sendbird-message-input-wrapper__message-input", channel: currentChannel, channelUrl: currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url, isMobile: isMobile, acceptableMimeTypes: acceptableMimeTypes, mentionSelectedUser: selectedUser, isMentionEnabled: isMentionEnabled, isVoiceMessageEnabled: isVoiceMessageEnabled, isSelectingMultipleFilesEnabled: isMultipleFilesMessageEnabled, onVoiceMessageIconClick: function () {
                setShowVoiceMessageInput(true);
            }, setMentionedUsers: setMentionedUsers, placeholder: (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
                || ((disabled || utils.isDisabledBecauseFrozen(currentChannel)) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
                || (utils.isDisabledBecauseMuted(currentChannel)
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
                    && ((e.key === _const.MessageInputKeys.Enter && ableMention)
                        || e.key === _const.MessageInputKeys.ArrowUp
                        || e.key === _const.MessageInputKeys.ArrowDown)) {
                    setMessageInputEvent(e);
                    return true;
                }
                return false;
            } }))));
});

exports.MessageInputWrapperView = MessageInputWrapperView;
exports.VoiceMessageInputWrapper = VoiceMessageInputWrapper;
//# sourceMappingURL=bundle-Xa3hXyhu.js.map
