import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useLocalization } from '../../lib/LocalizationContext';
import Modal from '../../ui/Modal';
import {
  BROWSER_SUPPORT_MIME_TYPE_LIST,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_RECORDER_AUDIO_BIT_RATE,
} from '../../utils/consts';
import useSendbirdStateContext from '../useSendbirdStateContext';
import { type WebAudioUtils } from './WebAudioUtils';

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
  const { logger, groupChannel } = config;
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecordable, setIsRecordable] = useState<boolean>(false);
  const [permissionWarning, setPermissionWarning] = useState<boolean>(false);
  const { stringSet } = useLocalization();

  const isVoiceMessageEnabled = groupChannel.enableVoiceMessage;
  const [webAudioUtils, setWebAudioUtils] = useState<WebAudioUtils | null>(null);

  const browserSupportMimeType = BROWSER_SUPPORT_MIME_TYPE_LIST.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? '';
  if (isVoiceMessageEnabled && !browserSupportMimeType) {
    logger.error('VoiceRecorder: Browser does not support mimeType', { mimmeTypes: BROWSER_SUPPORT_MIME_TYPE_LIST });
  }

  useEffect(() => {
    if (isVoiceMessageEnabled && !webAudioUtils) {
      import('./WebAudioUtils').then((data) => {
        setWebAudioUtils(data);
      });
    }
  }, [isVoiceMessageEnabled, webAudioUtils]);

  const start = useCallback((eventHandler: VoiceRecorderEventHandler): void => {
    if (isVoiceMessageEnabled && !webAudioUtils) {
      logger.error('VoiceRecorder: Recording audio processor is being loaded.');
      return;
    }

    const checkPermission = () => {
      try {
        // Type '"microphone"' is not assignable to type 'PermissionName'.ts(2322)
        // this is typescript issue
        // https://github.com/microsoft/TypeScript/issues/33923
        // @ts-expect-error
        navigator.permissions.query({ name: 'microphone' }).then((result) => {
          if (result.state === 'denied') {
            logger.warning('VoiceRecorder: Permission denied.');
            setPermissionWarning(true);
          }
        });
      } catch (error) {
        logger.warning('VoiceRecorder: Failed to check permission.', error);
      }
    };

    logger.info('VoiceRecorder: Start recording.');
    if (mediaRecorder) {
      stop();
      logger.info('VoiceRecorder: Previous mediaRecorder is stopped.');
    }
    checkPermission();
    navigator?.mediaDevices?.getUserMedia?.({ audio: true })
      .then((stream) => {
        logger.info('VoiceRecorder: Succeeded getting media stream.', stream);
        setIsRecordable(true);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: browserSupportMimeType,
          audioBitsPerSecond: VOICE_RECORDER_AUDIO_BIT_RATE,
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
            eventHandler?.onRecordingEnded?.(convertedAudioFile);
            logger.info('VoiceRecorder: Succeeded converting audio file.', convertedAudioFile);
          });
          stream?.getAudioTracks?.().forEach?.(track => track?.stop());
          setIsRecordable(false);
        };
        mediaRecorder.onstart = eventHandler?.onRecordingStarted ?? noop;
        mediaRecorder?.start();
        setMediaRecorder(mediaRecorder);
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
      {
        permissionWarning && (
          <Modal
            hideFooter
            onCancel={() => setPermissionWarning(false)}
          >
            <>{stringSet.VOICE_RECORDING_PERMISSION_DENIED}</>
          </Modal>
        )
      }
    </Context.Provider>
  );
};

export const useVoiceRecorderContext = (): VoiceRecorderContext => useContext(Context);

export default {
  VoiceRecorderProvider,
  useVoiceRecorderContext,
};
