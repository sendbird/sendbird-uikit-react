import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useMemo,
} from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { NotficationChannelStateInterface, initialState } from './dux/initialState';
import useInitialize from './hooks/useInitialize';
import { reducer } from './dux/reducers';

export type NotficationChannelContextProps = {
  channelUrl: string,
  children?: React.ReactElement;
};

export interface NotficationChannelProviderInterface extends NotficationChannelStateInterface,
  NotficationChannelContextProps {
    notificationsDispatcher: React.Dispatch<any>;
  };

const NotficationChannelContext = React.createContext<NotficationChannelProviderInterface | null>(undefined);
const NotficationChannelProvider: React.FC<NotficationChannelContextProps> = (
  props: NotficationChannelContextProps,
) => {
  const {
    channelUrl,
    children,
  } = props;

  const globalStore = useSendbirdStateContext();
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const logger = globalStore?.config?.logger;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;
  const [ notificationsStore, notificationsDispatcher ] = useReducer(reducer, initialState);
  // intialize
  useInitialize({ channelUrl, sdkInit}, {
    notificationsDispatcher,
    sdk,
    logger,
  });

  const {
    uiState,
    allMessages,
    currentNotificationChannel,
    hasMore,
  } = notificationsStore;
  return (
    <NotficationChannelContext.Provider value={{
      // props
      channelUrl,
      // store
      uiState,
      allMessages,
      currentNotificationChannel,
      hasMore,
      // dispatcher
      notificationsDispatcher,
    }}>
      {children}
    </NotficationChannelContext.Provider>
  );
}

export type UseNotficationChannelType = () => NotficationChannelProviderInterface;
const useNotficationChannelContext: UseNotficationChannelType = () => React.useContext(NotficationChannelContext);

export {
  NotficationChannelProvider,
  useNotficationChannelContext,
};
