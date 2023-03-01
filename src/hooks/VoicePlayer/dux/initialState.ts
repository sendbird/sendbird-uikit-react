import { VoicePlayerStatus } from "..";

export type GroupKey = string;
export type AudioStorageUnit = {
  playingStatus: VoicePlayerStatus;
  audioFile: null | File;
  playbackTime: number;
  duration: number;
}
export const AudioUnitDefaultValue: AudioStorageUnit = {
  audioFile: null,
  playbackTime: 0,
  duration: 1000,
  playingStatus: VoicePlayerStatus.PREPARING,
};

export interface VoicePlayerInitialState {
  currentPlayer: null | HTMLAudioElement;
  currentGroupKey: string;
  audioStorage: Record<GroupKey, AudioStorageUnit>;
}

export const voicePlayerInitialState: VoicePlayerInitialState = {
  currentPlayer: null,
  currentGroupKey: '',
  audioStorage: {},
}
