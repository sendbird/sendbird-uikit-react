import React from 'react';
import './index.scss';

import { ToggleContainer, ToggleContainerProps } from './ToggleContainer';
import { useToggleContext } from './ToggleContext';
import { ToggleUI, ToggleUIProps } from './ToggleUI';

export interface ToggleProps extends ToggleContainerProps, ToggleUIProps {
  className?: string;
}
function Toggle(props: ToggleProps): React.ReactElement {
  const {
    // ToggleProvider
    checked,
    defaultChecked,
    disabled,
    onChange,
    onFocus,
    onBlur,
    // ToggleUI
    className,
    reversed,
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
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        >
        <ToggleUI
          reversed={reversed}
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

export type { ToggleContainerProps, ToggleUIProps };
export { Toggle, ToggleContainer, ToggleUI, useToggleContext };
