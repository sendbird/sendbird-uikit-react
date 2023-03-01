import React, { createContext, useCallback, useContext, useState } from 'react';

const noop = () => {/* noop */ };

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
  stop: (groupKey?: string) => void;
}

const VoicePlayerContext = createContext<VoicePlayerContext>({
  play: noop,
  stop: noop,
});

export const VoicePlayerProvider = ({
  children,
}: VoicePlayerProps): React.ReactElement => {
  const [currentPlayer, setAudioPlayer] = useState<HTMLAudioElement>(null);
  const [currentGroupKey, setCurrentGroupKey] = useState<string>('');

  const clearStates = (): void => {
    setAudioPlayer(null);
    setCurrentGroupKey('');
  };

  const stop = useCallback((groupKey?: string): void => {
    if (groupKey === undefined || (groupKey?.length > 0 && groupKey === currentGroupKey)) {
      currentPlayer?.pause();
      clearStates();
    }
  }, [currentPlayer, currentGroupKey]);

  const play = ({
    audioFile,
    groupKey,
  }: VoicePlayerPlayProps): void => {
    if (currentPlayer || currentGroupKey) {
      stop();
    }

    const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
    // audioPlayer.currentTime = playbackTime;
    audioPlayer.volume = 1;
    audioPlayer.loop = false;
    audioPlayer.onplaying = () => {
    };
    audioPlayer.onpause = () => {
    };
    audioPlayer.ontimeupdate = () => {
    };
    audioPlayer?.play();
    setAudioPlayer(audioPlayer);
    setCurrentGroupKey(groupKey);
  };

  return (
    <VoicePlayerContext.Provider value={{
      play,
      stop,
    }}>
      {children}
    </VoicePlayerContext.Provider>
  );
};

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(VoicePlayerContext);
