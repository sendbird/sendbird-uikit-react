import { GroupChannel } from "@sendbird/chat/groupChannel";
import { BaseMessage } from "@sendbird/chat/message";

import { NotficationChannelStateInterface, initialState } from "./initialState";
import { actionTypes, ActionType } from "./actionTypes";
import compareIds from '../../../../utils/compareIds';

export declare type Action = {
  type: ActionType;
  payload?: any;
}

export function reducer(
  state: NotficationChannelStateInterface,
  action: Action,
): NotficationChannelStateInterface {
  switch (action?.type) {
    case actionTypes.FETCH_CHANNEL_START: {
      return initialState;
    }
    case actionTypes.FETCH_CHANNEL_SUCCESS: {
      return {
        ...state,
        currentNotificationChannel: action?.payload?.channel as GroupChannel,
      };
    }
    case actionTypes.FETCH_CHANNEL_FAILURE: {
      return {
        ...state,
        uiState: 'invalid',
      };
    }
    case actionTypes.RESET_MESSAGES: {
      return {
        ...state,
        allMessages: [],
      };
    }
    case actionTypes.FETCH_INITIAL_MESSAGES_START: {
      return {
        ...state,
        uiState: 'loading',
      };
    }
    case actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS: {
      return {
        ...state,
        allMessages: action.payload.messages as BaseMessage[],
        uiState: 'initialized',
      };
    }
    case actionTypes.FETCH_INITIAL_MESSAGES_FAILURE: {
      return {
        ...state,
        uiState: 'invalid',
      };
    }
    case actionTypes.FETCH_PREV_MESSAGES_SUCCESS: {
      const channel = action.payload.channel as GroupChannel;
      const messages = action.payload.messages as BaseMessage[];
      if (channel?.url !== state?.currentNotificationChannel?.url) {
        return state;
      }
      return {
        ...state,
        hasMore: messages?.length === 20,
        // todo: de-duplicate
        allMessages: [
          ...messages,
          ...state?.allMessages,
        ],
      };
    }
    case actionTypes.FETCH_PREV_MESSAGES_FAILURE: {
      return state;
    }
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const channel = action.payload.channel as GroupChannel;
      const message = action.payload.message as BaseMessage;
      if (channel?.url !== state?.currentNotificationChannel?.url) {
        return state;
      }
      return {
        ...state,
        allMessages: [
          ...state?.allMessages,
          message,
        ]
      };
    }
    case actionTypes.ON_MESSAGE_UPDATED: {
      const channel = action.payload.channel as GroupChannel;
      const message = action.payload.message as BaseMessage;
      if (channel?.url !== state?.currentNotificationChannel?.url) {
        return state;
      }
      return {
        ...state,
        allMessages: state?.allMessages?.map((m) => {
          if (m?.messageId === message?.messageId) {
            return message;
          }
          return m;
        }),
      };
    }
    case actionTypes.ON_MESSAGE_DELETED: {
      const channel = action.payload.channel as GroupChannel;
      const message = action.payload.message as BaseMessage;
      if (channel?.url !== state?.currentNotificationChannel?.url) {
        return state;
      }
      return {
        ...state,
        allMessages: state.allMessages.filter((m) => (
          !compareIds(m.messageId, message?.messageId)
        )),
      };
    }
    case actionTypes.ON_CHANNEL_DELETED: {
      const channelUrl = action.payload.channelUrl as string;
      if (channelUrl !== state?.currentNotificationChannel?.url) {
        return state;
      }
      return {
        ...state,
        currentNotificationChannel: null,
        uiState: 'invalid',
      };
    }
    default: {
      return state;
    }
  }
}
