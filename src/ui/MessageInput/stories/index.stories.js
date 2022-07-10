import React from 'react';

import MessageInput from '../index';

const description = `
  \`import MessageInput from "@sendbird/uikit-react/ui/MessageInput";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MessageInput',
  component: MessageInput,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => {
  const ref = React.useRef();
  return (
    <MessageInput {...arg} ref={ref} />
  )
};

export const messageInputEdit = () => {
  const ref = React.useRef();
  return (
    <MessageInput isEdit name="example" ref={ref} />
  )
};

export const disabledMessageInput = () => {
  const ref = React.useRef();
  return (
    <MessageInput disabled name="example" ref={ref} />
  )
};
