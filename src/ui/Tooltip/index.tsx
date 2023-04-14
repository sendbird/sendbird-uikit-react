import React, { ReactElement } from 'react';

import './index.scss';

import Label, { LabelColors, LabelTypography } from '../Label';

export interface TooltipProps {
  className?: string | Array<string>;
  children?: string | ReactElement;
}
export default function Tooltip({
  className = '',
  children = '',
}: TooltipProps): ReactElement {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-tooltip',
      ].join(' ')}
    >
      <Label
        className="sendbird-tooltip__text"
        type={LabelTypography.CAPTION_2}
        color={LabelColors.ONCONTENT_1}
      >
        {children}
      </Label>
    </div>
  );
}
