import { useCallback, useEffect, useState } from 'react';
import { VoiceRecorderEventHandler, useVoiceRecorderContext } from '.';
import useSendbirdStateContext from '../useSendbirdStateContext';

// export interface UseVoiceRecorderProps extends VoiceRecorderEventHandler {
//   /**
//    * onRecordingStarted
//    * onRecordingEnded
//    */
// }
export const VoiceRecorderStatus = {
  PREPARING: 'PREPARING',
  READY_TO_RECORD: 'READY_TO_RECORD',
  RECORDING: 'RECORDING',
  COMPLETED: 'COMPLETED',
} as const;
export type VoiceRecorderStatus = typeof VoiceRecorderStatus[keyof typeof VoiceRecorderStatus];
export interface UseVoiceRecorderContext {
  start: () => void;
  stop: () => void;
  cancel: () => void;
  recordingLimit: number;
  recordingTime: number;
  recordedFile: File;
  recordingStatus: VoiceRecorderStatus;
}

const noop = () => {/* noop */};

export const useVoiceRecorder = ({
  onRecordingStarted = noop,
  onRecordingEnded = noop,
}: VoiceRecorderEventHandler): UseVoiceRecorderContext => {
  const { config } = useSendbirdStateContext();
  const { voiceRecord } = config;
  const { maxRecordingTime } = voiceRecord;
  const voiceRecorder = useVoiceRecorderContext();
  const { isRecordable } = voiceRecorder;

  const [recordedFile, setRecordedFile] = useState<File>(null);
  const [recordingStatus, setRecordingStatus] = useState<VoiceRecorderStatus>(VoiceRecorderStatus.PREPARING);
  useEffect(() => {
    if (isRecordable && recordingStatus === VoiceRecorderStatus.PREPARING) {
      setRecordingStatus(VoiceRecorderStatus.READY_TO_RECORD);
    }
  }, [isRecordable]);

  const start = useCallback(() => {
    voiceRecorder?.start({
      onRecordingStarted: () => {
        setRecordingStatus(VoiceRecorderStatus.RECORDING);
        onRecordingStarted();
        startTimer();
      },
      onRecordingEnded: (audioFile) => {
        setRecordingStatus(VoiceRecorderStatus.COMPLETED);
        onRecordingEnded(audioFile);
        setRecordedFile(audioFile);
        stopTimer();
      },
    });
  }, [onRecordingStarted, onRecordingEnded]);
  const stop = useCallback(() => {
    voiceRecorder?.stop();
    stopTimer();
  }, [voiceRecorder]);
  const cancel = useCallback(() => {
    stop();
    setRecordedFile(null);
  }, [voiceRecorder]);

  // Timer
  const [recordingTime, setRecordingTime] = useState<number>(0);
  let timer: NodeJS.Timer = null;
  function startTimer() {
    stopTimer();
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prevTime => {
        const newTime = prevTime + 100;
        if (newTime > maxRecordingTime) {
          stopTimer();
        }
        return newTime;
      });
    }, 100);
    timer = interval;
  }
  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }
  useEffect(() => {
    if (recordingTime > maxRecordingTime) {
      stop();
    }
  }, [recordingTime, maxRecordingTime, stop]);

  return ({
    start,
    stop,
    cancel,
    recordingStatus,
    recordingTime,
    recordedFile,
    recordingLimit: maxRecordingTime,
  });
};
