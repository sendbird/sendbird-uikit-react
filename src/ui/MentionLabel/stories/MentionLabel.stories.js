import React from 'react';
import MentionLabel from '../index.tsx';
import SendbirdProvider from '../../../lib/Sendbird';

const description = `
  \`import MentionLabel from "@sendbird/uikit-react/ui/MentionLabel";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MentionLabel',
  component: MentionLabel,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <SendbirdProvider><MentionLabel {...arg} /></SendbirdProvider>;
