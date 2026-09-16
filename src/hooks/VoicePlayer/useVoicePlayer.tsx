import { useEffect, useRef } from 'react';
import { useVoicePlayerContext } from '.';
import { VOICE_PLAYER_AUDIO_ID, VOICE_MESSAGE_MIME_TYPE } from '../../utils/consts';
import { useVoiceRecorderContext } from '../VoiceRecorder';

import { AudioUnitDefaultValue, VOICE_PLAYER_STATUS, VoicePlayerStatusType } from './dux/initialState';
import { generateGroupKey } from './utils';
import { GroupKeyHolder, useMountRegistry } from './mountRegistry';

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
  const mountRegistry = useMountRegistry();
  const currentAudioUnit = voicePlayerStore?.audioStorage?.[groupKey] || AudioUnitDefaultValue();
  const currentAudioUnitRef = useRef(currentAudioUnit);
  const cleanupTargetRef = useRef({ groupKey, reset, mountRegistry });
  const hadAudioRef = useRef(false);
  const ownedGroupKeysRef = useRef(new Set<string>());
  const holderRef = useRef<GroupKeyHolder>({});
  // The keys the cleanup acts on are recorded on commit, never during render: a render React throws
  // away must not be able to name a unit this hook never held
  useEffect(() => {
    currentAudioUnitRef.current = currentAudioUnit;
    cleanupTargetRef.current = { groupKey, reset, mountRegistry };
    if (audioFile || audioFileUrl) hadAudioRef.current = true;
    ownedGroupKeysRef.current.add(groupKey);
  });

  // A group key names a unit, not a hook: on desktop the same voice message renders in the message
  // list and in the thread parent header at once, so one unit outlives any single consumer
  useEffect(() => {
    const holder = holderRef.current;
    mountRegistry.retain(groupKey, holder);
    return () => {
      mountRegistry.release(groupKey, holder);
    };
  }, [mountRegistry, groupKey]);

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
        mountRegistry: latestMountRegistry,
      } = cleanupTargetRef.current;
      const holder = holderRef.current;
      const groupKeysToReset = new Set<string>();
      // The element records its own unit the moment it is created, while the store learns of it a
      // render later, so ask the element rather than a group key that may not have been committed
      const voiceAudioPlayerElement = document.getElementById(VOICE_PLAYER_AUDIO_ID) as HTMLAudioElement | null;
      const playingGroupKey = voiceAudioPlayerElement?.dataset?.sbGroupId;
      if (
        playingGroupKey
        && ownedGroupKeysRef.current.has(playingGroupKey)
        && !latestMountRegistry.isRetainedByOthers(playingGroupKey, holder)
      ) {
        voiceAudioPlayerElement?.pause?.();
        groupKeysToReset.add(playingGroupKey);
      }
      const status = currentAudioUnitRef.current?.playingStatus;
      if (
        status
        && status !== VOICE_PLAYER_STATUS.IDLE
        && !latestMountRegistry.isRetainedByOthers(latestGroupKey, holder)
      ) {
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
