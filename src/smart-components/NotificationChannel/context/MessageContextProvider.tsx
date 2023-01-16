// create a context provider for MessageComponent
//  - this is a wrapper for MessageComponent
import React from 'react';

import { BaseMessage } from '@sendbird/chat/message';

export type MessageContextProps = {
  message: BaseMessage;
  children?: React.ReactElement;
};

export type MessageContextInterface = {
  message: BaseMessage;
}

const MessageContext = React.createContext<MessageContextProps | null>(undefined);
const MessageProvider: React.FC<MessageContextProps> = (
  props: MessageContextProps,
) => {
  const {
    message,
    children,
  } = props;

  const value = React.useMemo(() => ({
    message,
  }), [message?.updatedAt]);

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export type UseMessageContextType = () => MessageContextInterface;
const useMessageContext: UseMessageContextType = () => React.useContext(MessageContext);

export {
  MessageProvider,
  useMessageContext,
};
