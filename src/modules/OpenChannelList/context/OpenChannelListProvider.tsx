import React, { useContext, useReducer, useEffect } from 'react';

import pubSubTopics from '../../../lib/pubSub/topics';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

import openChannelListReducer from './dux/reducer';
import openChannelListInitialState, { OpenChannelListInitialInterface } from './dux/initialState';
import {
  OpenChannelListProviderProps,
  OpenChannelListProviderInterface,
  OpenChannelListDispatcherType,
} from './OpenChannelListInterfaces';
import useFetchNextCallback from './hooks/useFetchNextCallback';
import useSetupOpenChannelList from './hooks/useSetupOpenChannelList';
import useRefreshOpenChannelList from './hooks/useRefreshOpenChannelList';
import OpenChannelListActionTypes from './dux/actionTypes';

const OpenChannelListContext = React.createContext<OpenChannelListProviderInterface | null>(null);

export function useOpenChannelListContext() {
  const context = useContext(OpenChannelListContext);
  if (!context) throw new Error('OpenChannelListContext not found. Use within the OpenChannelList module.');
  return context;
}

export const OpenChannelListProvider: React.FC<OpenChannelListProviderProps> = ({
  className,
  children,
  queries,
  onChannelSelected,
}: OpenChannelListProviderProps): React.ReactElement => {
  // props
  const { stores, config } = useSendbirdStateContext();
  const { logger, pubSub } = config;
  const sdk = stores?.sdkStore?.sdk || null;
  const sdkInitialized = stores?.sdkStore?.initialized || false;
  const customOpenChannelListQuery = queries?.openChannelListQuery;

  // dux
  const [openChannelListStore, openChannelListDispatcher]: [OpenChannelListInitialInterface, OpenChannelListDispatcherType] = useReducer(
    openChannelListReducer,
    openChannelListInitialState,
  );
  const {
    allChannels,
    currentChannel,
    fetchingStatus,
    channelListQuery,
  } = openChannelListStore;

  // Initialize
  useSetupOpenChannelList({
    sdk,
    sdkInitialized,
    openChannelListQuery: customOpenChannelListQuery,
  }, {
    logger,
    openChannelListDispatcher,
  });

  // Events & PubSub
  useEffect(() => {
    const subscriber = new Map<string, { remove:() => void }>();
    subscriber.set(
      pubSubTopics.UPDATE_OPEN_CHANNEL,
      pubSub.subscribe(pubSubTopics.UPDATE_OPEN_CHANNEL, (channel) => {
        openChannelListDispatcher({
          type: OpenChannelListActionTypes.UPDATE_OPEN_CHANNEL,
          payload: channel,
        });
      }),
    );
    return () => {
      subscriber.forEach((it) => it.remove());
    };
  }, [sdkInitialized, pubSub]);

  // Fetch next channels by scroll event
  const fetchNextChannels = useFetchNextCallback({
    sdkInitialized: sdkInitialized,
    openChannelListQuery: channelListQuery,
  }, {
    logger,
    openChannelListDispatcher,
  });

  // Refresh channel list by click event of 'refresh button'
  const refreshOpenChannelList = useRefreshOpenChannelList({
    sdk,
    sdkInitialized,
    openChannelListQuery: customOpenChannelListQuery,
  }, {
    logger,
    openChannelListDispatcher,
  });

  return (
    <OpenChannelListContext.Provider
      value={{
        // props
        onChannelSelected: onChannelSelected,
        customOpenChannelListQuery: customOpenChannelListQuery,
        // interface
        logger: logger,
        currentChannel: currentChannel,
        allChannels: allChannels,
        fetchingStatus: fetchingStatus,
        fetchNextChannels: fetchNextChannels,
        refreshOpenChannelList: refreshOpenChannelList,
        openChannelListDispatcher: openChannelListDispatcher,
      }}
    >
      <div className={`sendbird-open-channel-list ${className}`}>
        {children}
      </div>
    </OpenChannelListContext.Provider>
  );
};

export default {
  OpenChannelListProvider,
  useOpenChannelListContext,
};
