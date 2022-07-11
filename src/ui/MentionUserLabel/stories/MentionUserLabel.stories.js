import React from 'react';
import MentionUserLabel from '../index.tsx';

const description = `
  \`import MentionUserLabel from "@sendbird/uikit-react/ui/MentionUserLabel";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MentionUserLabel',
  component: MentionUserLabel,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <MentionUserLabel {...arg} />;
