// Tooltip.stories.js
import React from 'react';
import Tooltip from '../ui/Tooltip';
import TooltipWrapper from '../ui/TooltipWrapper';
import './index.css';

export default {
  title: 'UI/Tooltip',
  component: Tooltip,
  subComponents: [TooltipWrapper],
};

const Template = (args) => <Tooltip {...args} />;

export const Default = Template.bind({});
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
