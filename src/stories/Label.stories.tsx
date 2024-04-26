// Label.stories.js
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Label, { LabelTypography, LabelColors } from '../ui/Label';

const meta: Meta<typeof Label> = {
  title: '2.UI/Label',
  component: Label,
  argTypes: {
    type: {
      control: 'select',
      options: Object.values(LabelTypography),
    },
    color: {
      control: 'select',
      options: Object.values(LabelColors),
    },
    children: { control: 'text' },
  },
};
export default meta;

type StoryOfLabel = StoryObj<typeof Label>;
const Template = (args) => <Label {...args} />;
export const Default: StoryOfLabel = Template.bind({});
Default.args = {
  children: 'Sample Text',
  type: LabelTypography.BODY_1,
  color: LabelColors.ONBACKGROUND_1,
};
export const CustomTypographyAndColor: StoryOfLabel = Template.bind({});
CustomTypographyAndColor.args = {
  children: 'Try the custom color and typo!',
  type: LabelTypography.BUTTON_1,
  color: LabelColors.ERROR,
};
