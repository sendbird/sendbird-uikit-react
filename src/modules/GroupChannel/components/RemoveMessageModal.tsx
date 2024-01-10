import React, { useContext } from 'react';

import Modal from '../../../ui/Modal';
import { ButtonTypes } from '../../../ui/Button';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { useGroupChannelContext } from '../context/GroupChannelProvider';
import { EveryMessage } from '../../../types';
import { getModalDeleteMessageTitle } from '../../../ui/Label/stringFormatterUtils';

export interface RemoveMessageProps {
  onSubmit?: () => void;
  onCancel: () => void;
  message: EveryMessage;
}

const RemoveMessageModal: React.FC<RemoveMessageProps> = (props: RemoveMessageProps) => {
  const {
    onSubmit = () => {
      /* noop */
    },
    onCancel,
    message,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  const { deleteMessage } = useGroupChannelContext();
  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={message?.threadInfo?.replyCount > 0}
      onCancel={onCancel}
      onSubmit={() => {
        if (message.isUserMessage() || message.isFileMessage() || message.isMultipleFilesMessage()) {
          deleteMessage(message).then(() => {
            // For other status such as PENDING, SCHEDULED, and CANCELED,
            // invalid parameters error is thrown so nothing happens.
            onSubmit();
            onCancel();
          });
        }
      }}
      submitText={stringSet.MESSAGE_MENU__DELETE}
      titleText={getModalDeleteMessageTitle(stringSet, message)}
    />
  );
};

export default RemoveMessageModal;
