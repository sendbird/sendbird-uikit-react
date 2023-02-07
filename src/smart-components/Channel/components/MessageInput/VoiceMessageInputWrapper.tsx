import React, { useEffect, useState } from 'react';
import './voice-message-wrapper.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useVoicePlayer } from '../../../../hooks/useVoicePlayer/useVoicePlayer';
import { useVoiceRecorder } from '../../../../hooks/useVoiceRecorder/useVoiceRecorder';
import VoiceMessageInput, { VoiceMessageInputStatus } from '../../../../ui/VoiceMessageInput';

export interface VoiceMessageInputWrapperProps {
  onCancelClick?: () => void;
  onSubmitClick?: (file: File, duration: number) => void;
}

export const VoiceMessageInputWrapper = ({
  onCancelClick,
  onSubmitClick,
}: VoiceMessageInputWrapperProps): React.ReactElement => {
  const [currentAudioFile, setAudioFile] = useState(null);
  const [audioDuration, setDuration] = useState(0);
  const [voiceInputState, setVoiceInputState] = useState(VoiceMessageInputStatus.READY_TO_RECORD);
  const [isRecording, setIsRecording] = useState(true);
  const [isSubmited, setSubmit] = useState(false);
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
          stop();
          setSubmit(true);
        }}
        onRecordClick={() => {
          start();
        }}
        onRecordStopClick={(playbackTime) => {
          if (playbackTime >= 1000) {
            stop();
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
    </div>
  );
};

export default VoiceMessageInputWrapper;
