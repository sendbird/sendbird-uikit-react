import { useEffect, useState } from "react";
import { useVoicePlayerContext } from ".";

import uuidv4 from "../../utils/uuid";
import { generateGroupKey, VoicePlayerEventParams } from "./voicePlayerEvent";
import { VOICE_PLAYER_DURATION_MIN_SIZE, VOICE_PLAYER_PLAYBACK_BUFFER } from "../../utils/consts";

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
  const [duration, setDuration] = useState<number>(VOICE_PLAYER_DURATION_MIN_SIZE);
  const {
    play,
    stop,
    addEventHandler,
    removeEventHandler,
  } = useVoicePlayerContext();

  // event operation
  useEffect(() => {
    addEventHandler({
      groupKey: groupKey,
      id: eventId,
      // get audioFile through events and put it to the state of this file
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
        if (duration - playbackTime <= VOICE_PLAYER_PLAYBACK_BUFFER) {
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
    return () => {
      removeEventHandler(groupKey, eventId);
    };
  }, []);

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
