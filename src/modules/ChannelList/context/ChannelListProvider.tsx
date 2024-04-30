import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react';

import type { User } from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelHandler,
  GroupChannelListOrder,
  GroupChannelListQuery as GroupChannelListQuerySb,
  GroupChannelUserIdsFilter,
  HiddenChannelFilter,
  MyMemberStateFilter,
  PublicChannelFilter,
  QueryType,
  SuperChannelFilter,
  UnreadChannelFilter,
} from '@sendbird/chat/groupChannel';

import { RenderUserProfileProps } from '../../../types';

import setupChannelList, { pubSubHandler, pubSubHandleRemover } from '../utils';
import { uuidv4 } from '../../../utils/uuid';
import { noop } from '../../../utils/utils';
import { DELIVERY_RECEIPT } from '../../../utils/consts';

import * as channelListActions from '../dux/actionTypes';
import { ChannelListActionTypes } from '../dux/actionTypes';

import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import channelListReducers from '../dux/reducers';
import channelListInitialState from '../dux/initialState';
import { CHANNEL_TYPE } from '../../CreateChannel/types';
import useActiveChannelUrl from './hooks/useActiveChannelUrl';
import { useFetchChannelList } from './hooks/useFetchChannelList';
import useHandleReconnectForChannelList from '../../Channel/context/hooks/useHandleReconnectForChannelList';

