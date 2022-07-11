import React from 'react';
import MessageSearchItem from '../index.tsx';

import { generateNormalMessage, generateLongMessage } from '../messageDummyDate.mock';

const description = `
  \`import MessageSearchItem from "@sendbird/uikit-react/ui/MessageSearchItem";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MessageSearchItem',
  component: MessageSearchItem,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <MessageSearchItem message={generateNormalMessage()} {...arg} />
);

export const normal = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    <MessageSearchItem message={generateNormalMessage()} />
    <MessageSearchItem message={generateLongMessage()} />
    <MessageSearchItem message={generateNormalMessage()} selected/>
  </div>
);
