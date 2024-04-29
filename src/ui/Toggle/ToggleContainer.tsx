import React, { useCallback, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

import {
  ToggleContext,
  ToggleContextInterface,
  TOGGLE_DEFAULT_VALUE as Dvalue,
} from './ToggleContext';

export interface ToggleContainerProps extends ToggleContextInterface {
  children?: ReactNode;
}

// Props Explanation https://github.com/aaronshaf/react-toggle#props
export function ToggleContainer({
  checked = Dvalue.checked, // null
  defaultChecked = Dvalue.defaultChecked,
  disabled = Dvalue.disabled,
  onChange = Dvalue.onChange,
  onFocus = Dvalue.onFocus,
  onBlur = Dvalue.onBlur,
  children,
}: ToggleContainerProps): React.ReactElement {
  const [isChecked, setChecked] = useState(defaultChecked || false);
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    if (checked === null) {
      setChecked(e.currentTarget.checked);
    }
    onChange(e);
  }, [onChange, checked]);

  return (
    <ToggleContext.Provider value={{
      checked: checked !== null ? checked : isChecked,
      disabled,
      onChange: handleChange,
      onFocus: (e) => {
        if (!disabled) {
          onFocus(e);
        }
      },
      onBlur: (e) => {
        if (!disabled) {
          onBlur(e);
        }
      },
    }}>
      {children}
    </ToggleContext.Provider>
  );
}
