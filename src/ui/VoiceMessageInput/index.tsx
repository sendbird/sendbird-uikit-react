import React, { useCallback, useMemo, useState } from 'react';
import './index.scss';

import PlaybackTime from '../PlaybackTime';
import ProgressBar from '../ProgressBar';
import TextButton from '../TextButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import ControlerIcon from './controlerIcons';
import { VOICE_RECORDER_CLICK_BUFFER_TIME, VOICE_RECORDER_DEFAULT_MIN } from '../../utils/consts';
import { VoiceMessageInputStatus } from './types';

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
  minRecordTime = VOICE_RECORDER_DEFAULT_MIN,
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
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const isReadyToRecord = useMemo(() => currentType === VoiceMessageInputStatus.READY_TO_RECORD, [currentType]);
  const isRecording = useMemo(() => currentType === VoiceMessageInputStatus.RECORDING, [currentType]);
  const isSendButtonDisabled = useMemo(() => {
    if (currentType === VoiceMessageInputStatus.READY_TO_RECORD
      || currentType === VoiceMessageInputStatus.RECORDING
    ) {
      return minRecordTime > currentValue;
    }
    return false;
  }, [currentType, minRecordTime, currentValue]);
  const isPlayMode = useMemo(() => {
    return (
      currentType === VoiceMessageInputStatus.READY_TO_PLAY
      || currentType === VoiceMessageInputStatus.PLAYING
    );
  }, [currentType]);
  const { stringSet } = useLocalization();

  const handleOnCancelClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > VOICE_RECORDER_CLICK_BUFFER_TIME) {
      onCancelClick();
      setLastClickTime(currentTime);
    }
  };
  const handleOnControlClick = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > VOICE_RECORDER_CLICK_BUFFER_TIME) {
      onControlClick(currentType);
      setLastClickTime(currentTime);
    }
  }, [currentType]);
  const handleOnSubmitClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > VOICE_RECORDER_CLICK_BUFFER_TIME) {
      if (!isSendButtonDisabled) {
        onSubmitClick();
      }
      setLastClickTime(currentTime);
    }
  };

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
        {(isRecording) ? (<div className="sendbird-voice-message-input__indicator__on-rec" />) : null}
        <PlaybackTime
          className="sendbird-voice-message-input__indicator__playback-time"
          time={isPlayMode ? maximumValue - currentValue : currentValue}
          labelColor={isReadyToRecord ? LabelColors.ONBACKGROUND_4 : LabelColors.ONCONTENT_1}
        />
      </div>
      <div className="sendbird-voice-message-input__controler">
        {
          renderCancelButton?.() || (
            <TextButton
              className="sendbird-voice-message-input__controler__cancel"
              onClick={handleOnCancelClick}
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
              onClick={handleOnControlClick}
            >
              <ControlerIcon inputState={currentType} />
            </div>
          )
        }
        {
          renderSubmitButton?.() || (
            <div
              className={`sendbird-voice-message-input__controler__submit ${isSendButtonDisabled ? 'voice-message--disabled' : ''}`}
              onClick={handleOnSubmitClick}
            >
              <Icon
                width="19px"
                height="19px"
                type={IconTypes.SEND}
                fillColor={isSendButtonDisabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT}
              />
            </div>
          )
        }
      </div>
    </div>
  );
};
