import React, { createContext, useContext, useReducer } from 'react';
import voicePlayerReducer from './dux/reducer';
import {
  AudioStorageUnit,
  AudioUnitDefaultValue,
  VoicePlayerInitialState,
  voicePlayerInitialState,
} from './dux/initialState';
import {
  INITIALIZE_AUDIO_UNIT,
  ON_CURRENT_TIME_UPDATE,
  ON_VOICE_PLAYER_PAUSE,
  ON_VOICE_PLAYER_PLAY,
  SET_CURRENT_PLAYER,
} from './dux/actionTypes';
import { VOICE_MESSAGE_FILE_NAME, VOICE_MESSAGE_MIME_TYPE } from '../../utils/consts';

// VoicePlayerProvider interface
export interface VoicePlayerProps {
  children: React.ReactElement;
}
export interface VoicePlayerPlayProps {
  groupKey: string;
  audioFile?: File;
  audioFileUrl?: string;
}
export interface VoicePlayerContext {
  play: (props: VoicePlayerPlayProps) => void;
  pause: (groupKey?: string) => void;
  stop: () => void;
  voicePlayerStore: VoicePlayerInitialState;
}

const noop = () => {/* noop */ };
const VoicePlayerStoreDefaultValue = {
  currentGroupKey: '',
  currentPlayer: null,
  audioStorage: {},
};

const VoicePlayerContext = createContext<VoicePlayerContext>({
  play: noop,
  pause: noop,
  stop: noop,
  voicePlayerStore: VoicePlayerStoreDefaultValue,
});

export const VoicePlayerProvider = ({
  children,
}: VoicePlayerProps): React.ReactElement => {
  const [voicePlayerStore, voicePlayerDispatcher] = useReducer(voicePlayerReducer, voicePlayerInitialState);
  const {
    currentGroupKey,
    currentPlayer,
    audioStorage,
  } = voicePlayerStore;

  const stop = () => {
    pause(currentGroupKey);
  };

  const pause = (groupKey: string) => {
    if (currentGroupKey === groupKey && currentPlayer !== null) {
      currentPlayer?.pause();
    }
  };

  const play = ({
    groupKey,
    audioFile = null,
    audioFileUrl = '',
  }: VoicePlayerPlayProps): void => {
    if (groupKey !== currentGroupKey) {
      pause(currentGroupKey);
    }

    new Promise((resolve) => {
      if (audioStorage?.[groupKey]?.audioFile) {
        resolve(audioStorage[groupKey].audioFile)
      }
      if (audioFile) {
        resolve(audioFile);
      }
      voicePlayerDispatcher({
        type: INITIALIZE_AUDIO_UNIT,
        payload: {
          groupKey,
        },
      });
      fetch(audioFileUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const audioFile = new File([blob], VOICE_MESSAGE_FILE_NAME, {
            lastModified: new Date().getTime(),
            type: VOICE_MESSAGE_MIME_TYPE,
          });
          resolve(audioFile);
        });
    }).then((audioFile: File) => {
      const currentAudioUnit = audioStorage[groupKey] || AudioUnitDefaultValue() as AudioStorageUnit;
      const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
      audioPlayer.currentTime = currentAudioUnit.playbackTime;
      audioPlayer.volume = 1;
      audioPlayer.loop = false;
      audioPlayer.onplaying = () => {
        voicePlayerDispatcher({
          type: ON_VOICE_PLAYER_PLAY,
          payload: {
            groupKey,
            audioFile,
          },
        });
      };
      audioPlayer.onpause = () => {
        voicePlayerDispatcher({
          type: ON_VOICE_PLAYER_PAUSE,
          payload: {
            groupKey,
          },
        });
      };
      audioPlayer.ontimeupdate = () => {
        voicePlayerDispatcher({
          type: ON_CURRENT_TIME_UPDATE,
          payload: {
            groupKey,
          },
        });
      };
      audioPlayer?.play();
      voicePlayerDispatcher({
        type: SET_CURRENT_PLAYER,
        payload: {
          groupKey,
          audioPlayer,
        },
      });
    })
  };

  return (
    <VoicePlayerContext.Provider value={{
      play,
      pause,
      stop,
      voicePlayerStore,
    }}>
      {children}
    </VoicePlayerContext.Provider>
  );
};

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(VoicePlayerContext);
