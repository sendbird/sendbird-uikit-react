import { VoicePlayerStatus } from "..";

export type GroupKey = string;
export type AudioStorageUnit = {
  playingStatus: VoicePlayerStatus;
  audioFile: null | File;
  playbackTime: number;
  duration: number;
}
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
