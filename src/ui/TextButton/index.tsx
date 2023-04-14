import React, { MouseEvent, KeyboardEvent, ReactElement } from 'react';

import './index.scss';

import {
  Colors,
  changeColorToClassName,
} from '../../utils/color';

export interface TextButtonProps {
  className?: string | Array<string>;
  color?: Colors;
  disabled?: boolean;
  disableUnderline?: boolean;
  onClick?: (e: (MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>)) => void;
  children: ReactElement;
}

const TextButton = ({
  className = '',
  color = Colors.ONBACKGROUND_1,
  disabled = false,
  disableUnderline = false,
  onClick = () => { /* noop */ },
  children,
}: TextButtonProps): ReactElement => {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        changeColorToClassName(color),
        disableUnderline ? 'sendbird-textbutton--not-underline' : 'sendbird-textbutton',
        disabled ? 'sendbird-textbutton--disabled' : '',
      ].join(' ')}
      role="button"
      tabIndex={0}
      onClick={(e) => onClick(e)}
      onKeyPress={(e) => onClick(e)}
    >
      {children}
    </div>
  );
};

export default TextButton;
