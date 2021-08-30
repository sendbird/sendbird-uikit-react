import React from 'react';
import UnknownMessage from '../index.jsx';

import generateUnknownMessage from '../dummyMessage.mock';

export default { title: 'Legacy/UnknownMessage' };

const message = generateUnknownMessage();
const messageWithUnknownSender = generateUnknownMessage((message) => {
  message.sender = {};
  return message;
});

export const outgoingUnknownMessage = () => (
  <>
    <UnknownMessage
      message={message}
      isByMe
      status="READ"
    />
    <UnknownMessage
      message={message}
      isByMe
      status="READ"
      chainBottom
    />
    <UnknownMessage
      message={message}
      isByMe
      status="READ"
      chainTop
      chainBottom
    />
    <UnknownMessage
      message={message}
      isByMe
      status="READ"
      chainTop
    />
  </>
);

export const incomingUnknownMessage = () => (
  <>
    <UnknownMessage
      message={message}
    />
    <UnknownMessage
      message={message}
      chainBottom
    />
    <UnknownMessage
      message={message}
      chainTop
      chainBottom
    />
    <UnknownMessage
      message={message}
      chainTop
    />
  </>
);

export const unknownMessageWithUnknownSender = () => (
  <>
    <UnknownMessage
      message={messageWithUnknownSender}
    />
    <UnknownMessage
      message={messageWithUnknownSender}
      chainBottom
      />
    <UnknownMessage
      message={messageWithUnknownSender}
      chainTop
      chainBottom
      />
    <UnknownMessage
      message={messageWithUnknownSender}
      chainTop
    />
  </>
);
