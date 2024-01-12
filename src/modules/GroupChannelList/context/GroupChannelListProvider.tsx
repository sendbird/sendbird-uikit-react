import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

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

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channelType: CHANNEL_TYPE;
};

type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;

interface GroupChannelListContextType {
  // Default
  className: string | string[];
  selectedChannelUrl?: string;

  // Flags
  allowProfileEdit: boolean;
  disableAutoSelect: boolean;
  isTypingIndicatorEnabled: boolean;
  isMessageReceiptStatusEnabled: boolean;

  // Essential
  onChannelSelect(channel: GroupChannel | null): void;
  onCreateChannel(channel: GroupChannel): void;

  // Custom
  // Partial props - because we are doing null check before calling these functions
  channelListQueryParams?: ChannelListQueryParamsType;
  onThemeChange?(theme: string): void;
  onClickCreateChannel?(params: OverrideInviteUserType): void;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  onUpdatedUserProfile?(user: User): void;
}

export interface GroupChannelListProviderProps extends PropsWithChildren<Partial<GroupChannelListContextType> & UserProfileProviderProps> {}

export interface GroupChannelListProviderInterface extends GroupChannelListContextType, ReturnType<typeof useGroupChannelList> {
  typingChannelUrls: Array<string>;
}

export const GroupChannelListContext = React.createContext<GroupChannelListProviderInterface>({
  // Props - Default
  className: null,
  selectedChannelUrl: undefined,
  // Props - Flags
  allowProfileEdit: true,
  disableAutoSelect: false,
  isTypingIndicatorEnabled: false,
  isMessageReceiptStatusEnabled: false,
  // Props - Essential
  onChannelSelect: noop,
  onCreateChannel: noop,
  // Props - Custom
  onThemeChange: undefined,
  onClickCreateChannel: undefined,
  onBeforeCreateChannel: undefined,
  onUpdatedUserProfile: undefined,

  // Internal Interface
  typingChannelUrls: [],

  // UseGroupChannelList
  initialized: false,
  refreshing: false,
  groupChannels: [],
  refresh: () => new Promise(noop),
  loadMore: () => new Promise(noop),
});

export const GroupChannelListProvider = (props: GroupChannelListProviderProps) => {
  const {
    // Default
    children,
    className,
    selectedChannelUrl,

    // Flags
    allowProfileEdit,
    disableAutoSelect,
    isTypingIndicatorEnabled = null,
    isMessageReceiptStatusEnabled = null,

    // Custom
    channelListQueryParams,
    onThemeChange,
    onChannelSelect = noop,
    onCreateChannel,
    onClickCreateChannel,
    onBeforeCreateChannel,
    onUpdatedUserProfile,

    // UserProfile
    disableUserProfile,
    renderUserProfile,
    onUserProfileMessage,
  } = props;
  const globalStore = useSendbirdStateContext();
  const { config, stores } = globalStore;
  const { sdkStore } = stores;
  const { isTypingIndicatorEnabledOnChannelList = false, isMessageReceiptStatusEnabledOnChannelList = false } = config;

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

  // Auto select channel
  useEffect(() => {
    if (!disableAutoSelect && stores.sdkStore.initialized && initialized) {
      if (!selectedChannelUrl) onChannelSelect(groupChannels[0] ?? null);
    }
  }, [disableAutoSelect, stores.sdkStore.initialized, initialized, selectedChannelUrl]);

  // TypingChannels
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

  return (
    <GroupChannelListContext.Provider
      value={{
        // Default
        className,
        selectedChannelUrl,
        // Flags
        allowProfileEdit: allowProfileEdit ?? config?.allowProfileEdit,
        disableAutoSelect,
        isTypingIndicatorEnabled: isTypingIndicatorEnabled ?? isTypingIndicatorEnabledOnChannelList,
        isMessageReceiptStatusEnabled: isMessageReceiptStatusEnabled ?? isMessageReceiptStatusEnabledOnChannelList,
        // Essential
        onChannelSelect,
        onCreateChannel,
        // Partial props
        onThemeChange,
        onClickCreateChannel,
        onBeforeCreateChannel,
        onUpdatedUserProfile,
        // Internal
        typingChannelUrls,
        // ReturnType<UseGroupChannelList>
        refreshing,
        initialized,
        groupChannels,
        refresh,
        loadMore,
      }}
    >
      <UserProfileProvider
        disableUserProfile={disableUserProfile ?? config?.disableUserProfile}
        renderUserProfile={renderUserProfile ?? config?.renderUserProfile}
        onUserProfileMessage={onUserProfileMessage ?? config?.onUserProfileMessage}
      >
        <div className={`sendbird-channel-list ${className}`}>{children}</div>
      </UserProfileProvider>
    </GroupChannelListContext.Provider>
  );
};

export function useGroupChannelListContext(): GroupChannelListProviderInterface {
  const context: GroupChannelListProviderInterface = useContext(GroupChannelListContext);
  return context;
}

function getCollectionCreator(sdk: SdkStore['sdk'], channelListQueryParams?: ChannelListQueryParamsType) {
  return (defaultParams: ChannelListQueryParamsType) => {
    const params = { ...defaultParams, ...channelListQueryParams };
    return sdk.groupChannel.createGroupChannelCollection({
      ...params,
      filter: new GroupChannelFilter(params),
    });
  };
}
