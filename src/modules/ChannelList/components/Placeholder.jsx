import React from 'react';
import PropTypes from 'prop-types';

import Placeholder from '../../../ui/PlaceHolder';

export default function ChannelsPlaceholder({
  type,
}) {
  return (
    <div className="sendbird-channel-list">
      <Placeholder type={type} />
    </div>
  );
}

ChannelsPlaceholder.propTypes = {
  type: PropTypes.string.isRequired,
};
