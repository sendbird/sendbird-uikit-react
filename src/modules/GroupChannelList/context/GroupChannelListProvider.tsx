import React, { useEffect, useMemo, useRef } from 'react';

import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams, GroupChannelFilterParams } from '@sendbird/chat/groupChannel';
import { GroupChannelCollectionParams, GroupChannelFilter } from '@sendbird/chat/groupChannel';
import { useGroupChannelList as useGroupChannelListDataSource, useGroupChannelHandler } from '@sendbird/uikit-tools';

import type { CHANNEL_TYPE } from '../../CreateChannel/types';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { useMarkAsDeliveredScheduler } from '../../../lib/hooks/useMarkAsDeliveredScheduler';
import useOnlineStatus from '../../../lib/hooks/useOnlineStatus';
import type { SdkStore } from '../../../lib/Sendbird/types';
import { PartialRequired } from '../../../utils/typeHelpers/partialRequired';
import { createStore } from '../../../utils/storeManager';
import { useStore } from '../../../hooks/useStore';
import { deleteNullish, noop } from '../../../utils/utils';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import useGroupChannelList from './useGroupChannelList';
import useDeepCompareEffect from '../../../hooks/useDeepCompareEffect';

type OnCreateChannelClickParams = { users: Array<string>; onClose: () => void; channelType: CHANNEL_TYPE };
type ChannelListDataSource = ReturnType<typeof useGroupChannelListDataSource>;
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
  scrollRef: React.RefObject<HTMLDivElement>;
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
  onChannelSelect: () => {},
  onChannelCreated: () => {},
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
  scrollRef: { current: null },
};

/**
 * @returns {ReturnType<typeof createStore<GroupChannelListState>>}
 */
export const useGroupChannelListStore = () => {
  return useStore(GroupChannelListContext, state => state, initialState);
};

export const GroupChannelListManager: React.FC<GroupChannelListProviderProps> = ({
  className = '',
  selectedChannelUrl = '',

  disableAutoSelect = false,

  channelListQueryParams,
  onThemeChange,
  onChannelSelect,
  onChannelCreated,
  onCreateChannelClick,
  onBeforeCreateChannel,
  onUserProfileUpdated,
  ...props
}: GroupChannelListProviderProps) => {
  const { state: sendbirdState } = useSendbird();
  const { config, stores } = sendbirdState;
  const { state, actions } = useGroupChannelList();
  const { updateState } = useGroupChannelListStore();
  const { sdkStore } = stores;

  const sdk = sdkStore.sdk;
  const isConnected = useOnlineStatus(sdk, config.logger);
  const scheduler = useMarkAsDeliveredScheduler({ isConnected }, config);

  const scrollRef = useRef(null);

  const channelListDataSource = useGroupChannelListDataSource(sdk, {
    collectionCreator: getCollectionCreator(sdk, channelListQueryParams),
    markAsDelivered: (channels) => channels.forEach(scheduler.push),
    onChannelsDeleted: (channelUrls) => {
      channelUrls.forEach((url) => {
        if (url === selectedChannelUrl) onChannelSelect(null);
      });
    },
    onChannelsUpdated: () => {
      actions.setGroupChannels(groupChannels);
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
    refresh?.();
  }, [
    Object.keys(channelListQueryParams ?? {}).sort()
      .map((key: string) => `${key}=${encodeURIComponent(JSON.stringify(channelListQueryParams[key]))}`)
      .join('&'),
  ]);

  const { typingChannelUrls } = state;

  useGroupChannelHandler(sdk, {
    onTypingStatusUpdated: (channel) => {
      const channelList = typingChannelUrls.filter((channelUrl) => channelUrl !== channel.url);
      if (channel.getTypingUsers()?.length > 0) {
        updateState({
          typingChannelUrls: (channelList.concat(channel.url)),
        });
      } else {
        updateState({
          typingChannelUrls: (channelList),
        });
      }
    },
  });

  const allowProfileEdit = props.allowProfileEdit ?? config.allowProfileEdit ?? true;
  const isTypingIndicatorEnabled = props.isTypingIndicatorEnabled ?? config.groupChannelList.enableTypingIndicator ?? false;
  const isMessageReceiptStatusEnabled = props.isMessageReceiptStatusEnabled ?? config.groupChannelList.enableMessageReceiptStatus ?? false;

  const eventHandlers = useMemo(() => ({
    onChannelSelect,
    onChannelCreated,
    onThemeChange,
    onCreateChannelClick,
    onBeforeCreateChannel,
    onUserProfileUpdated,
  }), [
    onChannelSelect,
    onChannelCreated,
    onThemeChange,
    onCreateChannelClick,
    onBeforeCreateChannel,
    onUserProfileUpdated,
  ]);
  const configurations = useMemo(() => ({
    className,
    selectedChannelUrl,
    disableAutoSelect,
    allowProfileEdit,
    isTypingIndicatorEnabled,
    isMessageReceiptStatusEnabled,
    typingChannelUrls,
    refreshing,
    initialized,
    refresh,
    loadMore,
  }), [
    className,
    selectedChannelUrl,
    disableAutoSelect,
    allowProfileEdit,
    isTypingIndicatorEnabled,
    isMessageReceiptStatusEnabled,
    typingChannelUrls,
    refreshing,
    initialized,
    scrollRef,
  ]);
  useDeepCompareEffect(() => {
    updateState({
      ...eventHandlers,
      ...configurations,
      groupChannels,
    });
  }, [
    configurations,
    eventHandlers,
    groupChannels.map(groupChannel => groupChannel.serialize()),
  ]);

  return null;
};

const createGroupChannelListStore = (props?: Partial<GroupChannelListState>) => createStore({
  ...initialState,
  ...props,
});

const InternalGroupChannelListProvider = (props: GroupChannelListProviderProps) => {
  const { children } = props;

  const defaultProps: Partial<GroupChannelListState> = deleteNullish({
    onChannelSelect: props?.onChannelSelect,
    onChannelCreated: props?.onChannelCreated,
    className: props?.className,
    selectedChannelUrl: props?.selectedChannelUrl,
    allowProfileEdit: props?.allowProfileEdit,
    disableAutoSelect: props?.disableAutoSelect,
    isTypingIndicatorEnabled: props?.isTypingIndicatorEnabled,
    isMessageReceiptStatusEnabled: props?.isMessageReceiptStatusEnabled,
    channelListQueryParams: props?.channelListQueryParams,
    onThemeChange: props?.onThemeChange,
    onCreateChannelClick: props?.onCreateChannelClick,
    onBeforeCreateChannel: props?.onBeforeCreateChannel,
    onUserProfileUpdated: props?.onUserProfileUpdated,
  });

  const storeRef = useRef(createGroupChannelListStore(defaultProps));

  return (
    <GroupChannelListContext.Provider value={storeRef.current}>
      {children}
    </GroupChannelListContext.Provider>
  );
};

export const GroupChannelListProvider = (props: GroupChannelListProviderProps) => {
  const { children, className } = props;

  return (
    <InternalGroupChannelListProvider {...props} >
      <GroupChannelListManager {...props} />
      <UserProfileProvider {...props}>
        <div className={`sendbird-channel-list ${className}`}>{children}</div>
      </UserProfileProvider>
    </InternalGroupChannelListProvider>
  );
};

// Keep this function for backward compatibility.
export const useGroupChannelListContext = () => {
  const { state, actions } = useGroupChannelList();
  return { ...state, ...actions };
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
