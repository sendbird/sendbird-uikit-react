import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';

import type { ChannelSettingsContextProps, ChannelSettingsState } from './types';

import useSetChannel from './hooks/useSetChannel';
import { useStore } from '../../../hooks/useStore';
import { useChannelHandler } from './hooks/useChannelHandler';

import uuidv4 from '../../../utils/uuid';
import { classnames, deleteNullish } from '../../../utils/utils';
import { createStore } from '../../../utils/storeManager';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import useChannelSettings from './useChannelSettings';
import { PartialDeep } from '../../../utils/typeHelpers/partialDeep';

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

const createChannelSettingsStore = (props?: Omit<PartialDeep<ChannelSettingsState>, 'channel'>) => createStore({
  ...initialState,
  ...props,
});

const InternalChannelSettingsProvider = (props: ChannelSettingsContextProps) => {
  const { children } = props;

  const defaultProps: PartialDeep<ChannelSettingsState> = deleteNullish({
    channelUrl: props?.channelUrl,
    onCloseClick: props?.onCloseClick,
    onLeaveChannel: props?.onLeaveChannel,
    onChannelModified: props?.onChannelModified,
    onBeforeUpdateChannel: props?.onBeforeUpdateChannel,
    renderUserListItem: props?.renderUserListItem,
    queries: props?.queries,
    overrideInviteUser: props?.overrideInviteUser,
  });

  const storeRef = useRef(createChannelSettingsStore(defaultProps));

  return (
    <ChannelSettingsContext.Provider value={storeRef.current}>
      {children}
    </ChannelSettingsContext.Provider>
  );
};

const ChannelSettingsProvider = (props: ChannelSettingsContextProps) => {
  const { children, className } = props;
  return (
    <InternalChannelSettingsProvider {...props}>
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
  const { state, actions } = useChannelSettings();
  return { ...state, ...actions };
};

export { ChannelSettingsProvider, useChannelSettingsContext };
