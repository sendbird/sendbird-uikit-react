import { useState, useEffect } from 'react';
import { u as useVoicePlayerContext, A as AudioUnitDefaultValue } from '../chunks/bundle-8TMXvllw.js';
import { g as VOICE_PLAYER_AUDIO_ID } from '../chunks/bundle-AFXr5NmI.js';
import { useVoiceRecorderContext } from '../VoiceRecorder/context.js';
import '../chunks/bundle-KMsJXUN2.js';
import '../useSendbirdStateContext.js';
import '../withSendbird.js';
import '../chunks/bundle-msnuMA4R.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '../chunks/bundle-CsWYoRVd.js';
import '../chunks/bundle-O8mkJ7az.js';
import 'react-dom';
import '../chunks/bundle-7YRb7CRq.js';
import '../chunks/bundle-ZTmwWu_-.js';
import '../ui/IconButton.js';
import '../ui/Button.js';
import '../chunks/bundle-kMMCn6GE.js';
import '../ui/Icon.js';

var generateGroupKey = function (channelUrl, key) {
    if (channelUrl === void 0) { channelUrl = ''; }
    if (key === void 0) { key = ''; }
    return ("".concat(channelUrl, "-").concat(key));
};

var useVoicePlayer = function (_a) {
    var _b;
    var _c = _a.key, key = _c === void 0 ? '' : _c, _d = _a.channelUrl, channelUrl = _d === void 0 ? '' : _d, _e = _a.audioFile, audioFile = _e === void 0 ? null : _e, _f = _a.audioFileUrl, audioFileUrl = _f === void 0 ? '' : _f;
    var groupKey = useState(generateGroupKey(channelUrl, key))[0];
    var _g = useVoicePlayerContext(), play = _g.play, pause = _g.pause, stop = _g.stop, voicePlayerStore = _g.voicePlayerStore;
    var isRecordable = useVoiceRecorderContext().isRecordable;
    var currentAudioUnit = ((_b = voicePlayerStore === null || voicePlayerStore === void 0 ? void 0 : voicePlayerStore.audioStorage) === null || _b === void 0 ? void 0 : _b[groupKey]) || AudioUnitDefaultValue();
    var playVoicePlayer = function () {
        if (!isRecordable) {
            play === null || play === void 0 ? void 0 : play({
                groupKey: groupKey,
                audioFile: audioFile,
                audioFileUrl: audioFileUrl,
            });
        }
    };
    var pauseVoicePlayer = function () {
        pause === null || pause === void 0 ? void 0 : pause(groupKey);
    };
    var stopVoicePlayer = function (text) {
        if (text === void 0) { text = ''; }
        stop === null || stop === void 0 ? void 0 : stop(text);
    };
    useEffect(function () {
        return function () {
            var _a;
            if (audioFile || audioFileUrl) {
                // Can't get the current AudioPlayer through the React hooks(useReducer or useState) in this scope
                var voiceAudioPlayerElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
                (_a = voiceAudioPlayerElement === null || voiceAudioPlayerElement === void 0 ? void 0 : voiceAudioPlayerElement.pause) === null || _a === void 0 ? void 0 : _a.call(voiceAudioPlayerElement);
            }
        };
    }, []);
    return ({
        play: playVoicePlayer,
        pause: pauseVoicePlayer,
        stop: stopVoicePlayer,
        /**
         * The reason why we multiply this by *1000 is,
         * The unit of playbackTime and duration should be millisecond
         */
        playbackTime: ((currentAudioUnit === null || currentAudioUnit === void 0 ? void 0 : currentAudioUnit.playbackTime) || 0) * 1000,
        duration: ((currentAudioUnit === null || currentAudioUnit === void 0 ? void 0 : currentAudioUnit.duration) || 0) * 1000,
        playingStatus: currentAudioUnit.playingStatus,
    });
};

export { useVoicePlayer };
//# sourceMappingURL=useVoicePlayer.js.map
