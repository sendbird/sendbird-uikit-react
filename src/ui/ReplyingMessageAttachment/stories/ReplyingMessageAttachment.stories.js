import React from 'react';
import ReplyingMessageAttachment from '../index.tsx';

import { dummyFileMessageAudio, dummyFileMessageVideo, dummyFileMessageImage, dummyFileMessageWithThumbnail } from '../mockMessage.ts';

export default { title: 'UI Components/ReplyingMessageAttachment' };

export const withText = () => [
<ReplyingMessageAttachment replyingMessage={dummyFileMessageAudio} />,
<ReplyingMessageAttachment replyingMessage={dummyFileMessageImage} />,
<ReplyingMessageAttachment replyingMessage={dummyFileMessageVideo} />,
<ReplyingMessageAttachment replyingMessage={dummyFileMessageWithThumbnail} />,
];
