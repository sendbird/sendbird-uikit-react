import React, { useState } from 'react';
import VoiceMessageInput, { VoiceMessageInputStatus } from '../index';

const description = `
  \`import VoiceMessageInput from "@sendbird/uikit-react/ui/VoiceMessageInput";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/VoiceMessageInput',
  component: VoiceMessageInput,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Basic = () => {
  const [voiceMessageState, setVoiceMessageState] = useState(VoiceMessageInputStatus.READY_TO_RECORD);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
    }}>
      <VoiceMessageInput
        maxSize={60000}
        inputState={voiceMessageState}
        onCancelClick={() => {
          console.log('onCancelClick');
        }}
        onSubmitClick={() => {
          console.log('onSubmitClick');
        }}
        onRecordClick={() => {
          console.log('onRecordClick');
          setVoiceMessageState(VoiceMessageInputStatus.RECORDING);
        }}
        onRecordStopClick={() => {
          console.log('onRecordStopClick');
          setVoiceMessageState(VoiceMessageInputStatus.READY_TO_PLAY);
        }}
        onPlayClick={() => {
          console.log('onPlayClick');
          setVoiceMessageState(VoiceMessageInputStatus.PLAYING);
        }}
        onPauseClick={() => {
          console.log('onPauseClick');
          setVoiceMessageState(VoiceMessageInputStatus.READY_TO_PLAY);
        }}
      />
    </div>
  );
};
