import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';

import withSendbirdContext from '../../lib/SendbirdSdkContext';
import * as userActions from '../../lib/dux/user/actionTypes';
import { UserProfileProvider } from '../../lib/UserProfileContext';

import * as channelListActions from './dux/actionTypes';
import channelListInitialState from './dux/initialState';
import channelListReducers from './dux/reducers';

import ChannelPreview from '../../ui/ChannelPreview';
import ChannelHeader from '../../ui/ChannelHeader';
import EditUserProfile from '../../ui/EditUserProfile';
import PlaceholderTypes from '../../ui/PlaceHolder/type';

import AddChannel from './components/AddChannel';
import ChannelPreviewAction from './components/ChannelPreviewAction';
import PlaceHolder from './components/Placeholder';

import setupChannelList, {
  pubSubHandler,
  pubSubHandleRemover,
} from './utils';
import { uuidv4 } from '../../utils/uuid';

import './index.scss';

const noop = () => { };
const DELIVERY_RECIPT = 'delivery_receipt';

function ChannelList(props) {
  const {
    stores: { sdkStore = {}, userStore = {} },
    config: {
      userId,
      isOnline,
      userListQuery,
      logger,
      pubSub,
      theme,
    },
    dispatchers: {
      userDispatcher,
    },
    queries = {},
    renderChannelPreview,
    renderHeader,
    renderUserProfile,
    disableUserProfile,
    allowProfileEdit,
    sortChannelList,
    onProfileEditSuccess,
    onThemeChange,
    onBeforeCreateChannel,
    onChannelSelect,
    disableAutoSelect,
  } = props;
  const { config = {} } = props;
  // enable if it is true atleast once(both are flase by default)
  const enableEditProfile = allowProfileEdit || config.allowProfileEdit;
  const userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  const userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;
  const { sdk = {} } = sdkStore;
  const userFilledChannelListQuery = queries.channelListQuery;
  const userFilledApplicationUserListQuery = queries.applicationUserListQuery;

  const sdkError = sdkStore.error;
  const sdkIntialized = sdkStore.initialized;

  const [channelListStore, channelListDispatcher] = useReducer(
    channelListReducers,
    channelListInitialState,
  );
  const [user, setUser] = useState({});
  const [channelSource, setChannelSource] = useState({});
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [sdkChannelHandlerId, setSdkChannelHandlerId] = useState(null);

  const { loading, currentChannel } = channelListStore;

  useEffect(() => {
    setUser(userStore.user);
  }, [userStore.user]);

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
      if (sdk && sdk.removeChannelHandler) {
        sdk.removeChannelHandler(sdkChannelHandlerId);
      }
      // remove channelSource
      setChannelSource({});
      // cleanup
      channelListDispatcher({
        type: channelListActions.RESET_CHANNEL_LIST,
      });
    }
    return () => {
      logger.info('ChannelList: Removing channelHandlers');
      if (sdk && sdk.removeChannelHandler) {
        sdk.removeChannelHandler(sdkChannelHandlerId);
      }
    };
  }, [sdkIntialized, userFilledChannelListQuery, sortChannelList]);

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
    channelListDispatcher({
      type: channelListActions.SET_AUTO_SELECT_CHANNEL_ITEM,
      payload: disableAutoSelect,
    });
  }, [disableAutoSelect]);

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
    <UserProfileProvider
      className="sendbird-channel-list"
      disableUserProfile={userDefinedDisableUserProfile}
      renderUserProfile={userDefinedRenderProfile}
    >
      <div className="sendbird-channel-list__header">
        <ChannelHeader
          renderHeader={renderHeader}
          user={user}
          onEdit={() => {
            if (enableEditProfile) {
              setShowProfileEdit(true);
            }
          }}
          allowProfileEdit={enableEditProfile}
          iconButton={(
            <AddChannel
              disabled={!isOnline}
              userListQuery={userListQuery}
              sdk={sdk}
              channelListDispatcher={channelListDispatcher}
              userId={userId}
              userFilledApplicationUserListQuery={userFilledApplicationUserListQuery}
              onBeforeCreateChannel={onBeforeCreateChannel}
            />
          )}
        />
      </div>
      {
        showProfileEdit && (
          <EditUserProfile
            onThemeChange={onThemeChange}
            user={user}
            onCancel={() => { setShowProfileEdit(false); }}
            onSubmit={(newName, newFile) => {
              sdk.updateCurrentUserInfoWithProfileImage(newName, newFile, (updatedUser) => {
                userDispatcher({ type: userActions.UPDATE_USER_INFO, payload: updatedUser });
                if (onProfileEditSuccess && typeof onProfileEditSuccess === 'function') {
                  onProfileEditSuccess(updatedUser);
                }
              });
            }}
          />
        )
      }
      <div
        className="sendbird-channel-list__body"
        onScroll={(e) => {
          const fetchMore = e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight;
          if (fetchMore && channelSource.hasNext) {
            logger.info('ChannelList: Fetching more channels');
            channelListDispatcher({
              type: channelListActions.FETCH_CHANNELS_START,
            });
            channelSource.next((response, error) => {
              const swapParams = sdk.getErrorFirstCallback();
              let channelList = response;
              let err = error;
              if (swapParams) {
                channelList = error;
                err = response;
              }
              if (err) {
                logger.info('ChannelList: Fetching channels failed', err);
                channelListDispatcher({
                  type: channelListActions.FETCH_CHANNELS_FAILURE,
                  payload: channelList,
                });
                return;
              }
              logger.info('ChannelList: Fetching channels successful', channelList);
              channelListDispatcher({
                type: channelListActions.FETCH_CHANNELS_SUCCESS,
                payload: channelList,
              });

              const canSetMarkAsDelivered = sdk?.appInfo?.premiumFeatureList
                ?.find((feature) => (feature === DELIVERY_RECIPT));

              if (canSetMarkAsDelivered) {
                logger.info('ChannelList: Marking all channels as read');
                // eslint-disable-next-line no-unused-expressions
                channelList?.forEach((channel, idx) => {
                  // Plan-based rate limits - minimum limit is 5 requests per second
                  setTimeout(() => {
                    // eslint-disable-next-line no-unused-expressions
                    channel?.markAsDelivered();
                  }, 500 * idx);
                });
              }
            });
          }
        }}
      >
        {
          (sdkError) && (
            <PlaceHolder type={PlaceholderTypes.WRONG} />
          )
        }
        {/*
          To do: Implement windowing
          Implement windowing if you are dealing with large number of messages/channels
          https://github.com/bvaughn/react-window -> recommendation
          We hesitate to bring one more dependency to our library,
          we are planning to implement it inside the library
        */}
        <div>
          {
            sortedChannels && sortedChannels.map((channel, idx) => {
              const onLeaveChannel = (c, cb) => {
                logger.info('ChannelList: Leaving channel', c);
                c.leave()
                  .then((res) => {
                    logger.info('ChannelList: Leaving channel success', res);
                    if (cb && typeof cb === 'function') {
                      cb(res, null);
                    }
                    channelListDispatcher({
                      type: channelListActions.LEAVE_CHANNEL_SUCCESS,
                      payload: channel.url,
                    });
                  })
                  .catch((err) => {
                    logger.error('ChannelList: Leaving channel failed', err);
                    if (cb && typeof cb === 'function') {
                      cb(null, err);
                    }
                  });
              };

              const onClick = () => {
                if (!isOnline) { return; }
                logger.info('ChannelList: Clicked on channel:', channel);
                channelListDispatcher({
                  type: channelListActions.SET_CURRENT_CHANNEL,
                  payload: channel.url,
                });
              };

              return (
                (renderChannelPreview)
                  ? (
                    // eslint-disable-next-line
                    <div key={channel.url} onClick={onClick}>
                      {renderChannelPreview({ channel, onLeaveChannel })}
                    </div>
                  )
                  : (
                    <ChannelPreview
                      key={channel.url}
                      tabIndex={idx}
                      onClick={onClick}
                      channel={channel}
                      currentUser={user}
                      theme={theme}
                      isActive={channel.url === currentChannel}
                      // todo - potential performance hit refactor
                      ChannelAction={(
                        <ChannelPreviewAction
                          disabled={!isOnline}
                          onLeaveChannel={() => onLeaveChannel(channel)}
                        />
                      )}
                    />
                  )
              );
            })
          }
        </div>
        {
          (!sdkIntialized || loading) && (
            <PlaceHolder type={PlaceholderTypes.LOADING} />
          )
        }
        {
          //  placeholder
          (!allChannels || allChannels.length === 0) && (
            <PlaceHolder type={PlaceholderTypes.NO_CHANNELS} />
          )
        }
      </div>
    </UserProfileProvider>
  );
}