export interface ApplicationUserListQueryInternal {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

export interface GroupChannelListQueryParamsInternal {
  limit?: number;
  includeEmpty?: boolean;
  order?: GroupChannelListOrder;
  userIdsExactFilter?: Array<string>;
  userIdsIncludeFilter?: Array<string>;
  userIdsIncludeFilterQueryType?: QueryType;
  nicknameContainsFilter?: string;
  channelNameContainsFilter?: string;
  customTypesFilter?: Array<string>;
  customTypeStartsWithFilter?: string;
  channelUrlsFilter?: Array<string>;
  superChannelFilter?: SuperChannelFilter;
  publicChannelFilter?: PublicChannelFilter;
  metadataOrderKeyFilter?: string;
  memberStateFilter?: MyMemberStateFilter;
  hiddenChannelFilter?: HiddenChannelFilter;
  unreadChannelFilter?: UnreadChannelFilter;
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
  reconnectOnIdle?: boolean;
}

export interface ChannelListProviderInterface extends ChannelListProviderProps {
  initialized: boolean;
  loading: boolean;
  allChannels: GroupChannel[];
  currentChannel: GroupChannel;
  channelListQuery: GroupChannelListQueryParamsInternal;
  currentUserId: string;
  channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
  channelSource: GroupChannelListQuerySb | null;
  fetchChannelList: () => void;
}

const ChannelListContext = React.createContext<ChannelListProviderInterface>({
  disableUserProfile: true,
  allowProfileEdit: true,
  onBeforeCreateChannel: null,
  onThemeChange: null,
  onProfileEditSuccess: null,
  onChannelSelect: null,
  queries: {},
  className: null,
  initialized: false,
  loading: false,
  allChannels: [],
  currentChannel: null,
  channelListQuery: {},
  currentUserId: null,
  channelListDispatcher: null,
  channelSource: null,
  typingChannels: [],
  fetchChannelList: noop,
  reconnectOnIdle: true,
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
    reconnectOnIdle,
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
    isOnline,
  } = config;
  const sdk = sdkStore?.sdk;
  const { premiumFeatureList = [] } = sdk?.appInfo ?? {};

  // derive some variables
  // enable if it is true at least once(both are false by default)
  const userDefinedDisableUserProfile = disableUserProfile ?? !config.common.enableUsingDefaultUserProfile;
  const userDefinedRenderProfile = config?.renderUserProfile;
  const enableEditProfile = allowProfileEdit || config?.allowProfileEdit;

  const userFilledChannelListQuery = queries?.channelListQuery;
  const userFilledApplicationUserListQuery = queries?.applicationUserListQuery;

  const sdkIntialized = sdkStore?.initialized;

  const [channelListStore, channelListDispatcher] = useReducer(channelListReducers, channelListInitialState);
  const { currentChannel } = channelListStore;

  const [channelSource, setChannelSource] = useState<GroupChannelListQuerySb | null>(null);
  const [typingChannels, setTypingChannels] = useState<Array<GroupChannel>>([]);

  useEffect(() => {
    const subscriber = pubSubHandler(pubSub, channelListDispatcher);
    return () => {
      pubSubHandleRemover(subscriber);
    };
  }, [sdkIntialized]);

  useEffect(() => {
    const sdkChannelHandlerId = uuidv4();
    if (sdkIntialized) {
      logger.info('ChannelList: Setup channelHandlers');
      setupChannelList({
        sdk,
        sdkChannelHandlerId,
        channelListDispatcher,
        setChannelSource,
        onChannelSelect,
        userFilledChannelListQuery: { ...userFilledChannelListQuery },
        logger,
        sortChannelList,
        disableAutoSelect,
        markAsDeliveredScheduler,
        disableMarkAsDelivered,
      });
    } else {
      logger.info('ChannelList: Removing channelHandlers');
      // remove previous channelHandlers
      if (sdk?.groupChannel?.removeGroupChannelHandler) {
        sdk.groupChannel.removeGroupChannelHandler(sdkChannelHandlerId);
      }
      // remove channelSource
      setChannelSource(null);
      // cleanup
      channelListDispatcher({
        type: channelListActions.RESET_CHANNEL_LIST,
        payload: null,
      });
    }
    return () => {
      logger.info('ChannelList: Removing channelHandlers');
      if (sdk?.groupChannel?.removeGroupChannelHandler) {
        sdk?.groupChannel?.removeGroupChannelHandler(sdkChannelHandlerId);
      }
    };
  }, [
    sdkIntialized,
    sortChannelList,
    Object.entries(userFilledChannelListQuery ?? {}).map(([key, value]) => key + value).join(),
  ]);

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
        onUnreadMemberStatusUpdated(channel) {
          channelListDispatcher({
            type: channelListActions.ON_LAST_MESSAGE_UPDATED,
            payload: channel,
          });
        },
        onUndeliveredMemberStatusUpdated(channel) {
          channelListDispatcher({
            type: channelListActions.ON_LAST_MESSAGE_UPDATED,
            payload: channel,
          });
        },
        onMessageUpdated(channel) {
          if (channel.isGroupChannel()) {
            channelListDispatcher({
              type: channelListActions.ON_LAST_MESSAGE_UPDATED,
              payload: channel,
            });
            sdk.groupChannel.getChannelWithoutCache(channel.url).then((ch) => {
              channelListDispatcher({
                type: channelListActions.ON_LAST_MESSAGE_UPDATED,
                payload: ch,
              });
            });
          }
        },
        onMentionReceived(channel) {
          if (channel.isGroupChannel()) {
            channelListDispatcher({
              type: channelListActions.ON_LAST_MESSAGE_UPDATED,
              payload: channel,
            });
            sdk.groupChannel.getChannelWithoutCache(channel.url).then((ch) => {
              channelListDispatcher({
                type: channelListActions.ON_LAST_MESSAGE_UPDATED,
                payload: ch,
              });
            });
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

  const { allChannels } = channelListStore;
  const sortedChannels = sortChannelList && typeof sortChannelList === 'function' ? sortChannelList(allChannels) : allChannels;

  if (sortedChannels.length !== allChannels.length) {
    const warning = `ChannelList: You have removed/added extra channels on sortChannelList
      this could cause unexpected problems`;
    // eslint-disable-next-line no-console
    console.warn(warning, { before: allChannels, after: sortedChannels });
    logger.warning(warning, { before: allChannels, after: sortedChannels });
  }

  // Set current channel (by on_channel_selected event)
  useEffect(() => {
    if (!sdk || !sdk.groupChannel) {
      return;
    }

    // When leaving a channel, tell consumers that the prior channel is no longer selected
    if (!currentChannel?.url) {
      onChannelSelect(null);
      return;
    }
    sdk.groupChannel.getChannel(currentChannel.url).then((groupChannel) => {
      if (groupChannel) {
        onChannelSelect(groupChannel);
      } else {
        onChannelSelect(null);
      }
    });
  }, [currentChannel?.url]);

  // Set active channel (by url)
  useActiveChannelUrl(
    {
      activeChannelUrl,
      channels: sortedChannels,
      sdk,
    },
    {
      logger,
      channelListDispatcher,
    },
  );

  useHandleReconnectForChannelList({
    isOnline,
    reconnectOnIdle,
    logger,
    sdk,
    currentGroupChannel: currentChannel,
    channelListDispatcher,
    setChannelSource,
    userFilledChannelListQuery,
    sortChannelList,
    disableAutoSelect,
    markAsDeliveredScheduler,
    disableMarkAsDelivered,
  });

  const fetchChannelList = useFetchChannelList(
    {
      channelSource,
      disableMarkAsDelivered:
        disableMarkAsDelivered || !premiumFeatureList.some((feature) => feature === DELIVERY_RECEIPT),
    },
    {
      channelListDispatcher,
      logger,
      markAsDeliveredScheduler,
    },
  );

  return (
    <ChannelListContext.Provider
      value={{
        className,
        disableUserProfile,
        queries: queries_,
        onProfileEditSuccess,
        onThemeChange,
        onBeforeCreateChannel,
        overrideInviteUser,
        onChannelSelect,
        sortChannelList,
        allowProfileEdit: enableEditProfile,
        channelListDispatcher,
        channelSource,
        ...channelListStore,
        allChannels: sortedChannels,
        typingChannels,
        isTypingIndicatorEnabled: isTypingIndicatorEnabled ?? config.groupChannelList.enableTypingIndicator,
        isMessageReceiptStatusEnabled: isMessageReceiptStatusEnabled ?? config.groupChannelList.enableMessageReceiptStatus,
        fetchChannelList,
      }}
    >
      <UserProfileProvider
        disableUserProfile={userDefinedDisableUserProfile ?? !config.common.enableUsingDefaultUserProfile}
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
