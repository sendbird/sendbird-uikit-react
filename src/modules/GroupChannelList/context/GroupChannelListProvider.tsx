import React, { useContext, useState } from 'react';

import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { useGroupChanelList, useGroupChannelHandler } from '@sendbird/uikit-tools';

import { noop } from '../../../utils/utils';

import { CHANNEL_TYPE } from '../../CreateChannel/types';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channelType: CHANNEL_TYPE;
};

interface GroupChannelListContextType {
  // Default
  className: string | string[];
  selectedChannelUrl: string;

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
  onThemeChange?(theme: string): void;
  onClickCreateChannel?(params: OverrideInviteUserType): void;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  onUpdatedUserProfile?(user: User): void;
}

export interface GroupChannelListProviderProps extends Partial<GroupChannelListContextType>, UserProfileProviderProps, React.PropsWithChildren {}

export interface GroupChannelListProviderInterface extends GroupChannelListContextType, ReturnType<typeof useGroupChanelList> {
  typingChannelUrls: Array<string>;
}

export const GroupChannelListContext = React.createContext<GroupChannelListProviderInterface>({
  // Props - Default
  className: null,
  selectedChannelUrl: '',
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
  const {
    isTypingIndicatorEnabledOnChannelList = false,
    isMessageReceiptStatusEnabledOnChannelList = false,
  } = config;
  const sdk = sdkStore?.sdk;

  const channelListStore = useGroupChanelList(sdk, {
    // TODO: Apply the filter props
  });
  const {
    refreshing,
    initialized,
    groupChannels,
    refresh,
    loadMore,
  } = channelListStore;

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
