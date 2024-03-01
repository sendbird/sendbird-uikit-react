import React__default, { useState, useMemo, useCallback } from 'react';
import { PlaybackTime } from '../ui/PlaybackTime.js';
import { ProgressBar } from '../ui/ProgressBar.js';
import TextButton from '../ui/TextButton.js';
import Icon, { IconTypes, IconColors } from '../ui/Icon.js';
import { b as LabelColors, L as Label, a as LabelTypography } from './bundle-sR62lMVk.js';
import { u as useLocalization } from './bundle-1inZXcUV.js';
import { h as VOICE_RECORDER_CLICK_BUFFER_TIME, f as VOICE_RECORDER_DEFAULT_MIN } from './bundle-UKdN0Ihw.js';

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
            return (React__default.createElement("div", { className: "sendbird-controler-icon record-icon" }));
        }
        case VoiceMessageInputStatus.RECORDING: {
            return (React__default.createElement("div", { className: "sendbird-controler-icon stop-icon" }));
        }
        case VoiceMessageInputStatus.READY_TO_PLAY: {
            return (React__default.createElement(Icon, { className: "sendbird-controler-icon play-icon", width: "20px", height: "20px", type: IconTypes.PLAY, fillColor: IconColors.ON_BACKGROUND_1 }));
        }
        case VoiceMessageInputStatus.PLAYING: {
            return (React__default.createElement("div", { className: "sendbird-controler-icon pause-icon" },
                React__default.createElement("div", { className: "sendbird-controler-icon pause-icon-inner" }),
                React__default.createElement("div", { className: "sendbird-controler-icon pause-icon-inner" })));
        }
        default:
            return null;
    }
};

var VoiceMessageInput = function (_a) {
    var _b = _a.minRecordTime, minRecordTime = _b === void 0 ? VOICE_RECORDER_DEFAULT_MIN : _b, maximumValue = _a.maximumValue, _c = _a.currentValue, currentValue = _c === void 0 ? 0 : _c, currentType = _a.currentType, onCancelClick = _a.onCancelClick, onControlClick = _a.onControlClick, onSubmitClick = _a.onSubmitClick, renderCancelButton = _a.renderCancelButton, renderControlButton = _a.renderControlButton, renderSubmitButton = _a.renderSubmitButton;
    var _d = useState(0), lastClickTime = _d[0], setLastClickTime = _d[1];
    var isReadyToRecord = useMemo(function () { return currentType === VoiceMessageInputStatus.READY_TO_RECORD; }, [currentType]);
    var isRecording = useMemo(function () { return currentType === VoiceMessageInputStatus.RECORDING; }, [currentType]);
    var isSendButtonDisabled = useMemo(function () {
        if (currentType === VoiceMessageInputStatus.READY_TO_RECORD
            || currentType === VoiceMessageInputStatus.RECORDING) {
            return minRecordTime > currentValue;
        }
        return false;
    }, [currentType, minRecordTime, currentValue]);
    var isPlayMode = useMemo(function () {
        return (currentType === VoiceMessageInputStatus.READY_TO_PLAY
            || currentType === VoiceMessageInputStatus.PLAYING);
    }, [currentType]);
    var stringSet = useLocalization().stringSet;
    var handleOnCancelClick = function () {
        var currentTime = Date.now();
        if (currentTime - lastClickTime > VOICE_RECORDER_CLICK_BUFFER_TIME) {
            onCancelClick();
            setLastClickTime(currentTime);
        }
    };
    var handleOnControlClick = useCallback(function () {
        var currentTime = Date.now();
        if (currentTime - lastClickTime > VOICE_RECORDER_CLICK_BUFFER_TIME) {
            onControlClick(currentType);
            setLastClickTime(currentTime);
        }
    }, [currentType]);
    var handleOnSubmitClick = function () {
        var currentTime = Date.now();
        if (currentTime - lastClickTime > VOICE_RECORDER_CLICK_BUFFER_TIME) {
            if (!isSendButtonDisabled) {
                onSubmitClick();
            }
            setLastClickTime(currentTime);
        }
    };
    return (React__default.createElement("div", { className: "sendbird-voice-message-input" },
        React__default.createElement("div", { className: "sendbird-voice-message-input__indicator" },
            React__default.createElement("div", { className: "sendbird-voice-message-input__indicator__progress-bar" },
                React__default.createElement(ProgressBar, { className: "sendbird-voice-message-input__indicator__progress-bar__bar", disabled: isReadyToRecord, maxSize: maximumValue, currentSize: currentValue })),
            (isRecording) ? (React__default.createElement("div", { className: "sendbird-voice-message-input__indicator__on-rec" })) : null,
            React__default.createElement(PlaybackTime, { className: "sendbird-voice-message-input__indicator__playback-time", time: isPlayMode ? maximumValue - currentValue : currentValue, labelColor: isReadyToRecord ? LabelColors.ONBACKGROUND_4 : LabelColors.ONCONTENT_1 })),
        React__default.createElement("div", { className: "sendbird-voice-message-input__controler" },
            (renderCancelButton === null || renderCancelButton === void 0 ? void 0 : renderCancelButton()) || (React__default.createElement(TextButton, { className: "sendbird-voice-message-input__controler__cancel", onClick: handleOnCancelClick, disableUnderline: true },
                React__default.createElement(Label, { type: LabelTypography.BUTTON_1, color: LabelColors.PRIMARY }, stringSet.BUTTON__CANCEL))),
            (renderControlButton === null || renderControlButton === void 0 ? void 0 : renderControlButton(currentType)) || (React__default.createElement("div", { className: "sendbird-voice-message-input__controler__main", onClick: handleOnControlClick },
                React__default.createElement(ControlerIcon, { inputState: currentType }))),
            (renderSubmitButton === null || renderSubmitButton === void 0 ? void 0 : renderSubmitButton()) || (React__default.createElement("div", { className: "sendbird-voice-message-input__controler__submit ".concat(isSendButtonDisabled ? 'voice-message--disabled' : ''), onClick: handleOnSubmitClick },
                React__default.createElement(Icon, { width: "19px", height: "19px", type: IconTypes.SEND, fillColor: isSendButtonDisabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT }))))));
};

export { VoiceMessageInputStatus as V, VoiceMessageInput as a };
//# sourceMappingURL=bundle-1AXEYxoC.js.map
