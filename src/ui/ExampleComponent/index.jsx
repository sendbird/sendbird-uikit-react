import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default function ExampleComponent({ text }) {
  return (
    <div>
      This is an example :
      <span className="sendbird-text">
        {text}
      </span>
    </div>
  );
}

ExampleComponent.propTypes = {
  text: PropTypes.string.isRequired,
};
