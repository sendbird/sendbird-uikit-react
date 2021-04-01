import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

import Label, { LabelColors, LabelTypography } from '../Label';

export default function Tooltip({
  className,
  children,
}) {
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

Tooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
};

Tooltip.defaultProps = {
  className: '',
  children: '',
};
