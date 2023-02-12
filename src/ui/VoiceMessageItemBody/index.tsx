import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileMessage } from '@sendbird/chat/message';

import './index.scss';

import ProgressBar, { ProgressBarColorTypes } from '../ProgressBar';
import { useVoicePlayer } from '../../hooks/VoicePlayer/useVoicePlayer2';
import PlaybackTime from '../PlaybackTime';
import Loader from '../Loader';
import Icon, { IconTypes, IconColors } from '../Icon';
import { LabelTypography, LabelColors } from '../Label';

export interface VoiceMessageItemBodyProps {
  className?: string;
  message: FileMessage;
  isByMe?: boolean;
  isReactionEnabled?: boolean;
}

export enum VoiceMessageItemStatus {
  NONE = 'NONE',
  LOADING = 'LOADING',
  READY_TO_PLAY = 'READY_TO_PLAY',
  PLAYING = 'PLAYING',
}

export const VoiceMessageItemBody = ({
  className,
  message,
  isByMe = false,
  isReactionEnabled = false,
}: VoiceMessageItemBodyProps): React.ReactElement => {
  const [usingReaction, setUsingReaction] = useState(false);
  const [audioState, setAudioState] = useState(VoiceMessageItemStatus.NONE);
  const [audioFile, setAudioFile] = useState(null);
  const downloadAudioFile = useCallback(() => {
    if (message?.url) {
      setAudioState(VoiceMessageItemStatus.LOADING);
      fetch(message?.url)
        .then((res) => res.blob())
        .then((blob) => {
          const audioFile = new File([blob], 'Voice message', {
            lastModified: new Date().getTime(),
            type: 'audio/mpeg',
          });
          setAudioFile(audioFile);
          setAudioState(VoiceMessageItemStatus.READY_TO_PLAY);
        });
    }
  }, [message?.url]);
  const {
    play,
    pause,
    playbackTime,
  } = useVoicePlayer({
    onPlayingStarted: () => {
      setAudioState(VoiceMessageItemStatus.PLAYING);
    },
    onPlayingStopped: () => {
      setAudioState(VoiceMessageItemStatus.READY_TO_PLAY);
    },
  });

  useEffect(() => {
    if (isReactionEnabled && message?.reactions?.length > 0) {
      setUsingReaction(true);
    } else {
      setUsingReaction(false);
    }
  }, [isReactionEnabled, message?.reactions]);
  const progresBarMaxSize = useMemo(() => {
    if (message?.metaArrays) {
      const duration = message?.metaArrays.find((metaArray) => metaArray.key === 'KEY_VOICE_MESSAGE_DURATION')?.value[0];
      return duration && parseInt(duration);
    }
    return 1;
  }, [message?.metaArrays]);

  const playAudio = () => {
    play(audioFile);
  };
  const pauseAudio = pause;

  return (
    <div className={`sendbird-voice-message-item-body ${className} ${usingReaction ? 'is-reactions-contained' : ''}`}>
      <ProgressBar
        className="sendbird-voice-message-item-body__progress-bar"
        maxSize={progresBarMaxSize}
        currentSize={playbackTime}
        colorType={isByMe ? ProgressBarColorTypes.PRIMARY : ProgressBarColorTypes.GRAY}
      />
      <div className="sendbird-voice-message-item-body__status-button">
        {
          audioState === VoiceMessageItemStatus.NONE && (
            <div
              className="sendbird-voice-message-item-body__status-button__button"
              onClick={downloadAudioFile}
            >
              <Icon
                width="18px"
                height="18px"
                type={IconTypes.PLAY}
                fillColor={IconColors.PRIMARY}
              />
            </div>
          )
        }
        {
          audioState === VoiceMessageItemStatus.LOADING && (
            <Loader width="22.2px" height="22.2px">
              <Icon
                width="22.2px"
                height="22.2px"
                type={IconTypes.SPINNER}
                fillColor={IconColors.PRIMARY_2}
              />
            </Loader>
          )
        }
        {
          audioState === VoiceMessageItemStatus.READY_TO_PLAY && (
            <div
              className="sendbird-voice-message-item-body__status-button__button"
              onClick={playAudio}
            >
              <Icon
                width="18px"
                height="18px"
                type={IconTypes.PLAY}
                fillColor={IconColors.PRIMARY}
              />
            </div>
          )
        }
        {
          audioState === VoiceMessageItemStatus.PLAYING && (
            <div
              className="sendbird-voice-message-item-body__status-button__button"
              onClick={pauseAudio}
            >
              <div className="sendbird-voice-message-item-body__status-button__button__pause">
                <div className="sendbird-voice-message-item-body__status-button__button__pause__inner" />
                <div className="sendbird-voice-message-item-body__status-button__button__pause__inner" />
              </div>
            </div>
          )
        }
      </div>
      <PlaybackTime
        className="sendbird-voice-message-item-body__playback-time"
        time={
          (audioState === VoiceMessageItemStatus.PLAYING)
          ? progresBarMaxSize - playbackTime : progresBarMaxSize
        }
        labelType={LabelTypography.BODY_1}
        labelColor={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
      />
    </div>
  );
};

export default VoiceMessageItemBody;
