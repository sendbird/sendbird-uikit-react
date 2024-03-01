var ONE_MiB = 1024 * 1024;
var SCROLL_BUFFER = 10;
var SCROLL_BOTTOM_DELAY_FOR_SEND = 100;
var SCROLL_BOTTOM_DELAY_FOR_FETCH = 100;
// voice message record
var VOICE_RECORDER_CLICK_BUFFER_TIME = 250;
var VOICE_RECORDER_DEFAULT_MIN = 1000; // 1 seconds
var VOICE_RECORDER_DEFAULT_MAX = 600000; // 10 minutes
var VOICE_RECORDER_AUDIO_BIT_RATE = 12000;
var VOICE_RECORDER_AUDIO_SAMPLE_RATE = 11025;
var BROWSER_SUPPORT_MIME_TYPE_LIST = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg'];
/**
 * Append Audio element to the root
 * because I can't get the Audio element in the useEffect unmount scope
 */
var VOICE_PLAYER_ROOT_ID = 'sendbird-voice-player-provider-root';
var VOICE_PLAYER_AUDIO_ID = 'sendbird-global-audio-player-id';
// voice message file
var VOICE_MESSAGE_FILE_NAME = 'Voice_message.mp3';
var VOICE_MESSAGE_MIME_TYPE = 'audio/mp3;sbu_type=voice';
// meta array
var META_ARRAY_VOICE_DURATION_KEY = 'KEY_VOICE_MESSAGE_DURATION';
var META_ARRAY_MESSAGE_TYPE_KEY = 'KEY_INTERNAL_MESSAGE_TYPE';
var META_ARRAY_MESSAGE_TYPE_VALUE__VOICE = 'voice/mp3';
// delivery receipt in feature list
var DELIVERY_RECEIPT = 'delivery_receipt';
// file viewer slider
var SLIDER_BUTTON_ICON_SIDE_LENGTH = '32px';
// multiple files message file info count limit
var DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT = 10;

export { BROWSER_SUPPORT_MIME_TYPE_LIST as B, DELIVERY_RECEIPT as D, META_ARRAY_VOICE_DURATION_KEY as M, ONE_MiB as O, SCROLL_BUFFER as S, VOICE_RECORDER_AUDIO_BIT_RATE as V, VOICE_MESSAGE_FILE_NAME as a, VOICE_MESSAGE_MIME_TYPE as b, VOICE_RECORDER_AUDIO_SAMPLE_RATE as c, SCROLL_BOTTOM_DELAY_FOR_FETCH as d, SCROLL_BOTTOM_DELAY_FOR_SEND as e, VOICE_RECORDER_DEFAULT_MIN as f, VOICE_PLAYER_AUDIO_ID as g, VOICE_RECORDER_CLICK_BUFFER_TIME as h, VOICE_PLAYER_ROOT_ID as i, META_ARRAY_MESSAGE_TYPE_KEY as j, META_ARRAY_MESSAGE_TYPE_VALUE__VOICE as k, SLIDER_BUTTON_ICON_SIDE_LENGTH as l, DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT as m, VOICE_RECORDER_DEFAULT_MAX as n };
//# sourceMappingURL=bundle-AFXr5NmI.js.map
