import React, { createContext, useContext, useState } from 'react';

export interface VoicePlayerProps {
  children: React.ReactElement;
}

interface VoicePlayerOnPlayingStoppedProps {
  playbackTime: number;
  playSize: number;
  audioFile: File;
}
export interface VoicePlayerEventHandler {
  onPlayingStarted?: () => void;
  onPlayingStopped?: (props: VoicePlayerOnPlayingStoppedProps) => void;
  onPlaybackTimeUpdated?: (time: number) => void;
}

export interface VoicePlayerContext {
  play: (props: VoicePlayerPlayProps) => void;
  stop: () => void;
}
const noop = () => {/* noop */ };
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
  const { children } = props;

  const play = ({
    audioFile,
    playPoint,
    eventHandler,
  }: VoicePlayerPlayProps): void => {
    if (sourceFile && currentPlayer) {
      stop();
    }

    // Start playing
    setSourceFile(audioFile);
    const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
    audioPlayer.loop = false;// play repeat
    audioPlayer.volume = 1;
    audioPlayer.currentTime = playPoint;
    audioPlayer.onplay = () => {
      eventHandler?.onPlayingStarted();
    };
    audioPlayer.onpause = () => {
      eventHandler?.onPlayingStopped({
        playbackTime: audioPlayer.currentTime * 1000,
        playSize: audioPlayer.duration * 1000,
        audioFile: audioFile,
      });
    };
    audioPlayer.ontimeupdate = () => {
      eventHandler?.onPlaybackTimeUpdated(audioPlayer.currentTime * 1000);
    };
    audioPlayer?.play();
    setCurrentPlayer(audioPlayer);
    // TODO: log
  };

  const stop = (): void => {
    // Stop playing
    currentPlayer?.pause();
    setSourceFile(null);
    setCurrentPlayer(null);
    // TODO: log
  };

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
