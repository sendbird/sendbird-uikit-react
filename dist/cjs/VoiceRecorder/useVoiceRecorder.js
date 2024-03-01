'use strict';

var React = require('react');
var VoiceRecorder_context = require('./context.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
require('../chunks/bundle-Nz6fSUye.js');
require('../chunks/bundle-xYV6cL9E.js');
require('../chunks/bundle-eyiJykZ-.js');
require('../chunks/bundle-NeYvE4zX.js');
require('../chunks/bundle-zYqQA3cT.js');
require('react-dom');
require('../chunks/bundle-Xwl4gw4D.js');
require('../chunks/bundle-37dz9yoi.js');
require('../ui/IconButton.js');
require('../ui/Button.js');
require('../chunks/bundle-2Pq38lvD.js');
require('../ui/Icon.js');
require('../chunks/bundle-4jVvOUfV.js');
require('../withSendbird.js');

// export interface UseVoiceRecorderProps extends VoiceRecorderEventHandler {
//   /**
//    * onRecordingStarted
//    * onRecordingEnded
//    */
// }
/* eslint-disable no-redeclare */
var VoiceRecorderStatus = {
    PREPARING: 'PREPARING',
    READY_TO_RECORD: 'READY_TO_RECORD',
    RECORDING: 'RECORDING',
    COMPLETED: 'COMPLETED',
};
var noop = function () { };
var useVoiceRecorder = function (_a) {
    var _b = _a.onRecordingStarted, onRecordingStarted = _b === void 0 ? noop : _b, _c = _a.onRecordingEnded, onRecordingEnded = _c === void 0 ? noop : _c;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var voiceRecord = config.voiceRecord;
    var maxRecordingTime = voiceRecord.maxRecordingTime;
    var voiceRecorder = VoiceRecorder_context.useVoiceRecorderContext();
    var isRecordable = voiceRecorder.isRecordable;
    var _d = React.useState(null), recordedFile = _d[0], setRecordedFile = _d[1];
    var _e = React.useState(VoiceRecorderStatus.PREPARING), recordingStatus = _e[0], setRecordingStatus = _e[1];
    React.useEffect(function () {
        if (isRecordable && recordingStatus === VoiceRecorderStatus.PREPARING) {
            setRecordingStatus(VoiceRecorderStatus.READY_TO_RECORD);
        }
    }, [isRecordable]);
    var start = React.useCallback(function () {
        voiceRecorder === null || voiceRecorder === void 0 ? void 0 : voiceRecorder.start({
            onRecordingStarted: function () {
                setRecordingStatus(VoiceRecorderStatus.RECORDING);
                onRecordingStarted();
                startTimer();
            },
            onRecordingEnded: function (audioFile) {
                setRecordingStatus(VoiceRecorderStatus.COMPLETED);
                onRecordingEnded(audioFile);
                setRecordedFile(audioFile);
                stopTimer();
            },
        });
    }, [onRecordingStarted, onRecordingEnded]);
    var stop = React.useCallback(function () {
        voiceRecorder === null || voiceRecorder === void 0 ? void 0 : voiceRecorder.stop();
        stopTimer();
    }, [voiceRecorder]);
    var cancel = React.useCallback(function () {
        stop();
        setRecordedFile(null);
    }, [voiceRecorder]);
    // Timer
    var _f = React.useState(0), recordingTime = _f[0], setRecordingTime = _f[1];
    var timer = null;
    function startTimer() {
        stopTimer();
        setRecordingTime(0);
        var interval = setInterval(function () {
            setRecordingTime(function (prevTime) {
                var newTime = prevTime + 100;
                if (newTime > maxRecordingTime) {
                    stopTimer();
                }
                return newTime;
            });
        }, 100);
        timer = interval;
    }
    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }
    React.useEffect(function () {
        if (recordingTime > maxRecordingTime) {
            stop();
        }
    }, [recordingTime, maxRecordingTime, stop]);
    return ({
        start: start,
        stop: stop,
        cancel: cancel,
        recordingStatus: recordingStatus,
        recordingTime: recordingTime,
        recordedFile: recordedFile,
        recordingLimit: maxRecordingTime,
    });
};

exports.VoiceRecorderStatus = VoiceRecorderStatus;
exports.useVoiceRecorder = useVoiceRecorder;
//# sourceMappingURL=useVoiceRecorder.js.map
