import React from 'react';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import RemoveMessageModalView, { RemoveMessageModalProps } from './RemoveMessageModalView';

export const RemoveMessageModal = (props: RemoveMessageModalProps) => {
  const { deleteMessage } = useGroupChannelContext();
  return <RemoveMessageModalView {...props} deleteMessage={deleteMessage} />;
};

export default RemoveMessageModal;
