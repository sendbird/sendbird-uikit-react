import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import './index.css';

export default {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  argTypes: {
    className: { control: 'text' },
    onBackdropClick: { action: 'onBackdropClick' },
  },
};

const Template = (args) => (
  <div style={{ position: 'relative' }}>
    <BottomSheet {...args}>
      <div style={{ padding: '20px', textAlign: 'center', border: '1px solid black' }}>
        Feel the content of the BottomSheet here.
      </div>
    </BottomSheet>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  className: '',
};

export const WithBackdropClick = Template.bind({});
WithBackdropClick.args = {
  ...Default.args,
  onBackdropClick: () => alert('Backdrop clicked!'),
};
