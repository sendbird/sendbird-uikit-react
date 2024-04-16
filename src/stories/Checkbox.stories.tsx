import React from 'react';
import Checkbox from '../ui/Checkbox';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  title: '2.UI/Checkbox',
  component: Checkbox,
  argTypes: {
    id: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'onChange' },
  },
};
export default meta;

type StoryOfCheckbox = StoryObj<typeof Checkbox>;
const Template = (args) => <Checkbox {...args} />;
export const Unchecked: StoryOfCheckbox = Template.bind({});
Unchecked.args = {
  id: 'unchecked-checkbox',
  checked: false,
  disabled: false,
};
export const Checked: StoryOfCheckbox = Template.bind({});
Checked.args = {
  id: 'checked-checkbox',
  checked: true,
  disabled: false,
};
export const DisabledUnchecked: StoryOfCheckbox = Template.bind({});
DisabledUnchecked.args = {
  id: 'disabled-unchecked-checkbox',
  checked: false,
  disabled: true,
};
export const DisabledChecked: StoryOfCheckbox = Template.bind({});
DisabledChecked.args = {
  id: 'disabled-checked-checkbox',
  checked: true,
  disabled: true,
};
