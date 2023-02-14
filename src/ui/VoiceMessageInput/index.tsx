import React, { useMemo } from 'react';
import './index.scss';

import PlaybackTime from '../PlaybackTime';
import ProgressBar from '../ProgressBar';
import TextButton from '../TextButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import ControlerIcon from './controlerIcons';

export const VoiceMessageInputStatus = {
  READY_TO_RECORD: 'READY_TO_RECORD',
  RECORDING: 'RECORDING',
  READY_TO_PLAY: 'READY_TO_PLAY',
  PLAYING: 'PLAYING',
} as const;
export type VoiceMessageInputStatus = typeof VoiceMessageInputStatus[keyof typeof VoiceMessageInputStatus];
export interface VoiceMessageInputProps {
  minRecordTime?: number;
  maximumValue: number;
  currentValue?: number;
  currentType: VoiceMessageInputStatus;
  onCancelClick?: () => void;
  onControlClick?: (type: VoiceMessageInputStatus) => void;
  onSubmitClick?: () => void;
  renderCancelButton?: () => React.ReactElement;
  renderControlButton?: (type: VoiceMessageInputStatus) => React.ReactElement;
  renderSubmitButton?: () => React.ReactElement;
}

export const VoiceMessageInput = ({
  minRecordTime = 1000,
  maximumValue,
  currentValue = 0,
  currentType,
  onCancelClick,
  onControlClick,
  onSubmitClick,
  renderCancelButton,
  renderControlButton,
  renderSubmitButton,
}: VoiceMessageInputProps): React.ReactElement => {
  const isReadyToRecord = useMemo(() => currentType === VoiceMessageInputStatus.READY_TO_RECORD, [currentType]);
  const isRecording = useMemo(() => currentType === VoiceMessageInputStatus.RECORDING, [currentType]);
  const isPlayMode = useMemo(() => {
    return (
      currentType === VoiceMessageInputStatus.READY_TO_PLAY
      || currentType === VoiceMessageInputStatus.PLAYING
    );
  }, [currentType]);
  const { stringSet } = useLocalization();

  return (
    <div className="sendbird-voice-message-input">
      <div className="sendbird-voice-message-input__indicator">
        <div className="sendbird-voice-message-input__indicator__progress-bar">
          <ProgressBar
            className="sendbird-voice-message-input__indicator__progress-bar__bar"
            disabled={isReadyToRecord}
            maxSize={maximumValue}
            currentSize={currentValue}
          />
        </div>
        {
          (isRecording) && (
            <div className="sendbird-voice-message-input__indicator__on-rec" />
          )
        }
        <PlaybackTime
          className="sendbird-voice-message-input__indicator__playback-time"
          time={isPlayMode ? maximumValue - currentValue : currentValue}
        />
      </div>
      <div className="sendbird-voice-message-input__controler">
        {
          renderCancelButton?.() || (
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
          )
        }
        {
          renderControlButton?.(currentType) || (
            <div
              className="sendbird-voice-message-input__controler__main"
              onClick={() => onControlClick(currentType)}
            >
              <ControlerIcon inputState={currentType} />
            </div>
          )
        }
        {
          renderSubmitButton?.() || (
            <div
              className={`sendbird-voice-message-input__controler__submit ${minRecordTime <= currentValue ? '' : 'voice-message--disabled'}`}
              onClick={() => {
                if (minRecordTime <= currentValue) {
                  onSubmitClick();
                }
              }}
            >
              <Icon
                width="19px"
                height="19px"
                type={IconTypes.SEND}
                fillColor={IconColors.CONTENT}
              />
            </div>
          )
        }
      </div>
    </div>
  );
};
