import { OpenChannelListFetchingStatus } from '../OpenChannelListInterfaces';
import actionTypes from './actionTypes';
import { OpenChannelListInitialInterface } from './initialState';

export default function reducer(
  state: OpenChannelListInitialInterface,
  action: { type: actionTypes, payload: any },
): OpenChannelListInitialInterface {
  switch (action.type) {
    case actionTypes.INIT_OPEN_CHANNEL_LIST_START: {
      return {
        ...state,
        fetchingStatus: OpenChannelListFetchingStatus.FETCHING,
      };
    }
    case actionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS: {
      const channelList = action.payload;
      return {
        ...state,
        allChannels: channelList,
        fetchingStatus: channelList.length > 0
          ? OpenChannelListFetchingStatus.DONE
          : OpenChannelListFetchingStatus.EMPTY,
      };
    }
    case actionTypes.INIT_OPEN_CHANNEL_LIST_FAILURE: {
      return {
        ...state,
        allChannels: [],
        fetchingStatus: OpenChannelListFetchingStatus.ERROR,
      };
    }
    case actionTypes.RESET_OPEN_CHANNEL_LIST: {
      return {
        ...state,
        allChannels: [],
        fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
      };
    }
    case actionTypes.FETCH_OPEN_CHANNEL_LIST_START: {
      return state;
    }
    case actionTypes.FETCH_OPEN_CHANNEL_LIST_SUCCESS: {
      return {
        ...state,
        allChannels: [...state.allChannels, ...action.payload],
      };
    }
    case actionTypes.FETCH_OPEN_CHANNEL_LIST_FAILURE: {
      return state;
    }
    case actionTypes.CREATE_OPEN_CHANNEL: {
      return {
        ...state,
        currentChannel: action.payload,
        allChannels: [action.payload, ...state.allChannels],
      };
    }
    case actionTypes.SET_CURRENT_OPEN_CHANNEL: {
      return {
        ...state,
        currentChannel: action.payload,
      };
    }
    case actionTypes.UPDATE_OPEN_CHANNEL_LIST_QUERY: {
      return {
        ...state,
        channelListQuery: action?.payload,
      };
    }
    case actionTypes.UPDATE_OPEN_CHANNEL: {
      return {
        ...state,
        allChannels: state.allChannels.map((channel) => (
          channel?.url === action.payload?.url ? action.payload : channel
        )),
        currentChannel: (state.currentChannel?.url === action?.payload?.url)
          ? state.currentChannel
          : action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
