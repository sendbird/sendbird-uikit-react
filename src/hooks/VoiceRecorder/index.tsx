import React, { createContext, useCallback, useContext, useState } from 'react';
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
  setAudioProcessor: React.Dispatch<React.SetStateAction<AudioProcessorType>>;
}

const noop = () => {/* noop */ };
const VoiceRecorderContext = createContext<VoiceRecorderContext>({
  start: noop,
  stop: noop,
  isRecordable: false,
  setAudioProcessor: noop,
});

// Todo: File type should be:
// const convertedAudioFile = new File([mp3blob], VOICE_MESSAGE_FILE_NAME, {
//   lastModified: new Date().getTime(),
//   type: VOICE_MESSAGE_MIME_TYPE,
// });
type AudioProcessorType = (audioFile: File) => Promise<File>;

export const VoiceRecorderProvider = (props: VoiceRecorderProps): React.ReactElement => {
  const { children } = props;
  const { config } = useSendbirdStateContext();
  const { logger } = config;
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);
  const [isRecordable, setIsRecordable] = useState<boolean>(false);
  const [audioProcessor, setAudioProcessor] = useState<AudioProcessorType>(null);

  const start = useCallback((eventHandler: VoiceRecorderEventHandler): void => {
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
        mediaRecorder.ondataavailable = (e) => {// when recording stops
          logger.info('VoiceRecorder: Succeeded getting an available data.', e.data);
          const audioFile = new File([e.data], VOICE_MESSAGE_FILE_NAME, {
            lastModified: new Date().getTime(),
            type: VOICE_MESSAGE_MIME_TYPE,
          });
          if (!audioProcessor) {
            // TODO: Add a default audio processor -> no conversion
            logger.error('VoiceRecorder: Failed converting audio file. audioProcessor not detected', audioFile);
            logger.error('VoiceRecorder: Set audioProcessor through', audioFile);
            return;
          }
          audioProcessor(audioFile).then((processedAudioFile) => {
            eventHandler?.onRecordingEnded(processedAudioFile);
            logger.info('VoiceRecorder: Succeeded converting audio file.', processedAudioFile);
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
  }, [mediaRecorder]);

  const stop = useCallback((): void => {
    // Stop recording
    mediaRecorder?.stop();
    setMediaRecorder(null);
    setIsRecordable(false);
    logger.info('VoiceRecorder: Stop recording.');
  }, [mediaRecorder]);

  return (
    <VoiceRecorderContext.Provider value={{
      start,
      stop,
      isRecordable,
      setAudioProcessor,
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
