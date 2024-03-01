import React__default, { createContext, useReducer, useContext } from 'react';
import { _ as __assign } from './bundle-xhjHZ041.js';
import { i as VOICE_PLAYER_ROOT_ID, g as VOICE_PLAYER_AUDIO_ID, a as VOICE_MESSAGE_FILE_NAME, b as VOICE_MESSAGE_MIME_TYPE } from './bundle-UKdN0Ihw.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';

var INITIALIZE_AUDIO_UNIT = 'INITIALIZE_AUDIO_UNIT';
var RESET_AUDIO_UNIT = 'RESET_AUDIO_UNIT';
var SET_CURRENT_PLAYER = 'SET_CURRENT_PLAYER';
var ON_VOICE_PLAYER_PLAY = 'ON_VOICE_PLAYER_PLAY';
var ON_VOICE_PLAYER_PAUSE = 'ON_VOICE_PLAYER_PAUSE';
var ON_CURRENT_TIME_UPDATE = 'ON_CURRENT_TIME_UPDATE';

var VOICE_PLAYER_STATUS = {
    IDLE: 'IDLE',
    PREPARING: 'PREPARING',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    COMPLETED: 'COMPLETED',
};
var AudioUnitDefaultValue = function () { return ({
    audioFile: null,
    playbackTime: 0,
    duration: 1000,
    playingStatus: VOICE_PLAYER_STATUS.IDLE,
}); };
var voicePlayerInitialState = {
    currentPlayer: null,
    currentGroupKey: '',
    audioStorage: {},
};

function voicePlayerReducer(state, action) {
    var _a, _b, _c, _d, _e;
    var _f, _g, _h, _j;
    switch (action.type) {
        case INITIALIZE_AUDIO_UNIT: {
            var groupKey = action.payload.groupKey;
            var audioUnit = (((_f = state.audioStorage) === null || _f === void 0 ? void 0 : _f[groupKey]) ? state.audioStorage[groupKey] : AudioUnitDefaultValue());
            audioUnit.playingStatus = VOICE_PLAYER_STATUS.PREPARING;
            return __assign(__assign({}, state), { audioStorage: __assign(__assign({}, state.audioStorage), (_a = {}, _a[groupKey] = audioUnit, _a)) });
        }
        case RESET_AUDIO_UNIT: {
            var groupKey = action.payload.groupKey;
            return __assign(__assign({}, state), { audioStorage: __assign(__assign({}, state.audioStorage), (_b = {}, _b[groupKey] = AudioUnitDefaultValue(), _b)) });
        }
        case SET_CURRENT_PLAYER: {
            var _k = action.payload, audioPlayer = _k.audioPlayer, groupKey = _k.groupKey;
            return __assign(__assign({}, state), { currentPlayer: audioPlayer, currentGroupKey: groupKey });
        }
        case ON_VOICE_PLAYER_PLAY: {
            var _l = action.payload, groupKey = _l.groupKey, audioFile = _l.audioFile;
            var audioUnit = (((_g = state.audioStorage) === null || _g === void 0 ? void 0 : _g[groupKey]) ? state.audioStorage[groupKey] : AudioUnitDefaultValue());
            audioUnit.audioFile = audioFile;
            audioUnit.playingStatus = VOICE_PLAYER_STATUS.PLAYING;
            return __assign(__assign({}, state), { audioStorage: __assign(__assign({}, state.audioStorage), (_c = {}, _c[groupKey] = audioUnit, _c)) });
        }
        case ON_VOICE_PLAYER_PAUSE: {
            var _m = action.payload, groupKey = _m.groupKey, duration = _m.duration, currentTime = _m.currentTime;
            var audioUnit = (((_h = state.audioStorage) === null || _h === void 0 ? void 0 : _h[groupKey]) ? state.audioStorage[groupKey] : AudioUnitDefaultValue());
            audioUnit.playingStatus = VOICE_PLAYER_STATUS.PAUSED;
            if (duration === currentTime) {
                audioUnit.playbackTime = 0;
            }
            return __assign(__assign({}, state), { audioStorage: __assign(__assign({}, state.audioStorage), (_d = {}, _d[groupKey] = audioUnit, _d)) });
        }
        case ON_CURRENT_TIME_UPDATE: {
            var groupKey = action.payload.groupKey;
            var _o = state.currentPlayer, currentTime = _o.currentTime, duration = _o.duration;
            var audioUnit = (((_j = state.audioStorage) === null || _j === void 0 ? void 0 : _j[groupKey]) ? state.audioStorage[groupKey] : AudioUnitDefaultValue());
            // sometimes the final time update is fired AFTER the pause event when audio is finished
            if (audioUnit.playbackTime === audioUnit.duration && audioUnit.playingStatus === VOICE_PLAYER_STATUS.PAUSED) {
                audioUnit.playbackTime = 0;
            }
            else if (currentTime > 0 && duration > 0) {
                audioUnit.playbackTime = currentTime;
                audioUnit.duration = duration;
            }
            return __assign(__assign({}, state), { audioStorage: __assign(__assign({}, state.audioStorage), (_e = {}, _e[groupKey] = audioUnit, _e)) });
        }
        default:
            return state;
    }
}

