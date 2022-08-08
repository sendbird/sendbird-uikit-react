import React from 'react';
import ConnectionStatus from '../index';

const description = `
  \`import ConnectionStatus from "@sendbird/uikit-react/ui/ConnectionStatus";\`
  \n This component has no props
`;

export default {
  title: '@sendbird/uikit-react/ui/ConnectionStatus',
  component: ConnectionStatus,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <ConnectionStatus {...arg} />;
