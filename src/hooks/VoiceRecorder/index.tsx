import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { downsampleToWav, encodeMp3 } from './WebAudioUtils';
import {
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_RECORDER_AUDIO_BITS,
  VOICE_RECORDER_MIME_TYPE,
} from '../../utils/consts';

// Input props of VoiceRecorder
export interface VoiceRecorderProps {
  children: React.ReactElement;
}

export interface VoiceRecorderEventHandler {
  onRecordingStarted?: () => void;
  onRecordingEnded?: (props: null | File) => void;
}

// Output of VoiceRecorder
export interface VoiceRecorderContext {
  start: (eventHandler?: VoiceRecorderEventHandler) => void,
  stop: () => void,
  isRecordable: boolean;
}
const noop = () => {/* noop */ };
const VoiceRecorderContext = createContext<VoiceRecorderContext>({
  start: noop,
  stop: noop,
  isRecordable: false,
});

export const VoiceRecorderProvider = (props: VoiceRecorderProps): React.ReactElement => {
  const [currentStream, setCurrentStream] = useState<MediaStream>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);

  const { children } = props;

  useEffect(() => {
    navigator?.mediaDevices?.getUserMedia?.({ audio: true })
      .then((stream) => {
        setCurrentStream(stream);
      })
      .catch(() => {
        // error
        setMediaRecorder(null);
      });
    return () => {
      currentStream?.getAudioTracks?.().forEach?.(track => track?.stop());
      setCurrentStream(null);
    };
  }, []);

  const start = useCallback((eventHandler: VoiceRecorderEventHandler): void => {
    if (mediaRecorder) {
      stop();
    }
    if (currentStream) {
      const mediaRecorder = new MediaRecorder(currentStream, {
        mimeType: VOICE_RECORDER_MIME_TYPE,
        audioBitsPerSecond: VOICE_RECORDER_AUDIO_BITS,
      });
      mediaRecorder.ondataavailable = (e) => {// when recording stops
        const audioFile = new File([e.data], VOICE_MESSAGE_FILE_NAME, {
          lastModified: new Date().getTime(),
          type: VOICE_MESSAGE_MIME_TYPE,
        });
        downsampleToWav(audioFile, (buffer) => {
          const mp3Buffer = encodeMp3(buffer);
          const mp3blob = new Blob(mp3Buffer, { type: VOICE_MESSAGE_MIME_TYPE });
          const convertedAudioFile = new File([mp3blob], VOICE_MESSAGE_FILE_NAME, {
            lastModified: new Date().getTime(),
            type: VOICE_MESSAGE_MIME_TYPE,
          });
          eventHandler?.onRecordingEnded(convertedAudioFile);
        })
      };
      mediaRecorder?.start();
      setMediaRecorder(mediaRecorder);
      eventHandler?.onRecordingStarted();
    }
  }, [mediaRecorder, currentStream]);

  const stop = useCallback((): void => {
    // Stop recording
    mediaRecorder?.stop();
    setMediaRecorder(null);
    // TODO: logger
  }, [mediaRecorder]);

  return (
    <VoiceRecorderContext.Provider value={{
      start,
      stop,
      isRecordable: (null !== currentStream),
    }}>
      {children}
    </VoiceRecorderContext.Provider>
  )
};

export const useVoiceRecorderContext = (): VoiceRecorderContext => useContext(VoiceRecorderContext);

export default {
  VoiceRecorderProvider,
  useVoiceRecorderContext,
};
