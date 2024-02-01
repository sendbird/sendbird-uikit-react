import React from 'react';
import RemoveMessageModalView, {
  RemoveMessageModalProps,
} from '../../../GroupChannel/components/RemoveMessageModal/RemoveMessageModalView';
import { useChannelContext } from '../../context/ChannelProvider';

const RemoveMessageModal = (props: RemoveMessageModalProps) => {
  const { deleteMessage } = useChannelContext();
  return <RemoveMessageModalView {...props} deleteMessage={deleteMessage} />;
};

export default RemoveMessageModal;
