import { GroupChannel } from "@sendbird/chat/groupChannel";
import { AdminMessage, BaseMessage, MessageListParams } from "@sendbird/chat/message";

import { NotficationChannelStateInterface, initialState } from "./initialState";
import { actionTypes, ActionType } from "./actionTypes";
import compareIds from '../../../../utils/compareIds';
import { filterMessageListParams } from '../../../../utils';
import { MAX_MESSAGE_COUNT } from "../consts";

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
      return {
        ...initialState,
        messageListParams: action?.payload?.messageListParams as MessageListParams,
      };
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
      const messages = action.payload.messages as BaseMessage[] || [];
      return {
        ...state,
        allMessages: messages,
        uiState: 'initialized',
        hasMore: messages?.length === MAX_MESSAGE_COUNT,
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
      const messages = action.payload.messages as BaseMessage[] || [];
      if (channel?.url !== state?.currentNotificationChannel?.url) {
        return state;
      }

      const deDuplucateAllMessages = state.allMessages.filter((m) => {
        return !messages.find((m2) => compareIds(m.messageId, m2.messageId));
      });
      return {
        ...state,
        hasMore: messages?.length === MAX_MESSAGE_COUNT,
        allMessages: [
          ...deDuplucateAllMessages,
          ...messages,
        ],
      };
    }
    case actionTypes.FETCH_PREV_MESSAGES_FAILURE: {
      return state;
    }
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const channel = action.payload.channel as GroupChannel;
      const message = action.payload.message as AdminMessage;
      if (channel?.url !== state?.currentNotificationChannel?.url) {
        return state;
      }
      // filter out messaegs using MessageListQuery
      if (state?.messageListParams && !filterMessageListParams(state?.messageListParams, message)) {
        return state;
      }
      return {
        ...state,
        allMessages: [
          message,
          ...state?.allMessages,
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
