import React, { useEffect, useState } from 'react';
import { FileMessage } from '@sendbird/chat/message';

import './index.scss';

import ProgressBar, { ProgressBarColorTypes } from '../ProgressBar';
import { useVoicePlayer } from '../../hooks/useVoicePlayer/useVoicePlayer';
import PlaybackTime from '../PlaybackTime';
import Loader from '../Loader';
import Icon, { IconTypes, IconColors } from '../Icon';
import { LabelTypography, LabelColors } from '../Label';

export interface VoiceMessageItemBodyProps {
  className?: string;
  message: FileMessage;
  isByMe?: boolean;
  // mouseHover?: boolean;
  isReactionEnabled?: boolean;
}

export enum VoiceMessageItemStatus {
  LOADING = 'LOADING',
  READY_TO_PLAY = 'READY_TO_PLAY',
  PLAYING = 'PLAYING',
}

export const VoiceMessageItemBody = ({
  className,
  message,
  isByMe = false,
  // mouseHover = false,
  isReactionEnabled = false,
}: VoiceMessageItemBodyProps): React.ReactElement => {
  const [audio, setAudio] = useState(null);
  const [audioState, setAudioState] = useState(VoiceMessageItemStatus.LOADING);
  const [audioFile, setAudioFile] = useState(null);
  useEffect(() => {
    if (message?.url) {
      fetch(message?.url)
        .then((res) => res.blob())
        .then((blob) => {
          const audioFile = new File([blob], 'Voice message', {
            lastModified: new Date().getTime(),
            type: 'audio/mpeg',
          });
          setAudioFile(audioFile);
          const url = URL.createObjectURL(audioFile);
          setAudio(new Audio(url));
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

  const playAudio = () => {
    play(audioFile);
  };
  const pauseAudio = pause;

  return (
    <div className={`sendbird-voice-message-item-body ${className} ${isReactionEnabled ? 'is-reactions-contained' : ''}`}>
      <ProgressBar
        className="sendbird-voice-message-item-body__progress-bar"
        maxSize={(audio?.duration || 1) * 1000}
        currentSize={playbackTime}
        colorType={isByMe ? ProgressBarColorTypes.PRIMARY : ProgressBarColorTypes.GRAY}
      />
      <div className="sendbird-voice-message-item-body__status-button">
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
        time={playbackTime}
        labelType={LabelTypography.BODY_1}
        labelColor={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
      />
    </div>
  );
};

export default VoiceMessageItemBody;
