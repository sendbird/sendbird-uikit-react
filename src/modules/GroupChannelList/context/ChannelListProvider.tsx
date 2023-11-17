import React, { useContext, useEffect, useMemo, useState } from 'react';

import type { User } from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelHandler,
  GroupChannelUserIdsFilter,
} from '@sendbird/chat/groupChannel';

import { RenderUserProfileProps } from '../../../types';

import { uuidv4 } from '../../../utils/uuid';
import { noop } from '../../../utils/utils';

import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CHANNEL_TYPE } from '../../CreateChannel/types';
import { useGroupChanelList } from '@sendbird/uikit-tools';

export interface ApplicationUserListQueryInternal {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

export interface GroupChannelListQueryParamsInternal {
  limit?: number;
  includeEmpty?: boolean;
  order?: 'latest_last_message' | 'chronological' | 'channel_name_alphabetical' | 'metadata_value_alphabetical';
  userIdsExactFilter?: Array<string>;
  userIdsIncludeFilter?: Array<string>;
  userIdsIncludeFilterQueryType?: 'AND' | 'OR';
  nicknameContainsFilter?: string;
  channelNameContainsFilter?: string;
  customTypesFilter?: Array<string>;
  customTypeStartsWithFilter?: string;
  channelUrlsFilter?: Array<string>;
  superChannelFilter?: 'all' | 'super' | 'nonsuper' | 'broadcast_only' | 'exclusive_only';
  publicChannelFilter?: 'all' | 'public' | 'private';
  metadataOrderKeyFilter?: string;
  memberStateFilter?: 'all' | 'joined_only' | 'invited_only' | 'invited_by_friend' | 'invited_by_non_friend';
  hiddenChannelFilter?:
    | 'all'
    | 'unhidden_only'
    | 'hidden_only'
    | 'hidden_allow_auto_unhide'
    | 'hidden_prevent_auto_unhide';
  unreadChannelFilter?: 'all' | 'unread_message';
  includeFrozen?: boolean;
  userIdsFilter?: GroupChannelUserIdsFilter;
}

interface ChannelListQueries {
  applicationUserListQuery?: ApplicationUserListQueryInternal;
  channelListQuery?: GroupChannelListQueryParamsInternal;
}

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channelType: CHANNEL_TYPE;
};

export interface ChannelListProviderProps {
  allowProfileEdit?: boolean;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  onThemeChange?(theme: string): void;
  onProfileEditSuccess?(user: User): void;
  onChannelSelect?(channel: GroupChannel | null): void;
  sortChannelList?: (channels: GroupChannel[]) => GroupChannel[];
  queries?: ChannelListQueries;
  children?: React.ReactElement;
  className?: string | string[];
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  disableUserProfile?: boolean;
  disableAutoSelect?: boolean;
  activeChannelUrl?: string;
  typingChannels?: Array<GroupChannel>;
  isTypingIndicatorEnabled?: boolean;
  isMessageReceiptStatusEnabled?: boolean;
}

export interface ChannelListProviderInterface extends ChannelListProviderProps {
  initialized: boolean;
  groupChannels: GroupChannel[];
  loadMore: () => Promise<void>;
}

const ChannelListContext = React.createContext<ChannelListProviderInterface | null>({
  disableUserProfile: true,
  allowProfileEdit: true,
  onBeforeCreateChannel: null,
  onThemeChange: null,
  onProfileEditSuccess: null,
  onChannelSelect: null,
  queries: {},
  className: null,
  initialized: false,
  groupChannels: [],
  typingChannels: [],
  loadMore: () => new Promise(noop),
});

