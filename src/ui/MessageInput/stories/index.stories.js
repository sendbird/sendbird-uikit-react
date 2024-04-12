import React from 'react';

import MessageInput from '../index';
import SendbirdProvider from '../../../lib/Sendbird';

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
    <SendbirdProvider>
      <MessageInput {...arg} ref={ref} />
    </SendbirdProvider>
  )
};

export const messageInputEdit = () => {
  const ref = React.useRef();
  return (
    <SendbirdProvider>
      <MessageInput isEdit name="example" ref={ref} />
    </SendbirdProvider>
  )
};

export const disabledMessageInput = () => {
  const ref = React.useRef();
  return (
    <SendbirdProvider>
      <MessageInput disabled name="example" ref={ref} />
    </SendbirdProvider>
  )
};
