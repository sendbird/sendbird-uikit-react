// Tooltip.stories.js
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Tooltip from '../ui/Tooltip';
import TooltipWrapper from '../ui/TooltipWrapper';

const meta: Meta<typeof Tooltip> = {
  title: '2.UI/Tooltip',
  component: Tooltip,
};
export default meta;

type StoryOfTooltip = StoryObj<typeof Tooltip>;
const Template = (args) => <Tooltip {...args} />;
export const Default: StoryOfTooltip = Template.bind({});
Default.args = {
  children: 'hoon, sravan, chongbu, mickey, mike, leo and you',
};
export const HoverTooltip = () => (
  <div style={{ marginTop: 50, marginLeft: 100 }}>
    <TooltipWrapper
      hoverTooltip={<Tooltip>Hi! I'm Tooltip!</Tooltip>}
    >
      <button>Hover over me</button>
    </TooltipWrapper>
  </div>
);
HoverTooltip.storyName = 'Hover Tooltip';