ChannelList.propTypes = {
  stores: PropTypes.shape({
    sdkStore: PropTypes.shape({
      initialized: PropTypes.bool,
    }),
    userStore: PropTypes.shape({
      user: PropTypes.shape({}),
    }),
  }).isRequired,
  dispatchers: PropTypes.shape({
    userDispatcher: PropTypes.func,
  }).isRequired,
  config: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userListQuery: PropTypes.func,
    theme: PropTypes.string,
    isOnline: PropTypes.bool,
    logger: PropTypes.shape({
      info: PropTypes.func,
      error: PropTypes.func,
      warning: PropTypes.func,
    }),
    pubSub: PropTypes.shape({
      subscribe: PropTypes.func,
      publish: PropTypes.func,
    }),
  }).isRequired,
  queries: PropTypes.shape({
    channelListQuery: PropTypes.shape({
      channelNameContainsFilter: PropTypes.string,
      channelUrlsFilter: PropTypes.arrayOf(PropTypes.string),
      customTypesFilter: PropTypes.arrayOf(PropTypes.string),
      customTypeStartsWithFilter: PropTypes.string,
      hiddenChannelFilter: PropTypes.string,
      includeEmpty: PropTypes.bool,
      limit: PropTypes.number,
      memberStateFilter: PropTypes.string,
      metadataOrderKeyFilter: PropTypes.string,
      nicknameContainsFilter: PropTypes.string,
      order: PropTypes.string,
      publicChannelFilter: PropTypes.string,
      superChannelFilter: PropTypes.string,
      unreadChannelFilter: PropTypes.string,
      userIdsExactFilter: PropTypes.arrayOf(PropTypes.string),
      userIdsIncludeFilter: PropTypes.arrayOf(PropTypes.string),
      userIdsIncludeFilterQueryType: PropTypes.string,
    }),
    applicationUserListQuery: PropTypes.shape({
      limit: PropTypes.number,
      userIdsFilter: PropTypes.arrayOf(PropTypes.string),
      metaDataKeyFilter: PropTypes.string,
      metaDataValuesFilter: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  onBeforeCreateChannel: PropTypes.func,
  renderChannelPreview: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  disableUserProfile: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  allowProfileEdit: PropTypes.bool,
  sortChannelList: PropTypes.func,
  onThemeChange: PropTypes.func,
  onProfileEditSuccess: PropTypes.func,
  renderHeader: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  onChannelSelect: PropTypes.func,
  disableAutoSelect: PropTypes.bool,
};

ChannelList.defaultProps = {
  onBeforeCreateChannel: null,
  renderChannelPreview: null,
  renderHeader: null,
  disableUserProfile: false,
  renderUserProfile: null,
  allowProfileEdit: false,
  onThemeChange: null,
  sortChannelList: null,
  onProfileEditSuccess: null,
  queries: {},
  onChannelSelect: noop,
  disableAutoSelect: false,
};

export default withSendbirdContext(ChannelList);
