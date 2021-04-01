import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Label, { LabelTypography, LabelColors } from '../Label';
import './index.scss';

export const InputLabel = ({ children }) => (
  <Label
    className="sendbird-input-label"
    type={LabelTypography.CAPTION_3}
    color={LabelColors.ONBACKGROUND_1}
  >
    {children}
  </Label>
);

InputLabel.propTypes = {
  children: PropTypes.string.isRequired,
};

// future: add validations? onChange? more props etc etc
const Input = React.forwardRef((props, ref) => {
  const {
    name,
    required,
    disabled,
    placeHolder,
    value,
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

Input.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  required: false,
  disabled: false,
  placeHolder: '',
  value: '',
};

export default Input;
