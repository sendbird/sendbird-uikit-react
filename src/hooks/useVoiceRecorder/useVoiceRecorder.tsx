import { useCallback, useState } from 'react';
import { VoiceRecorderEventHandler, useVoiceRecorderContext } from '.';

export interface UseVoiceRecorderProps extends VoiceRecorderEventHandler {
  // VoiceRecorderEventHandler
  /**
   * onRecordingStarted
   * onRecordingEnded
   */
}
export interface UseVoiceRecorderContext {
  start: () => void;
  stop: () => void;
  recordingTime: number;
  recordedFile: File;
}

const noop = () => { };
export const useVoiceRecorder = (props: UseVoiceRecorderProps): UseVoiceRecorderContext => {
  const {
    onRecordingStarted = noop,
    onRecordingEnded = noop,
  } = props;
  const voiceRecorder = useVoiceRecorderContext();
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedFile, setRecordedFile] = useState<File>(null);

  // Timer
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timer>(null);
  function startTimer(limit?: number) {
    const timerLimit = limit || 60000;
    const interval = setInterval(() => {
      const newTime = recordingTime + 100;
      setRecordingTime(newTime);
      if (newTime > timerLimit) {
        stopTimer();
      }
    }, 100);
    setTimeInterval(interval);
  }
  function stopTimer() {
    clearInterval(timeInterval);
  }

  const start = useCallback(() => {
    voiceRecorder?.start({
      onRecordingStarted: () => {
        startTimer();
      },
      onRecordingEnded: (audioFile) => {
        onRecordingEnded(audioFile);
        setRecordedFile(audioFile);
        stopTimer();
      },
    });
  }, [onRecordingStarted, onRecordingEnded]);
  const stop = useCallback(() => {
    voiceRecorder?.stop();
  }, []);

  return ({
    start,
    stop,
    recordingTime,
    recordedFile,
  });
};
