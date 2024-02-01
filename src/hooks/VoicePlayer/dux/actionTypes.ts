import { ObjectValues } from '../../../utils/typeHelpers/objectValues';

export const actionTypes = {
  INITIALIZE_AUDIO_UNIT: 'INITIALIZE_AUDIO_UNIT',
  RESET_AUDIO_UNIT: 'RESET_AUDIO_UNIT',
  SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
  ON_VOICE_PLAYER_PLAY: 'ON_VOICE_PLAYER_PLAY',
  ON_VOICE_PLAYER_PAUSE: 'ON_VOICE_PLAYER_PAUSE',
  ON_CURRENT_TIME_UPDATE: 'ON_CURRENT_TIME_UPDATE',
} as const;

export type VoicePlayerActionType = ObjectValues<typeof actionTypes>;

export const INITIALIZE_AUDIO_UNIT: VoicePlayerActionType = 'INITIALIZE_AUDIO_UNIT';
export const RESET_AUDIO_UNIT: VoicePlayerActionType = 'RESET_AUDIO_UNIT';
export const SET_CURRENT_PLAYER: VoicePlayerActionType = 'SET_CURRENT_PLAYER';
export const ON_VOICE_PLAYER_PLAY: VoicePlayerActionType = 'ON_VOICE_PLAYER_PLAY';
export const ON_VOICE_PLAYER_PAUSE: VoicePlayerActionType = 'ON_VOICE_PLAYER_PAUSE';
export const ON_CURRENT_TIME_UPDATE: VoicePlayerActionType = 'ON_CURRENT_TIME_UPDATE';
