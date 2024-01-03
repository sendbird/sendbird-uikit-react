import React from 'react';
import { MessageView, type MessageViewProps } from '../../../GroupChannel/components/Message/MessageView';
import { useChannelContext } from '../../context/ChannelProvider';

export const Message = (props: MessageViewProps) => {
  const context = useChannelContext();
  return (
    <MessageView
      {...props}
      {...context}
      currentChannel={context.currentGroupChannel}
      messages={context.localMessages}
      sendUserMessage={context.sendMessage}
      updateUserMessage={context.updateMessage}
    />
  );
};

export default Message;
