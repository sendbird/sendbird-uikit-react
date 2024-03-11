// TextButton.stories.js
import React from 'react';
import TextButton from '../ui/TextButton';
import { Colors } from '../utils/color';

export default {
  title: 'UI/TextButton',
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

const Template = (args) => <TextButton {...args}>Sample Text</TextButton>;

export const Default = Template.bind({});
Default.args = {
  color: Colors.ONBACKGROUND_1,
  disabled: false,
  disableUnderline: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const WithoutUnderline = Template.bind({});
WithoutUnderline.args = {
  ...Default.args,
  disableUnderline: true,
};
