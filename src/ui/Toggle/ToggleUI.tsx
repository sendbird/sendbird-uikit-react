import React, { useState } from 'react';
import { useToggleContext } from './ToggleContext';
import { filterNumber } from './utils';

export interface ToggleUIProps {
  reversed?: boolean;
  width?: string;
  animationDuration?: string;
  style?: Record<string, string>;
  name?: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}

export function ToggleUI(props: ToggleUIProps): React.ReactElement {
  const {
    reversed = false,
    width = '40px',
    animationDuration = '0.5s',
    style = {},
    name = '',
    id = '',
    ariaLabel = '',
    ariaLabelledby = '',
  } = props;
  const {
    checked,
    disabled,
    onChange,
    onFocus,
    onBlur,
  } = useToggleContext();

  // animation should not be activated in the initialization step
  const [animatedClassName, setAnimated] = useState('');

  const toggleWidth = filterNumber(width)?.[0];
  const toggleHeight = toggleWidth / 2;
  // The size of dot should be 60% of toggle height
  const dotSize = toggleHeight * 0.6;

  return (
    <label
      className={[
        'sendbird-input-toggle-button',
        animatedClassName,
        checked ? '--checked' : '--unchecked',
        disabled ? '--disabled' : [],
        reversed ? '--reversed' : [],
      ].flat().join(' ')}
      style={{
        width: `${toggleWidth}px`,
        height: `${toggleHeight}px`,
        borderRadius: `${dotSize}px`,
        ...style,
      }}
    >
      <div
        className={[
          'sendbird-input-toggle-button__inner-dot',
          checked
            ? 'sendbird-input-toggle-button__inner-dot--activate'
            : 'sendbird-input-toggle-button__inner-dot--inactivate',
        ].join(' ')}
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          animationDuration,
        }}
      />
      <input
        type="checkbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        name={name}
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          onChange(e);
          setAnimated(e.currentTarget.checked ? '--turned-on' : '--turned-off');
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </label>
  );
}
