import React from 'react';
import Button from '../index';

import { Type, Size } from '../type';

const description = `
  \`import Button from "@sendbird/uikit-react/ui/Button";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControls = (args) => <Button {...args}>TEXT</Button>;

export const defaultButton = () => [
  <Button>DEFAULT</Button>,
  <Button type={Type.PRIMARY}>PRIMARY</Button>,
  <Button type={Type.SECONDARY}>SECONDARY</Button>,
  <Button type={Type.DANGER}>DANGER</Button>,
  <Button type={Type.DISABLED}>DISABLED</Button>,
];
export const smallButton = () => [
  <Button type={Type.PRIMARY} size={Size.SMALL}>PRIMARY</Button>,
  <Button type={Type.SECONDARY} size={Size.SMALL}>SECONDARY</Button>,
  <Button type={Type.DANGER} size={Size.SMALL}>DANGER</Button>,
  <Button type={Type.DISABLED} size={Size.SMALL}>DISABLED</Button>,
];
