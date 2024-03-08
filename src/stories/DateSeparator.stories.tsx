import React from 'react';
import DateSeparator from '../ui/DateSeparator';
import { Colors } from '../utils/color';
import './index.css';

export default {
  title: 'UI/DateSeparator',
  component: DateSeparator,
  argTypes: {
    separatorColor: {
      control: 'select',
      options: Object.values(Colors),
    },
    children: { control: 'text' },
  },
};

const Template = (args) => <DateSeparator {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Date Separator',
  separatorColor: Colors.ONBACKGROUND_4,
};

export const CustomColor = Template.bind({});
CustomColor.args = {
  ...Default.args,
  separatorColor: Colors.PRIMARY,
};

export const WithCustomText = Template.bind({});
WithCustomText.args = {
  ...Default.args,
  children: 'Custom Date Text',
};
