import React from 'react';

import { renderMessage } from '../../types';
import { useNotficationChannelContext } from '../../context/NotificationChannelProvider';
import { BaseMessage } from '@sendbird/chat/message';



type Props = {
  renderMessage?: renderMessage;
}

export default function NotificationList({
  renderMessage,
}: Props) {
  const { allMessages } = useNotficationChannelContext();
  return (
    <div>
      {
        allMessages.map((message) => {
          return renderMessage?.({ message }) || message?.messageId;
        })
      }
    </div>
  );
}
