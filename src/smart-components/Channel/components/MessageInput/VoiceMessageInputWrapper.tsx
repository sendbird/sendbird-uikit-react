import React, { useEffect, useState } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import './voice-message-wrapper.scss';

import { useLocalization } from '../../../../lib/LocalizationContext';
import { useVoicePlayer } from '../../../../hooks/VoicePlayer/useVoicePlayer';
import { useVoiceRecorder, VoiceRecorderStatus } from '../../../../hooks/VoiceRecorder/useVoiceRecorder';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';

import { VoiceMessageInput, VoiceMessageInputStatus } from '../../../../ui/VoiceMessageInput';
import Modal from '../../../../ui/Modal';
import Button, { ButtonSizes, ButtonTypes } from '../../../../ui/Button';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { VOICE_RECORDER_DEFAULT_MIN } from '../../../../utils/consts';
import { useVoicePlayerContext } from '../../../../hooks/VoicePlayer';

export interface VoiceMessageInputWrapperProps {
  channel?: GroupChannel;
  onCancelClick?: () => void;
  onSubmitClick?: (file: File, duration: number) => void;
}

const VOICE_MESSAGE_INPUT_KEY = 'voice-message-input';
export const VoiceMessageInputWrapper = ({
  channel,
  onCancelClick,
  onSubmitClick,
}: VoiceMessageInputWrapperProps): React.ReactElement => {
  const [audioFile, setAudioFile] = useState<File>(null);
  const [voiceInputState, setVoiceInputState] = useState<VoiceMessageInputStatus>(VoiceMessageInputStatus.READY_TO_RECORD);
  const [isSubmited, setSubmit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const minRecordingTime = config?.voiceRecord?.minRecordingTime || VOICE_RECORDER_DEFAULT_MIN;
  const stopPlay = useVoicePlayerContext().stop;
  const {
    start,
    stop,
    cancel,
    recordingTime,
    recordingStatus,
    recordingLimit,
  } = useVoiceRecorder({
    onRecordingStarted: () => {
      setVoiceInputState(VoiceMessageInputStatus.RECORDING);
    },
    onRecordingEnded: (audioFile) => {
      setAudioFile(audioFile);
    },
  });
  const {
    play,
    pause,
    playbackTime,
  } = useVoicePlayer({
    channelUrl: channel?.url,
    key: VOICE_MESSAGE_INPUT_KEY,
    audioFile: audioFile,
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
    if (isSubmited && audioFile) {
      stopPlay();
      onSubmitClick(audioFile, recordingTime);
    }
    if (audioFile) {
      if (recordingTime < minRecordingTime) {
        setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
        setAudioFile(null);
      } else {
        setVoiceInputState(VoiceMessageInputStatus.READY_TO_PLAY);
      }
    }
  }, [isSubmited, audioFile, recordingTime]);

  return (
    <div className="sendbird-voice-message-input-wrapper">
      <VoiceMessageInput
        currentValue={recordingStatus === VoiceRecorderStatus.COMPLETED ? playbackTime : recordingTime}
        maximumValue={recordingStatus === VoiceRecorderStatus.COMPLETED ? recordingTime : recordingLimit}
        currentType={voiceInputState}
        onCancelClick={() => {
          stopPlay();
          onCancelClick();
        }}
        onSubmitClick={() => {
          if (isDisabled) {
            setShowModal(true);
            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
          } else {
            stop();
            setSubmit(true);
          }
        }}
        onControlClick={(type) => {
          switch (type) {
            case VoiceMessageInputStatus.READY_TO_RECORD: {
              pause();
              start();
              break;
            }
            case VoiceMessageInputStatus.RECORDING: {
              if (recordingTime >= minRecordingTime && !isDisabled) {
                stop();
              } else if (isDisabled) {
                cancel();
                setShowModal(true);
                setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
              } else {
                cancel();
                setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
              }
              break;
            }
            case VoiceMessageInputStatus.READY_TO_PLAY: {
              play();
              break;
            }
            case VoiceMessageInputStatus.PLAYING: {
              pause();
              break;
            }
          }
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
