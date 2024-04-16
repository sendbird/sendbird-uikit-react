import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import BottomSheet from '../ui/BottomSheet';
import { MODAL_ROOT } from '../hooks/useModal';

const meta: Meta<typeof BottomSheet> = {
  title: '2.UI/BottomSheet',
  component: BottomSheet,
  argTypes: {
    className: { control: 'text' },
    onBackdropClick: { action: 'onBackdropClick' },
  },
};
export default meta;

type StoryOfBottomSheet = StoryObj<typeof BottomSheet>;
const Template = (args) => (
  <div id={MODAL_ROOT} style={{ position: 'relative', height: '140px' }}>
    <BottomSheet {...args}>
      <div style={{ padding: '20px', textAlign: 'center', border: '1px solid black' }}>
        Feel the content of the BottomSheet here.
      </div>
    </BottomSheet>
  </div>
);
export const Default: StoryOfBottomSheet = Template.bind({});
Default.args = {
  className: '',
};
export const WithBackdropClick: StoryOfBottomSheet = Template.bind({});
WithBackdropClick.args = {
  ...Default.args,
  onBackdropClick: () => alert('Backdrop clicked!'),
};
