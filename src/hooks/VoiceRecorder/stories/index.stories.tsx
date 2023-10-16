import React, { useState } from 'react';

import SendbirdProvider from '../../../lib/Sendbird';

import { useVoiceRecorder } from '../useVoiceRecorder';
import { useVoicePlayer } from '../../VoicePlayer/useVoicePlayer';
import { LoggerFactory } from '../../../lib/Logger';

export default { title: 'globalcontext/voice-recorder' };
const logger = LoggerFactory('all');
const Tester = () => {
  const [currentAudio, setAudioFile] = useState(null);

  const { start, stop, recordingTime, recordingStatus } = useVoiceRecorder({
    onRecordingStarted: () => {
      logger.info('onRecordingStarted');
    },
    onRecordingEnded: (recordedFile) => {
      logger.info('onRecordingEnded', recordedFile);
      setAudioFile(recordedFile);
    },
  });
  const { play, pause, playbackTime, playingStatus, duration } = useVoicePlayer(
    {
      key: 'unique-key',
      channelUrl: 'channel-url',
      audioFile: currentAudio,
    },
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '98vw',
        height: '98vh',
      }}
    >
      <input
        value="start"
        type="button"
        onClick={() => {
          logger.info('on start clicked');
          start();
        }}
      />
      <input
        value="stop"
        type="button"
        onClick={() => {
          logger.info('on stop clicked');
          stop();
        }}
      />
      {recordingTime}
      {recordingStatus}
      <input
        value="play"
        type="button"
        onClick={() => {
          logger.info('on play clicked');
          play();
        }}
      />
      <input
        value="pause"
        type="button"
        onClick={() => {
          logger.info('on pause clicked');
          pause();
        }}
      />
      <p>
        {`${Math.floor(playbackTime)} / ${Math.floor(duration || recordingTime)}`}
      </p>
      <p>{`status: ${playingStatus}`}</p>
    </div>
  );
};

export const normal = () => {
  return (
    <div>
      <SendbirdProvider appId={process.env.STORYBOOK_APP_ID} userId="hoon">
        <Tester />
      </SendbirdProvider>
    </div>
  );
};
