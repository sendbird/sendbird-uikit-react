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
  RESET_AUDIO_UNIT,
  SET_CURRENT_PLAYER,
} from './dux/actionTypes';
import {
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_PLAYER_AUDIO_ID,
  VOICE_PLAYER_ROOT_ID,
} from '../../utils/consts';
import useSendbirdStateContext from '../useSendbirdStateContext';

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
  stop: (text?: string) => void;
  voicePlayerStore: VoicePlayerInitialState;
}

export const ALL = 'ALL';

const noop = () => { /* noop */ };
const VoicePlayerStoreDefaultValue = {
  currentGroupKey: '',
  currentPlayer: null,
  audioStorage: {},
};

const Context = createContext<VoicePlayerContext>({
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
  const { config } = useSendbirdStateContext();
  const { logger } = config;

  const stop = (text = '') => {
    if (currentGroupKey.includes(text)) {
      logger.info('VoicePlayer: Pause playing(by text).');
      pause(currentGroupKey);
    }
  };

  const pause = (groupKey: string | null) => {
    if (currentGroupKey === groupKey && currentPlayer !== null) {
      logger.info('VoicePlayer: Pause playing(by group key).');
      currentPlayer?.pause();
    }
    if (groupKey === ALL) {
      logger.info('VoicePlayer: Pause playing(all).');
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

    // Clear the previous AudioPlayer element
    const voicePlayerRoot = document.getElementById(VOICE_PLAYER_ROOT_ID);
    const voicePlayerAudioElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
    if (voicePlayerAudioElement) {
      voicePlayerRoot.removeChild(voicePlayerAudioElement);
    }

    logger.info('VoicePlayer: Start getting audio file.');
    new Promise<File>((resolve, reject) => {
      voicePlayerDispatcher({
        type: INITIALIZE_AUDIO_UNIT,
        payload: { groupKey },
      });
      // audio file passed as a parameter
      if (audioFile) {
        logger.info('VoicePlayer: Use the audioFile instance.');
        resolve(audioFile);
        return;
      }
      // audio file from the audioStorage
      const cachedAudioFile = audioStorage?.[groupKey]?.audioFile;
      if (cachedAudioFile) {
        logger.info('VoicePlayer: Get from the audioStorage.');
        resolve(cachedAudioFile);
        return;
      }
      // fetch the audio file from URL
      fetch(audioFileUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const audioFile = new File([blob], VOICE_MESSAGE_FILE_NAME, {
            lastModified: new Date().getTime(),
            type: VOICE_MESSAGE_MIME_TYPE,
          });
          resolve(audioFile);
          logger.info('VoicePlayer: Get the audioFile from URL.');
        })
        .catch(reject);
    })
      .then((audioFile: File) => {
        const voicePlayerRoot = document.getElementById(VOICE_PLAYER_ROOT_ID);
        logger.info('VoicePlayer: Succeeded getting audio file.', { audioFile });
        const currentAudioUnit = audioStorage[groupKey] || AudioUnitDefaultValue() as AudioStorageUnit;
        const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
        audioPlayer.id = VOICE_PLAYER_AUDIO_ID;
        audioPlayer.currentTime = currentAudioUnit.playbackTime;
        audioPlayer.volume = 1;
        audioPlayer.loop = false;
        audioPlayer.onplaying = () => {
          logger.info('VoicePlayer: OnPlaying event is called from audioPlayer', { groupKey, audioPlayer });
          voicePlayerDispatcher({
            type: ON_VOICE_PLAYER_PLAY,
            payload: { groupKey, audioFile },
          });
        };
        audioPlayer.onpause = () => {
          logger.info('VoicePlayer: OnPause event is called from audioPlayer', { groupKey, audioPlayer });
          voicePlayerDispatcher({
            type: ON_VOICE_PLAYER_PAUSE,
            payload: { groupKey },
          });
        };
        audioPlayer.ontimeupdate = () => {
          voicePlayerDispatcher({
            type: ON_CURRENT_TIME_UPDATE,
            payload: { groupKey },
          });
        };
        audioPlayer.dataset.sbGroupId = groupKey;
        // clean up the previous audio player
        try {
          voicePlayerRoot?.childNodes.forEach((node) => {
            const element = node as HTMLAudioElement;
            const thisGroupKey = element.dataset?.sbGroupKey;
            if (thisGroupKey !== groupKey) {
              element?.pause?.();
              voicePlayerDispatcher({
                type: ON_VOICE_PLAYER_PAUSE,
                payload: { groupKey },
              });
              voicePlayerRoot.removeChild(element);
              logger.info('VoicePlayer: Removed other player.', { element });
            }
          });
        } finally {
          audioPlayer?.play();
          voicePlayerRoot?.appendChild(audioPlayer);
          voicePlayerDispatcher({
            type: SET_CURRENT_PLAYER,
            payload: { groupKey, audioPlayer },
          });
          logger.info('VoicePlayer: Succeeded playing audio player.', { groupKey, audioPlayer });
        }
      })
      .catch((error) => {
        logger.warning('VoicePlayer: Failed loading audio file with URL.', error);
        voicePlayerDispatcher({
          type: RESET_AUDIO_UNIT,
          payload: { groupKey },
        });
      });
  };

  return (
    <Context.Provider value={{
      play,
      pause,
      stop,
      voicePlayerStore,
    }}>
      <div id={VOICE_PLAYER_ROOT_ID} style={{ display: 'none' }} />
      {children}
    </Context.Provider>
  );
};

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(Context);
