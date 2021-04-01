import React from 'react';
import Message from '../index.jsx';

import dummyMessage, { generateLongMessage } from '../messageDummyData.mock';

export default { title: 'UI Components/Message' };

export const messageByOther = () => [
  <Message message={dummyMessage} />,
  <p></p>,
  <Message message={generateLongMessage()} />,
  <p />,
  <Message message={dummyMessage} />,
];

export const messageByMe = () => [
  <Message
    isByMe
    message={generateLongMessage()}
    status="PENDING"
  />,
  <p />,
  <Message
    isByMe
    message={dummyMessage}
    status="SENT"
  />,
  <p />,
  <Message
    isByMe
    message={dummyMessage}
    status="DELIVERED"
  />,
  <p />,
  <Message
    isByMe
    message={dummyMessage}
    status="READ"
  />,
  <p />,
  <Message
    isByMe
    message={dummyMessage}
    status="FAILED"
  />,
];
