import { useEffect, useMemo, useState } from "react";
import { useVoicePlayerContext, VoicePlayerEventHandler, VoicePlayerUnit } from ".";
import uuidv4 from "../../utils/uuid";

export const VoicePlayerStatus = {
  PREPARING: 'PREPARING',
  READY_TO_PLAY: 'READY_TO_PLAY',
  PLAYING: 'PLAYING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;
export type VoicePlayerStatus = typeof VoicePlayerStatus[keyof typeof VoicePlayerStatus];

export interface UseVoicePlayerProps extends VoicePlayerEventHandler {
  channelUrl: string;
  key: string;
  audioFile?: File;
}

export interface UseVoicePlayerContext {
  play: () => void;
  pause: () => void;
  playbackTime: number;
  duration: number;
  playingStatus: VoicePlayerStatus;
}

export const useVoicePlayer = ({
  channelUrl,
  key = uuidv4(),
  audioFile,
  onPlayingStarted,
  onPlayingStopped,
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const [playingStatus, setPlayingStatus] = useState<VoicePlayerStatus>(VoicePlayerStatus.PREPARING);
  const voicePlayer = useVoicePlayerContext();
  const {
    registerPlayerUnit,
    currentPlayerUnit,
    voicePlayerMap,
    isAudioPlaying,
  } = voicePlayer;
  // get current player unit
  const {
    playbackTime,
    duration,
  } = useMemo(() => {
    const playerUnit = voicePlayerMap?.[channelUrl]?.[key] as VoicePlayerUnit;
    if (currentPlayerUnit?.channelUrl === channelUrl && currentPlayerUnit?.id === key) {
      setPlayingStatus(isAudioPlaying ? VoicePlayerStatus.PLAYING : VoicePlayerStatus.READY_TO_PLAY);
      if (playerUnit?.playbackTime > 0 && (playerUnit?.duration - playerUnit?.playbackTime <= 0.01)) {
        setPlayingStatus(VoicePlayerStatus.COMPLETED);
      }
    }
    return ({
      playbackTime: playerUnit?.playbackTime || 0,
      duration: (Number.isNaN(playerUnit?.duration) || playerUnit?.duration === Infinity || !playerUnit?.duration)
        ? 0 : playerUnit?.duration,
    });
  }, [
    voicePlayerMap,
    currentPlayerUnit,
    isAudioPlaying,
  ]);

  // initialize voice player with audioFile
  useEffect(() => {
    if (audioFile) {
      registerPlayerUnit?.(channelUrl, key, audioFile)
        .then((playerUnit) => {
          if (playerUnit.channelUrl === channelUrl && playerUnit.id === key) {
            setPlayingStatus(VoicePlayerStatus.READY_TO_PLAY);
          } else {
            setPlayingStatus(VoicePlayerStatus.ERROR);
          }
        })
        .catch(() => {
          setPlayingStatus(VoicePlayerStatus.ERROR);
        });
    }
  }, [audioFile]);

  const play = () => {
    voicePlayer?.play(channelUrl, key, {
      onPlayingStarted: (c, k) => {
        onPlayingStarted(c, k);
      },
      onPlayingStopped: (c, k) => {
        onPlayingStopped(c, k);
      },
    });
  };
  const pause = () => {
    voicePlayer?.pause(channelUrl, key);
  };

  return ({
    play,
    pause,
    playbackTime: playbackTime * 1000,
    duration: duration * 1000,
    // the unit of playbackTime and duration should be millisecond
    playingStatus,
  });
};
