import React, { useContext } from 'react';

import { LocalizationContext } from '../../lib/LocalizationContext';
import { ButtonTypes } from '../Button';
import Modal from '../Modal';

export interface DeleteConfirmationModalProps {
  onCancel: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function DeleteConfirmationModal({
  onCancel,
  onSubmit,
  disabled,
}: DeleteConfirmationModalProps): React.ReactElement {
  const { stringSet } = useContext(LocalizationContext);

  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={disabled}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitText={stringSet.MESSAGE_MENU__DELETE}
      titleText={stringSet.MODAL__DELETE_MESSAGE__TITLE}
    />
  );
}

export default DeleteConfirmationModal;
