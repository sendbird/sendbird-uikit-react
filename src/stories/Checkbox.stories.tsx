import React from 'react';
import Checkbox from '../ui/Checkbox';

export default {
  title: 'UI/Checkbox',
  component: Checkbox,
  argTypes: {
    id: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'onChange' },
  },
};

const Template = (args) => <Checkbox {...args} />;

export const Unchecked = Template.bind({});
Unchecked.args = {
  id: 'unchecked-checkbox',
  checked: false,
  disabled: false,
};

export const Checked = Template.bind({});
Checked.args = {
  id: 'checked-checkbox',
  checked: true,
  disabled: false,
};

export const DisabledUnchecked = Template.bind({});
DisabledUnchecked.args = {
  id: 'disabled-unchecked-checkbox',
  checked: false,
  disabled: true,
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  id: 'disabled-checked-checkbox',
  checked: true,
  disabled: true,
};
