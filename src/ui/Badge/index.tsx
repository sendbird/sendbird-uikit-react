import React, { ReactElement, useContext } from 'react';

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';

export interface BadgeProps {
  count: number;
  maxLevel?: number;
  className?: string | Array<string>;
}

export default function Badge({
  count,
  maxLevel = 2,
  className,
}: BadgeProps): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const maximumNumber = parseInt('9'.repeat((maxLevel > 6) ? 6 : maxLevel), 10);
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-badge',
      ].join(' ')}
    >
      <div className="sendbird-badge__text">
        <Label
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONCONTENT_1}
        >
          {
            (count > maximumNumber)
              ? `${maximumNumber}${stringSet.BADGE__OVER}`
              : count
          }
        </Label>
      </div>
    </div>
  );
}
