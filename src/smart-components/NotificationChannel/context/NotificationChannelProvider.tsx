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
import { BaseMessage, MessageListParams } from '@sendbird/chat/message';
import useEventListener from './hooks/useEventListener';
import useFetchMore, { NotificationFetchMoreCb } from './hooks/useFetchMore';
import { actionTypes } from './dux/actionTypes';
import { Action } from '@sendbird/uikit-message-template';

export type NotficationChannelContextProps = {
  channelUrl: string;
  children?: React.ReactElement;
  messageListParams?: MessageListParams;
  lastSeen?: number;
  handleWebAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage);
  handleCustomAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage);
  handlePredefinedAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage);
};

export interface NotficationChannelProviderInterface extends NotficationChannelStateInterface,
  NotficationChannelContextProps {
    notificationsDispatcher: React.Dispatch<any>;
    oldestMessageTimeStamp: number;
    scrollRef: React.RefObject<HTMLDivElement>;
    onFetchMore: (cb: NotificationFetchMoreCb) => void;
  }

const NotficationChannelContext = React.createContext<NotficationChannelProviderInterface | null>(undefined);
const NotficationChannelProvider: React.FC<NotficationChannelContextProps> = (
  props: NotficationChannelContextProps,
) => {
  const {
    channelUrl,
    children,
    messageListParams,
    lastSeen,
    handleWebAction,
    handleCustomAction,
    handlePredefinedAction,
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
    showDeleteModal,
    messageToDelete,
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

  const defaulthandlePredefinedAction = (event: React.SyntheticEvent, action: Action, message: BaseMessage) => {
    logger.info('NotficationChannel: handlePredefinedAction', { event, action, message });
    if (action?.type === 'uikit' && action?.data === 'sendbirduikit://delete') {
      notificationsDispatcher({
        type: actionTypes.SHOW_DELETE_MODAL,
        payload: { message, showDeleteModal: true },
      });
    }
  }
  return (
    <NotficationChannelContext.Provider value={{
      // props
      channelUrl,
      handleWebAction,
      handleCustomAction,
      handlePredefinedAction: handlePredefinedAction || defaulthandlePredefinedAction,
      // store
      uiState,
      messageListParams: notificationsStore.messageListParams,
      lastSeen: notificationsStore?.lastSeen,
      allMessages,
      showDeleteModal,
      currentNotificationChannel,
      hasMore,
      messageToDelete,
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
