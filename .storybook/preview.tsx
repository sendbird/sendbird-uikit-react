import React from 'react';
import type { Preview } from '@storybook/react';
import { SendbirdSdkContext } from '../src/lib/SendbirdSdkContext';

import '../src/lib/index.scss';
import './index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
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
      }
    },
  },
  decorators: [
    (Story) => (
      <div className="sendbird-theme--light">
        <SendbirdSdkContext.Provider value={{} as any}>
          {Story()}
        </SendbirdSdkContext.Provider>
      </div>
    ),
  ],
};

export default preview;
