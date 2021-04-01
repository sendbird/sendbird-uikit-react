import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../Label';
import { Type, Size } from './type';
import { changeTypeToClassName, changeSizeToClassName } from './utils';

export default function Button({
  className,
  type,
  size,
  children,
  disabled,
  onClick,
}) {
  const injectingClassNames = [
    ...((Array.isArray(className)) ? className : [className]),
    'sendbird-button',
    (disabled ? 'sendbird-button__disabled' : ''),
    changeTypeToClassName(type),
    changeSizeToClassName(size),
  ].join(' ');

  return (
    <button
      className={injectingClassNames}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <Label
        className="sendbird-button__text"
        type={LabelTypography.BUTTON_1}
        color={LabelColors.ONCONTENT_1}
      >
        {children}
      </Label>
    </button>
  );
}

export const ButtonTypes = Type;
export const ButtonSizes = Size;

Button.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  type: PropTypes.oneOf(Object.keys(Type)),
  size: PropTypes.oneOf(Object.keys(Size)),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  className: '',
  type: Type.PRIMARY,
  size: Size.BIG,
  children: 'Button',
  disabled: false,
  onClick: () => { },
};
