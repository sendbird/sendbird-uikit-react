import React from 'react';
import TypingIndicatorMessage from '../index';

const description = `
  \`import TypingIndicatorMessage from "@sendbird/uikit-react/ui/TypingIndicatorMessage";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/TypingIndicatorMessage',
  component: TypingIndicatorMessage,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <TypingIndicatorMessage {...arg} />
);
