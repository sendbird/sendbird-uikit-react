import React from 'react';
import { MessageView, type MessageViewProps } from './MessageView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export const Message = (props: MessageViewProps) => {
  const context = useGroupChannelContext();
  return (
    <MessageView
      {...props}
      {...context}
    />
  );
};

export default Message;
