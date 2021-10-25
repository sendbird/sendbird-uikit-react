import React from 'react';
import { OutgoingFileMessage, IncomingFileMessage } from '../index.jsx';
import { dummyFileMessageImage, dummyFileMessageAudio } from '../dummyFileMessage.mock';

import { MessageStatusTypes } from '../../../../ui/MessageStatus';

export default { title: 'Legacy/FileMessage' };

export const outgoingFileMessageAudio = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <OutgoingFileMessage message={dummyFileMessageAudio} status={MessageStatusTypes.SENT} />
    <OutgoingFileMessage
      message={dummyFileMessageAudio}
      status={MessageStatusTypes.SENT}
      chainBottom
    />
    <OutgoingFileMessage
      message={dummyFileMessageAudio}
      status={MessageStatusTypes.SENT}
      chainTop
      chainBottom
    />
    <OutgoingFileMessage
      message={dummyFileMessageAudio}
      status={MessageStatusTypes.SENT}
      chainTop
    />
  </div>
);
export const outgoingFileMessageImage = () => <OutgoingFileMessage message={dummyFileMessageImage} status={MessageStatusTypes.READ} />;

export const incomingFileMessageAudio = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    <IncomingFileMessage message={dummyFileMessageAudio} />
    <IncomingFileMessage
      message={dummyFileMessageAudio}
      chainBottom
    />
    <IncomingFileMessage
      message={dummyFileMessageAudio}
      chainTop
      chainBottom
    />
    <IncomingFileMessage
      message={dummyFileMessageAudio}
      chainTop
    />
  </div>
);
export const incomingFileMessageImage = () => <IncomingFileMessage message={dummyFileMessageImage} />;
