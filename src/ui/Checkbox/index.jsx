import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default function Checkbox({
  id,
  checked,
  onChange,
}) {
  const [isChecked, setCheck] = useState(checked);
  return (
    <label className="sendbird-checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onClick={() => setCheck(!isChecked)}
        onChange={onChange}
      />
      <span className="sendbird-checkbox--checkmark" />
    </label>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  id: 'sendbird-checkbox-input',
  checked: false,
  onChange: () => { },
};
