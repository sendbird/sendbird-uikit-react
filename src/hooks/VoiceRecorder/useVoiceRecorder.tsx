import { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceRecorderEventHandler, useVoiceRecorderContext } from '.';
import useSendbirdStateContext from '../useSendbirdStateContext';
import { VOICE_RECORDER_DEFAULT_MAX } from '../../utils/consts';

// export interface UseVoiceRecorderProps extends VoiceRecorderEventHandler {
//   /**
//    * onRecordingStarted
//    * onRecordingEnded
//    */
// }
/* eslint-disable no-redeclare */
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
  recordedFile: File | null;
  recordingStatus: VoiceRecorderStatus;
}

const noop = () => { /* noop */ };

export const useVoiceRecorder = ({
  onRecordingStarted = noop,
  onRecordingEnded = noop,
}: VoiceRecorderEventHandler): UseVoiceRecorderContext => {
  const { config } = useSendbirdStateContext();
  const { voiceRecord } = config;
  const maxRecordingTime = voiceRecord?.maxRecordingTime ?? VOICE_RECORDER_DEFAULT_MAX;
  const voiceRecorder = useVoiceRecorderContext();
  const { isRecordable } = voiceRecorder;

  const [recordedFile, setRecordedFile] = useState<File | null>(null);
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
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  function startTimer() {
    stopTimer();
    setRecordingTime(0);

    timer.current = setInterval(() => {
      setRecordingTime(prevTime => {
        const newTime = prevTime + 100;
        if (newTime > maxRecordingTime) {
          stopTimer();
        }
        return newTime;
      });
    }, 100);
  }
  function stopTimer() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
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
