import { useCallback, useState } from 'react';
import { VoiceRecorderEventHandler, useVoiceRecorderContext } from '.';
import useSendbirdStateContext from '../useSendbirdStateContext';

// export interface UseVoiceRecorderProps extends VoiceRecorderEventHandler {
//   /**
//    * onRecordingStarted
//    * onRecordingEnded
//    */
// }
export interface UseVoiceRecorderContext {
  start: () => void;
  stop: () => void;
  recordingTime: number;
  recordedFile: File;
  recordingLimit: number;
}

const noop = () => {/* noop */};
export const useVoiceRecorder = (props: VoiceRecorderEventHandler): UseVoiceRecorderContext => {
  const {
    onRecordingStarted = noop,
    onRecordingEnded = noop,
  } = props;
  const { config } = useSendbirdStateContext();
  const { voiceRecord } = config;
  const { maxRecordingTime } = voiceRecord;
  const voiceRecorder = useVoiceRecorderContext();

  const [recordedFile, setRecordedFile] = useState<File>(null);
  const [timerLimit] = useState<number>(maxRecordingTime);

  // Timer
  const [recordingTime, setRecordingTime] = useState<number>(0);
  let timer: NodeJS.Timer = null;

  const startTimer = () => {
    stopTimer();
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prevTime => {
        const newTime = prevTime + 100;
        if (newTime > timerLimit) {
          stopTimer();
        }
        return newTime;
      });
    }, 100);
    timer = interval;
  };
  const stopTimer = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = useCallback(() => {
    voiceRecorder?.start({
      onRecordingStarted: () => {
        onRecordingStarted();
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
  }, [voiceRecorder]);

  return ({
    start,
    stop,
    recordingTime,
    recordedFile,
    recordingLimit: timerLimit,
  });
};
