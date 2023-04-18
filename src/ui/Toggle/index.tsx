import React from 'react';
import './index.scss';

import {
  ToggleContainer as _ToggleContainer,
  ToggleContainerProps as _ToggleContainerProps,
} from './ToggleContainer';
import { useToggleContext as _useToggleContext } from './ToggleContext';
import {
  ToggleUI as _ToggleUI,
  ToggleUIProps as _ToggleUIProps,
} from './ToggleUI';

// export - context
export const ToggleContainer = _ToggleContainer;
export type ToggleContainerProps = _ToggleContainerProps;
export const useToggleContext = _useToggleContext;
// export - UI
export const ToggleUI = _ToggleUI;
export type ToggleUIProps = _ToggleUIProps;

// export - Toggle
export interface ToggleProps extends _ToggleContainerProps, _ToggleUIProps {
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
    <div className={className}>
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
