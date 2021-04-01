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
    case actions.INIT_CHANNELS_SUCCESS:
      return {
        ...state,
        initialized: true,
        loading: false,
        allChannels: action.payload,
        currentChannel: (action.payload && action.payload.length && action.payload.length > 0)
          ? action.payload[0].url
          : null,
      };
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
    case actions.CREATE_CHANNEL: {
      return {
        ...state,
        allChannels: [
          action.payload,
          ...state.allChannels.filter(
            (channel) => channel.url !== action.payload.url,
          )],
        currentChannel: action.payload.url,
      };
    }
    case actions.ON_CHANNEL_ARCHIVED:
    case actions.LEAVE_CHANNEL_SUCCESS:
    case actions.ON_CHANNEL_DELETED: {
      const channelUrl = action.payload;
      const leftCurrentChannel = (state.currentChannel === channelUrl);
      const newAllChannels = state.allChannels.filter(({ url }) => url !== channelUrl);
      const currentChannel = leftCurrentChannel
        ? (() => (
          (newAllChannels.length > 0)
            ? newAllChannels[0].url
            : ''
        ))()
        : state.currentChannel;

      return {
        ...state,
        currentChannel,
        allChannels: newAllChannels,
      };
    }
    case actions.ON_USER_LEFT: {
      const { channel, isMe } = action.payload;
      const { url } = channel;
      if (isMe) {
        const leftCurrentChannel = (url === state.currentChannel);
        const newAllChannels = state.allChannels.filter((c) => (c.url !== url));
        const currentChannel = leftCurrentChannel
          ? (() => (
            (newAllChannels.length > 0)
              ? newAllChannels[0].url
              : ''
          ))()
          : state.currentChannel;

        return {
          ...state,
          currentChannel,
          allChannels: newAllChannels,
        };
      }
      // other user left
      const newAllChannels = state.allChannels.map((c) => ((c.url === url) ? channel : c));
      return {
        ...state,
        allChannels: newAllChannels,
      };
    }
    case actions.ON_USER_JOINED:
    case actions.ON_CHANNEL_CHANGED:
    case actions.ON_READ_RECEIPT_UPDATED:
    case actions.ON_DELIVERY_RECEIPT_UPDATED: {
      const { allChannels = [] } = state;
      const { unreadMessageCount } = action.payload;
      const channel = action.payload;
      if (!channel.lastMessage) {
        return state;
      }
      // if its only an unread message count change, dont push to top
      if (unreadMessageCount === 0) {
        const currentChannel = allChannels.find(({ url }) => url === channel.url);
        const currentUnReadCount = currentChannel && currentChannel.unreadMessageCount;
        if (currentUnReadCount === 0) {
          return {
            ...state,
            allChannels: allChannels.map((c) => {
              if (c.url === channel.url) {
                return channel;
              }
              return c;
            }),
          };
        }
      }
      return {
        ...state,
        allChannels: [
          action.payload,
          ...state.allChannels.filter(({ url }) => url !== action.payload.url),
        ],
      };
    }
    case actions.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case actions.SHOW_CHANNEL_SETTINGS:
      return {
        ...state,
        showSettings: true,
      };
    case actions.HIDE_CHANNEL_SETTINGS:
      return {
        ...state,
        showSettings: false,
      };
    case actions.ON_LAST_MESSAGE_UPDATED:
      return {
        ...state,
        allChannels: state.allChannels.map((channel) => {
          if (channel.url === action.payload.url) {
            return action.payload;
          }
          return channel;
        }),
      };
    case actions.ON_CHANNEL_FROZEN:
      return {
        ...state,
        allChannels: state.allChannels.map((channel) => {
          if (channel.url === action.payload.url) {
            // eslint-disable-next-line no-param-reassign
            channel.isFrozen = true;
            return channel;
          }
          return channel;
        }),
      };
    case actions.ON_CHANNEL_UNFROZEN:
      return {
        ...state,
        allChannels: state.allChannels.map((channel) => {
          if (channel.url === action.payload.url) {
            // eslint-disable-next-line no-param-reassign
            channel.isFrozen = false;
            return channel;
          }
          return channel;
        }),
      };
    case actions.CHANNEL_REPLACED_TO_TOP:
      return {
        ...state,
        allChannels: [
          action.payload,
          ...state.allChannels.filter((channel) => channel.url !== action.payload.url),
        ],
      };
    default:
      return state;
  }
}
