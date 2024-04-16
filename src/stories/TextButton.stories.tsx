// TextButton.stories.js
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import TextButton from '../ui/TextButton';
import { Colors } from '../utils/color';

const meta: Meta<typeof TextButton> = {
  title: '2.UI/TextButton',
  component: TextButton,
  argTypes: {
    color: {
      control: 'select',
      options: Object.values(Colors),
    },
    disabled: {
      control: 'boolean',
    },
    disableUnderline: {
      control: 'boolean',
    },
  },
};
export default meta;

type StoryOfTextButton = StoryObj<typeof TextButton>;
const Template = (args) => <TextButton {...args}>Sample Text</TextButton>;
export const Default: StoryOfTextButton = Template.bind({});
Default.args = {
  color: Colors.ONBACKGROUND_1,
  disabled: false,
  disableUnderline: false,
};
export const Disabled: StoryOfTextButton = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
export const WithoutUnderline: StoryOfTextButton = Template.bind({});
WithoutUnderline.args = {
  ...Default.args,
  disableUnderline: true,
};
