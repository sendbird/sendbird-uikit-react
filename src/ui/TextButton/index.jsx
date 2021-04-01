import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import { changeColorToClassName, Colors } from '../../utils/color';

export default function TextButton({
  className,
  color,
  disabled,
  notUnderline,
  onClick,
  children,
}) {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        changeColorToClassName(color),
        notUnderline ? 'sendbird-textbutton--not-underline' : 'sendbird-textbutton',
        disabled ? 'sendbird-textbutton--disabled' : '',
      ].join(' ')}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
    >
      {children}
    </div>
  );
}

TextButton.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  color: PropTypes.string,
  disabled: PropTypes.bool,
  notUnderline: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
};

TextButton.defaultProps = {
  className: '',
  color: Colors.ONBACKGROUND_1,
  disabled: false,
  notUnderline: false,
  onClick: () => { },
};
