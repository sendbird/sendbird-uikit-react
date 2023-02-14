import React, { ChangeEvent, ReactElement, useState } from 'react';
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
  return (
    <label
      className={[
        "sendbird-checkbox",
        disabled ? 'disabled' : '',
      ].join(' ')}
      htmlFor={id}
    >
      <input
        disabled={disabled}
        id={id}
        type="checkbox"
        checked={isChecked}
        onClick={() => {
          if (!disabled) setIsCheck(!isChecked);
        }}
        onChange={onChange}
      />
      <span
        className={[
          "sendbird-checkbox--checkmark",
          disabled ? 'disabled' : '',
        ].join(' ')}
      />
    </label>
  );
}
