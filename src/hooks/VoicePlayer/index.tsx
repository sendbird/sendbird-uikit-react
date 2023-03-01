import React, { createContext, useContext, useReducer } from 'react';
import { voicePlayerReducer } from './dux/reducer';
import { CustomUseReducerDispatcher } from '../../lib/SendbirdState';
import {
  AudioStorageUnit,
  VoicePlayerInitialState,
  voicePlayerInitialState,
} from './dux/initialState';
import {
  ON_CURRENT_TIME_UPDATE,
  ON_VOICE_PLAYER_PAUSE,
  ON_VOICE_PLAYER_PLAY,
  SET_CURRENT_PLAYER,
} from './dux/actionTypes';

export const VoicePlayerStatus = {
  PREPARING: 'PREPARING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const;
export type VoicePlayerStatus = typeof VoicePlayerStatus[keyof typeof VoicePlayerStatus];

// VoicePlayerProvider interface
export interface VoicePlayerProps {
  children: React.ReactElement;
}
export interface VoicePlayerPlayProps {
  audioFile: File;
  groupKey: string;
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
  const [voicePlayerStore, voicePlayerDispatcher] = (
    useReducer(voicePlayerReducer, voicePlayerInitialState)
  ) as [VoicePlayerInitialState, CustomUseReducerDispatcher];
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
    audioFile,
  }: VoicePlayerPlayProps): void => {
    if (groupKey !== currentGroupKey) {
      pause(currentGroupKey);
    }

    const currentAudioUnit = audioStorage[groupKey] || {} as AudioStorageUnit;
    const targetAudioFile = currentAudioUnit?.audioFile || audioFile;
    const audioPlayer = new Audio(URL?.createObjectURL?.(targetAudioFile));
    audioPlayer.currentTime = currentAudioUnit?.playbackTime || 0;
    audioPlayer.volume = 1;
    audioPlayer.loop = false;
    audioPlayer.onplaying = () => {
      voicePlayerDispatcher({
        type: ON_VOICE_PLAYER_PLAY,
        payload: {
          groupKey,
          audioFile: targetAudioFile,
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
          playbackTime: audioPlayer?.currentTime,
          duration: audioPlayer?.duration,
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
