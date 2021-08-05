import React from 'react';
import MessageStatus, { MessageStatusTypes } from '../index.jsx';
import { generateNormalMessage } from '../messageDummyData.mock';

export default { title: 'UI Components/MessageStatus' };

const pendingMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'pending';
  return message;
});

const sentMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'succeeded';
  return message;
});
const failedMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'failed';
  return message;
});

export const messageStatus = () => [
  <MessageStatus status={MessageStatusTypes.PENDING} message={pendingMessage} />,
  <p />,
  <MessageStatus status={MessageStatusTypes.SENT} message={sentMessage} />,
  <p />,
  <MessageStatus status={MessageStatusTypes.DELIVERED} message={sentMessage} />,
  <p />,
  <MessageStatus status={MessageStatusTypes.READ} message={sentMessage} />,
  <p />,
  <MessageStatus status={MessageStatusTypes.FAILED} message={failedMessage} />,
];
