import { useCallback, useState } from 'react';
import { useVoicePlayerContext, VoicePlayerEventHandler } from '.';

export interface UseVoicePlayerProps extends VoicePlayerEventHandler {
  /**
   * VoicePlayerEventHandler
   * onPlayingStarted
   * onPlayingStopped
   * onPlaybackTimeUpdated
   */
  audioFile?: File;
}

export interface UseVoicePlayerContext {
  play: (file: File) => void;
  pause: () => void;
  playbackTime: number;
}

const noop = () => {/* noop */ };
export const useVoicePlayer = ({
  onPlayingStarted = noop,
  onPlayingStopped = noop,
  onPlaybackTimeUpdated = noop,
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const voicePlayer = useVoicePlayerContext();
  const [currentPlaybackTime, setPlaybackTime] = useState<number>(0);

  const play = useCallback((file) => {
    voicePlayer?.play({
      audioFile: file,
      playPoint: currentPlaybackTime,
      eventHandler: {
        onPlayingStarted: onPlayingStarted,
        onPlayingStopped: (props) => {
          const { playbackTime, playSize } = props;
          onPlayingStopped(props);
          setPlaybackTime(playbackTime === playSize ? 0 : playbackTime);
        },
        onPlaybackTimeUpdated: (time) => {
          onPlaybackTimeUpdated(time);
          setPlaybackTime(time);
        },
      },
    })
  }, [onPlayingStarted, onPlayingStopped, onPlaybackTimeUpdated]);
  const pause = useCallback(() => {
    voicePlayer?.stop();
  }, [voicePlayer]);

  return ({
    play,
    pause,
    playbackTime: Math.floor(currentPlaybackTime * 1000),// convert to milliseconds
  });
};