var ALL = 'ALL';
var noop = function () { };
var VoicePlayerStoreDefaultValue = {
    currentGroupKey: '',
    currentPlayer: null,
    audioStorage: {},
};
var Context = createContext({
    play: noop,
    pause: noop,
    stop: noop,
    voicePlayerStore: VoicePlayerStoreDefaultValue,
});
var VoicePlayerProvider = function (_a) {
    var children = _a.children;
    var _b = useReducer(voicePlayerReducer, voicePlayerInitialState), voicePlayerStore = _b[0], voicePlayerDispatcher = _b[1];
    var currentGroupKey = voicePlayerStore.currentGroupKey, currentPlayer = voicePlayerStore.currentPlayer, audioStorage = voicePlayerStore.audioStorage;
    var config = useSendbirdStateContext().config;
    var logger = config.logger;
    var stop = function (text) {
        if (text === void 0) { text = ''; }
        if (currentGroupKey.includes(text)) {
            logger.info('VoicePlayer: Pause playing(by text).');
            pause(currentGroupKey);
        }
    };
    var pause = function (groupKey) {
        if (currentGroupKey === groupKey && currentPlayer !== null) {
            logger.info('VoicePlayer: Pause playing(by group key).');
            currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.pause();
        }
        if (groupKey === ALL) {
            logger.info('VoicePlayer: Pause playing(all).');
            currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.pause();
        }
    };
    var play = function (_a) {
        var groupKey = _a.groupKey, _b = _a.audioFile, audioFile = _b === void 0 ? null : _b, _c = _a.audioFileUrl, audioFileUrl = _c === void 0 ? '' : _c;
        if (groupKey !== currentGroupKey) {
            pause(currentGroupKey);
        }
        // Clear the previous AudioPlayer element
        var voicePlayerRoot = document.getElementById(VOICE_PLAYER_ROOT_ID);
        var voicePlayerAudioElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
        if (voicePlayerAudioElement) {
            voicePlayerRoot.removeChild(voicePlayerAudioElement);
        }
        logger.info('VoicePlayer: Start getting audio file.');
        new Promise(function (resolve, reject) {
            var _a;
            voicePlayerDispatcher({
                type: INITIALIZE_AUDIO_UNIT,
                payload: { groupKey: groupKey },
            });
            // audio file passed as a parameter
            if (audioFile) {
                logger.info('VoicePlayer: Use the audioFile instance.');
                resolve(audioFile);
                return;
            }
            // audio file from the audioStorage
            var cachedAudioFile = (_a = audioStorage === null || audioStorage === void 0 ? void 0 : audioStorage[groupKey]) === null || _a === void 0 ? void 0 : _a.audioFile;
            if (cachedAudioFile) {
                logger.info('VoicePlayer: Get from the audioStorage.');
                resolve(cachedAudioFile);
                return;
            }
            // fetch the audio file from URL
            fetch(audioFileUrl)
                .then(function (res) { return res.blob(); })
                .then(function (blob) {
                var audioFile = new File([blob], VOICE_MESSAGE_FILE_NAME, {
                    lastModified: new Date().getTime(),
                    type: VOICE_MESSAGE_MIME_TYPE,
                });
                resolve(audioFile);
                logger.info('VoicePlayer: Get the audioFile from URL.');
            })
                .catch(reject);
        })
            .then(function (audioFile) {
            var _a;
            var voicePlayerRoot = document.getElementById(VOICE_PLAYER_ROOT_ID);
            logger.info('VoicePlayer: Succeeded getting audio file.', { audioFile: audioFile });
            var currentAudioUnit = audioStorage[groupKey] || AudioUnitDefaultValue();
            var audioPlayer = new Audio((_a = URL === null || URL === void 0 ? void 0 : URL.createObjectURL) === null || _a === void 0 ? void 0 : _a.call(URL, audioFile));
            audioPlayer.id = VOICE_PLAYER_AUDIO_ID;
            audioPlayer.currentTime = currentAudioUnit.playbackTime;
            audioPlayer.volume = 1;
            audioPlayer.loop = false;
            audioPlayer.onplaying = function () {
                logger.info('VoicePlayer: OnPlaying event is called from audioPlayer', { groupKey: groupKey, audioPlayer: audioPlayer });
                voicePlayerDispatcher({
                    type: ON_VOICE_PLAYER_PLAY,
                    payload: { groupKey: groupKey, audioFile: audioFile },
                });
            };
            audioPlayer.onpause = function () {
                logger.info('VoicePlayer: OnPause event is called from audioPlayer', { groupKey: groupKey, audioPlayer: audioPlayer });
                voicePlayerDispatcher({
                    type: ON_VOICE_PLAYER_PAUSE,
                    payload: { groupKey: groupKey, duration: audioPlayer.duration, currentTime: audioPlayer.currentTime },
                });
            };
            audioPlayer.ontimeupdate = function () {
                voicePlayerDispatcher({
                    type: ON_CURRENT_TIME_UPDATE,
                    payload: { groupKey: groupKey },
                });
            };
            audioPlayer.onerror = function (error) {
                logger.error('VoicePlayer: Failed to load the audioFile on the audio player.', error);
                voicePlayerDispatcher({
                    type: RESET_AUDIO_UNIT,
                    payload: { groupKey: groupKey },
                });
            };
            audioPlayer.dataset.sbGroupId = groupKey;
            // clean up the previous audio player
            try {
                voicePlayerRoot === null || voicePlayerRoot === void 0 ? void 0 : voicePlayerRoot.childNodes.forEach(function (node) {
                    var _a, _b;
                    var element = node;
                    var thisGroupKey = (_a = element.dataset) === null || _a === void 0 ? void 0 : _a.sbGroupKey;
                    if (thisGroupKey !== groupKey) {
                        (_b = element === null || element === void 0 ? void 0 : element.pause) === null || _b === void 0 ? void 0 : _b.call(element);
                        voicePlayerRoot.removeChild(element);
                        logger.info('VoicePlayer: Removed other player.', { element: element });
                    }
                });
            }
            finally {
                audioPlayer === null || audioPlayer === void 0 ? void 0 : audioPlayer.play();
                voicePlayerRoot === null || voicePlayerRoot === void 0 ? void 0 : voicePlayerRoot.appendChild(audioPlayer);
                voicePlayerDispatcher({
                    type: SET_CURRENT_PLAYER,
                    payload: { groupKey: groupKey, audioPlayer: audioPlayer },
                });
                logger.info('VoicePlayer: Succeeded playing audio player.', { groupKey: groupKey, audioPlayer: audioPlayer });
            }
        })
            .catch(function (error) {
            logger.warning('VoicePlayer: Failed loading audio file with URL.', error);
            voicePlayerDispatcher({
                type: RESET_AUDIO_UNIT,
                payload: { groupKey: groupKey },
            });
        });
    };
    return (React__default.createElement(Context.Provider, { value: {
            play: play,
            pause: pause,
            stop: stop,
            voicePlayerStore: voicePlayerStore,
        } },
        React__default.createElement("div", { id: VOICE_PLAYER_ROOT_ID, style: { display: 'none' } }),
        children));
};
var useVoicePlayerContext = function () { return useContext(Context); };

export { AudioUnitDefaultValue as A, VOICE_PLAYER_STATUS as V, ALL as a, VoicePlayerProvider as b, useVoicePlayerContext as u };
//# sourceMappingURL=bundle-JkSXeub7.js.map
