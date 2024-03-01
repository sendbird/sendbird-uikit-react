'use strict';

var React = require('react');
var ui_PlaybackTime = require('../ui/PlaybackTime.js');
var ui_ProgressBar = require('../ui/ProgressBar.js');
var ui_TextButton = require('../ui/TextButton.js');
var ui_Icon = require('../ui/Icon.js');
var ui_Label = require('./bundle-26QzFMMl.js');
var LocalizationContext = require('./bundle-60kIt9Rq.js');
var consts = require('./bundle-I79mHo_2.js');

/* eslint-disable no-redeclare */
var VoiceMessageInputStatus = {
    READY_TO_RECORD: 'READY_TO_RECORD',
    RECORDING: 'RECORDING',
    READY_TO_PLAY: 'READY_TO_PLAY',
    PLAYING: 'PLAYING',
};

var ControlerIcon = function (_a) {
    var inputState = _a.inputState;
    switch (inputState) {
        case VoiceMessageInputStatus.READY_TO_RECORD: {
            return (React.createElement("div", { className: "sendbird-controler-icon record-icon" }));
        }
        case VoiceMessageInputStatus.RECORDING: {
            return (React.createElement("div", { className: "sendbird-controler-icon stop-icon" }));
        }
        case VoiceMessageInputStatus.READY_TO_PLAY: {
            return (React.createElement(ui_Icon.default, { className: "sendbird-controler-icon play-icon", width: "20px", height: "20px", type: ui_Icon.IconTypes.PLAY, fillColor: ui_Icon.IconColors.ON_BACKGROUND_1 }));
        }
        case VoiceMessageInputStatus.PLAYING: {
            return (React.createElement("div", { className: "sendbird-controler-icon pause-icon" },
                React.createElement("div", { className: "sendbird-controler-icon pause-icon-inner" }),
                React.createElement("div", { className: "sendbird-controler-icon pause-icon-inner" })));
        }
        default:
            return null;
    }
};

var VoiceMessageInput = function (_a) {
    var _b = _a.minRecordTime, minRecordTime = _b === void 0 ? consts.VOICE_RECORDER_DEFAULT_MIN : _b, maximumValue = _a.maximumValue, _c = _a.currentValue, currentValue = _c === void 0 ? 0 : _c, currentType = _a.currentType, onCancelClick = _a.onCancelClick, onControlClick = _a.onControlClick, onSubmitClick = _a.onSubmitClick, renderCancelButton = _a.renderCancelButton, renderControlButton = _a.renderControlButton, renderSubmitButton = _a.renderSubmitButton;
    var _d = React.useState(0), lastClickTime = _d[0], setLastClickTime = _d[1];
    var isReadyToRecord = React.useMemo(function () { return currentType === VoiceMessageInputStatus.READY_TO_RECORD; }, [currentType]);
    var isRecording = React.useMemo(function () { return currentType === VoiceMessageInputStatus.RECORDING; }, [currentType]);
    var isSendButtonDisabled = React.useMemo(function () {
        if (currentType === VoiceMessageInputStatus.READY_TO_RECORD
            || currentType === VoiceMessageInputStatus.RECORDING) {
            return minRecordTime > currentValue;
        }
        return false;
    }, [currentType, minRecordTime, currentValue]);
    var isPlayMode = React.useMemo(function () {
        return (currentType === VoiceMessageInputStatus.READY_TO_PLAY
            || currentType === VoiceMessageInputStatus.PLAYING);
    }, [currentType]);
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var handleOnCancelClick = function () {
        var currentTime = Date.now();
        if (currentTime - lastClickTime > consts.VOICE_RECORDER_CLICK_BUFFER_TIME) {
            onCancelClick();
            setLastClickTime(currentTime);
        }
    };
    var handleOnControlClick = React.useCallback(function () {
        var currentTime = Date.now();
        if (currentTime - lastClickTime > consts.VOICE_RECORDER_CLICK_BUFFER_TIME) {
            onControlClick(currentType);
            setLastClickTime(currentTime);
        }
    }, [currentType]);
    var handleOnSubmitClick = function () {
        var currentTime = Date.now();
        if (currentTime - lastClickTime > consts.VOICE_RECORDER_CLICK_BUFFER_TIME) {
            if (!isSendButtonDisabled) {
                onSubmitClick();
            }
            setLastClickTime(currentTime);
        }
    };
    return (React.createElement("div", { className: "sendbird-voice-message-input" },
        React.createElement("div", { className: "sendbird-voice-message-input__indicator" },
            React.createElement("div", { className: "sendbird-voice-message-input__indicator__progress-bar" },
                React.createElement(ui_ProgressBar.ProgressBar, { className: "sendbird-voice-message-input__indicator__progress-bar__bar", disabled: isReadyToRecord, maxSize: maximumValue, currentSize: currentValue })),
            (isRecording) ? (React.createElement("div", { className: "sendbird-voice-message-input__indicator__on-rec" })) : null,
            React.createElement(ui_PlaybackTime.PlaybackTime, { className: "sendbird-voice-message-input__indicator__playback-time", time: isPlayMode ? maximumValue - currentValue : currentValue, labelColor: isReadyToRecord ? ui_Label.LabelColors.ONBACKGROUND_4 : ui_Label.LabelColors.ONCONTENT_1 })),
        React.createElement("div", { className: "sendbird-voice-message-input__controler" },
            (renderCancelButton === null || renderCancelButton === void 0 ? void 0 : renderCancelButton()) || (React.createElement(ui_TextButton, { className: "sendbird-voice-message-input__controler__cancel", onClick: handleOnCancelClick, disableUnderline: true },
                React.createElement(ui_Label.Label, { type: ui_Label.LabelTypography.BUTTON_1, color: ui_Label.LabelColors.PRIMARY }, stringSet.BUTTON__CANCEL))),
            (renderControlButton === null || renderControlButton === void 0 ? void 0 : renderControlButton(currentType)) || (React.createElement("div", { className: "sendbird-voice-message-input__controler__main", onClick: handleOnControlClick },
                React.createElement(ControlerIcon, { inputState: currentType }))),
            (renderSubmitButton === null || renderSubmitButton === void 0 ? void 0 : renderSubmitButton()) || (React.createElement("div", { className: "sendbird-voice-message-input__controler__submit ".concat(isSendButtonDisabled ? 'voice-message--disabled' : ''), onClick: handleOnSubmitClick },
                React.createElement(ui_Icon.default, { width: "19px", height: "19px", type: ui_Icon.IconTypes.SEND, fillColor: isSendButtonDisabled ? ui_Icon.IconColors.ON_BACKGROUND_4 : ui_Icon.IconColors.CONTENT }))))));
};

exports.VoiceMessageInput = VoiceMessageInput;
exports.VoiceMessageInputStatus = VoiceMessageInputStatus;
//# sourceMappingURL=bundle-1LKSecgr.js.map
