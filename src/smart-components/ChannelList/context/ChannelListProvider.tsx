import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import Sendbird from 'sendbird';

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
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  onThemeChange?(theme: string): void;
  onProfileEditSuccess?(user: Sendbird.User): void;
  onChannelSelect?(channel: Sendbird.GroupChannel): void;
  sortChannelList?: (channels: Sendbird.GroupChannel[]) => Sendbird.GroupChannel[];
  queries?: ChannelListQueries;
  children?: React.ReactNode;
  className?: string | string[];
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
}

export interface ChannelListProviderInterface extends ChannelListProviderProps {
  initialized: boolean;
  loading: boolean;
  allChannels: Sendbird.GroupChannel[];
  currentChannel: string;
  showSettings: boolean;
  channelListQuery: GroupChannelListQuery;
  currentUserId: string;
  channelListDispatcher: CustomUseReducerDispatcher;
  channelSource: Sendbird.GroupChannelListQuery;
}

interface ChannelListStoreInterface {
  initialized: boolean;
  loading: boolean;
  allChannels: Sendbird.GroupChannel[];
  currentChannel: string;
  showSettings: boolean;
  channelListQuery: GroupChannelListQuery;
  currentUserId: string;
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
  } = props;
  const onChannelSelect = props?.onChannelSelect || noop;

  // fetch store from <SendbirdProvider />
  const globalStore = useSendbirdStateContext();
  const { config, stores } = globalStore;
  const { sdkStore } = stores;
  const { pubSub, logger } = config;
  const { sdk } = sdkStore;

  // derive some variables
  // enable if it is true atleast once(both are flase by default)
  const userDefinedDisableUserProfile = disableUserProfile || config?.disableUserProfile;
  const userDefinedRenderProfile = config?.renderUserProfile;
  const enableEditProfile = allowProfileEdit || config?.allowProfileEdit;

  const userFilledChannelListQuery = queries?.channelListQuery;
  const userFilledApplicationUserListQuery = queries?.applicationUserListQuery;

  const sdkIntialized = sdkStore?.initialized;

  const [ channelListStore, channelListDispatcher ] = useReducer(
    channelListReducers,
    channelListInitialState,
  ) as [ChannelListStoreInterface, CustomUseReducerDispatcher];

  const [channelSource, setChannelSource] = useState<Sendbird.GroupChannelListQuery | null>();
  const [sdkChannelHandlerId, setSdkChannelHandlerId] = useState<string | null>(null);

  const { loading, currentChannel } = channelListStore;

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
      });
    } else {
      logger.info('ChannelList: Removing channelHandlers');
      // remove previous channelHandlers
      if (sdk && sdk?.removeChannelHandler) {
        sdk.removeChannelHandler(sdkChannelHandlerId);
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
      if (sdk && sdk.removeChannelHandler) {
        sdk.removeChannelHandler(sdkChannelHandlerId);
      }
    };
  }, [sdkIntialized, userFilledChannelListQuery, sortChannelList]);

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
    if (!sdk || !sdk.GroupChannel || !currentChannel) { return; }
    sdk.GroupChannel.getChannel(currentChannel, (groupChannel) => {
      if (groupChannel) {
        onChannelSelect(groupChannel);
      } else {
        onChannelSelect(null);
      }
    });
  }, [currentChannel]);

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

function useChannelListContext (): ChannelListProviderInterface {
  const context: ChannelListProviderInterface = useContext(ChannelListContext);
  return context;
}

export {
  ChannelListProvider,
  ChannelListContext,
  useChannelListContext,
};
