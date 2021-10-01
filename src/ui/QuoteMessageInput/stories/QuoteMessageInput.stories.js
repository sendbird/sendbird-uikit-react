import React from 'react';
import QuoteMessageInput from '../index.tsx';

export default { title: 'UI Components/QuoteMessageInput' };

import {
  dummyFileMessageAudio,
  dummyFileMessageVideo,
  dummyFileMessageImage,
  dummyFileMessageGif,
  dummyFileMessageWithThumbnail,
} from '../mockMessage.ts';

export const withText = () => [
  <QuoteMessageInput replyingMessage={dummyFileMessageAudio} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageImage} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageVideo} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageGif} />,
  <QuoteMessageInput replyingMessage={dummyFileMessageWithThumbnail} />,
];
