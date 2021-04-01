import React from 'react';
import MessageStatus from '../index.jsx';
import MessageStatusType from '../type.js';
import dummyMessage from '../messageDummyData.mock';

export default { title: 'UI Components/MessageStatus' };

export const messageStatus = () => [
  <MessageStatus status={MessageStatusType.PENDING} message={dummyMessage} />,
  <p />,
  <MessageStatus status={MessageStatusType.SENT} message={dummyMessage} />,
  <p />,
  <MessageStatus status={MessageStatusType.DELIVERED} message={dummyMessage} />,
  <p />,
  <MessageStatus status={MessageStatusType.READ} message={dummyMessage} />,
  <p />,
  <MessageStatus status={MessageStatusType.FAILED} message={dummyMessage} />,
];
