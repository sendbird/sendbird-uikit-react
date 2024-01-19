import {
  INITIALIZE_AUDIO_UNIT,
  RESET_AUDIO_UNIT,
  ON_CURRENT_TIME_UPDATE,
  ON_VOICE_PLAYER_PAUSE,
  ON_VOICE_PLAYER_PLAY,
  SET_CURRENT_PLAYER,
} from './actionTypes';
import {
  AudioStorageUnit,
  AudioUnitDefaultValue,
  VoicePlayerInitialState,
  VOICE_PLAYER_STATUS,
} from './initialState';

type InitializeAudioUnitPayload = { groupKey: string };
type SetCurrentPlayerPayload = { audioPlayer: HTMLAudioElement, groupKey: string };
type OnVoicePlayerPlayPayload = { groupKey: string, audioFile: File };
type OnVoicePlayerPausePayload = { groupKey: string };
type OnCurrentTimeUpdatePayload = { groupKey: string };
type PayloadType = (
  InitializeAudioUnitPayload
  | SetCurrentPlayerPayload
  | OnVoicePlayerPlayPayload
  | OnVoicePlayerPausePayload
  | OnCurrentTimeUpdatePayload
);
type ActionType = {
  type: string;
  payload: PayloadType;
};

export default function voicePlayerReducer(
  state: VoicePlayerInitialState,
  action: ActionType,
): VoicePlayerInitialState {
  switch (action.type) {
    case INITIALIZE_AUDIO_UNIT: {
      const { groupKey } = action.payload as InitializeAudioUnitPayload;
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : AudioUnitDefaultValue()) as AudioStorageUnit;
      audioUnit.playingStatus = VOICE_PLAYER_STATUS.PREPARING;
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: audioUnit,
        },
      };
    }
    case RESET_AUDIO_UNIT: {
      const { groupKey } = action.payload;
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: AudioUnitDefaultValue(),
        }
      };
    }
    case SET_CURRENT_PLAYER: {
      const { audioPlayer, groupKey } = action.payload as SetCurrentPlayerPayload;
      return {
        ...state,
        currentPlayer: audioPlayer,
        currentGroupKey: groupKey,
      };
    }
    case ON_VOICE_PLAYER_PLAY: {
      const { groupKey, audioFile } = action.payload as OnVoicePlayerPlayPayload;
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : AudioUnitDefaultValue()) as AudioStorageUnit;
      audioUnit.audioFile = audioFile;
      audioUnit.playingStatus = VOICE_PLAYER_STATUS.PLAYING;
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: audioUnit,
        },
      };
    }
    case ON_VOICE_PLAYER_PAUSE: {
      const { groupKey } = action.payload as OnVoicePlayerPausePayload;
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : AudioUnitDefaultValue()) as AudioStorageUnit;
      audioUnit.playingStatus = VOICE_PLAYER_STATUS.PAUSED;
      const { currentTime, duration } = state.currentPlayer as HTMLAudioElement;
      if (audioUnit.playbackTime === audioUnit.duration) {
        audioUnit.playbackTime = 0;
      } else if (currentTime > 0 && duration > 0) {
        audioUnit.playbackTime = currentTime;
        audioUnit.duration = duration;
      }
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: audioUnit,
        },
      };
    }
    case ON_CURRENT_TIME_UPDATE: {
      const { groupKey } = action.payload as OnCurrentTimeUpdatePayload;
      const { currentTime, duration } = state.currentPlayer as HTMLAudioElement;
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : AudioUnitDefaultValue()) as AudioStorageUnit;
      // sometimes the final time update is fired AFTER the pause event when audio is finished
      if (audioUnit.playbackTime === audioUnit.duration && audioUnit.playingStatus === VOICE_PLAYER_STATUS.PAUSED) {
        audioUnit.playbackTime = 0;
      } else if (currentTime > 0 && duration > 0) {
        audioUnit.playbackTime = currentTime;
        audioUnit.duration = duration;
      }
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: audioUnit,
        },
      };
    }
    default:
      return state;
  }
}
