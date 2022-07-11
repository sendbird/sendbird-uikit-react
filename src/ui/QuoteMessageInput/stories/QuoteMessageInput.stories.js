import React from 'react';
import QuoteMessageInput from '../index.tsx';

import {
  dummyFileMessageAudio,
  dummyFileMessageVideo,
  dummyFileMessageImage,
  dummyFileMessageGif,
  dummyFileMessageWithThumbnail,
} from '../mockMessage.ts';

const description = `
  \`import QuoteMessageInput from "@sendbird/uikit-react/ui/QuoteMessageInput";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/QuoteMessageInput',
  component: QuoteMessageInput,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <QuoteMessageInput replyingMessage={dummyFileMessageAudio} {...arg} />
);

export const withText = () => [
  <QuoteMessageInput replyingMessage={dummyFileMessageAudio} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageImage} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageVideo} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageGif} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageWithThumbnail} />,
];
