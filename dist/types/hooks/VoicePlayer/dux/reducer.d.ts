import { VoicePlayerInitialState } from './initialState';
type InitializeAudioUnitPayload = {
    groupKey: string;
};
type SetCurrentPlayerPayload = {
    audioPlayer: HTMLAudioElement;
    groupKey: string;
};
type OnVoicePlayerPlayPayload = {
    groupKey: string;
    audioFile: File;
};
type OnVoicePlayerPausePayload = {
    groupKey: string;
    duration: number;
    currentTime: number;
};
type OnCurrentTimeUpdatePayload = {
    groupKey: string;
};
type PayloadType = (InitializeAudioUnitPayload | SetCurrentPlayerPayload | OnVoicePlayerPlayPayload | OnVoicePlayerPausePayload | OnCurrentTimeUpdatePayload);
type ActionType = {
    type: string;
    payload: PayloadType;
};
export default function voicePlayerReducer(state: VoicePlayerInitialState, action: ActionType): VoicePlayerInitialState;
export {};
