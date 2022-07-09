import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import { changeColorToClassName, Colors } from '../../utils/color';
import Label, { LabelTypography, LabelColors } from '../Label';

export default function DateSeparator({
  className,
  children,
  separatorColor,
}) {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-separator',
      ].join(' ')}
    >
      <div className={['sendbird-separator__left', `${changeColorToClassName(separatorColor)}--background-color`].join(' ')} />
      <div className="sendbird-separator__text">{children}</div>
      <div className={['sendbird-separator__right', `${changeColorToClassName(separatorColor)}--background-color`].join(' ')} />
    </div>
  );
}

DateSeparator.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.element,
  ]),
  separatorColor: PropTypes.oneOf([
    'ONBACKGROUND_1',
    'ONBACKGROUND_2',
    'ONBACKGROUND_3',
    'ONBACKGROUND_4',
    'ONCONTENT_1',
    'PRIMARY',
    'ERROR',
  ]),
};

DateSeparator.defaultProps = {
  className: '',
  children: (
    <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
      Date Separator
    </Label>
  ),
  separatorColor: Colors.ONBACKGROUND_4,
};
