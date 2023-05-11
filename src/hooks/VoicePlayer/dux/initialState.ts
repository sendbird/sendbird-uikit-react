import { ObjectValues } from '../../../utils/typeHelpers/objectValues';
import { GroupKey } from '../utils';

export const VOICE_PLAYER_STATUS = {
  IDLE: 'IDLE',
  PREPARING: 'PREPARING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const;
export const VoicePlayerStatus = VOICE_PLAYER_STATUS;
export type VoicePlayerStatusType = ObjectValues<typeof VOICE_PLAYER_STATUS>;

export type AudioStorageUnit = {
  playingStatus: VoicePlayerStatusType;
  audioFile: null | File;
  playbackTime: number;
  duration: number;
};
export const AudioUnitDefaultValue = (): AudioStorageUnit => ({
  audioFile: null,
  playbackTime: 0,
  duration: 1000,
  playingStatus: VOICE_PLAYER_STATUS.IDLE,
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
