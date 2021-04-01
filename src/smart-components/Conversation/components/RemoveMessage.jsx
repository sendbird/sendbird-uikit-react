import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../ui/Modal';
import { LocalizationContext } from '../../../lib/LocalizationContext';

const RemoveMessage = (props) => {
  const {
    onCloseModal,
    onDeleteMessage,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  return (
    <Modal
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
};

export default RemoveMessage;
