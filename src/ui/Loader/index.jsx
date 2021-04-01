import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Icon, { IconTypes } from '../Icon';

export default function Loader({
  className,
  width,
  height,
  children,
}) {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-loader',
      ].join(' ')}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`,
      }}
    >
      {children}
    </div>
  );
}

Loader.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  children: PropTypes.element,
};

Loader.defaultProps = {
  className: '',
  width: '26px',
  height: '26px',
  children: <Icon
    type={IconTypes.SPINNER}
    width="26px"
    height="26px"
  />,
};
