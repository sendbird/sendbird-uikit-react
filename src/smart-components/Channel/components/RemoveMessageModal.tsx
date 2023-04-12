import React, { useContext } from 'react';

import Modal from '../../../ui/Modal';
import { ButtonTypes } from '../../../ui/Button';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { useChannelContext } from '../context/ChannelProvider';
import { EveryMessage } from '../../../types';

export interface RemoveMessageProps {
  onSubmit?: () => void;
  onCancel: () => void;
  message: EveryMessage;
}

const RemoveMessage: React.FC<RemoveMessageProps> = (props: RemoveMessageProps) => {
  const {
    onSubmit = () => { /* noop */ },
    onCancel,
    message,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  const {
    deleteMessage,
  } = useChannelContext();
  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={message?.threadInfo?.replyCount > 0}
      onCancel={onCancel}
      onSubmit={() => { deleteMessage(message).then(() => {
        onSubmit();
        onCancel();
      }) }}
      submitText={stringSet.MESSAGE_MENU__DELETE}
      titleText={stringSet.MODAL__DELETE_MESSAGE__TITLE}
    />
  );
};

export default RemoveMessage;
