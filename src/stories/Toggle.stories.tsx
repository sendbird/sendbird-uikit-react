// Toggle.stories.js
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Toggle, ToggleContainer, ToggleUI } from '../ui/Toggle';

const meta: Meta<typeof Toggle> = {
  title: '2.UI/Toggle',
  component: Toggle,
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    reversed: { control: 'boolean' },
    width: { control: 'text' },
    animationDuration: { control: 'text' },
    name: { control: 'text' },
    id: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaLabelledby: { control: 'text' },
    // Custom props for styling in storybook, not part of the component's API
    className: { control: 'text' },
  },
};
export default meta;

type StoryOfToggle = StoryObj<typeof Toggle>;
const Template = (args) => <Toggle {...args} />;
export const Default: StoryOfToggle = Template.bind({});
Default.args = {
  defaultChecked: false,
  disabled: false,
  reversed: false,
  width: '40px',
  animationDuration: '0.3s',
};
export const MultipleUI = () => {
  return (
    <ToggleContainer>
      <span>normal</span>
      <br/>
      <ToggleUI />
      <br/>
      <span>reversed</span>
      <br/>
      <ToggleUI reversed />
    </ToggleContainer>
  );
};
