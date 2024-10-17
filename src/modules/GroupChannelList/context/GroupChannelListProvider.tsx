import React, { useContext, useEffect, useRef, useState } from 'react';

import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams, GroupChannelFilterParams } from '@sendbird/chat/groupChannel';
import { GroupChannelCollectionParams, GroupChannelFilter } from '@sendbird/chat/groupChannel';
import { useGroupChannelList, useGroupChannelHandler } from '@sendbird/uikit-tools';

import type { CHANNEL_TYPE } from '../../CreateChannel/types';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { useMarkAsDeliveredScheduler } from '../../../lib/hooks/useMarkAsDeliveredScheduler';
import useOnlineStatus from '../../../lib/hooks/useOnlineStatus';
import { noop } from '../../../utils/utils';
import type { SdkStore } from '../../../lib/types';
import { PartialRequired } from '../../../utils/typeHelpers/partialRequired';
import { createStore } from '../../../utils/storeManager';
import { useStore } from '../../../hooks/useStore';

type OnCreateChannelClickParams = { users: Array<string>; onClose: () => void; channelType: CHANNEL_TYPE };
type ChannelListDataSource = ReturnType<typeof useGroupChannelList>;
export type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;

interface ContextBaseType {
  // Required
  onChannelSelect(channel: GroupChannel | null): void;
  onChannelCreated(channel: GroupChannel): void;

  // Default
  className: string | string[];
  selectedChannelUrl?: string;

  // Flags
  allowProfileEdit: boolean;
  disableAutoSelect: boolean;
  isTypingIndicatorEnabled: boolean;
  isMessageReceiptStatusEnabled: boolean;

  // Custom
  // Partial props - because we are doing null check before calling these functions
  channelListQueryParams?: ChannelListQueryParamsType;
  onThemeChange?(theme: string): void;
  onCreateChannelClick?(params: OnCreateChannelClickParams): void;
  onBeforeCreateChannel?(users: string[]): GroupChannelCreateParams;
  onUserProfileUpdated?(user: User): void;
}

export interface GroupChannelListContextType extends ContextBaseType, ChannelListDataSource {
  typingChannelUrls: string[];
}
export interface GroupChannelListProviderProps extends
  PartialRequired<ContextBaseType, 'onChannelSelect' | 'onChannelCreated'>,
  Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'onStartDirectMessage' | 'renderUserProfile' | 'disableUserProfile'> {
  children?: React.ReactNode;
}

export const GroupChannelListContext = React.createContext<ReturnType<typeof createStore<GroupChannelListState>> | null>(null);

export interface GroupChannelListState extends GroupChannelListContextType {
}

const initialState: GroupChannelListState = {
  className: '',
  selectedChannelUrl: '',
  disableAutoSelect: false,
  allowProfileEdit: false,
  isTypingIndicatorEnabled: false,
  isMessageReceiptStatusEnabled: false,
  onChannelSelect: noop,
  onChannelCreated: noop,
  onThemeChange: noop,
  onCreateChannelClick: noop,
  onBeforeCreateChannel: null,
  onUserProfileUpdated: noop,
  typingChannelUrls: [],
  refreshing: false,
  initialized: false,
  groupChannels: [],
  refresh: null,
  loadMore: null,
};

/**
 * @returns {ReturnType<typeof createStore<GroupChannelListState>>}
 */
const useGroupChannelListStore = () => {
  return useStore(GroupChannelListContext, state => state, initialState);
};

