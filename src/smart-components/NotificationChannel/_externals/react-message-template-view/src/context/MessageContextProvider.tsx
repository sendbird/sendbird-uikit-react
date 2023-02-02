// create a context provider for MessageComponent
//  - this is a wrapper for MessageComponent
import React, { Children } from 'react';

import { BaseMessage } from '@sendbird/chat/message';
import { Action } from '../../../message-template/src';


export type MessageContextProps = {
  message: BaseMessage;
  children?: React.ReactElement;
  handleWebAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage);
  handleCustomAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage);
  handlePredefinedAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage);
};

export type MessageContextInterface = Omit<MessageContextProps, 'children'>;

const MessageContext = React.createContext<MessageContextProps | null>(undefined);
const MessageProvider: React.FC<MessageContextProps> = (
  props: MessageContextProps,
) => {
  const {
    message,
    handleWebAction,
    handleCustomAction,
    handlePredefinedAction,
    children,
  } = props;

  const value = React.useMemo(() => ({
    message,
    handleWebAction,
    handleCustomAction,
    handlePredefinedAction,
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
