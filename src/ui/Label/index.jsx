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
  type: PropTypes.oneOf([...Object.keys(Typography), '']),
  color: PropTypes.oneOf([...Object.keys(Colors), '']),
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
