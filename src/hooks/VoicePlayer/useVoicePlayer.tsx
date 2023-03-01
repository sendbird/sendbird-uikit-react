import { useEffect, useState } from "react";
import { useVoicePlayerContext } from ".";
import { VOICE_PLAYER_AUDIO_ID } from "../../utils/consts";

import { AudioUnitDefaultValue, VoicePlayerStatus } from "./dux/initialState";
import { generateGroupKey } from "./utils";

export interface UseVoicePlayerProps {
  key: string;
  channelUrl: string;
  audioFile?: File;
  audioFileUrl?: string;
}

export interface UseVoicePlayerContext {
  play: () => void;
  pause: () => void;
  stop: (text?: string) => void;
  playbackTime: number;
  duration: number;
  playingStatus: VoicePlayerStatus;
}

export const useVoicePlayer = ({
  key = '',
  channelUrl = '',
  audioFile = null,
  audioFileUrl = '',
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const [groupKey] = useState<string>(generateGroupKey(channelUrl, key));
  const {
    play,
    pause,
    stop,
    voicePlayerStore,
  } = useVoicePlayerContext();
  const currentAudioUnit = voicePlayerStore?.audioStorage?.[groupKey] || AudioUnitDefaultValue();

  const playVoicePlayer = () => {
    play?.({
      groupKey,
      audioFile,
      audioFileUrl,
    });
  };

  const pauseVoicePlayer = () => {
    pause?.(groupKey);
  };

  const stopVoicePlayer = (text = '') => {
    stop?.(text);
  };

  useEffect(() => {
    return () => {
      // Can't get the current AudioPlayer through the React hooks(useReducer or useState) in this scope
      const voiceAudioPlayerElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
      (voiceAudioPlayerElement as HTMLAudioElement)?.pause?.();
    }
  }, []);

  return ({
    play: playVoicePlayer,
    pause: pauseVoicePlayer,
    stop: stopVoicePlayer,
    playbackTime: currentAudioUnit?.playbackTime * 1000,
    duration: currentAudioUnit?.duration * 1000,
    // the unit of playbackTime and duration should be millisecond
    playingStatus: currentAudioUnit?.playingStatus,
  });
};
