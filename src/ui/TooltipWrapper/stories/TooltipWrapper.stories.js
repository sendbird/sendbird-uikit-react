import React from 'react';
import TooltipWrapper from '../index.jsx';

import Tooltip from '../../Tooltip';
import Icon, { IconTypes, IconColors } from '../../Icon';

const description = `
  \`import TooltipWrapper from "@sendbird/uikit-react/ui/TooltipWrapper";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/TooltipWrapper',
  component: TooltipWrapper,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <div style={{ marginTop: 100, marginLeft: 100 }}>
    <TooltipWrapper
      hoverTooltip={
        <Tooltip>Test Text</Tooltip>
      }
      {...arg}
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
