import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default function Checkbox({
  id,
  checked,
  onChange,
}) {
  return (
    <label className="sendbird-checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
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
