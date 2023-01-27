import React, { createContext, useContext, useState } from 'react';

// Input props of VoiceRecorder
export interface VoiceRecorderProps {
  children: React.ReactElement;
}

export interface VoiceRecorderEventHandler {
  onRecordingStarted: () => void;
  onRecordingEnded: (props: null | File) => void;
}

// Output of VoiceRecorder
export interface VoiceRecorderContext {
  start: (eventHandler?: VoiceRecorderEventHandler) => void,
  stop: () => void,
  recordingTime: number,
}
const VoiceRecorderContext = createContext<VoiceRecorderContext>({
  start: () => { },
  stop: () => { },
  recordingTime: 0,
});

export const VoiceRecorderProvider = (props: VoiceRecorderProps): React.ReactElement => {
  const [audioData, setAudioData] = useState<Blob>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);

  const [recordingTime, setRecordingTime] = useState<number>(0);

  const [currentEventHandler, setEventHandler] = useState<VoiceRecorderEventHandler>(null);

  const { children } = props;

  // function initialize(eventHandler: VoiceRecorderEventHandler = null) {
  //   if (currentEventHandler) {
  //     currentEventHandler?.onRecordingEnded(recordedFile);
  //   }
  //   setRecordingTime(0);
  //   setRecordedFile(null);
  // }

  function prepareRecord(eventHandler: VoiceRecorderEventHandler): void {
    if (currentEventHandler) {
      endRecord();
    }
  }

  function endRecord() {

  }

  function start(eventHandler: VoiceRecorderEventHandler): void {
    console.log('voice recorder / start is called')

    if (currentEventHandler) {
      // 녹음을 종료한다
      currentEventHandler?.onRecordingEnded(recordedFile);

      // Reset: currentEventHandler, recordedFile, recordingTime
    }
    navigator?.mediaDevices?.getUserMedia?.({ audio: true })
      .then((stream) => {
        // const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4', audioBitsPerSecond: 96,  })
        setCurrentStream(stream);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          console.log('set audio data', e.data);
          setAudioData(e.data);
        };
        setMediaRecorder(mediaRecorder);
        mediaRecorder?.start();
        setEventHandler(eventHandler);
        eventHandler?.onRecordingStarted();
      })
      .catch((error) => {
        // log error
        setMediaRecorder(null);
      });
  }

  function stop(): void {
    console.log('voice recorder / stop is called')

    currentStream?.getAudioTracks?.().forEach?.(track => track?.stop());
    mediaRecorder?.stop();

    const audioFile = new File([audioData], 'I am file name', {
      lastModified: new Date().getTime(),
      type: 'audio/mpeg',
    })
    currentEventHandler?.onRecordingEnded(audioFile);
    setEventHandler(null);
    console.log('Audio file', audioFile)

    // setTimeout(() => {
    //   // 이거는 player 로직
    //   console.log('play time | audio data', audioData)
    //   const audioPlayer = new Audio(URL?.createObjectURL?.(audioData))
    //   audioPlayer.loop = false;
    //   audioPlayer.volume = 1;
    //   audioPlayer.play();
    // }, 1000)

    // 녹음을 종료한다
    // recording status를 변경한다 - RECORDING to COMPLETED
    // recoded file을 생성하고 setState

    // if (mediaRecorder) {
    //   mediaRecorder?.stop();
    //   setMediaRecorder(null);
    // }
  }

  return (
    <VoiceRecorderContext.Provider value={{
      start,
      stop,
      recordingTime,
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
