import {
  GroupChannel,
  GroupChannelHandler,
  GroupChannelListOrder,
  GroupChannelListQuery,
  GroupChannelListQueryParams,
} from '@sendbird/chat/groupChannel';
import * as channelActions from './dux/actionTypes';
import topics, { SBUGlobalPubSub } from '../../lib/pubSub/topics';
import { SdkStore } from '../../lib/types';
import React from 'react';
import { ChannelListInitialStateType } from './dux/initialState';
import { ChannelListActionTypes } from './dux/actionTypes';
import { GroupChannelListQueryParamsInternal } from './context/ChannelListProvider';
import { LoggerInterface } from '../../lib/Logger';
import { MarkAsDeliveredSchedulerType } from '../../lib/hooks/useMarkAsDeliveredScheduler';

const DELIVERY_RECEIPT = 'delivery_receipt';

type CreateEventHandlerParams = {
  sdk: SdkStore['sdk'];
  sdkChannelHandlerId: string;
  channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
  logger: LoggerInterface;
};
const createEventHandler = ({ sdk, sdkChannelHandlerId, channelListDispatcher, logger }: CreateEventHandlerParams) => {
  const ChannelHandler = new GroupChannelHandler({
    onChannelChanged: (channel) => {
      if (channel.isGroupChannel()) {
        logger.info('ChannelList: onChannelChanged', channel);
        channelListDispatcher({
          type: channelActions.ON_CHANNEL_CHANGED,
          payload: channel,
        });
      }
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
      channelListDispatcher({
        type: channelActions.ON_USER_JOINED,
        payload: channel,
      });
    },
    onUserBanned: (channel, user) => {
      if (channel.isGroupChannel()) {
        logger.info('Channel: onUserBanned', channel);
        const isMe = user.userId === sdk?.currentUser?.userId;
        channelListDispatcher({
          type: channelActions.ON_USER_LEFT,
          payload: { channel, isMe },
        });
      }
    },
    onUserLeft: (channel, user) => {
      logger.info('ChannelList: onUserLeft', channel);
      const isMe = user.userId === sdk?.currentUser?.userId;
      channelListDispatcher({
        type: channelActions.ON_USER_LEFT,
        payload: { channel, isMe },
      });
    },
    onUnreadMemberStatusUpdated: (channel) => {
      logger.info('ChannelList: onUnreadMemberStatusUpdated', channel);
      channelListDispatcher({
        type: channelActions.ON_READ_RECEIPT_UPDATED,
        payload: channel,
      });
    },
    onUndeliveredMemberStatusUpdated: (channel) => {
      logger.info('ChannelList: onUndeliveredMemberStatusUpdated', channel);
      if (channel.lastMessage) {
        channelListDispatcher({
          type: channelActions.ON_DELIVERY_RECEIPT_UPDATED,
          payload: channel,
        });
      }
    },
    onMessageUpdated: (channel, message) => {
      if (channel.isGroupChannel() && channel.lastMessage.isEqual(message)) {
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
      if (channel.isGroupChannel()) {
        logger.info('ChannelList: onChannelFrozen', channel);
        channelListDispatcher({
          type: channelActions.ON_CHANNEL_FROZEN,
          payload: channel,
        });
      }
    },
    onChannelUnfrozen: (channel) => {
      if (channel.isGroupChannel()) {
        logger.info('ChannelList: onChannelUnfrozen', channel);
        channelListDispatcher({
          type: channelActions.ON_CHANNEL_UNFROZEN,
          payload: channel,
        });
      }
    },
  });

  logger.info('ChannelList: Added channelHandler');
  sdk.groupChannel.addGroupChannelHandler(sdkChannelHandlerId, ChannelHandler);
};

type CreateChannelListQueryParams = {
  sdk: SdkStore['sdk'];
  userFilledChannelListQuery: GroupChannelListQueryParamsInternal;
};

const createChannelListQuery = ({
  sdk,
  userFilledChannelListQuery = {},
}: CreateChannelListQueryParams): GroupChannelListQuery => {
  const params: GroupChannelListQueryParamsInternal = {
    includeEmpty: false,
    limit: 20, // The value of pagination limit could be set up to 100.
    order: GroupChannelListOrder.LATEST_LAST_MESSAGE, // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
  };

  if (userFilledChannelListQuery) {
    Object.keys(userFilledChannelListQuery).forEach((key) => {
      params[key] = userFilledChannelListQuery[key];
    });
  }

  return sdk.groupChannel.createMyGroupChannelListQuery(params as GroupChannelListQueryParams);
};

/**
 * Setup event listener
 * create channel source query
 * addloading screen
 */
type SetupChannelListParams = {
  sdk: SdkStore['sdk'];
  sdkChannelHandlerId: string;
  channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
  setChannelSource: (query: GroupChannelListQuery) => void;
  onChannelSelect: (channel: ChannelListInitialStateType['currentChannel']) => void;
  userFilledChannelListQuery: GroupChannelListQueryParamsInternal;
  logger: LoggerInterface;
  sortChannelList: (channels: GroupChannel[]) => GroupChannel[];
  disableAutoSelect: boolean;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
  disableMarkAsDelivered: boolean;
};
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
  markAsDeliveredScheduler,
  disableMarkAsDelivered,
}: SetupChannelListParams) {
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
    channelListQuery
      .next()
      .then((channelList) => {
        logger.info('ChannelList - fetched channels', channelList);
        // select first channel
        logger.info('ChannelList - highlight channel', channelList[0]);
        let sortedChannelList = channelList;
        if (sortChannelList && typeof sortChannelList === 'function') {
          sortedChannelList = sortChannelList(channelList);
          logger.info('ChannelList - channel list sorted', sortedChannelList);
        }
        if (!disableAutoSelect) {
          onChannelSelect?.(sortedChannelList[0]);
        }
        channelListDispatcher({
          type: channelActions.INIT_CHANNELS_SUCCESS,
          payload: { channelList: sortedChannelList, disableAutoSelect },
        });
        const canSetMarkAsDelivered = sdk?.appInfo?.premiumFeatureList?.find((feature) => feature === DELIVERY_RECEIPT);

        if (canSetMarkAsDelivered && !disableMarkAsDelivered) {
          sortedChannelList.forEach((channel) => {
            markAsDeliveredScheduler.push(channel);
          });
        }
      })
      .catch((err) => {
        if (err) {
          logger.error('ChannelList - couldnt fetch channels', err);
          channelListDispatcher({
            type: channelActions.INIT_CHANNELS_FAILURE,
          });
        }
      });
  } else {
    logger.info('ChannelList - there are no more channels');
  }
}

