import { useEffect, useRef } from 'react';
import { useVoicePlayerContext } from '.';
import { VOICE_PLAYER_AUDIO_ID, VOICE_MESSAGE_MIME_TYPE } from '../../utils/consts';
import { useVoiceRecorderContext } from '../VoiceRecorder';

import { AudioUnitDefaultValue, VOICE_PLAYER_STATUS, VoicePlayerStatusType } from './dux/initialState';
import { generateGroupKey } from './utils';

export interface UseVoicePlayerProps {
  key?: string;
  channelUrl?: string;
  audioFile?: File;
  audioFileUrl?: string;
  audioFileMimeType?: string;
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
  audioFileMimeType = VOICE_MESSAGE_MIME_TYPE,
}: UseVoicePlayerProps): UseVoicePlayerContext => {
  const groupKey = generateGroupKey(channelUrl, key);
  const {
    play,
    pause,
    stop,
    reset,
    voicePlayerStore,
  } = useVoicePlayerContext();
  const { isRecordable } = useVoiceRecorderContext();
  const currentAudioUnit = voicePlayerStore?.audioStorage?.[groupKey] || AudioUnitDefaultValue();
  const currentAudioUnitRef = useRef(currentAudioUnit);
  const cleanupTargetRef = useRef({ groupKey, reset, currentGroupKey: voicePlayerStore?.currentGroupKey });
  const hadAudioRef = useRef(false);
  const ownedGroupKeysRef = useRef(new Set<string>());
  // The keys the cleanup acts on are recorded on commit, never during render: a render React throws
  // away must not be able to name a unit this hook never held
  useEffect(() => {
    currentAudioUnitRef.current = currentAudioUnit;
    cleanupTargetRef.current = { groupKey, reset, currentGroupKey: voicePlayerStore?.currentGroupKey };
    if (audioFile || audioFileUrl) hadAudioRef.current = true;
    ownedGroupKeysRef.current.add(groupKey);
  });

  const playVoicePlayer = () => {
    if (!isRecordable) {
      play?.({
        groupKey,
        audioFile,
        audioFileUrl,
        audioFileMimeType,
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
      if (!hadAudioRef.current) return;
      const {
        groupKey: latestGroupKey,
        reset: latestReset,
        currentGroupKey: latestCurrentGroupKey,
      } = cleanupTargetRef.current;
      const groupKeysToReset = new Set<string>();
      // The audio element is shared across every unit, so pause it only while this hook owns the
      // unit that holds it — including a key it was bound to before the props changed
      if (latestCurrentGroupKey && ownedGroupKeysRef.current.has(latestCurrentGroupKey)) {
        const voiceAudioPlayerElement = document.getElementById(VOICE_PLAYER_AUDIO_ID);
        (voiceAudioPlayerElement as HTMLAudioElement)?.pause?.();
        groupKeysToReset.add(latestCurrentGroupKey);
      }
      const status = currentAudioUnitRef.current?.playingStatus;
      if (status && status !== VOICE_PLAYER_STATUS.IDLE) {
        groupKeysToReset.add(latestGroupKey);
      }
      groupKeysToReset.forEach((groupKeyToReset) => latestReset?.(groupKeyToReset));
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
