import React, { useState } from 'react';
import { useToggleContext } from './ToggleContext';
import { filterNumber } from './utils';
import { deleteNullish } from '../../utils/utils';

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
  } = deleteNullish(props);
  const {
    checked,
    disabled,
    onChange,
    onFocus,
    onBlur,
  } = useToggleContext();

  // animation should not be activated in the initialization step
  const [animatedClassName, setAnimatedClassName] = useState('');

  const toggleWidth = filterNumber(width)?.[0];
  const toggleHeight = toggleWidth / 2;
  // The size of dot should be 60% of toggle height
  const dotSize = toggleHeight * 0.6;

  return (
    <label
      className={[
        'sendbird-input-toggle-button',
        animatedClassName,
        checked ? 'sendbird-input-toggle-button--checked' : 'sendbird-input-toggle-button--unchecked',
        disabled ? 'sendbird-input-toggle-button--disabled' : [],
        reversed ? 'sendbird-input-toggle-button--reversed' : [],
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
          setAnimatedClassName(e.currentTarget.checked ? 'sendbird-input-toggle-button--turned-on' : 'sendbird-input-toggle-button--turned-off');
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </label>
  );
}
