import React, { useContext, useEffect, useState } from 'react';
import './index.scss';

import ProgressBar from '../ProgressBar';
import TextButton from '../TextButton';
import { LocalizationContext } from '../../lib/LocalizationContext';
import ControlerIcon from './controlerIcons';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import PlaybackTime from '../PlaybackTime';

export interface VoiceMessageInputProps {
  onCancelClick?: () => void;
  onSubmitClick?: () => void;
  maxSize: number;
  inputState: VoiceMessageInputStatus;
  onRecordClick?: () => void;
  onRecordStopClick?: () => void;
  onPlayClick?: () => void;
  onPauseClick?: () => void;
}

export enum VoiceMessageInputStatus {
  PREPARING = 'PREPARING',
  READY_TO_RECORD = 'READY_TO_RECORD',
  RECORDING = 'RECORDING',
  READY_TO_PLAY = 'READY_TO_PLAY',
  PLAYING = 'PLAYING',
}

let interval = null;
let counter = null;
export const VoiceMessageInput = ({
  onCancelClick,
  onSubmitClick,
  maxSize = 60000,
  inputState = VoiceMessageInputStatus.READY_TO_RECORD,
  onRecordClick,
  onRecordStopClick,
  onPlayClick,
  onPauseClick,
}: VoiceMessageInputProps): React.ReactElement => {
  const { stringSet } = useContext(LocalizationContext);

  // Progress bar
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    // device progress bar to progressFrame value
    const progressFrame = maxSize / 8;
    setFrame(maxSize / progressFrame);
  }, [maxSize]);
  useEffect(() => {
    if (inProgress) {
      interval = setInterval(() => {
        setProgress((prev) => prev + frame);
      }, frame);
    } else {
      clearInterval(interval);
    }
  }, [inProgress, frame]);
  useEffect(() => {
    if (progress >= maxSize) {
      setProgress(0);
      setPlaybackTime(0);
      setInProgress(false);
      clearInterval(interval);
      clearInterval(counter);
    }
  }, [progress]);
  const startProgressBar = () => {
    setInProgress(true);
  };
  const stopProgressBar = () => {
    setInProgress(false);
  };
  const clearProgressBar = () => {
    setProgress(0);
    setPlaybackTime(0);
    setInProgress(false);
  };

  // PlaybackTime
  const [playbackTime, setPlaybackTime] = useState(0);
  useEffect(() => {
    if (inProgress) {
      counter = setInterval(() => {
        setPlaybackTime((prev) => prev + 1000);
      }, 1000);
    } else {
      clearInterval(counter);
    }
  }, [inProgress]);

  return (
    <div className="sendbird-voice-message-input">
      <div className="sendbird-voice-message-input__indicator">
        <div className="sendbird-voice-message-input__indicator__progress-bar">
          <ProgressBar
            className="sendbird-voice-message-input__indicator__progress-bar__bar"
            maxSize={maxSize}
            currentSize={progress}
          />
        </div>
        {
          (inputState === VoiceMessageInputStatus.RECORDING) && (
            <div className="sendbird-voice-message-input__indicator__on-rec" />
          )
        }
        <PlaybackTime
          className="sendbird-voice-message-input__indicator__playback-time"
          time={playbackTime}
        />
      </div>
      <div className="sendbird-voice-message-input__controler">
        <TextButton
          className="sendbird-voice-message-input__controler__cancel"
          onClick={onCancelClick}
          disableUnderline
        >
          <Label
            type={LabelTypography.BUTTON_1}
            color={LabelColors.PRIMARY}
          >
            {stringSet.BUTTON__CANCEL}
          </Label>
        </TextButton>
        <div
          className="sendbird-voice-message-input__controler__main"
          onClick={() => {
            switch (inputState) {
              case VoiceMessageInputStatus.READY_TO_RECORD: {
                onRecordClick();
                startProgressBar();
                break;
              }
              case VoiceMessageInputStatus.RECORDING: {
                onRecordStopClick();
                clearProgressBar();
                break;
              }
              case VoiceMessageInputStatus.READY_TO_PLAY: {
                onPlayClick();
                startProgressBar();
                break;
              }
              case VoiceMessageInputStatus.PLAYING: {
                onPauseClick();
                stopProgressBar();
                break;
              }
              default: break;
            }
          }}
        >
          <ControlerIcon inputState={inputState} />
        </div>
        <div
          className="sendbird-voice-message-input__controler__submit"
          onClick={onSubmitClick}
        >
          <Icon
            width="19px"
            height="19px"
            type={IconTypes.SEND}
            fillColor={IconColors.CONTENT}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceMessageInput;
