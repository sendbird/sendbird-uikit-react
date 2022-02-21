import * as channelActions from './dux/actionTypes';
import * as topics from '../../lib/pubSub/topics';

const createEventHandler = ({
  sdk,
  sdkChannelHandlerId,
  channelListDispatcher,
  logger,
}) => {
  const ChannelHandler = new sdk.ChannelHandler();

  ChannelHandler.onChannelChanged = (channel) => {
    logger.info('ChannelList: onChannelChanged', channel);
    channelListDispatcher({
      type: channelActions.ON_CHANNEL_CHANGED,
      payload: channel,
    });
  };
  ChannelHandler.onChannelDeleted = (channelUrl) => {
    logger.info('ChannelList: onChannelDeleted', channelUrl);
    channelListDispatcher({
      type: channelActions.ON_CHANNEL_DELETED,
      payload: channelUrl,
    });
  };
  ChannelHandler.onUserJoined = (channel) => {
    logger.info('ChannelList: onUserJoined', channel);
    if (channel.lastMessage) {
      channelListDispatcher({
        type: channelActions.ON_USER_JOINED,
        payload: channel,
      });
    }
  };
  ChannelHandler.onUserBanned = (channel, user) => {
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
  };
  ChannelHandler.onUserLeft = (channel, leftUser) => {
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
  };

  ChannelHandler.onReadStatus = (channel) => {
    logger.info('ChannelList: onReadStatus', channel);
    channelListDispatcher({
      type: channelActions.ON_READ_RECEIPT_UPDATED,
      payload: channel,
    });
  };

  ChannelHandler.onDeliveryReceiptUpdated = (channel) => {
    logger.info('ChannelList: onDeliveryReceiptUpdated', channel);
    if (channel.lastMessage) {
      channelListDispatcher({
        type: channelActions.ON_DELIVERY_RECEIPT_UPDATED,
        payload: channel,
      });
    }
  };

  ChannelHandler.onMessageUpdated = (channel, message) => {
    if (channel.lastMessage.isEqual(message)) {
      logger.info('ChannelList: onMessageUpdated', channel);
      channelListDispatcher({
        type: channelActions.ON_LAST_MESSAGE_UPDATED,
        payload: channel,
      });
    }
  };

  ChannelHandler.onChannelHidden = (channel) => {
    logger.info('ChannelList: onChannelHidden', channel);
    channelListDispatcher({
      type: channelActions.ON_CHANNEL_ARCHIVED,
      payload: channel,
    });
  };

  ChannelHandler.onChannelFrozen = (channel) => {
    logger.info('ChannelList: onChannelFrozen', channel);
    channelListDispatcher({
      type: channelActions.ON_CHANNEL_FROZEN,
      payload: channel,
    });
  };

  ChannelHandler.onChannelUnfrozen = (channel) => {
    logger.info('ChannelList: onChannelUnfrozen', channel);
    channelListDispatcher({
      type: channelActions.ON_CHANNEL_UNFROZEN,
      payload: channel,
    });
  };

  logger.info('ChannelList: Added channelHandler');
  sdk.addChannelHandler(sdkChannelHandlerId, ChannelHandler);
};

const createChannelListQuery = ({ sdk, userFilledChannelListQuery = {} }) => {
  const channelListQuery = sdk.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.includeEmpty = false;
  channelListQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
  channelListQuery.limit = 20; // The value of pagination limit could be set up to 100.

  if (userFilledChannelListQuery) {
    Object.keys(userFilledChannelListQuery).forEach((key) => {
      channelListQuery[key] = userFilledChannelListQuery[key];
    });
  }

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
  ableAutoSelectChannelItem,
}) {
  if (sdk && sdk.ChannelHandler) {
    createEventHandler({
      sdk,
      channelListDispatcher,
      sdkChannelHandlerId,
      logger,
    });
  } else {
    logger.console.warning('ChannelList - createEventHandler: sdk or sdk.ChannelHandler does not exist', sdk);
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
    channelListQuery.next((response, error) => {
      const swapParams = sdk.getErrorFirstCallback();
      let channelList = response;
      let err = error;
      if (swapParams) {
        channelList = error;
        err = response;
      }
      logger.info('ChannelList - fetched channels', channelList);
      if (err) {
        logger.error('ChannelList - couldnt fetch channels', err);
        channelListDispatcher({
          type: channelActions.INIT_CHANNELS_FAILURE,
        });
        return;
      }
      // select first channel
      logger.info('ChannelList - highlight channel', channelList[0]);
      let sorted = channelList;
      if (sortChannelList && typeof sortChannelList === 'function') {
        sorted = sortChannelList(channelList);
        logger.info('ChannelList - channel list sorted', sorted);
      }
      if (ableAutoSelectChannelItem) {
        onChannelSelect(sorted[0]);
      }
      channelListDispatcher({
        type: channelActions.INIT_CHANNELS_SUCCESS,
        payload: sorted,
      });
      if (channelList && typeof channelList.forEach === 'function') {
        logger.info('ChannelList - mark all channels as delivered');
        channelList.forEach((c) => c.markAsDelivered());
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
  const subScriber = new Map();
  if (!pubSub) return subScriber;
  subScriber.set(topics.CREATE_CHANNEL, pubSub.subscribe(topics.CREATE_CHANNEL, (msg) => {
    const { channel } = msg;
    channelListDispatcher({
      type: 'CREATE_CHANNEL',
      payload: channel,
    });
  }));

  subScriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
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

  subScriber.set(topics.LEAVE_CHANNEL, pubSub.subscribe(topics.LEAVE_CHANNEL, (msg) => {
    const { channel } = msg;
    channelListDispatcher({
      type: channelActions.LEAVE_CHANNEL_SUCCESS,
      payload: channel.url,
    });
  }));

  subScriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
    const { channel } = msg;
    channelListDispatcher({
      type: channelActions.CHANNEL_REPLACED_TO_TOP,
      payload: channel,
    });
  }));

  return subScriber;
};

export default setupChannelList;
