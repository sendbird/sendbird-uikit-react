import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useMemo,
} from 'react';

import type { User } from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelHandler,
  SendbirdGroupChat,
  GroupChannelListQuery as GroupChannelListQuerySb,
  GroupChannelUserIdsFilter,
} from '@sendbird/chat/groupChannel';

import { RenderUserProfileProps } from '../../../types';

import setupChannelList, {
  pubSubHandler,
  pubSubHandleRemover,
} from '../utils';
import { uuidv4 } from '../../../utils/uuid';
import { noop } from '../../../utils/utils';

import * as channelListActions from '../dux/actionTypes';

import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import channelListReducers from '../dux/reducers';
import channelListInitialState from '../dux/initialState';
import { CHANNEL_TYPE, CustomButton } from '../../CreateChannel/types';
import useActiveChannelUrl from './hooks/useActiveChannelUrl';

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

interface GroupChannelListQuery {
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
  superChannelFilter?: 'all' | 'super' | 'nonsuper';
  publicChannelFilter?: 'all' | 'public' | 'private';
  metadataOrderKeyFilter?: string;
  memberStateFilter?: 'all' | 'joined_only' | 'invited_only' | 'invited_by_friend' | 'invited_by_non_friend';
  hiddenChannelFilter?: 'unhidden_only' | 'hidden_only' | 'hidden_allow_auto_unhide' | 'hidden_prevent_auto_unhide';
  unreadChannelFilter?: 'all' | 'unread_message';
  includeFrozen?: boolean;
  userIdsFilter?: GroupChannelUserIdsFilter;
  customNewButton?: CustomButton | null
}

interface ChannelListQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
  channelListQuery?: GroupChannelListQuery;
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
  onChannelSelect?(channel: GroupChannel): void;
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
  customNewButton?: CustomButton | null
}

export interface ChannelListProviderInterface extends ChannelListProviderProps {
  initialized: boolean;
  loading: boolean;
  allChannels: GroupChannel[];
  currentChannel: GroupChannel;
  showSettings: boolean;
  channelListQuery: GroupChannelListQuery;
  currentUserId: string;
  channelListDispatcher: CustomUseReducerDispatcher;
  channelSource: GroupChannelListQuerySb;
}

