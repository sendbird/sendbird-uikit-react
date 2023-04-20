import React, { ChangeEventHandler } from 'react';

/**
 * The default value of `checked` should be null
 * to support both case of controlled and uncontrolled component
 * ref: https://github.com/aaronshaf/react-toggle#props
 */
const noop = (): void => { /* noop */ };
export const TOGGLE_DEFAULT_VALUE = {
  checked: null,
  defaultChecked: false,
  disabled: false,
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
};

export interface ToggleContextInterface {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
}

export const ToggleContext = React.createContext<ToggleContextInterface>(TOGGLE_DEFAULT_VALUE);

export function useToggleContext(): ToggleContextInterface {
  let context = null;
  try {
    context = React.useContext(ToggleContext);
    return context;
  } catch (_) { }
  return context;
}