export const GroupChannelListManager: React.FC<GroupChannelListProviderProps> = (props: GroupChannelListProviderProps) => {
  const {
    className = '',
    selectedChannelUrl,

    disableAutoSelect = false,
    allowProfileEdit,
    isTypingIndicatorEnabled,
    isMessageReceiptStatusEnabled,

    channelListQueryParams,
    onThemeChange,
    onChannelSelect = noop,
    onChannelCreated = noop,
    onCreateChannelClick,
    onBeforeCreateChannel,
    onUserProfileUpdated,
  } = props;

  const { config, stores } = useSendbirdStateContext();
  const { updateState } = useGroupChannelListStore();
  const { sdkStore } = stores;

  const sdk = sdkStore.sdk;
  const isConnected = useOnlineStatus(sdk, config.logger);
  const scheduler = useMarkAsDeliveredScheduler({ isConnected }, config);

  const channelListDataSource = useGroupChannelList(sdk, {
    collectionCreator: getCollectionCreator(sdk, channelListQueryParams),
    markAsDelivered: (channels) => channels.forEach(scheduler.push),
    onChannelsDeleted: (channelUrls) => {
      channelUrls.forEach((url) => {
        if (url === selectedChannelUrl) onChannelSelect(null);
      });
    },
  });

  const { refreshing, initialized, groupChannels, refresh, loadMore } = channelListDataSource;

  // SideEffect: Auto select channel
  useEffect(() => {
    if (!disableAutoSelect && stores.sdkStore.initialized && initialized) {
      if (!selectedChannelUrl) onChannelSelect(groupChannels[0] ?? null);
    }
  }, [disableAutoSelect, stores.sdkStore.initialized, initialized, selectedChannelUrl]);

  // Recreates the GroupChannelCollection when `channelListQueryParams` change
  useEffect(() => {
    refresh();
  }, [
    Object.keys(channelListQueryParams ?? {}).sort()
      .map((key: string) => `${key}=${encodeURIComponent(JSON.stringify(channelListQueryParams[key]))}`)
      .join('&'),
  ]);

  const [typingChannelUrls, setTypingChannelUrls] = useState<string[]>([]);
  useGroupChannelHandler(sdk, {
    onTypingStatusUpdated: (channel) => {
      const channelList = typingChannelUrls.filter((channelUrl) => channelUrl !== channel.url);
      if (channel.getTypingUsers()?.length > 0) {
        setTypingChannelUrls(channelList.concat(channel.url));
      } else {
        setTypingChannelUrls(channelList);
      }
    },
  });

  useEffect(() => {
    updateState({
      className,
      selectedChannelUrl,
      disableAutoSelect,
      allowProfileEdit,
      isTypingIndicatorEnabled,
      isMessageReceiptStatusEnabled,
      onChannelSelect,
      onChannelCreated,
      onThemeChange,
      onCreateChannelClick,
      onBeforeCreateChannel,
      onUserProfileUpdated,
      typingChannelUrls,
      refreshing,
      initialized,
      groupChannels,
      refresh,
      loadMore,
    });
  }, [
    className,
    selectedChannelUrl,
    disableAutoSelect,
    allowProfileEdit,
    isTypingIndicatorEnabled,
    isMessageReceiptStatusEnabled,
    onChannelSelect,
    onChannelCreated,
    onThemeChange,
    onCreateChannelClick,
    onBeforeCreateChannel,
    onUserProfileUpdated,
    typingChannelUrls,
    refreshing,
    initialized,
    groupChannels,
    refresh,
    loadMore,
  ]);

  return null;
};

const createGroupChannelListStore = () => createStore(initialState);
const InternalGroupChannelListStoreProvider = ({ children }) => {
  const storeRef = useRef(createGroupChannelListStore());
  return (
    <GroupChannelListContext.Provider value={storeRef.current}>
      {children}
    </GroupChannelListContext.Provider>
  );
};

export const GroupChannelListProvider = (props: GroupChannelListProviderProps) => {
  const { children, className } = props;

  return (
    <InternalGroupChannelListStoreProvider>
      <GroupChannelListManager {...props} />
      <UserProfileProvider {...props}>
        <div className={`sendbird-channel-list ${className}`}>{children}</div>
      </UserProfileProvider>
    </InternalGroupChannelListStoreProvider>
  );
};

export const useGroupChannelListContext = () => {
  const context = useContext(GroupChannelListContext);
  if (!context) throw new Error('GroupChannelListContext not found. Use within the GroupChannelList module.');
  return context;
};

function getCollectionCreator(sdk: SdkStore['sdk'], channelListQueryParams?: ChannelListQueryParamsType) {
  return (defaultParams: ChannelListQueryParamsType) => {
    const params = { ...defaultParams, ...channelListQueryParams };
    return sdk.groupChannel.createGroupChannelCollection({
      ...params,
      filter: new GroupChannelFilter(params),
    });
  };
}
