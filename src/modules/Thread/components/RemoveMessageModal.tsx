import React, { useContext } from 'react';

import Modal from '../../../ui/Modal';
import { ButtonTypes } from '../../../ui/Button';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { useThreadContext } from '../context/ThreadProvider';
import { SendableMessageType } from '../../../utils';
import { getModalDeleteMessageTitle } from '../../../ui/Label/stringFormatterUtils';

export interface RemoveMessageProps {
  onCancel: () => void; // rename to onClose
  onSubmit?: () => void;
  message: SendableMessageType;
}

const RemoveMessage: React.FC<RemoveMessageProps> = (props: RemoveMessageProps) => {
  const {
    onCancel,
    onSubmit,
    message,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  const {
    deleteMessage,
  } = useThreadContext();
  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={(message.threadInfo?.replyCount ?? 0) > 0}
      onCancel={onCancel}
      onSubmit={() => {
        deleteMessage(message).then(() => {
          onCancel?.();
          onSubmit?.();
        });
      }}
      submitText={stringSet.MESSAGE_MENU__DELETE}
      titleText={getModalDeleteMessageTitle(stringSet, message)}
    />
  );
};

export default RemoveMessage;
