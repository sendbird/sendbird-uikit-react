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
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_PLAYER_AUDIO_ID,
  VOICE_PLAYER_ROOT_ID,
} from '../../utils/consts';
import useSendbirdStateContext from '../useSendbirdStateContext';
import { getParsedVoiceAudioFileInfo } from './utils';

// VoicePlayerProvider interface
export interface VoicePlayerProps {
  children: React.ReactElement;
}
export interface VoicePlayerPlayProps {
  groupKey: string;
  audioFile?: File;
  audioFileUrl?: string;
  audioFileMimeType?: string;
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

  const pause = (groupKey?: string) => {
    if (currentPlayer) {
      if (groupKey === currentGroupKey) {
        logger.info('VoicePlayer: Pause playing(by group key).');
        currentPlayer.pause();
      } else if (groupKey === ALL) {
        logger.info('VoicePlayer: Pause playing(all).');
        currentPlayer.pause();
      }
    } else {
      logger.warning('VoicePlayer: No currentPlayer to pause.');
    }
  };

  const play = ({
    groupKey,
    audioFile,
    audioFileUrl = '',
    audioFileMimeType = VOICE_MESSAGE_MIME_TYPE,
  }: VoicePlayerPlayProps): void => {
    if (groupKey !== currentGroupKey) {
      pause(currentGroupKey);
    }

    // Clear the previous AudioPlayer element
    const voicePlayerRoot = document.getElementById(VOICE_PLAYER_ROOT_ID);
    const voicePlayerAudioElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
    if (voicePlayerRoot && voicePlayerAudioElement) {
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
          const audioFile = new File([blob], getParsedVoiceAudioFileInfo(audioFileMimeType).name, {
            lastModified: new Date().getTime(),
            type: getParsedVoiceAudioFileInfo(audioFileMimeType).mimeType,
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
            payload: { groupKey, duration: audioPlayer.duration, currentTime: audioPlayer.currentTime },
          });
        };
        audioPlayer.ontimeupdate = () => {
          voicePlayerDispatcher({
            type: ON_CURRENT_TIME_UPDATE,
            payload: { groupKey },
          });
        };
        audioPlayer.onerror = (error) => {
          logger.error('VoicePlayer: Failed to load the audioFile on the audio player.', error);
          voicePlayerDispatcher({
            type: RESET_AUDIO_UNIT,
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
      {/**
       * This empty div is also used for finding the root div element
       * within SendbirdProvider to set the 'dir' attribute ('rtl' | 'ltr').
       * See hooks/useHTMLTextDirection.tsx for more details.
       */}
      <div id={VOICE_PLAYER_ROOT_ID} style={{ display: 'none' }} />

      {children}
    </Context.Provider>
  );
};

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(Context);
