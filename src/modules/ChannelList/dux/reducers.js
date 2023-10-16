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
      const {
        allChannels,
        currentUserId,
        currentChannel,
        channelListQuery,
        disableAutoSelect,
      } = state;
      let nextChannels = null;
      let nextChannel = null;
      if (channelListQuery) {
        if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
          // Good to [add to/keep in] the ChannelList
          nextChannels = getChannelsWithUpsertedChannel(allChannels, channel);
        }
      }
      // Replace the currentChannel if I left the currentChannel
      if (isMe && channel.url === currentChannel?.url) {
        if (!disableAutoSelect && filteredChannels.length > 0) {
          const [firstChannel, secondChannel = null] = filteredChannels;
          nextChannel = firstChannel.url === channel.url ? secondChannel : firstChannel;
        }
      } else {
        nextChannel = currentChannel;
      }
      return {
        ...state,
        currentChannel: nextChannel,
        allChannels: filteredChannels,
      };
    }
    case actions.ON_USER_JOINED: {
      const channel = action.payload;
      // Do not display the channel when it's created (and not sent a message yet)
      if (!channel?.lastMessage) return state;
    }
    case actions.ON_CHANNEL_CHANGED:
    case actions.ON_READ_RECEIPT_UPDATED:
    case actions.ON_DELIVERY_RECEIPT_UPDATED: {
      const channel = action.payload;
      const {
        allChannels = [],
        currentUserId,
        currentChannel,
        channelListQuery,
        disableAutoSelect,
      } = state;
      const { unreadMessageCount } = channel;

      if (channelListQuery) {
        if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
          // Good to [add to/keep in] the ChannelList
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(allChannels, channel),
          };
        }
        // Filter the channel from the ChannelList
        // Replace the currentChannel if it's filtered channel
        const filteredChannel = channel;
        let nextChannel = null;
        if (currentChannel?.url === filteredChannel.url) {
          if (!disableAutoSelect && allChannels.length > 0) {
            const [firstChannel, secondChannel = null] = allChannels;
            nextChannel = firstChannel.url === filteredChannel.url ? secondChannel : firstChannel;
          }
        } else {
          nextChannel = currentChannel;
        }
        return {
          ...state,
          currentChannel: nextChannel,
          allChannels: allChannels.filter(({ url }) => url !== channel?.url),
        };
      }

      if (
        // When marking as read the channel
        unreadMessageCount === 0
        // When sending a message by the current peer
        && channel?.lastMessage?.sender?.userId !== currentUserId
      ) {
        // Don't move to the top
        return {
          ...state,
          allChannels: allChannels.map((ch) => (ch.url === channel?.url ? channel : ch)),
        };
      }
      // Move to the top
      return {
        ...state,
        allChannels: [
          channel,
          ...allChannels.filter(({ url }) => url !== channel.url),
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
      const {
        allChannels,
        currentUserId,
        currentChannel,
        channelListQuery,
        disableAutoSelect,
      } = state;
      if (channelListQuery) {
        if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
          // Good to [add to/keep in] the ChannelList
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(allChannels, channel),
          };
        }
        // Filter the channel from the ChannelList
        // Replace the currentChannel if it's filtered channel
        const filteredChannel = channel;
        let nextChannel = null;
        if (currentChannel?.url === filteredChannel.url) {
          if (!disableAutoSelect && allChannels.length > 0) {
            const [firstChannel, secondChannel = null] = allChannels;
            nextChannel = firstChannel.url === filteredChannel.url ? secondChannel : firstChannel;
          }
        } else {
          nextChannel = currentChannel;
        }
        return {
          ...state,
          currentChannel: nextChannel,
          allChannels: allChannels.filter(({ url }) => url !== channel?.url),
        };
      }
      return {
        ...state,
        allChannels: allChannels.map((ch) => {
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
      const {
        allChannels,
        currentUserId,
        currentChannel,
        channelListQuery,
        disableAutoSelect,
      } = state;
      if (channelListQuery) {
        if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
          // Good to [add to/keep in] the ChannelList
          return {
            ...state,
            allChannels: getChannelsWithUpsertedChannel(allChannels, channel),
          };
        }
        // Filter the channel from the ChannelList
        // Replace the currentChannel if it's filtered channel
        const filteredChannel = channel;
        let nextChannel = null;
        if (currentChannel?.url === filteredChannel.url) {
          if (!disableAutoSelect && allChannels.length > 0) {
            const [firstChannel, secondChannel = null] = allChannels;
            nextChannel = firstChannel.url === filteredChannel.url ? secondChannel : firstChannel;
          }
        } else {
          nextChannel = currentChannel;
        }
        return {
          ...state,
          currentChannel: nextChannel,
          allChannels: allChannels.filter(({ url }) => url !== channel?.url),
        };
      }

      // No channelListQuery
      return {
        ...state,
        allChannels: allChannels.map((ch) => {
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
      if (state.channelListQuery) {
        if (filterChannelListParams(state.channelListQuery, action.payload, state.currentUserId)) {
          return {
            ...state,
            allChannels: [
              action.payload,
              ...state.allChannels.filter((channel) => channel?.url !== action.payload.url),
            ],
          };
        }
        return state;
      }
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
