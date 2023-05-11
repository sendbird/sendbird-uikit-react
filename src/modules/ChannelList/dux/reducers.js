import { filterChannelListParams, getChannelsWithUpsertedChannel } from '../../../utils';
import * as actions from './actionTypes';
import initialState from './initialState';

export default function reducer(state, action) {
  switch (action.type) {
    case actions.INIT_CHANNELS_START:
      return {
        ...state,
        loading: true,
      };
    case actions.RESET_CHANNEL_LIST:
      return initialState;
    case actions.INIT_CHANNELS_SUCCESS: {
      const { channelList, disableAutoSelect } = action.payload;
      return {
        ...state,
        initialized: true,
        loading: false,
        allChannels: channelList,
        disableAutoSelect,
        currentChannel: (
          !disableAutoSelect
          && channelList
          && channelList.length
          && channelList.length > 0
        )
          ? channelList[0]
          : null,
      };
    }
    case actions.FETCH_CHANNELS_SUCCESS: {
      const currentChannels = state.allChannels.map((c) => c.url);
      const filteredChannels = action.payload.filter(
        ({ url }) => !(currentChannels.find((c) => c === url)),
      );
      return {
        ...state,
        allChannels: [
          ...state.allChannels,
          ...filteredChannels,
        ],
      };
    }
    case actions.USER_INVITED: {
      const channel = action.payload;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(state.allChannels, channel),
          };
        }
        return {
          ...state,
          currentChannel: channel,
        };
      }
      return {
        ...state,
        allChannels: [channel, ...state.allChannels.filter((ch) => ch.url !== channel?.url)],
      };
    }
    case actions.CREATE_CHANNEL: {
      const channel = action.payload;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(state.allChannels, channel),
          };
        }
        return {
          ...state,
          currentChannel: channel,
        };
      }
      return {
        ...state,
        allChannels: [channel, ...state.allChannels.filter((ch) => ch.url !== channel?.url)],
        currentChannel: channel,
      };
    }
    case actions.ON_CHANNEL_ARCHIVED: {
      const channel = action.payload;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(state.allChannels, channel),
          };
          // TODO: Check if we have to set current channel
        }
      }
      const nextChannel = (channel?.url === state.currentChannel?.url)
        ? state.allChannels[state.allChannels[0].url === channel?.url ? 1 : 0]
        : state.currentChannel;
      return {
        ...state,
        allChannels: state.allChannels.filter(({ url }) => url !== channel?.url),
        currentChannel: state.disableAutoSelect ? null : nextChannel,
      };
    }
    case actions.LEAVE_CHANNEL_SUCCESS:
    case actions.ON_CHANNEL_DELETED: {
      const channelUrl = action.payload;
      return {
        ...state,
        currentChannel: (channelUrl === state.currentChannel?.url)
          ? state.allChannels[0]
          : state.currentChannel,
        allChannels: state.allChannels.filter(({ url }) => url !== channelUrl),
      };
    }
    case actions.ON_USER_LEFT: {
      const { channel, isMe } = action.payload;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          const filteredChannels = getChannelsWithUpsertedChannel(state.allChannels, channel);
          const nextChannel = (isMe && (channel?.url === state.currentChannel?.url))
            ? filteredChannels[0]
            : state.currentChannel;
          return {
            ...state,
            currentChannel: state.disableAutoSelect ? null : nextChannel,
            allChannels: filteredChannels,
          };
        }
        const nextChannel = (channel?.url === state.currentChannel?.url)
          ? state.allChannels[0]
          : state.currentChannel;
        return {
          ...state,
          currentChannel: state.disableAutoSelect ? null : nextChannel,
          allChannels: state.allChannels.filter(({ url }) => url !== channel?.url),
        };
      }
      const filteredChannels = state.allChannels.filter((c) => !(c.url === channel?.url && isMe));
      const nextChannel = (isMe && (channel?.url === state.currentChannel?.url))
        ? filteredChannels[0]
        : state.currentChannel;
      return {
        ...state,
        currentChannel: state.disableAutoSelect ? null : nextChannel,
        allChannels: filteredChannels,
      };
    }
    case actions.ON_USER_JOINED:
    case actions.ON_CHANNEL_CHANGED:
    case actions.ON_READ_RECEIPT_UPDATED:
    case actions.ON_DELIVERY_RECEIPT_UPDATED: {
      const { allChannels = [] } = state;
      const channel = action.payload;
      const { unreadMessageCount } = channel;
      if (!channel?.lastMessage) return state;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(allChannels, channel),
          };
        }
        const nextChannel = (channel?.url === state.currentChannel?.url)
          ? state.allChannels[state.allChannels[0].url === channel?.url ? 1 : 0]
          // if coming channel is first of channel list, current channel will be the next one
          : state.currentChannel;
        return {
          ...state,
          currentChannel: state.disableAutoSelect ? null : nextChannel,
          allChannels: state.allChannels.filter(({ url }) => url !== channel?.url),
        };
      }
      // if its only an unread message count change, dont push to top
      if (unreadMessageCount === 0) {
        const currentChannel = allChannels.find(({ url }) => url === channel?.url);
        const currentUnreadCount = currentChannel && currentChannel.unreadMessageCount;
        if (currentUnreadCount === 0) {
          return {
            ...state,
            allChannels: state.allChannels.map((ch) => (ch.url === channel?.url ? channel : ch)),
          };
        }
      }
      return {
        ...state,
        allChannels: [
          channel,
          ...state.allChannels.filter(({ url }) => url !== action.payload.url),
        ],
      };
    }
    case actions.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case actions.ON_LAST_MESSAGE_UPDATED: {
      return {
        ...state,
        allChannels: state.allChannels.map((channel) => (
          channel?.url === action.payload.url ? action.payload : channel)),
      };
    }
    case actions.ON_CHANNEL_FROZEN: {
      const channel = action.payload;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(state.allChannels, channel),
          };
        }
        const nextChannel = (channel?.url === state.currentChannel?.url)
          ? state.allChannels[state.allChannels[0].url === channel?.url ? 1 : 0]
          // if coming channel is first of channel list, current channel will be the next one
          : state.currentChannel;
        return {
          ...state,
          allChannels: state.allChannels.filter(({ url }) => url !== channel?.url),
          currentChannel: state.disableAutoSelect ? null : nextChannel,
        };
      }
      return {
        ...state,
        allChannels: state.allChannels.map((ch) => {
          if (ch.url === channel?.url) {
            // eslint-disable-next-line no-param-reassign
            ch.isFrozen = true;
            return ch;
          }
          return ch;
        }),
      };
    }
    case actions.ON_CHANNEL_UNFROZEN: {
      const channel = action.payload;
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, channel, state.currentUserId)) {
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(state.allChannels, channel),
          };
        }
        const nextChannel = (channel?.url === state.currentChannel?.url)
          ? state.allChannels[state.allChannels[0].url === channel?.url ? 1 : 0]
          // if coming channel is first of channel list, current channel will be the next one
          : state.currentChannel;
        return {
          ...state,
          allChannels: state.allChannels.filter(({ url }) => url !== channel?.url),
          currentChannel: state.disableAutoSelect ? null : nextChannel,
        };
      }
      return {
        ...state,
        allChannels: state.allChannels.map((ch) => {
          if (ch.url === channel?.url) {
            // eslint-disable-next-line no-param-reassign
            ch.isFrozen = false;
            return ch;
          }
          return ch;
        }),
      };
    }
    case actions.CHANNEL_REPLACED_TO_TOP: {
      return {
        ...state,
        allChannels: [
          action.payload,
          ...state.allChannels.filter((channel) => channel?.url !== action.payload.url),
        ],
      };
    }
    case actions.CHANNEL_LIST_PARAMS_UPDATED:
      return {
        ...state,
        currentUserId: action.payload.currentUserId,
        channelListQuery: action.payload.channelListQuery,
      };
    default:
      return state;
  }
}
