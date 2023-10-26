import React from 'react';

import './index.scss';
import { Typography, Colors } from './types';
import { changeTypographyToClassName, changeColorToClassName } from './utils';
import getStringSet from './stringSet';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';

type LabelProps = {
  className?: string | string[];
  type?: ObjectValues<typeof Typography>;
  color?: ObjectValues<typeof Colors>;
  children?: React.ReactNode;
};
export default function Label({
  className = [],
  type,
  color,
  children = null,
}: LabelProps) {
  return (
    // Donot make this into div
    // Mention uses Label. If we use div, it would break the mention detection on Paste
    // https://github.com/sendbird/sendbird-uikit-react/pull/479
    <span
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-label',
        changeTypographyToClassName(type),
        changeColorToClassName(color),
      ].join(' ')}
    >
      {children}
    </span>
  );
}

const LabelTypography = Typography;
const LabelColors = Colors;
const LabelStringSet = getStringSet('en');
export { LabelTypography, LabelColors, LabelStringSet };
