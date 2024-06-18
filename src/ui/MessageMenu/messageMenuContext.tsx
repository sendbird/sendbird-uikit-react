import React, { createContext, useContext, ReactNode, MutableRefObject, MouseEvent } from 'react';
import { SendableMessageType } from '../../utils';

interface CommonMessageMenuContextProps {
  message: SendableMessageType;
  hideMenu: () => void;
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

export interface MessageMenuContextProps extends CommonMessageMenuContextProps {
  showMenu: () => void;
  toggleMenu: () => void;
}

export interface MobileMessageMenuContextProps extends CommonMessageMenuContextProps {
  onDownloadClick?: (e: MouseEvent) => Promise<void>;
}

const MessageMenuContext = createContext<MessageMenuContextProps | MobileMessageMenuContextProps | undefined>(undefined);

interface MessageMenuProviderProps {
  children: ReactNode;
  value: MessageMenuContextProps | MobileMessageMenuContextProps;
  isMobile?: boolean;
}

export const MessageMenuProvider = ({ children, value, isMobile = false }: MessageMenuProviderProps) => {
  const contextValue = isMobile
    ? value as MobileMessageMenuContextProps
    : value as MessageMenuContextProps;

  return (
    <MessageMenuContext.Provider value={contextValue}>
      {children}
    </MessageMenuContext.Provider>
  );
};

export const useMessageMenuContext = () => {
  const context = useContext(MessageMenuContext);
  if (!context) {
    throw new Error('useMessageMenuContext must be used within a MessageMenuProvider');
  }
  return context;
};
