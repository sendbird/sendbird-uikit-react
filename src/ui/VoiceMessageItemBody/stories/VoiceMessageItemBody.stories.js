import React from 'react';
import { VoicePlayerProvider } from '../../../hooks/useVoicePlayer';
import VoiceMessageItemBody from '../index';

const description = `
  \`import VoiceMessageItemBody from "@sendbird/uikit-react/ui/VoiceMessageItemBody";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/VoiceMessageItemBody',
  component: VoiceMessageItemBody,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Basic = () => {
  return (
    <div style={{
      width: '100%',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      gap: '100px',
    }}>
      <VoicePlayerProvider>
        <VoiceMessageItemBody
          message={{
            url: 'https://file-ap-1.sendbird.com/5ed2eac62e9b41609ac34340b6b3aa75.mp3',
          }}
        />
        <VoiceMessageItemBody
          message={{
            url: 'https://file-ap-1.sendbird.com/5ed2eac62e9b41609ac34340b6b3aa75.mp3',
          }}
          isByMe
        />
      </VoicePlayerProvider>
    </div>
  )
};
