import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  VoicePlayerEvent,
  VoicePlayerEventParams,
  VoicePlayerEventStorage,
  VoicePlayerEventTypes,
} from './voicePlayerEvent';

const noop = () => {/* noop */ };

// VoicePlayerProvider interface
export interface VoicePlayerProps {
  children: React.ReactElement;
}
export interface VoicePlayerPlayProps {
  audioFile: File;
  playbackTime: number;
  groupKey: string;
}
export interface VoicePlayerContext {
  play: (props: VoicePlayerPlayProps) => void;
  stop: (groupKey?: string) => void;
  addEventHandler: (props: VoicePlayerEvent) => void;
  removeEventHandler: (groupKey: string, handlerId: string) => void;
}

const VoicePlayerContext = createContext<VoicePlayerContext>({
  play: noop,
  stop: noop,
  addEventHandler: noop,
  removeEventHandler: noop,
});

export const VoicePlayerProvider = ({
  children,
}: VoicePlayerProps): React.ReactElement => {
  const [eventStorage, setEventStorage] = useState<VoicePlayerEventStorage>({});
  const [currentPlayer, setAudioPlayer] = useState<HTMLAudioElement>(null);
  const [currentGroupKey, setCurrentGroupKey] = useState<string>('');

  const addEventHandler = (event: VoicePlayerEvent): void => {
    const { groupKey } = event;
    setEventStorage((storage) => {
      if (!storage?.[groupKey]) {
        storage[groupKey] = [];
      }
      storage?.[groupKey].push(event);
      return storage;
    });
  };
  const removeEventHandler = (groupKey: string, handlerId: string): void => {
    setEventStorage((storage) => {
      if (!Array.isArray(storage?.[groupKey])) {
        return storage;
      }
      return ({
        ...storage,
        [groupKey]: storage[groupKey].filter(({ id }) => id !== handlerId),
      });
    });
  };
  const triggerEvent = useCallback((eventType: VoicePlayerEventTypes, payload: VoicePlayerEventParams): void => {
    const { groupKey } = payload;
    if (Array.isArray(eventStorage?.[groupKey])) {
      eventStorage[groupKey].map((playerEvent) => {
        playerEvent?.[eventType]?.(payload);
      });
    }
  }, [eventStorage]);
  const clearStates = (): void => {
    if (currentPlayer) {
      currentPlayer.pause();
    }
    // setAudioPlayer(null);
    setCurrentGroupKey('');
  };

  const stop = useCallback((groupKey?: string): void => {
    if (groupKey === undefined || (groupKey?.length > 0 && groupKey === currentGroupKey)) {
      console.log('stopp is called', currentPlayer)
      currentPlayer?.pause();
      clearStates();
    }
  }, [currentPlayer, currentGroupKey]);

  const play = useCallback(({
    audioFile,
    playbackTime,
    groupKey,
  }: VoicePlayerPlayProps): void => {
    if (currentPlayer || currentGroupKey) {
      stop();
    }
    const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
    audioPlayer.currentTime = playbackTime;
    audioPlayer.volume = 1;
    audioPlayer.loop = false;
    audioPlayer.onplaying = () => {
      triggerEvent(VoicePlayerEventTypes.STARTED, {
        groupKey,
        playbackTime: audioPlayer?.currentTime,
        duration: audioPlayer?.duration,
      });
    };
    audioPlayer.onpause = () => {
      triggerEvent(VoicePlayerEventTypes.STOPPED, {
        groupKey,
        playbackTime: audioPlayer?.currentTime,
        duration: audioPlayer?.duration,
      });
    };
    audioPlayer.ontimeupdate = () => {
      triggerEvent(VoicePlayerEventTypes.TIME_UPDATED, {
        groupKey,
        playbackTime: audioPlayer?.currentTime,
        duration: audioPlayer?.duration,
      });
    };
    audioPlayer?.play();
    setAudioPlayer(audioPlayer);
    setCurrentGroupKey(groupKey);
  }, [eventStorage]);

  return (
    <VoicePlayerContext.Provider value={{
      play,
      stop,
      addEventHandler,
      removeEventHandler,
    }}>
      {children}
    </VoicePlayerContext.Provider>
  );
};

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(VoicePlayerContext);
