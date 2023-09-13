import React, { ReactElement } from 'react';

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../Label';
import { changeTypeToClassName, changeSizeToClassName } from './utils';
import { ButtonTypes, ButtonSizes } from './types';

export interface ButtonProps {
  className?: string | Array<string>;
  type?: ButtonTypes;
  size?: ButtonSizes;
  children: string | ReactElement;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  className,
  type = ButtonTypes.PRIMARY,
  size = ButtonSizes.BIG,
  children = 'Button',
  disabled = false,
  onClick = () => { /* noop */ },
}: ButtonProps): ReactElement {
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

export * from './types';
