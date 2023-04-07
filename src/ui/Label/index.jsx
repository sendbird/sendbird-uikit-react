import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import { Typography, Colors } from './types';
import { changeTypographyToClassName, changeColorToClassName } from './utils';
import getStringSet from './stringSet';

export default function Label({
  className,
  type,
  color,
  children,
}) {
  return (
    // Donot make this into div
    // Mention uses Label. If we use div, it would break the mention detection on Paste
    // https://github.com/sendbird/sendbird-uikit-react/pull/479
    <span
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-label',
        type ? changeTypographyToClassName(type) : '',
        color ? changeColorToClassName(color) : '',
      ].join(' ')}
    >
      {children}
    </span>
  );
}

Label.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  type: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
    PropTypes.any,
  ]),
};

Label.defaultProps = {
  className: [],
  type: '',
  color: '',
  children: null,
};

const LabelTypography = Typography;
const LabelColors = Colors;
const LabelStringSet = getStringSet('en');
export { LabelTypography, LabelColors, LabelStringSet };
