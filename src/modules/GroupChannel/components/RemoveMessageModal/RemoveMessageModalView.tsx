import React, { useContext } from 'react';

import Modal from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { EveryMessage } from '../../../../types';
import { getModalDeleteMessageTitle } from '../../../../ui/Label/stringFormatterUtils';
import { SendableMessageType } from '../../../../utils';

export interface RemoveMessageModalProps {
  onSubmit?: () => void;
  onCancel: () => void;
  message: EveryMessage;
}

export interface RemoveMessageModalViewProps extends RemoveMessageModalProps {
  deleteMessage: (message: SendableMessageType) => Promise<void>;
}

export const RemoveMessageModalView = (props: RemoveMessageModalViewProps) => {
  const {
    onSubmit = () => {
      /* noop */
    },
    onCancel,
    message,
    deleteMessage,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  return (
    <Modal
      type={ButtonTypes.DANGER}
      disabled={message?.threadInfo?.replyCount ? message.threadInfo.replyCount > 0 : undefined}
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

export default RemoveMessageModalView;
