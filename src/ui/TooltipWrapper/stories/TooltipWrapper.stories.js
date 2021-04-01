import React from 'react';
import TooltipWrapper from '../index.jsx';

import Tooltip from '../../Tooltip';
import Icon, { IconTypes, IconColors } from '../../Icon';

export default { title: 'UI Components/TooltipWrapper' };

export const withTooltip = () => (
  <div style={{ marginTop: 100, marginLeft: 100 }}>
    <TooltipWrapper
      hoverTooltip={
        <Tooltip>Test Text</Tooltip>
      }
    >
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    </TooltipWrapper>
  </div>
);

export const withLongText = () => (
  <div style={{ marginTop: 200, marginLeft: 100 }}>
    <TooltipWrapper
      hoverTooltip={
        <Tooltip children={'Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, '}></Tooltip>
      }
    >
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    </TooltipWrapper>
  </div>
);
