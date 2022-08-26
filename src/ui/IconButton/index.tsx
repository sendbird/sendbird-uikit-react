import React, {
  FocusEvent,
  MouseEvent,
  ReactElement,
  RefObject,
  useState,
} from 'react';

import './index.scss';

export interface IconButtonProps {
  className?: string | Array<string>;
  children: ReactElement;
  disabled?: boolean;
  width?: string;
  height?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: { [key: string]: string };
  onBlur?: (e: FocusEvent<HTMLButtonElement>) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = React.forwardRef((
  props: IconButtonProps,
  ref: RefObject<HTMLButtonElement>,
): ReactElement => {
  const {
    className = '',
    children,
    disabled = false,
    width = '56px',
    height = '56px',
    type = 'button',
    style = {},
    onBlur = () => {/* noop */},
    onClick = () => {/* noop */},
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  return (
    <button
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-iconbutton',
        isPressed ? 'sendbird-iconbutton--pressed' : '',
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
        setIsPressed(true);
        onClick?.(e);
      }}
      onBlur={(e) => {
        setIsPressed(false);
        onBlur?.(e);
      }}
    >
      <span className="sendbird-iconbutton__inner">
        {children}
      </span>
    </button>
  );
});

export default IconButton;
