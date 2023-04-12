import React, { useEffect, useState } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import './voice-message-wrapper.scss';

import { useLocalization } from '../../../../lib/LocalizationContext';
import { useVoicePlayer } from '../../../../hooks/VoicePlayer/useVoicePlayer';
import { useVoiceRecorder, VoiceRecorderStatus } from '../../../../hooks/VoiceRecorder/useVoiceRecorder';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';

import { VoiceMessageInput } from '../../../../ui/VoiceMessageInput';
import { VoiceMessageInputStatus } from '../../../../ui/VoiceMessageInput/types';
import Modal from '../../../../ui/Modal';
import Button, { ButtonSizes, ButtonTypes } from '../../../../ui/Button';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { VOICE_RECORDER_DEFAULT_MIN } from '../../../../utils/consts';
import { VoicePlayerStatus } from '../../../../hooks/VoicePlayer/dux/initialState';
import uuidv4 from '../../../../utils/uuid';

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
  const [audioFile, setAudioFile] = useState<File>(null);
  const [uuid] = useState<string>(uuidv4());
  const [voiceInputState, setVoiceInputState] = useState<VoiceMessageInputStatus>(VoiceMessageInputStatus.READY_TO_RECORD);
  const [isSubmitted, setSubmit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const minRecordingTime = config?.voiceRecord?.minRecordingTime || VOICE_RECORDER_DEFAULT_MIN;
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
  const voicePlayer = useVoicePlayer({
    channelUrl: channel?.url,
    key: uuid,
    audioFile: audioFile,
  });
  const {
    play,
    pause,
    playbackTime,
    playingStatus,
  } = voicePlayer;
  const stopVoicePlayer = voicePlayer.stop;

  // disabled state: muted & frozen
  useEffect(() => {
    if (isDisabledBecauseFrozen(channel) || isDisabledBecauseMuted(channel)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [channel?.myRole, channel?.isFrozen, channel?.myMutedState]);

  useEffect(() => {
    if (isSubmitted && audioFile) {
      onSubmitClick(audioFile, recordingTime);
      setSubmit(false);
      setAudioFile(null);
    }
  }, [isSubmitted, audioFile, recordingTime]);
  useEffect(() => {
    if (audioFile) {
      if (recordingTime < minRecordingTime) {
        setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
        setAudioFile(null);
      } else if (playingStatus === VoicePlayerStatus.PLAYING) {
        setVoiceInputState(VoiceMessageInputStatus.PLAYING);
      } else {
        setVoiceInputState(VoiceMessageInputStatus.READY_TO_PLAY);
      }
    }
  }, [isSubmitted, audioFile, recordingTime, playingStatus]);

  return (
    <div className="sendbird-voice-message-input-wrapper">
      <VoiceMessageInput
        currentValue={recordingStatus === VoiceRecorderStatus.COMPLETED ? playbackTime : recordingTime}
        maximumValue={recordingStatus === VoiceRecorderStatus.COMPLETED ? recordingTime : recordingLimit}
        currentType={voiceInputState}
        onCancelClick={() => {
          onCancelClick();
          cancel();
        }}
        onSubmitClick={() => {
          if (isDisabled) {
            setShowModal(true);
            setVoiceInputState(VoiceMessageInputStatus.READY_TO_RECORD);
          } else {
            stop();
            pause();
            setSubmit(true);
          }
        }}
        onControlClick={(type) => {
          switch (type) {
            case VoiceMessageInputStatus.READY_TO_RECORD: {
              stopVoicePlayer();
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
