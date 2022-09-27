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
  type: PropTypes.oneOf([
    'H_1',
    'H_2',
    'SUBTITLE_1',
    'SUBTITLE_2',
    'BODY_1',
    'BODY_2',
    'BUTTON_1',
    'BUTTON_2',
    'CAPTION_1',
    'CAPTION_2',
    'CAPTION_3',
    '',
  ]),
  color: PropTypes.oneOf([
    'ONBACKGROUND_1',
    'ONBACKGROUND_2',
    'ONBACKGROUND_3',
    'ONBACKGROUND_4',
    'ONCONTENT_1',
    'ONCONTENT_2',
    'PRIMARY',
    'ERROR',
    'SECONDARY_3',
    '',
  ]),
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
