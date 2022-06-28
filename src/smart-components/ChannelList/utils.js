import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import * as channelActions from './dux/actionTypes';
import * as topics from '../../lib/pubSub/topics';

const DELIVERY_RECIPT = 'delivery_receipt';

const createEventHandler = ({
  sdk,
  sdkChannelHandlerId,
  channelListDispatcher,
  logger,
}) => {
  const ChannelHandler = new GroupChannelHandler({
    onChannelChanged: (channel) => {
      logger.info('ChannelList: onChannelChanged', channel);
      channelListDispatcher({
        type: channelActions.ON_CHANNEL_CHANGED,
        payload: channel,
      });
    },
    onChannelDeleted: (channelUrl) => {
      logger.info('ChannelList: onChannelDeleted', channelUrl);
      channelListDispatcher({
        type: channelActions.ON_CHANNEL_DELETED,
        payload: channelUrl,
      });
    },
    onUserJoined: (channel) => {
      logger.info('ChannelList: onUserJoined', channel);
      if (channel.lastMessage) {
        channelListDispatcher({
          type: channelActions.ON_USER_JOINED,
          payload: channel,
        });
      }
    },
    onUserBanned: (channel, user) => {
      const { currentUser } = sdk;
      logger.info('Channel | useHandleChannelEvents: onUserBanned', channel);
      if (user.userId === currentUser.userId) {
        channelListDispatcher({
          type: channelActions.ON_USER_LEFT,
          payload: {
            channel,
            isMe: true,
          },
        });
      } else {
        channelListDispatcher({
          type: channelActions.ON_USER_LEFT,
          payload: {
            channel,
            isMe: false,
          },
        });
      }
    },
    onUserLeft: (channel, leftUser) => {
      const { currentUser } = sdk;
      const isMe = (currentUser.userId === leftUser.userId);
      logger.info('ChannelList: onUserLeft', channel);
      channelListDispatcher({
        type: channelActions.ON_USER_LEFT,
        payload: {
          channel,
          isMe,
        },
      });
    },

    onReadStatus: (channel) => {
      logger.info('ChannelList: onReadStatus', channel);
      channelListDispatcher({
        type: channelActions.ON_READ_RECEIPT_UPDATED,
        payload: channel,
      });
    },

    onDeliveryReceiptUpdated: (channel) => {
      logger.info('ChannelList: onDeliveryReceiptUpdated', channel);
      if (channel.lastMessage) {
        channelListDispatcher({
          type: channelActions.ON_DELIVERY_RECEIPT_UPDATED,
          payload: channel,
        });
      }
    },

    onMessageUpdated: (channel, message) => {
      if (channel.lastMessage.isEqual(message)) {
        logger.info('ChannelList: onMessageUpdated', channel);
        channelListDispatcher({
          type: channelActions.ON_LAST_MESSAGE_UPDATED,
          payload: channel,
        });
      }
    },

    onChannelHidden: (channel) => {
      logger.info('ChannelList: onChannelHidden', channel);
      channelListDispatcher({
        type: channelActions.ON_CHANNEL_ARCHIVED,
        payload: channel,
      });
    },

    onChannelFrozen: (channel) => {
      logger.info('ChannelList: onChannelFrozen', channel);
      channelListDispatcher({
        type: channelActions.ON_CHANNEL_FROZEN,
        payload: channel,
      });
    },

    onChannelUnfrozen: (channel) => {
      logger.info('ChannelList: onChannelUnfrozen', channel);
      channelListDispatcher({
        type: channelActions.ON_CHANNEL_UNFROZEN,
        payload: channel,
      });
    },
  });

  logger.info('ChannelList: Added channelHandler');
  sdk.groupChannel.addGroupChannelHandler(sdkChannelHandlerId, ChannelHandler);
};

const createChannelListQuery = ({ sdk, userFilledChannelListQuery = {} }) => {
  const param = {};
  param.includeEmpty = false;
  param.limit = 20; // The value of pagination limit could be set up to 100.
  param.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'

  if (userFilledChannelListQuery) {
    Object.keys(userFilledChannelListQuery).forEach((key) => {
      param[key] = userFilledChannelListQuery[key];
    });
  }

  const channelListQuery = sdk.groupChannel.createMyGroupChannelListQuery(param);

  return channelListQuery;
};

/**
 * Setup event listener
 * create channel source query
 * addloading screen
 */
