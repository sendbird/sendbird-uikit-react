// Icon.stories.js
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Icon, { IconTypes, IconColors } from '../ui/Icon';
import { Types } from '../ui/Icon/type';

const meta: Meta<typeof Icon> = {
  title: '2.UI/Icon',
  component: Icon,
  argTypes: {
    type: {
      control: 'select',
      options: Object.values(IconTypes),
    },
    fillColor: {
      control: 'select',
      options: Object.values(IconColors),
    },
    width: { control: 'number' },
    height: { control: 'number' },
  },
};
export default meta;

type StoryOfIcon = StoryObj<typeof Icon>;
const Template = (args) => <Icon {...args} />;
export const Default: StoryOfIcon = Template.bind({});
Default.args = {
  type: IconTypes.ADD,
  fillColor: IconColors.DEFAULT,
  width: 26,
  height: 26,
};
export const iconListDefault = () => [
  ...Object.keys(IconTypes).map(
    (type) => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type as Types} width={36} height={36} />
      </div>
    )
  )
];
