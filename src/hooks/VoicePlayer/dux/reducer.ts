import { VoicePlayerStatus } from "..";
import {
  INITIALIZE_AUDIO_UNIT,
  ON_CURRENT_TIME_UPDATE,
  ON_VOICE_PLAYER_PAUSE,
  ON_VOICE_PLAYER_PLAY,
  SET_CURRENT_PLAYER,
} from "./actionTypes";
import { AudioStorageUnit, VoicePlayerInitialState } from "./initialState";

type InitializeAudioUnitPayload = { groupKey: string };
type SetCurrentPlayerPayload = { audioPlayer: HTMLAudioElement, groupKey: string };
type OnVoicePlayerPlayPayload = { groupKey: string, audioFile: File };
type OnVoicePlayerPausePayload = { groupKey: string };
type OnCurrentTimeUpdatePayload = { groupKey: string, duration: number, playbackTime: number };
type PayloadType = SetCurrentPlayerPayload | OnVoicePlayerPlayPayload | OnVoicePlayerPausePayload | OnCurrentTimeUpdatePayload;
type ActionType = {
  type: string;
  payload: PayloadType;
}
const audioUnitInitialValue = {
  audioFile: null,
  playbackTime: 0,
  duration: 1000,
};

export default function reducer(
  state: VoicePlayerInitialState,
  action: ActionType,
): VoicePlayerInitialState {
  switch (action.type) {
    case INITIALIZE_AUDIO_UNIT: {
      const { groupKey } = action.payload as InitializeAudioUnitPayload;
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : audioUnitInitialValue) as AudioStorageUnit;
      audioUnit.playingStatus = VoicePlayerStatus.PREPARING;
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: audioUnit,
        },
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
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : audioUnitInitialValue) as AudioStorageUnit;
      audioUnit.audioFile = audioFile;
      audioUnit.playingStatus = VoicePlayerStatus.PLAYING;
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
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : audioUnitInitialValue) as AudioStorageUnit;
      audioUnit.playingStatus = VoicePlayerStatus.PAUSED;
      return {
        ...state,
        audioStorage: {
          ...state.audioStorage,
          [groupKey]: audioUnit,
        },
      };
    }
    case ON_CURRENT_TIME_UPDATE: {
      const { groupKey, playbackTime, duration } = action.payload as OnCurrentTimeUpdatePayload;
      const audioUnit = (state.audioStorage?.[groupKey] ? state.audioStorage[groupKey] : audioUnitInitialValue) as AudioStorageUnit;
      // audioUnit.playingStatus = VoicePlayerStatus.PAUSED;
      console.log('ON_CURRENT_TIME_UPDATE - playback time: ', playbackTime, state.currentPlayer.currentTime);
      console.log('ON_CURRENT_TIME_UPDATE - duration: ', duration, state.currentPlayer.duration);
      // return {
      //   ...state,
      //   audioStorage: {
      //     ...state.audioStorage,
      //     [groupKey]: audioUnit,
      //   },
      // };
    }
    default:
      return state;
  }
}
