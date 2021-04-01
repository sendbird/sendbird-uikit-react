import React, { useContext } from 'react'
import { ClientFileMessage, ClientUserMessage } from '../../..'
import Modal from '../../../ui/Modal';
import { LocalizationContext } from '../../../lib/LocalizationContext';

interface Props {
  onCloseModal(): void;
  onDeleteMessage(message: ClientUserMessage | ClientFileMessage, callback?: () => void): void;
}

export default function RemoveMessageModal({
  onCloseModal,
  onDeleteMessage,
}: Props): JSX.Element {
  const { stringSet } = useContext(LocalizationContext);

  return (
    <Modal
      onCancel={onCloseModal}
      onSubmit={onDeleteMessage}
      submitText="Delete"
      titleText={stringSet.MODAL__DELETE_MESSAGE__TITLE}
    />
  );
}