const ChannelListProvider: React.FC<ChannelListProviderProps> = (props: ChannelListProviderProps) => {
  // destruct props
  const {
    children,
    className,
    disableUserProfile,
    allowProfileEdit,
    queries,
    onProfileEditSuccess,
    onThemeChange,
    onBeforeCreateChannel,
    sortChannelList,
    overrideInviteUser,
    activeChannelUrl,
    isTypingIndicatorEnabled = null,
    isMessageReceiptStatusEnabled = null,
  } = props;
  // disable autoselect, if activeChannelUrl is provided
  // useActiveChannelUrl should be executed when activeChannelUrl is present
  const disableAutoSelect = props?.disableAutoSelect || !!activeChannelUrl;
  const onChannelSelect = props?.onChannelSelect || noop;
  // fetch store from <SendbirdProvider />
  const globalStore = useSendbirdStateContext();
  const { config, stores } = globalStore;
  const { sdkStore } = stores;
  const { pubSub, logger, onUserProfileMessage } = config;
  const {
    markAsDeliveredScheduler,
    disableMarkAsDelivered = false,
    isTypingIndicatorEnabledOnChannelList = false,
    isMessageReceiptStatusEnabledOnChannelList = false,
  } = config;
  const sdk = sdkStore?.sdk;
  const { premiumFeatureList = [] } = sdk?.appInfo ?? {};

  // derive some variables
  // enable if it is true atleast once(both are flase by default)
  const userDefinedDisableUserProfile = disableUserProfile || config?.disableUserProfile;
  const userDefinedRenderProfile = config?.renderUserProfile;
  const enableEditProfile = allowProfileEdit || config?.allowProfileEdit;

  const userFilledChannelListQuery = queries?.channelListQuery;
  const userFilledApplicationUserListQuery = queries?.applicationUserListQuery;

  const channelListStore = useGroupChanelList(sdk, {});
  const {
    initialized,
    groupChannels,
    loadMore,
  } = channelListStore;

  // Removed: pubSub

  // Removed: setupChannelList, channelSource

  // TypingChannels
  const [typingChannels, setTypingChannels] = useState<Array<GroupChannel>>([]);
  useEffect(() => {
    let typingHandlerId = '';
    if (sdk?.groupChannel?.addGroupChannelHandler) {
      typingHandlerId = uuidv4();
      const handler = new GroupChannelHandler({
        onTypingStatusUpdated: (channel) => {
          const typingMemberCount = channel?.getTypingUsers()?.length;
          const channelList = typingChannels.filter((ch) => ch.url !== channel.url);
          if (typingMemberCount > 0) {
            setTypingChannels([...channelList, channel]);
          } else {
            setTypingChannels(channelList);
          }
        },
      });
      sdk?.groupChannel?.addGroupChannelHandler(typingHandlerId, handler);
    }
    return () => {
      if (sdk?.groupChannel?.removeGroupChannelHandler && typingHandlerId !== '') {
        sdk.groupChannel.removeGroupChannelHandler(typingHandlerId);
      }
    };
  }, [sdk?.currentUser?.userId]);

  const queries_ = useMemo(() => {
    return {
      applicationUserListQuery: userFilledApplicationUserListQuery,
      channelListQuery: userFilledChannelListQuery,
    };
  }, [userFilledApplicationUserListQuery, userFilledChannelListQuery]);

  // Sorting Channel
  const sortedChannels = sortChannelList && typeof sortChannelList === 'function' ? sortChannelList(groupChannels) : groupChannels;
  if (sortedChannels.length !== groupChannels.length) {
    const warning = `ChannelList: You have removed/added extra channels on sortChannelList
      this could cause unexpected problems`;
    // eslint-disable-next-line no-console
    console.warn(warning, { before: groupChannels, after: sortedChannels });
    logger.warning(warning, { before: groupChannels, after: sortedChannels });
  }

  // Removed: set currentChannel, onChannelSelect

  // Removed: useActiveChannelUrl

  // Removed: useFetchChannelList

  return (
    <ChannelListContext.Provider
      value={{
        className,
        activeChannelUrl,
        disableUserProfile,
        queries: queries_,
        onProfileEditSuccess,
        onThemeChange,
        onBeforeCreateChannel,
        overrideInviteUser,
        onChannelSelect,
        sortChannelList,
        allowProfileEdit: enableEditProfile,
        initialized,
        groupChannels: sortedChannels,
        loadMore,
        typingChannels,
        isTypingIndicatorEnabled:
          isTypingIndicatorEnabled !== null ? isTypingIndicatorEnabled : isTypingIndicatorEnabledOnChannelList,
        isMessageReceiptStatusEnabled:
          isMessageReceiptStatusEnabled !== null
            ? isMessageReceiptStatusEnabled
            : isMessageReceiptStatusEnabledOnChannelList,
      }}
    >
      <UserProfileProvider
        disableUserProfile={userDefinedDisableUserProfile ?? config?.disableUserProfile}
        renderUserProfile={userDefinedRenderProfile}
        onUserProfileMessage={onUserProfileMessage}
      >
        <div className={`sendbird-channel-list ${className}`}>{children}</div>
      </UserProfileProvider>
    </ChannelListContext.Provider>
  );
};

function useChannelListContext(): ChannelListProviderInterface {
  const context: ChannelListProviderInterface = useContext(ChannelListContext);
  return context;
}

export { ChannelListProvider, useChannelListContext };