function setupChannelList({
  sdk,
  sdkChannelHandlerId,
  channelListDispatcher,
  setChannelSource,
  onChannelSelect,
  userFilledChannelListQuery,
  logger,
  sortChannelList,
  disableAutoSelect,
}) {
  if (sdk?.groupChannel) {
    createEventHandler({
      sdk,
      channelListDispatcher,
      sdkChannelHandlerId,
      logger,
    });
  } else {
    logger.warning('ChannelList - createEventHandler: sdk or sdk.ChannelHandler does not exist', sdk);
  }

  logger.info('ChannelList - creating query', { userFilledChannelListQuery });
  const channelListQuery = createChannelListQuery({ sdk, userFilledChannelListQuery });
  logger.info('ChannelList - created query', channelListQuery);
  setChannelSource(channelListQuery);

  channelListDispatcher({
    type: channelActions.INIT_CHANNELS_START,
  });

  if (userFilledChannelListQuery) {
    logger.info('ChannelList - setting up channelListQuery', channelListQuery);
    channelListDispatcher({
      type: channelActions.CHANNEL_LIST_PARAMS_UPDATED,
      payload: {
        channelListQuery,
        currentUserId: sdk && sdk.currentUser && sdk.currentUser.userId,
      },
    });
  }

  logger.info('ChannelList - fetching channels');
  if (channelListQuery.hasNext) {
    channelListQuery.next().then((channelList) => {
      logger.info('ChannelList - fetched channels', channelList);
      // select first channel
      logger.info('ChannelList - highlight channel', channelList[0]);
      let sortedChannelList = channelList;
      if (sortChannelList && typeof sortChannelList === 'function') {
        sortedChannelList = sortChannelList(channelList);
        logger.info('ChannelList - channel list sorted', sortedChannelList);
      }
      if (!disableAutoSelect) {
        onChannelSelect(sortedChannelList[0]);
      }
      channelListDispatcher({
        type: channelActions.INIT_CHANNELS_SUCCESS,
        payload: { channelList: sortedChannelList, disableAutoSelect },
      });
      const canSetMarkAsDelivered = sdk?.appInfo?.premiumFeatureList
        ?.find((feature) => (feature === DELIVERY_RECIPT));

      if (canSetMarkAsDelivered) {
        logger.info('ChannelList: Marking all channels as read');
        // eslint-disable-next-line no-unused-expressions
        channelList?.forEach((c, idx) => {
          // Plan-based rate limits - minimum limit is 5 requests per second
          setTimeout(() => {
            // eslint-disable-next-line no-unused-expressions
            c?.markAsDelivered();
          }, 300 * idx);
        });
      }
    }).catch((err) => {
      if (err) {
        logger.error('ChannelList - couldnt fetch channels', err);
        channelListDispatcher({
          type: channelActions.INIT_CHANNELS_FAILURE,
        });
      }
    });
  } else {
    logger.warning('ChannelList - there are no more channels');
  }
}

export const pubSubHandleRemover = (subscriber) => {
  subscriber.forEach((s) => {
    try {
      s.remove();
    } catch {
      //
    }
  });
};

export const pubSubHandler = (pubSub, channelListDispatcher) => {
  const subscriber = new Map();
  if (!pubSub) return subscriber;
  subscriber.set(topics.CREATE_CHANNEL, pubSub.subscribe(topics.CREATE_CHANNEL, (msg) => {
    const { channel } = msg;
    channelListDispatcher({
      type: 'CREATE_CHANNEL',
      payload: channel,
    });
  }));

  subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
    const { channel, message } = msg;
    const updatedChannel = channel;
    if (updatedChannel?.lastMessage?.messageId === message.messageId) {
      updatedChannel.lastMessage = message;
    }
    if (channel) {
      channelListDispatcher({
        type: channelActions.ON_LAST_MESSAGE_UPDATED,
        payload: updatedChannel,
      });
    }
  }));

  subscriber.set(topics.LEAVE_CHANNEL, pubSub.subscribe(topics.LEAVE_CHANNEL, (msg) => {
    const { channel } = msg;
    channelListDispatcher({
      type: channelActions.LEAVE_CHANNEL_SUCCESS,
      payload: channel.url,
    });
  }));

  subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
    const { channel } = msg;
    channelListDispatcher({
      type: channelActions.CHANNEL_REPLACED_TO_TOP,
      payload: channel,
    });
  }));

  return subscriber;
};

export default setupChannelList;
