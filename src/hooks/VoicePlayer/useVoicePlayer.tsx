import { useEffect } from 'react';
import { useVoicePlayerContext } from '.';
import { VOICE_PLAYER_AUDIO_ID } from '../../utils/consts';
import { useVoiceRecorderContext } from '../VoiceRecorder';

import { AudioUnitDefaultValue, VoicePlayerStatusType } from './dux/initialState';
import { generateGroupKey } from './utils';

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
  playingStatus: VoicePlayerStatusType;
}

export const useVoicePlayer = ({
  key = '',
  channelUrl = '',
  audioFile,
  audioFileUrl = '',
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const groupKey = generateGroupKey(channelUrl, key);
  const {
    play,
    pause,
    stop,
    voicePlayerStore,
  } = useVoicePlayerContext();
  const { isRecordable } = useVoiceRecorderContext();
  const currentAudioUnit = voicePlayerStore?.audioStorage?.[groupKey] || AudioUnitDefaultValue();

  const playVoicePlayer = () => {
    if (!isRecordable) {
      play?.({
        groupKey,
        audioFile,
        audioFileUrl,
      });
    }
  };

  const pauseVoicePlayer = () => {
    pause?.(groupKey);
  };

  const stopVoicePlayer = (text = '') => {
    stop?.(text);
  };

  useEffect(() => {
    return () => {
      if (audioFile || audioFileUrl) {
        // Can't get the current AudioPlayer through the React hooks(useReducer or useState) in this scope
        const voiceAudioPlayerElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
        (voiceAudioPlayerElement as HTMLAudioElement)?.pause?.();
      }
    };
  }, []);

  return ({
    play: playVoicePlayer,
    pause: pauseVoicePlayer,
    stop: stopVoicePlayer,
    /**
     * The reason why we multiply this by *1000 is,
     * The unit of playbackTime and duration should be millisecond
     */
    playbackTime: (currentAudioUnit?.playbackTime || 0) * 1000,
    duration: (currentAudioUnit?.duration || 0) * 1000,
    playingStatus: currentAudioUnit.playingStatus,
  });
};
