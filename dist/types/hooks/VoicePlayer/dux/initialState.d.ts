import { ObjectValues } from '../../../utils/typeHelpers/objectValues';
import { GroupKey } from '../utils';
export declare const VOICE_PLAYER_STATUS: {
    readonly IDLE: "IDLE";
    readonly PREPARING: "PREPARING";
    readonly PLAYING: "PLAYING";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
};
export declare const VoicePlayerStatus: {
    readonly IDLE: "IDLE";
    readonly PREPARING: "PREPARING";
    readonly PLAYING: "PLAYING";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
};
export type VoicePlayerStatusType = ObjectValues<typeof VOICE_PLAYER_STATUS>;
export type AudioStorageUnit = {
    playingStatus: VoicePlayerStatusType;
    audioFile: null | File;
    playbackTime: number;
    duration: number;
};
export declare const AudioUnitDefaultValue: () => AudioStorageUnit;
export interface VoicePlayerInitialState {
    currentPlayer: null | HTMLAudioElement;
    currentGroupKey: string;
    audioStorage: Record<GroupKey, AudioStorageUnit>;
}
export declare const voicePlayerInitialState: VoicePlayerInitialState;
