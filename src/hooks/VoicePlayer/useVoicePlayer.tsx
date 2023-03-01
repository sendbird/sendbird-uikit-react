import { useState } from "react";
import { useVoicePlayerContext, VoicePlayerStatus } from ".";

import { VOICE_PLAYER_DURATION_MIN_SIZE, VOICE_PLAYER_PLAYBACK_BUFFER } from "../../utils/consts";
import { generateGroupKey } from "./utils";

export interface UseVoicePlayerProps {
  key: string;
  channelUrl: string;
  audioFile?: File;
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
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const groupKey = generateGroupKey(channelUrl, key);
  const {
    play,
    stop,
  } = useVoicePlayerContext();

  const playVoicePlayer = () => {
    play?.({
      audioFile: audioFile,
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
