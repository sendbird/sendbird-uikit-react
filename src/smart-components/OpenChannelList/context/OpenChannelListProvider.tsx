import React, { useContext, useReducer, useMemo } from 'react';

import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

import openChannelListReducer from './dux/reducer';
import openChannelListInitialState, { OpenChannelListInitialInterface } from './dux/initialState';
import {
  OpenChannelListFetchingStatus,
  OpenChannelListProviderProps,
  OpenChannelListProviderInterface,
} from './OpenChannelListInterfaces';
import useFetchNextCallback from './hooks/useFetchNextCallback';
import useSetupOpenChannelList from './hooks/useSetupOpenChannelList';
import useRefreshOpenChannelList from './hooks/useRefreshOpenChannelList';

const OpenChannelListContext = React.createContext<OpenChannelListProviderInterface | null>({
  onChannelSelected: null,
  currentChannel: null,
  allChannels: [],
  fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
  customOpenChannelListQuery: {},
  fetchNextChannels: null,
  refreshOpenChannelList: null,
  openChannelListDispatcher: null,
  logger: null,
});

export function useOpenChannelListContext(): OpenChannelListProviderInterface {
  const context: OpenChannelListProviderInterface = useContext(OpenChannelListContext);
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
  const { logger } = config;
  const sdk = stores?.sdkStore?.sdk || null;
  const sdkInitialized = stores?.sdkStore?.initialized || false;
  const customOpenChannelListQuery = useMemo(() => {
    return queries?.openChannelListQuery || null;
  }, [queries?.openChannelListQuery]);

  // dux
  const [openChannelListStore, openChannelListDispatcher] = useReducer(
    openChannelListReducer,
    openChannelListInitialState,
  ) as [OpenChannelListInitialInterface, CustomUseReducerDispatcher];
  const {
    allChannels,
    currentChannel,
    fetchingStatus,
    channelListQuery,
  } = openChannelListStore;

  // add channel event: will do later
  // Initialize
  useSetupOpenChannelList({
    sdk,
    sdkInitialized,
    openChannelListQuery: customOpenChannelListQuery,
  }, {
    logger,
    openChannelListDispatcher,
  });

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
}

export default {
  OpenChannelListProvider,
  useOpenChannelListContext,
};
