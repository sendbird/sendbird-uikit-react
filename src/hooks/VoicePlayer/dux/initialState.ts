import { GroupKey } from '../utils';

export const VoicePlayerStatus = {
  IDLE: 'IDLE',
  PREPARING: 'PREPARING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const;
export type VoicePlayerStatus = typeof VoicePlayerStatus[keyof typeof VoicePlayerStatus];

export type AudioStorageUnit = {
  playingStatus: VoicePlayerStatus;
  audioFile: null | File;
  playbackTime: number;
  duration: number;
};
export const AudioUnitDefaultValue = (): AudioStorageUnit => ({
  audioFile: null,
  playbackTime: 0,
  duration: 1000,
  playingStatus: VoicePlayerStatus.IDLE,
});

export interface VoicePlayerInitialState {
  currentPlayer: null | HTMLAudioElement;
  currentGroupKey: string;
  audioStorage: Record<GroupKey, AudioStorageUnit>;
}

export const voicePlayerInitialState: VoicePlayerInitialState = {
  currentPlayer: null,
  currentGroupKey: '',
  audioStorage: {},
};
