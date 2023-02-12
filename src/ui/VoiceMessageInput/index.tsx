import React, { useMemo } from 'react';
import './index.scss';

import PlaybackTime from '../PlaybackTime';
import ProgressBar from '../ProgressBar';
import TextButton from '../TextButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import ControlerIcon from './controlerIcons';

export const VoiceMessageInputControlTypes = {
  READY_TO_RECORD: 'READY_TO_RECORD',
  RECORDING: 'RECORDING',
  READY_TO_PLAY: 'READY_TO_PLAY',
  PLAYING: 'PLAYING',
} as const;
export type VoiceMessageInputControlTypes = typeof VoiceMessageInputControlTypes[keyof typeof VoiceMessageInputControlTypes];
export interface VoiceMessageInputProps {
  maximumValue: number;
  currentValue?: number;
  currentType: VoiceMessageInputControlTypes;
  onCancelClick?: () => void;
  onControlClick?: (type: VoiceMessageInputControlTypes) => void;
  onSubmitClick?: () => void;
  renderCancelButton?: () => React.ReactElement;
  renderControlButton?: (type: VoiceMessageInputControlTypes) => React.ReactElement;
  renderSubmitButton?: () => React.ReactElement;
}

export const VoiceMessageInput = ({
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
  const isReadyToRecord = useMemo(() => currentType === VoiceMessageInputControlTypes.READY_TO_RECORD, [currentType]);
  const isRecording = useMemo(() => currentType === VoiceMessageInputControlTypes.RECORDING, [currentType]);
  const isPlayMode = useMemo(() => {
    return (
      currentType === VoiceMessageInputControlTypes.READY_TO_PLAY
      || currentType === VoiceMessageInputControlTypes.PLAYING
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
              className={`sendbird-voice-message-input__controler__submit`}
              onClick={onSubmitClick}
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
