import React, { useEffect, useState } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import './voice-message-wrapper.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useVoicePlayer } from '../../../../hooks/useVoicePlayer/useVoicePlayer';
import { useVoiceRecorder } from '../../../../hooks/useVoiceRecorder/useVoiceRecorder';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';

import VoiceMessageInput, { VoiceMessageInputStatus } from '../../../../ui/VoiceMessageInput';
import Modal from '../../../../ui/Modal';
import Button, { ButtonSizes, ButtonTypes } from '../../../../ui/Button';

export interface VoiceMessageInputWrapperProps {
  channel?: GroupChannel;
  onCancelClick?: () => void;
  onSubmitClick?: (file: File, duration: number) => void;
}

export const VoiceMessageInputWrapper = ({
  channel,
  onCancelClick,
  onSubmitClick,
}: VoiceMessageInputWrapperProps): React.ReactElement => {
  const [currentAudioFile, setAudioFile] = useState(null);
  const [audioDuration, setDuration] = useState(0);
  const [voiceInputState, setVoiceInputState] = useState(VoiceMessageInputStatus.READY_TO_RECORD);
  const [isRecording, setIsRecording] = useState(true);
  const [isSubmited, setSubmit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const { voiceRecord } = config;
  const { maxRecordingTime } = voiceRecord;
  const {
    start,
    stop,
    recordingTime,
  } = useVoiceRecorder({
    onRecordingStarted: () => {
      setVoiceInputState(VoiceMessageInputStatus.RECORDING);
    },
    onRecordingEnded: (recordedFile) => {
      setAudioFile(recordedFile);
      setVoiceInputState(VoiceMessageInputStatus.READY_TO_PLAY);
    },
  });
  const {
    play,
    pause,
  } = useVoicePlayer({
    onPlayingStarted: () => {
      setVoiceInputState(VoiceMessageInputStatus.PLAYING);
    },
    onPlayingStopped: () => {
      setVoiceInputState(VoiceMessageInputStatus.READY_TO_PLAY);
    },
  });

  // disabled state: muted & frozen
  useEffect(() => {
    if (isDisabledBecauseFrozen(channel) || isDisabledBecauseMuted(channel)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [channel?.myRole, channel?.isFrozen, channel?.myMutedState]);

  useEffect(() => {
    if (voiceInputState === VoiceMessageInputStatus.READY_TO_RECORD
      || voiceInputState === VoiceMessageInputStatus.RECORDING
    ) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }

    if (voiceInputState === VoiceMessageInputStatus.READY_TO_PLAY) {
      setDuration(recordingTime);
    }
  }, [voiceInputState]);
  useEffect(() => {
    if (isSubmited && currentAudioFile) {
      onSubmitClick(currentAudioFile, recordingTime);
    }
  }, [isSubmited, currentAudioFile, recordingTime]);
  useEffect(() => {
    if (recordingTime >= maxRecordingTime) {
      stop();
    }
  }, [recordingTime, maxRecordingTime]);

  return (
    <div className="sendbird-voice-message-input-wrapper">
      <VoiceMessageInput
        maxSize={isRecording ? maxRecordingTime : audioDuration}
        inputState={voiceInputState}
        onCancelClick={onCancelClick}
        onSubmitClick={() => {
          if (isDisabled) {
            setShowModal(true);
            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
          } else {
            stop();
            setSubmit(true);
          }
        }}
        onRecordClick={() => {
          start();
        }}
        onRecordStopClick={(playbackTime) => {
          if (playbackTime >= 1000 && !isDisabled) {
            stop();
          } else if (isDisabled) {
            setShowModal(true);
            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
          } else {
            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
          }
        }}
        onPlayClick={() => {
          play(currentAudioFile);
        }}
        onPauseClick={() => {
          pause();
        }}
      />
      {
        showModal && (
          <Modal
            className="sendbird-voice-message-input-wrapper-alert"
            titleText={isDisabledBecauseMuted(channel)
              ? stringSet.MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED
              : stringSet.MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN
            }
            hideFooter
            isCloseOnClickOutside
            onCancel={() => {
              setShowModal(false);
              onCancelClick();
            }}
          >
            <div className="sendbird-voice-message-input-wrapper-alert__body">
              <Button
                className="sendbird-voice-message-input-wrapper-alert__body__ok-button"
                type={ButtonTypes.PRIMARY}
                size={ButtonSizes.BIG}
                onClick={() => {
                  setShowModal(false);
                  onCancelClick();
                }}
              >
                {stringSet.BUTTON__OK}
              </Button>
            </div>
          </Modal>
        )
      }
    </div>
  );
};

export default VoiceMessageInputWrapper;
