// Label.stories.js
import React from 'react';
import Label, { LabelTypography, LabelColors } from '../ui/Label';

export default {
  title: 'UI/Label',
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

const Template = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Sample Text',
  type: LabelTypography.BODY_1,
  color: LabelColors.ONBACKGROUND_1,
};

export const CustomTypographyAndColor = Template.bind({});
CustomTypographyAndColor.args = {
  children: 'Try the custom color and typo!',
  type: LabelTypography.BUTTON_1,
  color: LabelColors.ERROR,
};
