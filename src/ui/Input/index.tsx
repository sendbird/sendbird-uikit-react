import React, { ReactElement, ReactNode, RefObject, useState } from 'react';

import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';

export interface InputLabelProps {
  children: ReactNode;
}
export const InputLabel = ({ children }: InputLabelProps): ReactElement => (
  <Label
    className="sendbird-input-label"
    type={LabelTypography.CAPTION_3}
    color={LabelColors.ONBACKGROUND_1}
  >
    {children}
  </Label>
);

export interface InputProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  placeHolder?: string;
  autoFocus?: boolean;
}
const Input = React.forwardRef((props: InputProps, ref: RefObject<HTMLInputElement>) => {
  const {
    name,
    required,
    disabled,
    value,
    placeHolder,
    autoFocus = false,
  } = props;
  const [inputValue, setInputValue] = useState(value);
  return (
    <div className="sendbird-input">
      <input
        className="sendbird-input__input"
        ref={ref}
        name={name}
        required={required}
        disabled={disabled}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        autoFocus={autoFocus}
      />
      {(placeHolder && !inputValue) && (
        <Label
          className="sendbird-input__placeholder"
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_3}
        >
          {placeHolder}
        </Label>
      )}
    </div>
  );
});

export default Input;
