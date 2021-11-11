import { State as initialStateInterface } from './initialState';
import * as actionTypes from './actionTypes';

import compareIds from '../../../../utils/compareIds.js';

/* eslint-disable  @typescript-eslint/no-explicit-any */
// @ts-ignore: Unreachable code error
interface ActionInterface {
  type: string;
  payload?: any;
}

export default function reducer(
  state: initialStateInterface,
  action: ActionInterface,
): initialStateInterface {
  switch (action.type) {
    case actionTypes.RESET_MESSAGES: {
      return {
        ...state,
        allMessages: [],
      };
    }

    case actionTypes.SET_CURRENT_CHANNEL: {
      const gottenChannel = action.payload;
      const operators = gottenChannel.operators;
      if (
        !state.isInvalid
        && state.currentOpenChannel
        && state.currentOpenChannel.url
        && (state.currentOpenChannel.url === gottenChannel.url)
      ) {
        return state;
      }
      return {
        ...state,
        currentOpenChannel: gottenChannel,
        isInvalid: false,
        operators: operators,
        participants: operators,
        bannedParticipantIds: [],
        mutedParticipantIds: [],
      };
    }
    case actionTypes.SET_CHANNEL_INVALID: {
      return {
        ...state,
        isInvalid: true,
      };
    }
    case actionTypes.GET_PREV_MESSAGES_START: {
      return {
        ...state,
        loading: true,
      };
    }
    case actionTypes.GET_PREV_MESSAGES_SUCESS:
    case actionTypes.GET_PREV_MESSAGES_FAIL: {
      const isFailed = (action.type === actionTypes.GET_PREV_MESSAGES_FAIL);
      const {
        currentOpenChannel = {},
        messages = [],
        hasMore,
        lastMessageTimestamp,
      } = action.payload;
      const actionChannelUrl = currentOpenChannel.url;
      const receivedMessages = isFailed ? [] : messages;
      const _hasMore = isFailed ? false : hasMore;
      const _lastMessageTimestamp = isFailed ? 0 : lastMessageTimestamp;

      const stateChannel = state.currentOpenChannel;
      const stateChannelUrl = stateChannel.url;

      if (actionChannelUrl !== stateChannelUrl) {
        return state;
      }

      const filteredAllMessages = state.allMessages.filter((message) => (
        !(receivedMessages.find(({ messageId }) => compareIds(messageId, message.messageId)))
      ));
      return {
        ...state,
        loading: false,
        initialized: true,
        hasMore: _hasMore,
        lastMessageTimestamp: _lastMessageTimestamp,
        allMessages: [
          ...receivedMessages,
          ...filteredAllMessages,
        ],
      };
    }
    case actionTypes.SENDING_MESSAGE_START: {
      const {
        message,
        channel,
      } = action.payload;
      if (channel.url !== state.currentOpenChannel.url) {
        return state;
      }
      return {
        ...state,
        allMessages: [
          ...state.allMessages,
          { ...message },
        ],
      };
    }
    case actionTypes.SENDING_MESSAGE_SUCCEEDED: {
      const sentMessage = action.payload;
      const newMessages = state.allMessages.map((m) => (
        compareIds(m.reqId, sentMessage.reqId) ? sentMessage : m
      ));
      return {
        ...state,
        allMessages: newMessages,
      };
    }
    case actionTypes.SENDING_MESSAGE_FAILED: {
      const sentMessage = action.payload;
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.reqId, sentMessage.reqId) ? sentMessage : m
        )),
      };
    }
    case actionTypes.TRIM_MESSAGE_LIST: {
      const { allMessages } = state;
      const messageLimit = action.payload?.messageLimit;
      if (messageLimit
        && messageLimit > 0
        && allMessages?.length > messageLimit
      ) {
        const sliceAt = allMessages.length - messageLimit;
        return {
          ...state,
          allMessages: allMessages.slice(sliceAt),
        }
      }
      return state;
    }
    case actionTypes.RESENDING_MESSAGE_START: {
      const eventedChannel = action.payload.channel;
      const resentMessage = action.payload.message;
      if (eventedChannel.url !== state.currentOpenChannel.url) {
        return state;
      }
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.reqId, resentMessage.reqId) ? resentMessage : m
        )),
      };
    }
    case actionTypes.FETCH_PARTICIPANT_LIST: {
      const eventedChannel = action.payload.channel;
      const fetchedParticipantList = action.payload.users;
      if (eventedChannel.url !== state.currentOpenChannel.url) {
        return state;
      }
      return {
        ...state,
        participants: [... state.participants, ...fetchedParticipantList],
        // Should check duplication
      };
    }
    case actionTypes.FETCH_BANNED_USER_LIST: {
      const eventedChannel = action.payload.channel;
      const fetchedBannedUserList = action.payload.users;
      if (
        (eventedChannel.url !== state.currentOpenChannel.url)
        || !(fetchedBannedUserList.every(user => typeof user.userId === 'string'))
      ) {
        return state;
      }
      return {
        ...state,
        bannedParticipantIds: [
          ... state.bannedParticipantIds,
          ...fetchedBannedUserList.map(user => user.userId),
        ],
        // Should check duplication
      };
    }
    case actionTypes.FETCH_MUTED_USER_LIST: {
      const eventedChannel = action.payload.channel;
      const fetchedMutedUserList = action.payload.users;
      if (
        (eventedChannel.url !== state.currentOpenChannel.url)
        || !(fetchedMutedUserList.every(user => typeof user.userId === 'string'))
      ) {
        return state;
      }
      return {
        ...state,
        mutedParticipantIds: [
          ... state.bannedParticipantIds,
          ...fetchedMutedUserList.map(user => user.userId),
        ],
        // Should check duplication
      };
    }
    // events
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const eventedChannel = action.payload.channel;
      const receivedMessage = action.payload.message;

      const {
        currentOpenChannel
      } = state;

      if (
        !compareIds(eventedChannel.url, currentOpenChannel.url)
        || (
          !(state.allMessages.map(
            (message) => message.messageId).indexOf(receivedMessage.messageId) < 0
        ))
      ) {
        return state;
      }

      return {
        ...state,
        allMessages: [...state.allMessages, receivedMessage],
      };
    }
    case actionTypes.ON_MESSAGE_UPDATED: {
      const eventedChannel = action.payload.channel;
      const updatedMessage = action.payload.message;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== eventedChannel.url)) {
        return state;
      }
      return {
        ...state,
        allMessages: state.allMessages.map((message) => (
          message.isIdentical(updatedMessage)
            ? updatedMessage
            : message
        )),
      };
    }
    case actionTypes.ON_MESSAGE_DELETED: {
      const eventedChannel = action.payload.channel;
      const deletedMessageId = action.payload.messageId;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== eventedChannel.url)) {
        return state;
      }
      return {
        ...state,
        allMessages: state.allMessages.filter((message) => (
          !compareIds(message.messageId, deletedMessageId)
        )),
      };
    }
    case actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID: {
      return {
        ...state,
        allMessages: state.allMessages.filter((m) => (
          !compareIds(m.reqId, action.payload)
        )),
      };
    }
    case actionTypes.ON_OPERATOR_UPDATED: {
      const eventedChannel = action.payload.channel;
      const updatedOperators = action.payload.operators;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== eventedChannel.url)) {
        return state;
      }
      return {
        ...state,
        currentOpenChannel: {
          ...state.currentOpenChannel,
          operators: updatedOperators,
        },
        operators: updatedOperators,
      };
    }
    case actionTypes.ON_USER_ENTERED: {
      const eventedChannel = action.payload.channel;
      const enteredUser = action.payload.user;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== eventedChannel.url)) {
        return state;
      }
      return {
        ...state,
        participants: [...state.participants, enteredUser],
      };
    }
    case actionTypes.ON_USER_EXITED: {
      const eventedChannel = action.payload.channel;
      const exitedUser = action.payload.user;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== eventedChannel.url)) {
        return state;
      }
      return {
        ...state,
        participants: state.participants.filter((participant) => (
          !compareIds(participant.userId, exitedUser.userId)
        )),
      };
    }
    case actionTypes.ON_USER_MUTED: {
      const eventedChannel = action.payload.channel;
      const mutedUser = action.payload.user;
      const currentChannel = state.currentOpenChannel;
      if (
        !currentChannel
        || (currentChannel.url && (currentChannel.url !== eventedChannel.url))
        || state.mutedParticipantIds.indexOf(mutedUser.userId) >= 0
      ) {
        return state;
      }
      return {
        ...state,
        mutedParticipantIds: [...state.mutedParticipantIds, mutedUser.userId],
      };
    }
    case actionTypes.ON_USER_UNMUTED: {
      const eventedChannel = action.payload.channel;
      const unmutedUser = action.payload.user;
      const currentChannel = state.currentOpenChannel;
      if (
        !currentChannel
        || (currentChannel.url && (currentChannel.url !== eventedChannel.url))
        || state.mutedParticipantIds.indexOf(unmutedUser.userId) < 0
      ) {
        return state;
      }
      return {
        ...state,
        mutedParticipantIds: state.mutedParticipantIds.filter(userId => userId !== unmutedUser.userId),
      };
    }
    case actionTypes.ON_USER_BANNED: {
      const eventedChannel = action.payload.channel;
      const bannedUser = action.payload.user;
      const currentChannel = state.currentOpenChannel;
      if (
        !currentChannel
        || (currentChannel.url && (currentChannel.url !== eventedChannel.url))
        || state.bannedParticipantIds.indexOf(bannedUser.userId) >= 0
      ) {
        return state;
      }
      return {
        ...state,
        bannedParticipantIds: [...state.bannedParticipantIds, bannedUser.userId],
      };
    }
    case actionTypes.ON_USER_UNBANNED: {
      const eventedChannel = action.payload.channel;
      const unbannedUser = action.payload.user;
      const currentChannel = state.currentOpenChannel;
      if (
        !currentChannel
        || (currentChannel.url && (currentChannel.url !== eventedChannel.url))
        || state.bannedParticipantIds.indexOf(unbannedUser.userId) < 0
      ) {
        return state;
      }
      return {
        ...state,
        bannedParticipantIds: state.bannedParticipantIds.filter(userId => userId !== unbannedUser.userId),
      };
    }
    case actionTypes.ON_CHANNEL_FROZEN: {
      const frozenChannel = action.payload;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== frozenChannel.url)) {
        return state;
      }
      return {
        ...state,
        frozen: true,
      };
    }
    case actionTypes.ON_CHANNEL_UNFROZEN: {
      const unfrozenChannel = action.payload;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== unfrozenChannel.url)) {
        return state;
      }
      return {
        ...state,
        frozen: false,
      };
    }
    case actionTypes.ON_CHANNEL_CHANGED: {
      const changedChannel = action.payload;
      const currentChannel = state.currentOpenChannel;
      if (!currentChannel || currentChannel.url && (currentChannel.url !== changedChannel.url)) {
        return state;
      }
      return {
        ...state,
        currentOpenChannel: changedChannel,
      };
    }
    case actionTypes.ON_META_DATA_CREATED: {
      // const eventedChannel = action.payload.channel;
      // const createdMetaData = action.payload.metaData;
      // return {
      //   ...state
      // };
      return state;
    }
    case actionTypes.ON_META_DATA_UPDATED: {
      // const eventedChannel = action.payload.channel;
      // const updatedMetaData = action.payload.metaData;
      // return {
      //   ...state
      // };
      return state;
    }
    case actionTypes.ON_META_DATA_DELETED: {
      // const eventedChannel = action.payload.channel;
      // const deletedMetaDataKeys = action.payload.metaDataKeys;
      // return {
      //   ...state
      // };
      return state;
    }
    case actionTypes.ON_META_COUNTERS_CREATED: {
      // const eventedChannel = action.payload.channel;
      // const createdMetaCounter = action.payload.metaCounter;
      // return {
      //   ...state
      // };
      return state;
    }
    case actionTypes.ON_META_COUNTERS_UPDATED: {
      // const eventedChannel = action.payload.channel;
      // const updatedMetaCounter = action.payload.metaCounter;
      // return {
      //   ...state
      // };
      return state;
    }
    case actionTypes.ON_META_COUNTERS_DELETED: {
      // const eventedChannel = action.payload.channel;
      // const deletedMetaCounterKeys = action.payload.metaCounterKeys;
      // return {
      //   ...state
      // };
      return state;
    }
    case actionTypes.ON_MENTION_RECEIVED: {
      // const eventedChannel = action.payload.channel;
      // const mentionedMessage = action.payload.message;
      // return {
      //   ...state
      // };
      return state;
    }
    default:
      return state;
  }
}
