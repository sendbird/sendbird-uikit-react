'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var LocalizationContext = require('../chunks/bundle-60kIt9Rq.js');
var ui_Modal = require('../chunks/bundle-CfdtYkhL.js');
var consts = require('../chunks/bundle-I79mHo_2.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
require('../chunks/bundle-eH49AisR.js');
require('../chunks/bundle-gDA5XZ0C.js');
require('../chunks/bundle-2dG9SU7T.js');
require('react-dom');
require('../chunks/bundle-QStqvuCY.js');
require('../chunks/bundle-MZHOyRuu.js');
require('../ui/IconButton.js');
require('../ui/Button.js');
require('../chunks/bundle-26QzFMMl.js');
require('../ui/Icon.js');
require('../withSendbird.js');

var noop = function () { };
var Context = React.createContext({
    start: noop,
    stop: noop,
    isRecordable: false,
});
var VoiceRecorderProvider = function (props) {
    var _a;
    var children = props.children;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var logger = config.logger, isVoiceMessageEnabled = config.isVoiceMessageEnabled;
    var _b = React.useState(null), mediaRecorder = _b[0], setMediaRecorder = _b[1];
    var _c = React.useState(false), isRecordable = _c[0], setIsRecordable = _c[1];
    var _d = React.useState(false), permissionWarning = _d[0], setPermissionWarning = _d[1];
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var _e = React.useState(null), webAudioUtils = _e[0], setWebAudioUtils = _e[1];
    var browserSupportMimeType = (_a = consts.BROWSER_SUPPORT_MIME_TYPE_LIST.find(function (mimeType) { return MediaRecorder.isTypeSupported(mimeType); })) !== null && _a !== void 0 ? _a : '';
    if (isVoiceMessageEnabled && !browserSupportMimeType) {
        logger.error('VoiceRecorder: Browser does not support mimeType', { mimmeTypes: consts.BROWSER_SUPPORT_MIME_TYPE_LIST });
    }
    React.useEffect(function () {
        if (isVoiceMessageEnabled && !webAudioUtils) {
            Promise.resolve().then(function () { return require('../chunks/bundle-wawGd6HY.js'); }).then(function (data) {
                setWebAudioUtils(data);
            });
        }
    }, [isVoiceMessageEnabled, webAudioUtils]);
    var start = React.useCallback(function (eventHandler) {
        var _a, _b;
        if (isVoiceMessageEnabled && !webAudioUtils) {
            logger.error('VoiceRecorder: Recording audio processor is being loaded.');
            return;
        }
        var checkPermission = function () {
            try {
                // Type '"microphone"' is not assignable to type 'PermissionName'.ts(2322)
                // this is typescript issue
                // https://github.com/microsoft/TypeScript/issues/33923
                // @ts-expect-error
                navigator.permissions.query({ name: 'microphone' }).then(function (result) {
                    if (result.state === 'denied') {
                        logger.warning('VoiceRecorder: Permission denied.');
                        setPermissionWarning(true);
                    }
                });
            }
            catch (error) {
                logger.warning('VoiceRecorder: Failed to check permission.', error);
            }
        };
        logger.info('VoiceRecorder: Start recording.');
        if (mediaRecorder) {
            stop();
            logger.info('VoiceRecorder: Previous mediaRecorder is stopped.');
        }
        checkPermission();
        (_b = (_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia) === null || _b === void 0 ? void 0 : _b.call(_a, { audio: true }).then(function (stream) {
            var _a;
            logger.info('VoiceRecorder: Succeeded getting media stream.', stream);
            setIsRecordable(true);
            var mediaRecorder = new MediaRecorder(stream, {
                mimeType: browserSupportMimeType,
                audioBitsPerSecond: consts.VOICE_RECORDER_AUDIO_BIT_RATE,
            });
            mediaRecorder.ondataavailable = function (e) {
                var _a, _b, _c;
                logger.info('VoiceRecorder: Succeeded getting an available data.', e.data);
                var audioFile = new File([e.data], consts.VOICE_MESSAGE_FILE_NAME, {
                    lastModified: new Date().getTime(),
                    type: consts.VOICE_MESSAGE_MIME_TYPE,
                });
                webAudioUtils === null || webAudioUtils === void 0 ? void 0 : webAudioUtils.downsampleToWav(audioFile, function (buffer) {
                    var mp3Buffer = webAudioUtils === null || webAudioUtils === void 0 ? void 0 : webAudioUtils.encodeMp3(buffer);
                    var mp3blob = new Blob(mp3Buffer, { type: consts.VOICE_MESSAGE_MIME_TYPE });
                    var convertedAudioFile = new File([mp3blob], consts.VOICE_MESSAGE_FILE_NAME, {
                        lastModified: new Date().getTime(),
                        type: consts.VOICE_MESSAGE_MIME_TYPE,
                    });
                    eventHandler === null || eventHandler === void 0 ? void 0 : eventHandler.onRecordingEnded(convertedAudioFile);
                    logger.info('VoiceRecorder: Succeeded converting audio file.', convertedAudioFile);
                });
                (_c = (_a = stream === null || stream === void 0 ? void 0 : stream.getAudioTracks) === null || _a === void 0 ? void 0 : (_b = _a.call(stream)).forEach) === null || _c === void 0 ? void 0 : _c.call(_b, function (track) { return track === null || track === void 0 ? void 0 : track.stop(); });
                setIsRecordable(false);
            };
            mediaRecorder.onstart = (_a = eventHandler === null || eventHandler === void 0 ? void 0 : eventHandler.onRecordingStarted) !== null && _a !== void 0 ? _a : noop;
            mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.start();
            setMediaRecorder(mediaRecorder);
        }).catch(function (err) {
            logger.error('VoiceRecorder: Failed getting media stream.', err);
            setMediaRecorder(null);
        });
    }, [mediaRecorder, webAudioUtils]);
    var stop = React.useCallback(function () {
        // Stop recording
        mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
        setMediaRecorder(null);
        setIsRecordable(false);
        logger.info('VoiceRecorder: Stop recording.');
    }, [mediaRecorder]);
    return (React.createElement(Context.Provider, { value: {
            start: start,
            stop: stop,
            isRecordable: isRecordable,
        } },
        children,
        permissionWarning && (React.createElement(ui_Modal.Modal, { hideFooter: true, onCancel: function () { return setPermissionWarning(false); } },
            React.createElement(React.Fragment, null, stringSet.VOICE_RECORDING_PERMISSION_DENIED)))));
};
var useVoiceRecorderContext = function () { return React.useContext(Context); };
var index = {
    VoiceRecorderProvider: VoiceRecorderProvider,
    useVoiceRecorderContext: useVoiceRecorderContext,
};

exports.VoiceRecorderProvider = VoiceRecorderProvider;
exports.default = index;
exports.useVoiceRecorderContext = useVoiceRecorderContext;
//# sourceMappingURL=context.js.map
