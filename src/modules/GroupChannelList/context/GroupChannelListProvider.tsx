import React, { useContext, useEffect, useState } from 'react';

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

type OnCreateChannelClickParams = { users: Array<string>; onClose: () => void; channelType: CHANNEL_TYPE };
type ChannelListDataSource = ReturnType<typeof useGroupChannelList>;
type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;

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
export interface GroupChannelListProviderProps
  extends PartialRequired<ContextBaseType, 'onChannelSelect' | 'onChannelCreated'>,
    Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'renderUserProfile' | 'disableUserProfile'> {
  children?: React.ReactNode;
}

export const GroupChannelListContext = React.createContext<GroupChannelListContextType>(null);
export const GroupChannelListProvider = (props: GroupChannelListProviderProps) => {
  const {
    // Default
    children,
    className = '',
    selectedChannelUrl,

    // Flags
    allowProfileEdit = true,
    disableAutoSelect = false,
    isTypingIndicatorEnabled = false,
    isMessageReceiptStatusEnabled = false,

    // Custom
    channelListQueryParams,
    onThemeChange,
    onChannelSelect = noop,
    onChannelCreated = noop,
    onCreateChannelClick,
    onBeforeCreateChannel,
    onUserProfileUpdated,

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

  // SideEffect: Auto select channel
  useEffect(() => {
    if (!disableAutoSelect && stores.sdkStore.initialized && initialized) {
      if (!selectedChannelUrl) onChannelSelect(groupChannels[0] ?? null);
    }
  }, [disableAutoSelect, stores.sdkStore.initialized, initialized, selectedChannelUrl]);

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
        onChannelCreated,
        // Partial props
        onThemeChange,
        onCreateChannelClick,
        onBeforeCreateChannel,
        onUserProfileUpdated,
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
