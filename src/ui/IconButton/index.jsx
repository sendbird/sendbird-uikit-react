import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const IconButton = React.forwardRef((props, ref) => {
  const {
    className,
    children,
    disabled,
    width,
    height,
    type,
    onClick,
    onBlur,
    style,
  } = props;

  const [pressed, setPressed] = useState('');

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-iconbutton',
        pressed,
      ].join(' ')}
      disabled={disabled}
      ref={ref}
      type={type}
      style={{
        ...style,
        height,
        width,
      }}
      onClick={(e) => {
        if (disabled) { return; }
        setPressed('sendbird-iconbutton--pressed');
        onClick(e);
      }}
      onBlur={(e) => {
        setPressed('');
        onBlur(e);
      }}
    >
      <span className="sendbird-iconbutton__inner">
        {children}
      </span>
    </button>
  );
});

IconButton.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.any,
  ]).isRequired,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.shape({}),
};

IconButton.defaultProps = {
  className: '',
  disabled: false,
  width: '56px',
  height: '56px',
  type: 'button',
  onClick: () => { },
  onBlur: () => { },
  style: {},
};

export default IconButton;
