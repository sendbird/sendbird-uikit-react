import React from 'react';
import OpenChannelAdminMessage from '../index.tsx';

const description = `
  \`import OpenChannelAdminMessage from "@sendbird/uikit-react/ui/OpenChannelAdminMessage";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/OpenChannelAdminMessage',
  component: OpenChannelAdminMessage,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};


export const WithControl = (arg) => (
  <OpenChannelAdminMessage message={{
    message: 'Hello my name is Admin message'
  }} {...arg} />
);
