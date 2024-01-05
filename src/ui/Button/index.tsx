import React, { ReactElement } from 'react';

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../Label';
import { changeTypeToClassName, changeSizeToClassName } from './utils';
import { ButtonTypes, ButtonSizes } from './types';
import {ObjectValues} from '../../utils/typeHelpers/objectValues';
import {Typography} from '../Label/types';

export interface ButtonProps {
  className?: string | Array<string>;
  type?: ButtonTypes;
  size?: ButtonSizes;
  children: string | ReactElement;
  disabled?: boolean;
  onClick?: () => void;
  labelType?: ObjectValues<typeof Typography>;
  labelColor?: ObjectValues<typeof LabelColors>;
}

export default function Button({
  className,
  type = ButtonTypes.PRIMARY,
  size = ButtonSizes.BIG,
  children = 'Button',
  disabled = false,
  onClick = () => { /* noop */ },
  labelType = LabelTypography.BUTTON_1,
  labelColor = LabelColors.ONCONTENT_1,
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
        type={labelType}
        color={labelColor}
      >
        {children}
      </Label>
    </button>
  );
}

export * from './types';
