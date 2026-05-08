import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import './index.scss';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
}

export default function Checkbox({
  id,
  checked = false,
  disabled,
  onChange,
}: CheckboxProps): ReactElement {
  const [isChecked, setIsCheck] = useState(checked);
  useEffect(() => {
    setIsCheck(checked);
  }, [checked]);

  return (
    <label
      className={[
        'sendbird-checkbox',
        disabled ? 'disabled' : '',
      ].join(' ')}
      htmlFor={id}
    >
      <input
        disabled={disabled}
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={(event) => {
          if (!disabled) setIsCheck(event.target.checked);
          onChange?.(event);
        }}
      />
      <span
        className={[
          'sendbird-checkbox--checkmark',
          disabled ? 'disabled' : '',
        ].join(' ')}
      />
    </label>
  );
}
