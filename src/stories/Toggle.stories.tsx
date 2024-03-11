// Toggle.stories.js
import React from 'react';
import { Toggle, ToggleContainer, ToggleUI } from '../ui/Toggle';

export default {
  title: 'UI/Toggle',
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

const Template = (args) => <Toggle {...args} />;

export const Default = Template.bind({});
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
