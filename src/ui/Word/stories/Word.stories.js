import React from 'react';
import Word from '../index.tsx';

const description = `
  \`import Word from "@sendbird/uikit-react/ui/Word";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Word',
  component: Word,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <Word word="example" {...arg} />;
