import React from 'react';
import Button, { ButtonTypes, ButtonSizes } from '../index';

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
  <Button type={ButtonTypes.PRIMARY}>PRIMARY</Button>,
  <Button type={ButtonTypes.SECONDARY}>SECONDARY</Button>,
  <Button type={ButtonTypes.DANGER}>DANGER</Button>,
  <Button type={ButtonTypes.DISABLED}>DISABLED</Button>,
];
export const smallButton = () => [
  <Button type={ButtonTypes.PRIMARY} size={ButtonSizes.SMALL}>PRIMARY</Button>,
  <Button type={ButtonTypes.SECONDARY} size={ButtonSizes.SMALL}>SECONDARY</Button>,
  <Button type={ButtonTypes.DANGER} size={ButtonSizes.SMALL}>DANGER</Button>,
  <Button type={ButtonTypes.DISABLED} size={ButtonSizes.SMALL}>DISABLED</Button>,
];
