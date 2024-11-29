import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';

import type { ChannelSettingsContextProps, ChannelSettingsState } from './types';

import useSetChannel from './hooks/useSetChannel';
import { useStore } from '../../../hooks/useStore';
import { useChannelHandler } from './hooks/useChannelHandler';

import uuidv4 from '../../../utils/uuid';
import { classnames } from '../../../utils/utils';
import { createStore } from '../../../utils/storeManager';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import { useSendbird } from '../../../lib/Sendbird/context/hooks/useSendbird';

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
  const { state } = useSendbird();
  const { config, stores } = state;
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
  const { children, className } = props;
  return (
    <InternalChannelSettingsProvider>
      <ChannelSettingsManager {...props} />
      <UserProfileProvider {...props}>
        <div className={classnames('sendbird-channel-settings', className)}>
          {children}
        </div>
      </UserProfileProvider>
    </InternalChannelSettingsProvider>
  );
};

const useChannelSettingsContext = () => {
  const context = React.useContext(ChannelSettingsContext);
  if (!context) throw new Error('ChannelSettingsContext not found. Use within the ChannelSettings module');
  return context;
};

export { ChannelSettingsProvider, useChannelSettingsContext };
