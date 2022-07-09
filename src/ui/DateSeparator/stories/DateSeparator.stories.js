import React from 'react';
import DateSeparator from '../index.jsx';

const description = `
  \`import DateSeparator from "@sendbird/uikit-react/ui/DateSeparator";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/DateSeparator',
  component: DateSeparator,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (args) => <DateSeparator {...args} />;
