import React from 'react';
import type { Preview } from '@storybook/react';
import './index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        if (a.type === b.type) {
          return a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true });
        } else {
          return a.type === 'docs' ? -1 : 0;
        }
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="sendbird-theme--light">
        {Story()}
        <></>
      </div>
    ),
  ],
};

export default preview;
