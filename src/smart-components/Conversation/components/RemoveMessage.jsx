import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../ui/Modal';
import { ButtonTypes } from '../../../ui/Button';
import { LocalizationContext } from '../../../lib/LocalizationContext';

const RemoveMessage = (props) => {
  const {
    onCloseModal,
    onDeleteMessage,
    message,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={message?.threadInfo?.replyCount > 0}
      onCancel={onCloseModal}
      onSubmit={onDeleteMessage}
      submitText="Delete"
      titleText={stringSet.MODAL__DELETE_MESSAGE__TITLE}
    />
  );
};

RemoveMessage.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  message: PropTypes.shape({
    threadInfo: PropTypes.shape({
      replyCount: PropTypes.number,
    }),
  }).isRequired,
};

export default RemoveMessage;
