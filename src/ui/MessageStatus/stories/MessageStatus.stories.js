import React from 'react';
import MessageStatus, { MessageStatusTypes } from '../index';
import { generateNormalMessage } from '../messageDummyData.mock';

const description = `
  \`import MessageStatus, { MessageStatusTypes } from "@sendbird/uikit-react/ui/MessageStatus, { MessageStatusTypes }";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MessageStatus',
  component: MessageStatus,
  subcomponents: { MessageStatusTypes },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const pendingMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'pending';
  return message;
});
const sentMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'succeeded';
  return message;
});
const readMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'succeeded';
  message.getUnreadMemberCount = () => 0;
  message.getUndeliveredMemberCount = () => 0;
  return message;
});
const deliveredMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'succeeded';
  message.getUnreadMemberCount = () => 0;
  return message;
});
const failedMessage = generateNormalMessage((message) => {
  message.sendingStatus = 'failed';
  return message;
});

export const WithControl = (arg) => (
  <MessageStatus message={pendingMessage} {...arg} />
);

export const messageStatus = () => [
  <p>
    PENDING
    <MessageStatus status={MessageStatusTypes.PENDING} message={pendingMessage} />
  </p>,
  <p>
    SENT
    <MessageStatus status={MessageStatusTypes.SENT} message={sentMessage} />
  </p>,
  <p>
    DELIVERED
    <MessageStatus status={MessageStatusTypes.DELIVERED} message={deliveredMessage} />
  </p>,
  <p>
    READ
    <MessageStatus status={MessageStatusTypes.READ} message={readMessage} />
  </p>,
  <p>
    FAILED
    <MessageStatus status={MessageStatusTypes.FAILED} message={failedMessage} />
  </p>,
];
