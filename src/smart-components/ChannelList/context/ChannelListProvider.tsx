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
  GroupChannelListQuery as GroupChannelListQuerySb
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
import { GroupChannelListQueryStatic } from 'sendbird';

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
}

interface ChannelListQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
  channelListQuery?: GroupChannelListQuery;
}

export interface ChannelListProviderProps {
  allowProfileEdit?: boolean;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  onThemeChange?(theme: string): void;
  onProfileEditSuccess?(user: User): void;
  onChannelSelect?(channel: GroupChannel): void;
  sortChannelList?: (channels: GroupChannel[]) => GroupChannel[];
  queries?: ChannelListQueries;
  children?: React.ReactNode;
  className?: string | string[];
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
  disableAutoSelect?: boolean;
  typingChannels?: Array<GroupChannel>;
  isTypingIndicatorEnabled?: boolean;
  isMessageReceiptStatusEnabled?: boolean;
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
    disableAutoSelect,
    isTypingIndicatorEnabled = null,
    isMessageReceiptStatusEnabled = null,
  } = props;
  const onChannelSelect = props?.onChannelSelect || noop;
  // fetch store from <SendbirdProvider />
  const globalStore = useSendbirdStateContext();
  const { config, stores } = globalStore;
  const { sdkStore } = stores;
  const { pubSub, logger } = config;
  const {
    isTypingIndicatorEnabledOnChannelList,
    isMessageReceiptStatusEnabledOnChannelList,
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
  const [sdkChannelHandlerId, setSdkChannelHandlerId] = useState<string | null>(null);
  const [typingHandlerId, setTypingHandlerId] = useState<string | null>(null);
  const [typingChannels, setTypingChannels] = useState<Array<GroupChannel>>([]);

  useEffect(() => {
    const subscriber = pubSubHandler(pubSub, channelListDispatcher);
    return () => {
      pubSubHandleRemover(subscriber);
    };
  }, [sdkIntialized]);

  useEffect(() => {
    setSdkChannelHandlerId(uuidv4);
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
    if (sdk?.groupChannel?.addGroupChannelHandler) {
      const handlerId = uuidv4()
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
      });
      sdk?.groupChannel?.addGroupChannelHandler(handlerId, handler)
      setTypingHandlerId(handlerId)
    }
    return () => {
      if (sdk?.groupChannel?.removeGroupChannelHandler) {
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

  return (
    <ChannelListContext.Provider value={{
      className,
      disableUserProfile,
      queries: queries_,
      onProfileEditSuccess,
      onThemeChange,
      onBeforeCreateChannel,
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
    }}>
      <UserProfileProvider
        disableUserProfile={userDefinedDisableUserProfile}
        renderUserProfile={userDefinedRenderProfile}
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

const useChannelList = useChannelListContext;

export {
  ChannelListProvider,
  // ChannelListContext,
  // todo: rename all use{component}Context to use{component}
  useChannelListContext,
  useChannelList,
};
