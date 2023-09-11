export const SCROLL_BUFFER = 10;

// voice message record
export const VOICE_RECORDER_CLICK_BUFFER_TIME = 250;
export const VOICE_RECORDER_DEFAULT_MIN = 1000; // 1 seconds
export const VOICE_RECORDER_DEFAULT_MAX = 600000; // 10 minutes
export const VOICE_RECORDER_AUDIO_BIT_RATE = 12000;
export const VOICE_RECORDER_AUDIO_SAMPLE_RATE = 11025;
export const BROWSER_SUPPORT_MIME_TYPE_LIST = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg'];

// voice message play
export const VOICE_PLAYER_PLAYBACK_BUFFER = 0.01;
export const VOICE_PLAYER_DURATION_MIN_SIZE = 1000;

/**
 * Append Audio element to the root
 * because I can't get the Audio element in the useEffect unmount scope
 */
export const VOICE_PLAYER_ROOT_ID = 'sendbird-voice-player-provider-root';
export const VOICE_PLAYER_AUDIO_ID = 'sendbird-global-audio-player-id';

// voice message file
export const VOICE_MESSAGE_FILE_NAME = 'Voice_message.mp3';
export const VOICE_MESSAGE_MIME_TYPE = 'audio/mp3;sbu_type=voice';

// meta array
export const META_ARRAY_VOICE_DURATION_KEY = 'KEY_VOICE_MESSAGE_DURATION';
export const META_ARRAY_MESSAGE_TYPE_KEY = 'KEY_INTERNAL_MESSAGE_TYPE';
export const META_ARRAY_MESSAGE_TYPE_VALUE__VOICE = 'voice/mp3';

// delivery receipt in feature list
export const DELIVERY_RECEIPT = 'delivery_receipt';

// file viewer slider
export const SLIDER_BUTTON_ICON_SIDE_LENGTH = '32px';

// multiple files message file info count limit
export const DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT = 10;
