import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../ui/Modal';

const LeaveChannel = (props) => {
  const {
    onCloseModal,
    onLeaveChannel,
  } = props;
  return (
    <Modal
      onCancel={onCloseModal}
      onSubmit={onLeaveChannel}
      submitText="Leave"
      titleText="Leave this channel?"
    />
  );
};

LeaveChannel.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onLeaveChannel: PropTypes.func.isRequired,
};

export default LeaveChannel;
