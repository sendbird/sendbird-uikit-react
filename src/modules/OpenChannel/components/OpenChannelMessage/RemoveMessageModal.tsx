import React, { useContext } from 'react';
import Modal from '../../../../ui/Modal';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { ClientFileMessage, ClientUserMessage } from '../../../../types';
import { getModalDeleteMessageTitle } from '../../../../ui/Label/stringFormatterUtils';
import { CoreMessageType } from '../../../../utils';

interface Props {
  message: CoreMessageType;
  onCloseModal(): void;
  onDeleteMessage(message: ClientUserMessage | ClientFileMessage, callback?: () => void): void;
}

export default function RemoveMessageModal({
  message,
  onCloseModal,
  onDeleteMessage,
}: Props): JSX.Element {
  const { stringSet } = useContext(LocalizationContext);

  return (
    <Modal
      onCancel={onCloseModal}
      onSubmit={onDeleteMessage}
      submitText={stringSet.MESSAGE_MENU__DELETE}
      titleText={getModalDeleteMessageTitle(stringSet, message)}
    />
  );
}
