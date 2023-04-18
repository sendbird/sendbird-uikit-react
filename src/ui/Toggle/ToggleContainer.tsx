import React, { ChangeEvent, useCallback, useState } from 'react';

import {
  ToggleContext,
  ToggleContextInterface,
  TOGGLE_DEFAULT_VALUE as Dvalue,
} from './ToggleContext';

export interface ToggleContainerProps extends ToggleContextInterface {
  children?: React.ReactElement;
}

// Props Explanation https://github.com/aaronshaf/react-toggle#props
export function ToggleContainer({
  checked = Dvalue.checked, // null
  defaultChecked = Dvalue.defaultChecked,
  disabled = Dvalue.disabled,
  reversed = Dvalue.reversed,
  onChange = Dvalue.onChange,
  onFocus = Dvalue.onFocus,
  onBlur = Dvalue.onBlur,
  children = null,
}: ToggleContainerProps): React.ReactElement {
  const [isChecked, setChecked] = useState(defaultChecked || false);
  const useOnChangeCallback = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
      reversed,
      onChange: useOnChangeCallback,
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
