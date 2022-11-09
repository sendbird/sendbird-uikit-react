import React, { useContext } from 'react';

import Modal from '../../../ui/Modal';
import { ButtonTypes } from '../../../ui/Button';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { useThreadContext } from '../context/ThreadProvider';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

export interface RemoveMessageProps {
  onCancel: () => void;
  message: UserMessage | FileMessage;
}

const RemoveMessage: React.FC<RemoveMessageProps> = (props: RemoveMessageProps) => {
  const {
    onCancel,
    message,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  const {
    deleteMessage,
  } = useThreadContext();
  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={message?.threadInfo?.replyCount > 0}
      onCancel={onCancel}
      onSubmit={() => { deleteMessage(message).then(() => {
        onCancel();
      }) }}
      submitText={stringSet.MESSAGE_MENU__DELETE}
      titleText={stringSet.MODAL__DELETE_MESSAGE__TITLE}
    />
  );
};

export default RemoveMessage;
