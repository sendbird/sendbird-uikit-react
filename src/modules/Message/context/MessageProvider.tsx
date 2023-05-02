// todo@v4.0.0: combine with the provider in core-ts, see:
// https://github.com/sendbird/sendbird-uikit-core-ts
// packages/react-uikit-message-template-view/src/context/MessageContextProvider.tsx
import React from 'react';
import { BaseMessage } from '@sendbird/chat/message';

export type MessageProviderProps = {
  children: React.ReactNode;
  message: BaseMessage;
  isByMe?: boolean;
}

export type MessageProviderInterface = Exclude<MessageProviderProps, 'children'>;

const MessageContext = React.createContext(undefined);

const MessageProvider: React.FC<MessageProviderInterface> = (props: MessageProviderProps) => {
  const {
    children,
    message,
    isByMe = false,
  } = props;

  return (
    <MessageContext.Provider value={{
      message,
      isByMe,
    }}>
      {children}
    </MessageContext.Provider>
  );
}

const useMessageContext = (): MessageProviderInterface => {
  const value = React.useContext(MessageContext);
  if (value === undefined) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return value;
};

export {
  MessageProvider,
  useMessageContext,
};
