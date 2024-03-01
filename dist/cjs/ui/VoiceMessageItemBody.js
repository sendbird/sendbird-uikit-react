'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ui_ProgressBar = require('./ProgressBar.js');
var VoicePlayer_useVoicePlayer = require('../VoicePlayer/useVoicePlayer.js');
var ui_PlaybackTime = require('./PlaybackTime.js');
var ui_Loader = require('./Loader.js');
var ui_Icon = require('./Icon.js');
var ui_Label = require('../chunks/bundle-KkCwxjVN.js');
var VoicePlayer_context = require('../chunks/bundle-jXnX-7jH.js');
require('../chunks/bundle-Atn5EZwu.js');
require('../VoiceRecorder/context.js');
require('../chunks/bundle-WKa05h0_.js');
require('../chunks/bundle-Yzhiyr0t.js');
require('../chunks/bundle-HY8cubCp.js');
require('../chunks/bundle-6hGNMML2.js');
require('../chunks/bundle-xbdnJE9-.js');
require('react-dom');
require('../chunks/bundle-jCTpndN0.js');
require('../chunks/bundle-4WvE40Un.js');
require('./IconButton.js');
require('./Button.js');
require('../useSendbirdStateContext.js');
require('../withSendbird.js');

var VoiceMessageItemBody = function (_a) {
    var _b;
    var className = _a.className, message = _a.message, channelUrl = _a.channelUrl, _c = _a.isByMe, isByMe = _c === void 0 ? false : _c, _d = _a.isReactionEnabled, isReactionEnabled = _d === void 0 ? false : _d;
    var _e = React.useState(false), usingReaction = _e[0], setUsingReaction = _e[1];
    var _f = VoicePlayer_useVoicePlayer.useVoicePlayer({
        channelUrl: channelUrl,
        key: "".concat(message === null || message === void 0 ? void 0 : message.messageId),
        audioFileUrl: message === null || message === void 0 ? void 0 : message.url,
    }), play = _f.play, 
    // do not pause on unmount, because on desktop layout
    // the component can be paused when it is played from
    // channel and same message is unmounted from the thread
    pause = _f.pause, _g = _f.playbackTime, playbackTime = _g === void 0 ? 0 : _g, duration = _f.duration, _h = _f.playingStatus, playingStatus = _h === void 0 ? VoicePlayer_context.VOICE_PLAYER_STATUS.IDLE : _h;
    React.useEffect(function () {
        var _a;
        if (isReactionEnabled && ((_a = message === null || message === void 0 ? void 0 : message.reactions) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            setUsingReaction(true);
        }
        else {
            setUsingReaction(false);
        }
    }, [isReactionEnabled, (_b = message === null || message === void 0 ? void 0 : message.reactions) === null || _b === void 0 ? void 0 : _b.length]);
    var progresBarMaxSize = React.useMemo(function () {
        var _a;
        if (message === null || message === void 0 ? void 0 : message.metaArrays) {
            var duration_1 = (_a = message === null || message === void 0 ? void 0 : message.metaArrays.find(function (metaArray) { return metaArray.key === 'KEY_VOICE_MESSAGE_DURATION'; })) === null || _a === void 0 ? void 0 : _a.value[0];
            return duration_1 && parseInt(duration_1);
        }
        return 1;
    }, [message === null || message === void 0 ? void 0 : message.metaArrays]);
    return (React.createElement("div", { className: "sendbird-voice-message-item-body ".concat(className, " ").concat(usingReaction ? 'is-reactions-contained' : '') },
        React.createElement(ui_ProgressBar.ProgressBar, { className: "sendbird-voice-message-item-body__progress-bar", maxSize: duration || progresBarMaxSize, currentSize: playbackTime, colorType: isByMe ? ui_ProgressBar.ProgressBarColorTypes.PRIMARY : ui_ProgressBar.ProgressBarColorTypes.GRAY }),
        React.createElement("div", { className: "sendbird-voice-message-item-body__status-button" },
            (playingStatus === VoicePlayer_context.VOICE_PLAYER_STATUS.IDLE || playingStatus === VoicePlayer_context.VOICE_PLAYER_STATUS.PAUSED) && (React.createElement("div", { className: "sendbird-voice-message-item-body__status-button__button", onClick: play },
                React.createElement(ui_Icon.default, { width: "18px", height: "18px", type: ui_Icon.IconTypes.PLAY, fillColor: ui_Icon.IconColors.PRIMARY }))),
            playingStatus === VoicePlayer_context.VOICE_PLAYER_STATUS.PREPARING && (React.createElement(ui_Loader, { width: "22.2px", height: "22.2px" },
                React.createElement(ui_Icon.default, { width: "22.2px", height: "22.2px", type: ui_Icon.IconTypes.SPINNER, fillColor: ui_Icon.IconColors.PRIMARY_2 }))),
            playingStatus === VoicePlayer_context.VOICE_PLAYER_STATUS.PLAYING && (React.createElement("div", { className: "sendbird-voice-message-item-body__status-button__button", onClick: function () { pause(); } },
                React.createElement("div", { className: "sendbird-voice-message-item-body__status-button__button__pause" },
                    React.createElement("div", { className: "sendbird-voice-message-item-body__status-button__button__pause__inner" }),
                    React.createElement("div", { className: "sendbird-voice-message-item-body__status-button__button__pause__inner" }))))),
        React.createElement(ui_PlaybackTime.PlaybackTime, { className: "sendbird-voice-message-item-body__playback-time", time: progresBarMaxSize - playbackTime, labelType: ui_Label.LabelTypography.BODY_1, labelColor: isByMe ? ui_Label.LabelColors.ONCONTENT_1 : ui_Label.LabelColors.ONBACKGROUND_1 })));
};

exports.VoiceMessageItemBody = VoiceMessageItemBody;
exports.default = VoiceMessageItemBody;
//# sourceMappingURL=VoiceMessageItemBody.js.map
