import React from 'react';
import Badge from '../index.jsx';

const description = `
  \`import Badge from "@sendbird/uikit-react/ui/Badge";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControls = (args) => <Badge {...args} />;
export const defaultBadge = () => <Badge count={1} />;
export const wideBadge = () => <Badge count={10} />;
export const overHundredBadge = () => <Badge count={100} />;
