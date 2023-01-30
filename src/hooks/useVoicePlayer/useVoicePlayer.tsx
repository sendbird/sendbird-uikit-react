import { useCallback, useState } from 'react';
import { useVoicePlayerContext, VoicePlayerEventHandler } from '.';

export interface UseVoicePlayerProps extends VoicePlayerEventHandler {
  /**
   * VoicePlayerEventHandler
   * onPlayingStarted
   * onPlayingStopped
   * onPlaybackTimeUpdated
   */
  audioFile: File;
}

export interface UseVoicePlayerContext {
  play: () => void;
  pause: () => void;
  playbackTime: number;
}

const noop = () => {/* noop */ };
export const useVoicePlayer = ({
  audioFile,
  onPlayingStarted = noop,
  onPlayingStopped = noop,
  onPlaybackTimeUpdated = noop,
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const voicePlayer = useVoicePlayerContext();
  const [sourceFile] = useState<File>(audioFile);
  const [currentPlaybackTime, setPlaybackTime] = useState<number>(0);

  const play = useCallback(() => {
    voicePlayer?.play({
      audioFile: sourceFile,
      playPoint: currentPlaybackTime,
      eventHandler: {
        onPlayingStarted: onPlayingStarted,
        onPlayingStopped: (props) => {
          onPlayingStopped(props);
          setPlaybackTime(props?.playbackTime);
        },
        onPlaybackTimeUpdated: (time) => {
          onPlaybackTimeUpdated(time);
          setPlaybackTime(time);
        },
      },
    })
  }, [audioFile, onPlayingStarted, onPlayingStopped, onPlaybackTimeUpdated]);
  const pause = useCallback(() => {
    voicePlayer?.stop();
  }, [audioFile, voicePlayer]);

  return ({
    play,
    pause,
    playbackTime: currentPlaybackTime,
  });
};
