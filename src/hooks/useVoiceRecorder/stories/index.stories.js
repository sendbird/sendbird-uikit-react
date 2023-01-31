import React, { useState } from 'react';
import { VoiceRecorderProvider } from '../index';
import { useVoiceRecorder } from '../useVoiceRecorder';
import { VoicePlayerProvider } from '../../useVoicePlayer/index';
import { useVoicePlayer } from '../../useVoicePlayer/useVoicePlayer';

export default { title: 'globalcontext/voice-recorder' };

const Tester = () => {
  const [currentAudio, setAudioFile] = useState(null);

  const { start, stop, recordingTime } = useVoiceRecorder({
    onRecordingStarted: () => {
      console.log('onRecordingStarted')
    },
    onRecordingEnded: (recordedFile) => {
      console.log('onRecordingEnded', recordedFile)
      setAudioFile(recordedFile);
    },
  });
  const { play, pause, playbackTime } = useVoicePlayer({
    onPlayingStarted: () =>  {
      console.log('onPlayingStarted')
    },
    onPlayingStopped: ({playbackTime, audioFile}) => {
      console.log('onPlayingStopped', playbackTime, audioFile)
    },
    onPlaybackTimeUpdated: (time) => {
      console.log('onPlaybackTimeUpdated', time)
    },
  });

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
      <div>{recordingTime}</div>
      <input
        value="play"
        type="button"
        onClick={() => {
          console.log('on play clicked')
          play(currentAudio);
        }}
      />
      <input
        value="pause"
        type="button"
        onClick={() => {
          console.log('on pause clicked')
          pause();
        }}
      />
      <div>{playbackTime}</div>
    </div>
  );
}

export const normal = () => {
  return (
    <div>
      <VoiceRecorderProvider>
        <VoicePlayerProvider>
          <Tester />
        </VoicePlayerProvider>
      </VoiceRecorderProvider>
    </div>
  );
}
