import { useEffect, useState } from "react";
import { useVoicePlayerContext } from ".";
import uuidv4 from "../../utils/uuid";
import { generateGroupKey, VoicePlayerEventParams } from "./voicePlayerEvent";

export const VoicePlayerStatus = {
  PREPARING: 'PREPARING',
  READY_TO_PLAY: 'READY_TO_PLAY',
  PLAYING: 'PLAYING',
  COMPLETED: 'COMPLETED',
} as const;
export type VoicePlayerStatus = typeof VoicePlayerStatus[keyof typeof VoicePlayerStatus];

export interface UseVoicePlayerProps {
  key: string;
  channelUrl: string;
  audioFile?: File;
  onPlayingStarted?: (props: VoicePlayerEventParams) => void;
  onPlayingStopped?: (props: VoicePlayerEventParams) => void;
  onPlaybackTimeUpdated?: (props: VoicePlayerEventParams) => void;
}

export interface UseVoicePlayerContext {
  play: () => void;
  pause: (groupKey?: string) => void;
  playbackTime: number;
  duration: number;
  playingStatus: VoicePlayerStatus;
}

const noop = () => {/* noop */}

export const useVoicePlayer = ({
  key,
  channelUrl,
  audioFile,
  onPlayingStarted = noop,
  onPlayingStopped = noop,
  onPlaybackTimeUpdated = noop,
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const groupKey = generateGroupKey(channelUrl, key);
  const eventId = uuidv4();
  const [playingStatus, setPlayingStatus] = useState<VoicePlayerStatus>(VoicePlayerStatus.PREPARING);
  const [currentPlaybackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1000);
  const {
    play,
    stop,
    addEventHandler,
    removeEventHandler,
  } = useVoicePlayerContext();

  // event operation
  useEffect(() => {
    if (audioFile) {
      addEventHandler({
        groupKey: groupKey,
        id: eventId,
        onPlayingStarted: (props) => {
          setPlayingStatus(VoicePlayerStatus.PLAYING);
          onPlayingStarted(props);
          setDuration(props?.duration);
          setPlaybackTime(props?.playbackTime);
        },
        onPlayingStopped: (props) => {
          const { duration, playbackTime } = props;
          setPlayingStatus(VoicePlayerStatus.READY_TO_PLAY);
          onPlayingStopped(props);
          setDuration(props?.duration);
          if (duration - playbackTime <= 0.01) {
            setPlaybackTime(0);
          } else {
            setPlaybackTime(props?.playbackTime);
          }
        },
        onPlaybackTimeUpdated: (props) => {
          onPlaybackTimeUpdated(props);
          setDuration(props?.duration);
          setPlaybackTime(props?.playbackTime);
        },
      });
    }
    return () => {
      removeEventHandler(groupKey, eventId);
    };
  }, [audioFile]);

  const playVoicePlayer = () => {
    play?.({
      audioFile: audioFile,
      playbackTime: currentPlaybackTime,
      groupKey: groupKey,
    });
  };
  const pauseVoicePlayer = (groupKey?: string) => {
    stop?.(groupKey);
  };

  return ({
    play: playVoicePlayer,
    pause: pauseVoicePlayer,
    playbackTime: currentPlaybackTime * 1000,
    duration: duration * 1000,
    // the unit of playbackTime and duration should be millisecond
    playingStatus,
  });
};
