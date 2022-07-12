import React from 'react';
import Introduction from '../Introduction';

const description = `
  \`@sendbird/uikit-react/ui/Introduction\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Introduction',
  component: Introduction,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <Introduction {...arg} />;
