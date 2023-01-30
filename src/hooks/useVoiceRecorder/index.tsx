import React, { createContext, useContext, useState } from 'react';

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
}
const VoiceRecorderContext = createContext<VoiceRecorderContext>({
  start: () => { },
  stop: () => { },
});

export const VoiceRecorderProvider = (props: VoiceRecorderProps): React.ReactElement => {
  const [audioData, setAudioData] = useState<Blob>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);

  const [currentEventHandler, setEventHandler] = useState<VoiceRecorderEventHandler>(null);

  const { children } = props;

  function start(eventHandler: VoiceRecorderEventHandler): void {
    // Getting the mic permission, stream
    navigator?.mediaDevices?.getUserMedia?.({ audio: true })
      .then((stream) => {
        setCurrentStream(stream);
        // Start recording
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {// when recording stops
          setAudioData(e.data);
        };
        mediaRecorder?.start();
        setMediaRecorder(mediaRecorder);
        // Event handling
        setEventHandler(eventHandler);
        eventHandler?.onRecordingStarted();
        // logger
      })
      .catch((error) => {
        // log error
        setMediaRecorder(null);
      });
  }

  function stop(): void {
    // Stop recording
    currentStream?.getAudioTracks?.().forEach?.(track => track?.stop());
    mediaRecorder?.stop();
    // Generate audio file
    const audioFile = new File([audioData], 'I am file name', {
      lastModified: new Date().getTime(),
      type: 'audio/mpeg',
    });
    // Event handling
    currentEventHandler?.onRecordingEnded(audioFile);
    setEventHandler(null);
    // logger
  }

  return (
    <VoiceRecorderContext.Provider value={{
      start,
      stop,
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
