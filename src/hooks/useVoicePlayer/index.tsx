import React, { createContext, useContext, useState } from 'react';

export interface VoicePlayerProps {
  children: React.ReactElement;
}
export interface VoicePlayerEventHandler {
  onPlayingStarted?: () => void;
  onPlayingStopped?: (props: { playbackTime: number, audioFile: File }) => void;
  onPlaybackTimeUpdated?: (time: number) => void;
}

export interface VoicePlayerContext {
  play: (props: VoicePlayerPlayProps) => void;
  stop: () => void;
}
const noop = () => {/* noop */};
const VoicePlayerContext = createContext<VoicePlayerContext>({
  play: noop,
  stop: noop,
});

interface VoicePlayerPlayProps {
  audioFile: File;
  playPoint?: number;
  eventHandler?: VoicePlayerEventHandler;
}

export const VoicePlayerProvider = (props: VoicePlayerProps): React.ReactElement => {
  const [sourceFile, setSourceFile] = useState<File>(null);
  const [currentPlayer, setCurrentPlayer] = useState<HTMLAudioElement>(null);
  const [currentEventHandler, setEventHandler] = useState<VoicePlayerEventHandler>(null);
  
  const { children } = props;

  function play({
    audioFile,
    playPoint,
    eventHandler,
  }: VoicePlayerPlayProps): void {
    if (sourceFile && currentPlayer) {
      stop();
    }

    // Event handling
    setEventHandler(eventHandler);

    // Start playing
    setSourceFile(audioFile);
    const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
    audioPlayer.loop = false;// play repeat
    audioPlayer.volume = 1;
    audioPlayer.currentTime = playPoint;
    audioPlayer?.play();
    audioPlayer?.addEventListener('play', () => {
      eventHandler?.onPlayingStarted();
    });
    audioPlayer?.addEventListener('pause', () => {
      eventHandler?.onPlayingStopped({
        playbackTime: currentPlayer.currentTime,
        audioFile: sourceFile,
      });
    });
    audioPlayer?.addEventListener('timeupdate', () => {
      eventHandler?.onPlaybackTimeUpdated(currentPlayer.currentTime);
    });
    setCurrentPlayer(audioPlayer);
    // TODO: log
  }
  function stop(): void {
    // Stop playing
    currentPlayer?.pause();
    // Event handling
    currentEventHandler?.onPlayingStopped({
      playbackTime: currentPlayer.currentTime,
      audioFile: sourceFile,
    });
    // Clear source file and player
    setSourceFile(null);
    setCurrentPlayer(null);
    // TODO: log
  }

  return (
    <VoicePlayerContext.Provider value={{
      play,
      stop,
    }}>
      {children}
    </VoicePlayerContext.Provider>
  );
}

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(VoicePlayerContext);

export default {
  VoicePlayerProvider,
  useVoicePlayerContext,
};
