import { State as initialStateInterface } from './initialState';
import * as actionTypes from './actionTypes';

interface ActionInterface {
  type: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  payload?: any;
}

export default function reducer(
  state: initialStateInterface,
  action: ActionInterface,
): initialStateInterface {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL: {
      const currentChannel = action.payload;
      return {
        ...state,
        currentChannel,
        initialized: true,
      };
    }
    case actionTypes.CHANNEL_INVALID: {
      return {
        ...state,
        currentChannel: null,
        initialized: false,
      };
    }
    case actionTypes.GET_SEARCHED_MESSAGES: {
      const { messages, createdQuery } = action.payload;
      if (
        createdQuery
        && createdQuery.channelUrl === state.currentMessageSearchQuery.channelUrl
        && createdQuery.key === state.currentMessageSearchQuery.key
      ) {
        return {
          ...state,
          loading: false,
          isInvalid: false,
          allMessages: [...messages],
          hasMoreResult: state.currentMessageSearchQuery.hasNext,
        };
      }
      return { ...state };
    }
    case actionTypes.SET_QUERY_INVALID: {
      return {
        ...state,
        isInvalid: true,
      }
    }
    case actionTypes.START_MESSAGE_SEARCH: {
      return {
        ...state,
        isInvalid: false,
        loading: false,
      }
    }
    case actionTypes.START_GETTING_SEARCHED_MESSAGES: {
      const currentMessageSearchQuery = action.payload;
      return {
        ...state,
        loading: true,
        currentMessageSearchQuery,
      };
    }
    case actionTypes.GET_NEXT_SEARCHED_MESSAGES: {
      const messages = action.payload;
      return {
        ...state,
        allMessages: [...state.allMessages, ...messages],
        hasMoreResult: state.currentMessageSearchQuery.hasNext,
      };
    }
    default: {
      return state;
    }
  }
}
