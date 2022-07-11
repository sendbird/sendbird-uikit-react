import React from 'react';
import UnknownMessageItemBody from '../index.tsx';

const description = `
  \`import UnknownMessageItemBody from "@sendbird/uikit-react/ui/UnknownMessageItemBody";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/UnknownMessageItemBody',
  component: UnknownMessageItemBody,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};


export const WithControl = (arg) => (
  <UnknownMessageItemBody {...arg} />
);
