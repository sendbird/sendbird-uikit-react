import React from 'react';
import PropTypes from 'prop-types';

import Label, { LabelTypography, LabelColors } from '../Label';
import { changeColorToClassName } from '../Label/utils';
import './index.scss';

const http = /https?:\/\//;

export default function LinkLabel({
  className,
  src,
  type,
  color,
  children,
}) {
  const url = (http.test(src)) ? src : `http://${src}`;

  return (
    <a
      data-testid="sendbird-link-label"
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-link-label',
        color ? changeColorToClassName(color) : '',
      ].join(' ')}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Label
        className="sendbird-link-label__label"
        type={type}
        color={color}
      >
        {children}
      </Label>
    </a>
  );
}

LinkLabel.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  src: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(LabelTypography)).isRequired,
  color: PropTypes.oneOf(Object.keys(LabelColors)).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

LinkLabel.defaultProps = {
  className: '',
};

export const LinkLabelTypography = LabelTypography;
export const LinkLabelColors = LabelColors;
