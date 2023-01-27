import React, { useEffect } from 'react';
import { useVoiceRecorderContext, VoiceRecorderProvider } from '../index';

export default { title: 'globalcontext/voice-recorder' };

const Tester = () => {
  const {
    start,
    stop,
    recordingTime,
  } = useVoiceRecorderContext();

  // eventHandler
  // useEffect(() => {
  //   onRecordingStarted()
  //     .then(() => {
  //       console.log('on recording started')
  //     })
  //     .catch((error) => {
  //       console.log('record starting failed')
  //     });
  //   onRecordingEnded()
  //     .then((file) => {
  //       console.log('on recording ended')
  //       // manage file
  //     })
  //     .catch((error) => {
  //       console.log('recording failed')
  //     });
  // }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '98vw',
      height: '98vh',
    }}>
      <input
        value="start"
        type="button"
        onClick={() => {
          console.log('on start clicked')
          start();
        }}
      />
      <input
        value="stop"
        type="button"
        onClick={() => {
          console.log('on stop clicked')
          stop();
        }}
      />
    </div>
  );
}

export const normal = () => {
  return (
    <div>
      <VoiceRecorderProvider>
        <Tester />
      </VoiceRecorderProvider>
    </div>
  );
}