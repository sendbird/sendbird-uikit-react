import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '../ui/Button';
import { ButtonTypes, ButtonSizes } from '../ui/Button/types';
import { LabelTypography, LabelColors } from '../ui/Label';

const meta: Meta<typeof Button> = {
  title: '2.UI/Button',
  component: Button,
  argTypes: {
    className: { control: 'text' },
    type: {
      control: { type: 'select', options: Object.values(ButtonTypes) },
    },
    size: {
      control: { type: 'select', options: Object.values(ButtonSizes) },
    },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    labelType: {
      control: { type: 'select', options: Object.values(LabelTypography) },
    },
    labelColor: {
      control: { type: 'select', options: Object.values(LabelColors) },
    },
    onClick: { action: 'clicked' },
  },
};
export default meta;

type StoryOfButton = StoryObj<typeof Button>;
const Template = (args) => <Button {...args} />;
export const Primary: StoryOfButton = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  type: ButtonTypes.PRIMARY,
  size: ButtonSizes.BIG,
  disabled: false,
  labelType: LabelTypography.BUTTON_1,
  labelColor: LabelColors.ONCONTENT_1,
};
export const Secondary: StoryOfButton = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  type: ButtonTypes.SECONDARY,
  size: ButtonSizes.BIG,
  disabled: false,
  labelType: LabelTypography.BUTTON_1,
  labelColor: LabelColors.ONCONTENT_1,
};
export const Danger: StoryOfButton = Template.bind({});
Danger.args = {
  children: 'Danger Button',
  type: ButtonTypes.DANGER,
  size: ButtonSizes.BIG,
  disabled: false,
  labelType: LabelTypography.BUTTON_1,
  labelColor: LabelColors.ONCONTENT_1,
};
export const Big: StoryOfButton = Template.bind({});
Big.args = {
  children: 'Big Button',
  type: ButtonTypes.PRIMARY,
  size: ButtonSizes.SMALL,
  disabled: false,
  labelType: LabelTypography.BUTTON_1,
  labelColor: LabelColors.ONCONTENT_1,
};
export const Small: StoryOfButton = Template.bind({});
Small.args = {
  children: 'Small Button',
  type: ButtonTypes.PRIMARY,
  size: ButtonSizes.SMALL,
  disabled: false,
  labelType: LabelTypography.BUTTON_1,
  labelColor: LabelColors.ONCONTENT_1,
};
export const Disabled: StoryOfButton = Template.bind({});
Disabled.args = {
  ...Primary.args,
  children: 'Disabled Button',
  disabled: true,
};
