import React from 'react';
import Tooltip from '../index.jsx';

const description = `
  \`import Tooltip from "@sendbird/uikit-react/ui/Tooltip";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <Tooltip children='hoon, sravan, chongbu, mickey, mike, leo and you' {...arg} />
);

export const normal = () => <Tooltip children='hoon, sravan, chongbu, mickey, mike, leo and you' />;
