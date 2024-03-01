import { ObjectValues } from '../../../utils/typeHelpers/objectValues';
export declare const actionTypes: {
    readonly INITIALIZE_AUDIO_UNIT: "INITIALIZE_AUDIO_UNIT";
    readonly RESET_AUDIO_UNIT: "RESET_AUDIO_UNIT";
    readonly SET_CURRENT_PLAYER: "SET_CURRENT_PLAYER";
    readonly ON_VOICE_PLAYER_PLAY: "ON_VOICE_PLAYER_PLAY";
    readonly ON_VOICE_PLAYER_PAUSE: "ON_VOICE_PLAYER_PAUSE";
    readonly ON_CURRENT_TIME_UPDATE: "ON_CURRENT_TIME_UPDATE";
};
export type VoicePlayerActionType = ObjectValues<typeof actionTypes>;
export declare const INITIALIZE_AUDIO_UNIT: VoicePlayerActionType;
export declare const RESET_AUDIO_UNIT: VoicePlayerActionType;
export declare const SET_CURRENT_PLAYER: VoicePlayerActionType;
export declare const ON_VOICE_PLAYER_PLAY: VoicePlayerActionType;
export declare const ON_VOICE_PLAYER_PAUSE: VoicePlayerActionType;
export declare const ON_CURRENT_TIME_UPDATE: VoicePlayerActionType;
