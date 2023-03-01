import { useEffect, useState } from "react";
import { useVoicePlayerContext, VoicePlayerStatus } from ".";

import { VOICE_MESSAGE_FILE_NAME, VOICE_MESSAGE_MIME_TYPE } from "../../utils/consts";
import { AudioStorageUnit, AudioUnitDefaultValue } from "./dux/initialState";
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
  stop: () => void;
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
  const [currentAudioUnit, setCurrentAudioUnit] = useState<AudioStorageUnit>(AudioUnitDefaultValue);

  const {
    play,
    pause,
    stop,
    voicePlayerStore,
  } = useVoicePlayerContext();

  useEffect(() => {
    // Set currentAudioUnit
    //  a) get it from AudioStorage
    //  b) set it with parameters, audioFile or audioFileUrl
    if (voicePlayerStore.audioStorage?.[groupKey]) {
      setCurrentAudioUnit(voicePlayerStore.audioStorage?.[groupKey]);
    } else {
      const newAudioUnit = AudioUnitDefaultValue;
      if (audioFile) {
        newAudioUnit.audioFile = audioFile;
        setCurrentAudioUnit(newAudioUnit);
      } else if (audioFileUrl) {
        fetch(audioFileUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const audioFile = new File([blob], VOICE_MESSAGE_FILE_NAME, {
              lastModified: new Date().getTime(),
              type: VOICE_MESSAGE_MIME_TYPE,
            });
            newAudioUnit.audioFile = audioFile;
            setCurrentAudioUnit(newAudioUnit);
          });
      }
    }
  }, [voicePlayerStore.audioStorage?.[groupKey]]);

  const playVoicePlayer = () => {
    play?.({
      groupKey,
      audioFile: currentAudioUnit?.audioFile,
    });
  };
  const pauseVoicePlayer = () => {
    pause?.(groupKey);
  };
  const stopVoicePlayer = () => {
    stop?.();
  };

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
