import React from 'react';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import RemoveMessageModalView, { RemoveMessageModalProps } from './RemoveMessageModalView';

const RemoveMessageModal = (props: RemoveMessageModalProps) => {
  const { deleteMessage } = useGroupChannelContext();
  return <RemoveMessageModalView {...props} deleteMessage={deleteMessage} />;
};

export default RemoveMessageModal;
