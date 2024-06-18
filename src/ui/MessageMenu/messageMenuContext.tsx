import React, { createContext, useContext, ReactNode, MutableRefObject } from 'react';
import { SendableMessageType } from '../../utils';

export interface MessageMenuContextProps {
  message: SendableMessageType;
  hideMenu: () => void;
  showMenu: () => void;
  setQuoteMessage: (message: SendableMessageType) => void;
  onReplyInThread: (props: { message: SendableMessageType }) => void;
  onMoveToParentMessage: () => void;
  showEdit: (bool: boolean) => void;
  showRemove: (bool: boolean) => void;
  deleteMessage: (message: SendableMessageType) => void;
  resendMessage: (message: SendableMessageType) => void;
  isOnline: boolean;
  disableDeleteMessage: boolean | null;
  triggerRef: MutableRefObject<null>;
  containerRef: MutableRefObject<null>;
}

const MessageMenuContext = createContext<MessageMenuContextProps | undefined>(undefined);

export const MessageMenuProvider = ({ children, value }: { children: ReactNode, value: MessageMenuContextProps }) => {
  return <MessageMenuContext.Provider value={value}>{children}</MessageMenuContext.Provider>;
};

export const useMessageMenuContext = () => {
  const context = useContext(MessageMenuContext);
  if (!context) {
    throw new Error('useMessageMenuContext must be used within a MessageMenuProvider');
  }
  return context;
};
