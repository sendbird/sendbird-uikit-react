import React, {
  useReducer,
  useRef,
  useEffect,
} from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { NotficationChannelStateInterface, initialState } from './dux/initialState';
import useInitialize from './hooks/useInitialize';
import { reducer } from './dux/reducers';
import { MessageListParams } from '@sendbird/chat/message';
import useEventListener from './hooks/useEventListener';
import useFetchMore from './hooks/useFetchMore';
import { actionTypes } from './dux/actionTypes';

export type NotficationChannelContextProps = {
  channelUrl: string,
  children?: React.ReactElement;
  messageListParams?: MessageListParams;
  lastSeen?: number;
  // todo:
  // handleWebAction(view: EventTargentElement, action: Action, message: BaseMessage)
  // handleCustomAction(view: EventTargentElement, action: Action, message: BaseMessage)
  // hanlePredefinedAction(view: EventTargentElement, action: Action, message: BaseMessage)
};

export interface NotficationChannelProviderInterface extends NotficationChannelStateInterface,
  NotficationChannelContextProps {
    notificationsDispatcher: React.Dispatch<any>;
    oldestMessageTimeStamp: number;
    scrollRef: React.RefObject<HTMLDivElement>;
    onFetchMore: (cb: any) => void;
  };

const NotficationChannelContext = React.createContext<NotficationChannelProviderInterface | null>(undefined);
const NotficationChannelProvider: React.FC<NotficationChannelContextProps> = (
  props: NotficationChannelContextProps,
) => {
  const {
    channelUrl,
    children,
    messageListParams,
    lastSeen,
  } = props;

  const globalStore = useSendbirdStateContext();
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const logger = globalStore?.config?.logger;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;
  const [ notificationsStore, notificationsDispatcher ] = useReducer(reducer, initialState);
  const {
    uiState,
    allMessages,
    currentNotificationChannel,
    hasMore,
  } = notificationsStore;
  const oldestMessageTimeStamp = allMessages?.[allMessages?.length - 1]?.createdAt || 0;

  // intialize
  useInitialize({ channelUrl, sdkInit, messageListParams }, {
    notificationsDispatcher,
    sdk,
    logger,
  });

  // event listener
  useEventListener({ currentChannel: currentNotificationChannel, sdkInit }, {
    notificationsDispatcher,
    sdk,
    logger,
  });

  const onFetchMore = useFetchMore({
    channel: currentNotificationChannel,
    sdkInit,
    oldestMessageTimeStamp,
  }, {
    notificationsDispatcher,
    messageListParams: notificationsStore.messageListParams,
    logger,
  });

  useEffect(() => {
    notificationsDispatcher({
      type: actionTypes.SET_LAST_SEEN,
      payload: { lastSeen },
    })
  }, [lastSeen]);

  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <NotficationChannelContext.Provider value={{
      // props
      channelUrl,
      // store
      uiState,
      messageListParams: notificationsStore.messageListParams,
      lastSeen: notificationsStore?.lastSeen,
      allMessages,
      currentNotificationChannel,
      hasMore,
      // dispatcher
      notificationsDispatcher,
      // derived info
      oldestMessageTimeStamp,
      scrollRef,
      onFetchMore,
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
