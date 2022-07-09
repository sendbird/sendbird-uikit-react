import React from 'react';
import EmojiReactions from '../index.tsx';

const description = `
  \`import EmojiReactions from "@sendbird/uikit-react/ui/EmojiReactions";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/EmojiReactions',
  component: EmojiReactions,
  // subcomponents: { AccordionGroup },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <EmojiReactions {...arg} />
);
