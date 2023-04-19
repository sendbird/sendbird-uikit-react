import React from 'react';
import './index.scss';

import { ToggleContainer, ToggleContainerProps } from './ToggleContainer';
import { useToggleContext } from './ToggleContext';
import { ToggleUI, ToggleUIProps } from './ToggleUI';

export interface ToggleProps extends ToggleContainerProps, ToggleUIProps {
  className?: string;
}
export default function Toggle(props: ToggleProps): React.ReactElement {
  const {
    // ToggleProvider
    checked,
    defaultChecked,
    disabled,
    reversed,
    onChange,
    onFocus,
    onBlur,
    // ToggleUI
    className,
    width,
    // height will be half of width
    animationDuration,
    style,
    name,
    id,
    ariaLabel,
    ariaLabelledby,
  } = props;
  return (
    <div className={`sendbird-ui-toggle ${className}`}>
      <ToggleContainer
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        reversed={reversed}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <ToggleUI
          width={width}
          animationDuration={animationDuration}
          style={style}
          name={name}
          id={id}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}
        />
      </ToggleContainer>
    </div>
  );
}

export { ToggleContainer, ToggleContainerProps, ToggleUI, ToggleUIProps, useToggleContext };
