/* eslint-disable no-redeclare */
export const VoiceMessageInputStatus = {
  READY_TO_RECORD: 'READY_TO_RECORD',
  RECORDING: 'RECORDING',
  READY_TO_PLAY: 'READY_TO_PLAY',
  PLAYING: 'PLAYING',
} as const;
export type VoiceMessageInputStatus = typeof VoiceMessageInputStatus[keyof typeof VoiceMessageInputStatus];