interface ChannelListStoreInterface {
  initialized: boolean;
  loading: boolean;
  allChannels: GroupChannel[];
  currentChannel: GroupChannel;
  showSettings: boolean;
  channelListQuery: GroupChannelListQuery;
  currentUserId: string;
  disableAutoSelect: boolean;
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
  loading: false,
  allChannels: [],
  currentChannel: null,
  showSettings: false,
  channelListQuery: {},
  currentUserId: null,
  channelListDispatcher: null,
  channelSource: null,
  typingChannels: [],
  customNewButton: null
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
    customNewButton
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
    disableMarkAsDelivered = false,
    isTypingIndicatorEnabledOnChannelList = false,
    isMessageReceiptStatusEnabledOnChannelList = false,
  } = config;
  const sdk = sdkStore?.sdk as SendbirdGroupChat;

  // derive some variables
  // enable if it is true atleast once(both are flase by default)
  const userDefinedDisableUserProfile = disableUserProfile || config?.disableUserProfile;
  const userDefinedRenderProfile = config?.renderUserProfile;
  const enableEditProfile = allowProfileEdit || config?.allowProfileEdit;

  const userFilledChannelListQuery = queries?.channelListQuery;
  const userFilledApplicationUserListQuery = queries?.applicationUserListQuery;

  const sdkIntialized = sdkStore?.initialized;

  const [channelListStore, channelListDispatcher] = useReducer(
    channelListReducers,
    channelListInitialState,
  ) as [ChannelListStoreInterface, CustomUseReducerDispatcher];
  const { loading, currentChannel } = channelListStore;

  const [channelSource, setChannelSource] = useState<GroupChannelListQuerySb>();
  const [typingChannels, setTypingChannels] = useState<Array<GroupChannel>>([]);

  const [channelsTomarkAsRead, setChannelsToMarkAsRead] = useState([]);
  useEffect(() => {
    // https://stackoverflow.com/a/60907638
    let isMounted = true;
    if (channelsTomarkAsRead?.length > 0 && !disableMarkAsDelivered) {
      channelsTomarkAsRead?.forEach((c, idx) => {
        // Plan-based rate limits - minimum limit is 5 requests per second
        setTimeout(() => {
          if (isMounted) {
            c?.markAsDelivered();
          }
        }, 2000 * idx);
      });
    }
    return () => {
      isMounted = false;
    }
  }, [channelsTomarkAsRead]);

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
        userFilledChannelListQuery,
        logger,
        sortChannelList,
        disableAutoSelect,
        setChannelsToMarkAsRead,
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
  }, [sdkIntialized, userFilledChannelListQuery, sortChannelList]);

  useEffect(() => {
    let typingHandlerId = null;
    if (sdk?.groupChannel?.addGroupChannelHandler) {
      typingHandlerId = uuidv4();
      const handler = new GroupChannelHandler({
        onTypingStatusUpdated: (channel) => {
          const typingMemberCount = channel?.getTypingUsers()?.length
          const channelList = typingChannels.filter(ch => ch.url !== channel.url)
          if (typingMemberCount > 0) {
            setTypingChannels([...channelList, channel])
          } else {
            setTypingChannels(channelList)
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
          channelListDispatcher({
            type: channelListActions.ON_LAST_MESSAGE_UPDATED,
            payload: channel,
          });
          sdk.groupChannel.getChannelWithoutCache(channel.url)
            .then((ch) => {
              channelListDispatcher({
                type: channelListActions.ON_LAST_MESSAGE_UPDATED,
                payload: ch,
              });
            });
        },
        onMentionReceived(channel) {
          channelListDispatcher({
            type: channelListActions.ON_LAST_MESSAGE_UPDATED,
            payload: channel,
          });
          sdk.groupChannel.getChannelWithoutCache(channel.url)
            .then((ch) => {
              channelListDispatcher({
                type: channelListActions.ON_LAST_MESSAGE_UPDATED,
                payload: ch,
              });
            });
        },
      });
      sdk?.groupChannel?.addGroupChannelHandler(typingHandlerId, handler);
    }
    return () => {
      if (sdk?.groupChannel?.removeGroupChannelHandler && typingHandlerId) {
        sdk.groupChannel.removeGroupChannelHandler(typingHandlerId);
      }
    }
  }, [sdk?.currentUser?.userId]);

  const queries_ = useMemo(() => {
    return {
      applicationUserListQuery: userFilledApplicationUserListQuery,
      channelListQuery: userFilledChannelListQuery,
    };
  }, [
    userFilledApplicationUserListQuery,
    userFilledChannelListQuery,
  ])

  const { allChannels } = channelListStore;
  const sortedChannels = (sortChannelList && typeof sortChannelList === 'function')
    ? sortChannelList(allChannels)
    : allChannels;

  if (sortedChannels.length !== allChannels.length) {
    const warning = `ChannelList: You have removed/added extra channels on sortChannelList
      this could cause unexpected problems`;
    // eslint-disable-next-line no-console
    console.warn(warning, { before: allChannels, after: sortedChannels });
    logger.warning(warning, { before: allChannels, after: sortedChannels });
  }

  // Set current channel (by on_channel_selected event)
  useEffect(() => {
    if (!sdk || !sdk.groupChannel || !currentChannel || !currentChannel?.url) {
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
  useActiveChannelUrl({
    activeChannelUrl,
    channels: sortedChannels,
    sdk,
  } , {
    logger,
    channelListDispatcher,
  });

  return (
    <ChannelListContext.Provider value={{
      className,
      disableUserProfile,
      queries: queries_,
      onProfileEditSuccess,
      onThemeChange,
      onBeforeCreateChannel,
      overrideInviteUser,
      onChannelSelect,
      sortChannelList,
      loading,
      allowProfileEdit: enableEditProfile,
      channelListDispatcher,
      channelSource,
      ...channelListStore,
      allChannels: sortedChannels,
      typingChannels,
      isTypingIndicatorEnabled: (isTypingIndicatorEnabled !== null) ? isTypingIndicatorEnabled : isTypingIndicatorEnabledOnChannelList,
      isMessageReceiptStatusEnabled: (isMessageReceiptStatusEnabled !== null) ? isMessageReceiptStatusEnabled : isMessageReceiptStatusEnabledOnChannelList,
      customNewButton: customNewButton
    }}>
      <UserProfileProvider
        disableUserProfile={userDefinedDisableUserProfile}
        renderUserProfile={userDefinedRenderProfile}
        onUserProfileMessage={onUserProfileMessage}
      >
        <div className={`sendbird-channel-list ${className}`}>
          {children}
        </div>
      </UserProfileProvider>
    </ChannelListContext.Provider>
  );
};

function useChannelListContext(): ChannelListProviderInterface {
  const context: ChannelListProviderInterface = useContext(ChannelListContext);
  return context;
}

export {
  ChannelListProvider,
  useChannelListContext,
};
