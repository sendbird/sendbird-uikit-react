import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';

import type { ChannelSettingsContextProps, ChannelSettingsState } from './types';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { useAsyncRequest } from '../../../hooks/useAsyncRequest';
import { useStore } from '../../../hooks/useStore';

import uuidv4 from '../../../utils/uuid';
import compareIds from '../../../utils/compareIds';
import { createStore } from '../../../utils/storeManager';

const ChannelSettingsContext = createContext<ReturnType<typeof createStore<ChannelSettingsState>> | null>(null);

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
  forceUpdateUI: () => {},
  setChannelUpdateId: () => {},
};
const useChannelSettingsStore = () => useStore(ChannelSettingsContext, state => state, initialState);

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

  const [channelHandlerId, setChannelHandlerId] = useState<string | undefined>();
  const [channelUpdateId, setChannelUpdateId] = useState(() => uuidv4());
  const forceUpdateUI = useCallback(() => setChannelUpdateId(uuidv4()), []);

  const {
    response: channel = null,
    loading,
    error,
    refresh,
  } = useAsyncRequest(
    async () => {
      logger.info('ChannelSettings: fetching channel');
      if (!channelUrl) {
        logger.warning('ChannelSettings: channel url is required');
        return;
      } else if (!initialized || !sdk) {
        logger.warning('ChannelSettings: SDK is not initialized');
        return;
      } else if (!sdk.groupChannel) {
        logger.warning('ChannelSettings: GroupChannelModule is not specified in the SDK');
        return;
      }

      try {
        if (channelHandlerId) {
          if (sdk.groupChannel.removeGroupChannelHandler) {
            logger.info('ChannelSettings: Removing message receiver handler', channelHandlerId);
            sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
          } else {
            logger.error('ChannelSettings: removeGroupChannelHandler not found');
          }
          setChannelHandlerId(undefined);
        }

        const fetchedChannel = await sdk.groupChannel.getChannel(channelUrl);
        const channelHandler: GroupChannelHandler = {
          onUserLeft: (channel, user) => {
            if (compareIds(channel?.url, channelUrl)) {
              logger.info('ChannelSettings: onUserLeft', { channel, user });
              refresh();
            }
          },
          onUserBanned: (channel, user) => {
            if (compareIds(channel?.url, channelUrl) && channel.isGroupChannel()) {
              logger.info('ChannelSettings: onUserBanned', { channel, user });
              refresh();
            }
          },
        };
        const newChannelHandlerId = uuidv4();
        sdk.groupChannel.addGroupChannelHandler(newChannelHandlerId, new GroupChannelHandler(channelHandler));
        setChannelHandlerId(newChannelHandlerId);
        return fetchedChannel;
      } catch (error) {
        logger.error('ChannelSettings: error fetching channel', error);
        throw error;
      }
    },
    {
      resetResponseOnRefresh: true,
      persistLoadingIfNoResponse: true,
      deps: [initialized, sdk?.groupChannel],
    },
  );

  useEffect(() => {
    refresh();
  }, [channelUrl, channelUpdateId]);

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
      channel,
      loading,
      invalidChannel: Boolean(error),
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
    channel,
    loading,
    error,
    forceUpdateUI,
  ]);

  return null;
};

const InternalChannelSettingsProvider = ({ children }) => {
  const storeRef = useRef((() => createStore(initialState))());
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
      <ChannelSettingsManager {...props}/>
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
