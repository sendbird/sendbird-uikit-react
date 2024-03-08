// Icon.stories.js
import React from 'react';
import Icon, { IconTypes, IconColors } from '../ui/Icon';
import { Types } from '../ui/Icon/type';

export default {
  title: 'UI/Icon',
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

const Template = (args) => <Icon {...args} />;

export const Default = Template.bind({});
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
