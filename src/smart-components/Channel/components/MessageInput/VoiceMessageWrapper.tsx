import React, { useEffect, useState } from 'react';
import './voice-message-wrapper.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useVoicePlayer } from '../../../../hooks/useVoicePlayer/useVoicePlayer';
import { useVoiceRecorder } from '../../../../hooks/useVoiceRecorder/useVoiceRecorder';
import VoiceMessageInput, { VoiceMessageInputStatus } from '../../../../ui/VoiceMessageInput';

export interface VoiceMessageInputWrapperProps {
  onCancelClick?: () => void;
  onSubmitClick?: (file: File) => void;
}

export const VoiceMessageInputWrapper = ({
  onCancelClick,
  onSubmitClick,
}: VoiceMessageInputWrapperProps): React.ReactElement => {
  const [currentAudioFile, setAudioFile] = useState(null);
  const [audioDuration, setDuration] = useState(0);
  const [voiceInputState, setVoiceInputState] = useState(VoiceMessageInputStatus.READY_TO_RECORD);
  const [isRecording, setIsRecording] = useState(true);
  const { config } = useSendbirdStateContext();
  const { voiceRecord } = config;
  const { maxRecordingTime } = voiceRecord;
  const {
    start,
    stop,
  } = useVoiceRecorder({
    onRecordingStarted: () => {
      setVoiceInputState(VoiceMessageInputStatus.RECORDING);
    },
    onRecordingEnded: (recordedFile) => {
      setAudioFile(recordedFile);
      setDuration(new Audio(URL.createObjectURL(recordedFile)).duration);
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
  }, [voiceInputState])

  return (
    <div className="sendbird-voice-message-input-wrapper">
      <VoiceMessageInput
        maxSize={isRecording ? maxRecordingTime : audioDuration}
        // playTime={isRecording ? recordingTime : playbackTime}
        inputState={voiceInputState}
        onCancelClick={onCancelClick}
        onSubmitClick={() => {
          onSubmitClick(currentAudioFile);
        }}
        onRecordClick={() => {
          start();
        }}
        onRecordStopClick={() => {
          stop();
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
