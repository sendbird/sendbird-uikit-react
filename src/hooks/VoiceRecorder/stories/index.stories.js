import React, { useState } from 'react';

import SendbirdProvider from '../../../lib/Sendbird';

import { useVoiceRecorder } from '../useVoiceRecorder';
import { useVoicePlayer } from '../../VoicePlayer/useVoicePlayer';

export default { title: 'globalcontext/voice-recorder' };

const Tester = () => {
  const [currentAudio, setAudioFile] = useState(null);

  const { start, stop, recordingTime, recordingStatus } = useVoiceRecorder({
    onRecordingStarted: () => {
      console.log('onRecordingStarted')
    },
    onRecordingEnded: (recordedFile) => {
      console.log('onRecordingEnded', recordedFile)
      setAudioFile(recordedFile);
    },
  });
  const { play, pause, playbackTime, playingStatus, duration } = useVoicePlayer({
    key: 'unique-key',
    channelUrl: 'channel-url',
    audioFile: currentAudio,
    onPlayingStarted: () =>  {
      console.log('onPlayingStarted')
    },
    onPlayingStopped: () => {
      console.log('onPlayingStopped')
    },
    onPlaybackTimeUpdated: () => {
      console.log('onPlaybackTimeUpdated')
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
      {recordingTime}
      {recordingStatus}
      <input
        value="play"
        type="button"
        onClick={() => {
          console.log('on play clicked')
          play();
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
      {`${Math.floor(playbackTime)} / ${Math.floor(duration || recordingTime)}`}
      {playingStatus}
    </div>
  );
};

export const normal = () => {
  return (
    <div>
      <SendbirdProvider
        appId={process.env.STORYBOOK_APP_ID}
        userId="hoon"
      >
        <Tester />
      </SendbirdProvider>
    </div>
  );
};
