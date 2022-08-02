import React from 'react';
import Checkbox from '../index';

const description = `
  \`import Checkbox from "@sendbird/uikit-react/ui/Checkbox";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <Checkbox {...arg} />;
export const checkedCheckbox = () => [
  <Checkbox checked />,
  <Checkbox checked disabled />,
  <Checkbox disabled />,
];
