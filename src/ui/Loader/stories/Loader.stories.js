import React from 'react';
import Loader from '../index';

const description = `
  \`import Loader from "@sendbird/uikit-react/ui/Loader";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Loader',
  component: Loader,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <Loader {...arg} />;
