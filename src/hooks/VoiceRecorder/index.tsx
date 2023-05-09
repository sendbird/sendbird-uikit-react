import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_RECORDER_AUDIO_BITS,
  VOICE_RECORDER_MIME_TYPE,
} from '../../utils/consts';
import useSendbirdStateContext from '../useSendbirdStateContext';

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
const noop = () => { /* noop */ };
const Context = createContext<VoiceRecorderContext>({
  start: noop,
  stop: noop,
  isRecordable: false,
});

export const VoiceRecorderProvider = (props: VoiceRecorderProps): React.ReactElement => {
  const { children } = props;
  const { config } = useSendbirdStateContext();
  const { logger, isVoiceMessageEnabled } = config;
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);
  const [isRecordable, setIsRecordable] = useState<boolean>(false);

  const [webAudioUtils, setWebAudioUtils] = useState(null);
  useEffect(() => {
    if (isVoiceMessageEnabled && !webAudioUtils) {
      import('./WebAudioUtils').then((data) => {
        setWebAudioUtils(data);
      });
    }
  }, []);

  const start = useCallback((eventHandler: VoiceRecorderEventHandler): void => {
    if (isVoiceMessageEnabled && !webAudioUtils) {
      logger.error('VoiceRecorder: Recording audio processor is being loaded.');
      return;
    }

    logger.info('VoiceRecorder: Start recording.');
    if (mediaRecorder) {
      stop();
      logger.info('VoiceRecorder: Previous mediaRecorder is stopped.');
    }
    navigator?.mediaDevices?.getUserMedia?.({ audio: true })
      .then((stream) => {
        logger.info('VoiceRecorder: Succeeded getting media stream.', stream);
        setIsRecordable(true);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: VOICE_RECORDER_MIME_TYPE,
          audioBitsPerSecond: VOICE_RECORDER_AUDIO_BITS,
        });
        mediaRecorder.ondataavailable = (e) => { // when recording stops
          logger.info('VoiceRecorder: Succeeded getting an available data.', e.data);
          const audioFile = new File([e.data], VOICE_MESSAGE_FILE_NAME, {
            lastModified: new Date().getTime(),
            type: VOICE_MESSAGE_MIME_TYPE,
          });
          webAudioUtils?.downsampleToWav(audioFile, (buffer) => {
            const mp3Buffer = webAudioUtils?.encodeMp3(buffer);
            const mp3blob = new Blob(mp3Buffer, { type: VOICE_MESSAGE_MIME_TYPE });
            const convertedAudioFile = new File([mp3blob], VOICE_MESSAGE_FILE_NAME, {
              lastModified: new Date().getTime(),
              type: VOICE_MESSAGE_MIME_TYPE,
            });
            eventHandler?.onRecordingEnded(convertedAudioFile);
            logger.info('VoiceRecorder: Succeeded converting audio file.', convertedAudioFile);
          });
          stream?.getAudioTracks?.().forEach?.(track => track?.stop());
          setIsRecordable(false);
        };
        mediaRecorder?.start();
        setMediaRecorder(mediaRecorder);
        eventHandler?.onRecordingStarted();
      })
      .catch((err) => {
        logger.error('VoiceRecorder: Failed getting media stream.', err);
        setMediaRecorder(null);
      });
  }, [mediaRecorder, webAudioUtils]);

  const stop = useCallback((): void => {
    // Stop recording
    mediaRecorder?.stop();
    setMediaRecorder(null);
    setIsRecordable(false);
    logger.info('VoiceRecorder: Stop recording.');
  }, [mediaRecorder]);

  return (
    <Context.Provider value={{
      start,
      stop,
      isRecordable,
    }}>
      {children}
    </Context.Provider>
  );
};

export const useVoiceRecorderContext = (): VoiceRecorderContext => useContext(Context);

export default {
  VoiceRecorderProvider,
  useVoiceRecorderContext,
};
