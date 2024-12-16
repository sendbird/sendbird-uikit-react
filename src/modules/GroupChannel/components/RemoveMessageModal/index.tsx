import React from 'react';
import RemoveMessageModalView, { RemoveMessageModalProps } from './RemoveMessageModalView';
import { useGroupChannel } from '../../context/hooks/useGroupChannel';

export const RemoveMessageModal = (props: RemoveMessageModalProps) => {
  const { actions: { deleteMessage } } = useGroupChannel();
  return <RemoveMessageModalView {...props} deleteMessage={deleteMessage} />;
};

export default RemoveMessageModal;