export const pubSubHandleRemover = (subscriber: ReturnType<typeof pubSubHandler>) => {
  subscriber.forEach((s) => {
    try {
      s.remove();
    } catch {
      //
    }
  });
};

export const pubSubHandler = (pubSub: SBUGlobalPubSub, channelListDispatcher: React.Dispatch<ChannelListActionTypes>) => {
  const subscriber = new Map<string, ReturnType<SBUGlobalPubSub['subscribe']>>();
  if (!pubSub) return subscriber;
  subscriber.set(
    topics.CREATE_CHANNEL,
    pubSub.subscribe(topics.CREATE_CHANNEL, (msg: { channel: GroupChannel }) => {
      const { channel } = msg;
      channelListDispatcher({
        type: channelActions.CREATE_CHANNEL,
        payload: channel,
      });
    }),
  );

  subscriber.set(
    topics.UPDATE_USER_MESSAGE,
    pubSub.subscribe(topics.UPDATE_USER_MESSAGE, ({ channel, message }) => {
      if (channel.isGroupChannel() && channel?.lastMessage?.messageId === message.messageId) {
        channel.lastMessage = message;
        channelListDispatcher({
          type: channelActions.ON_LAST_MESSAGE_UPDATED,
          payload: channel,
        });
      }
    }),
  );

  subscriber.set(
    topics.LEAVE_CHANNEL,
    pubSub.subscribe(topics.LEAVE_CHANNEL, (msg: { channel: GroupChannel }) => {
      const { channel } = msg;
      channelListDispatcher({
        type: channelActions.LEAVE_CHANNEL_SUCCESS,
        payload: channel?.url,
      });
    }),
  );

  subscriber.set(
    topics.SEND_MESSAGE_START,
    pubSub.subscribe(topics.SEND_MESSAGE_START, ({ channel }) => {
      if (channel.isGroupChannel()) {
        channelListDispatcher({
          type: channelActions.CHANNEL_REPLACED_TO_TOP,
          payload: channel,
        });
      }
    }),
  );

  return subscriber;
};

export default setupChannelList;
