import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';

import type { ChannelSettingsContextProps, ChannelSettingsState } from './types';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { useStore } from '../../../hooks/useStore';

import uuidv4 from '../../../utils/uuid';
import { createStore } from '../../../utils/storeManager';
import useSetChannel from './hooks/useSetChannel';
import { useChannelHandler } from './hooks/useChannelHandler';

export const ChannelSettingsContext = createContext<ReturnType<typeof createStore<ChannelSettingsState>> | null>(null);

const initialState: ChannelSettingsState = {
  // Props
  channelUrl: '',
  onCloseClick: undefined,
  onLeaveChannel: undefined,
  onChannelModified: undefined,
  onBeforeUpdateChannel: undefined,
  renderUserListItem: undefined,
  queries: {},
  overrideInviteUser: undefined,
  // Managed states
  channel: null,
  loading: false,
  invalidChannel: false,
  forceUpdateUI: () => { },
  setChannelUpdateId: () => { },
};

/**
 * @returns {ReturnType<typeof createStore<ChannelSettingsState>>}
 */
const useChannelSettingsStore = () => {
  return useStore(ChannelSettingsContext, state => state, initialState);
};

const ChannelSettingsManager = ({
  channelUrl,
  onCloseClick,
  onLeaveChannel,
  onChannelModified,
  overrideInviteUser,
  onBeforeUpdateChannel,
  queries,
  renderUserListItem,
}: ChannelSettingsContextProps) => {
  const { config, stores } = useSendbirdStateContext();
  const { updateState } = useChannelSettingsStore();
  const { logger } = config;
  const { sdk, initialized } = stores?.sdkStore ?? {};

  const [channelUpdateId, setChannelUpdateId] = useState(() => uuidv4());
  const forceUpdateUI = useCallback(() => setChannelUpdateId(uuidv4()), []);

  const dependencies = [channelUpdateId];
  useSetChannel({
    channelUrl,
    sdk,
    logger,
    initialized,
    dependencies,
  });
  useChannelHandler({
    sdk,
    channelUrl,
    logger,
    forceUpdateUI,
    dependencies,
  });

  useEffect(() => {
    updateState({
      channelUrl,
      onCloseClick,
      onLeaveChannel,
      onChannelModified,
      onBeforeUpdateChannel,
      renderUserListItem,
      queries,
      overrideInviteUser,
      forceUpdateUI,
      setChannelUpdateId,
    });
  }, [
    channelUrl,
    onCloseClick,
    onLeaveChannel,
    onChannelModified,
    onBeforeUpdateChannel,
    renderUserListItem,
    queries,
    overrideInviteUser,
    forceUpdateUI,
  ]);

  return null;
};

const createChannelSettingsStore = () => createStore(initialState);
const InternalChannelSettingsProvider = ({ children }) => {
  const storeRef = useRef(createChannelSettingsStore());
  return (
    <ChannelSettingsContext.Provider value={storeRef.current}>
      {children}
    </ChannelSettingsContext.Provider>
  );
};

const ChannelSettingsProvider = (props: ChannelSettingsContextProps) => {
  const { children } = props;
  return (
    <InternalChannelSettingsProvider>
      <ChannelSettingsManager {...props} />
      {children}
    </InternalChannelSettingsProvider>
  );
};

const useChannelSettingsContext = () => {
  const context = React.useContext(ChannelSettingsContext);
  if (!context) throw new Error('ChannelSettingsContext not found. Use within the ChannelSettings module');
  return context;
};

export { ChannelSettingsProvider, useChannelSettingsContext };
