import React from 'react';
import DateSeparator from '../ui/DateSeparator';
import { Colors } from '../utils/color';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DateSeparator> = {
  title: '2.UI/DateSeparator',
  component: DateSeparator,
  argTypes: {
    separatorColor: {
      control: 'select',
      options: Object.values(Colors),
    },
    children: { control: 'text' },
  },
};
export default meta;

type StoryOfDateSeparator = StoryObj<typeof DateSeparator>;
const Template = (args) => <DateSeparator {...args} />;
export const Default: StoryOfDateSeparator = Template.bind({});
Default.args = {
  children: 'Date Separator',
  separatorColor: Colors.ONBACKGROUND_4,
};
export const CustomColor: StoryOfDateSeparator = Template.bind({});
CustomColor.args = {
  ...Default.args,
  separatorColor: Colors.PRIMARY,
};
export const WithCustomText: StoryOfDateSeparator = Template.bind({});
WithCustomText.args = {
  ...Default.args,
  children: 'Custom Date Text',
};
