import format from 'date-fns/format';

import * as actionTypes from './actionTypes';
import initialState from './initialState';

import compareIds from '../../../utils/compareIds';
import { passUnsuccessfullMessages, hasOwnProperty } from '../utils';
import { getSendingMessageStatus } from '../../../utils';

const {
  SUCCEEDED,
  FAILED,
  PENDING,
} = getSendingMessageStatus();

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return initialState;
    case actionTypes.RESET_MESSAGES:
      return {
        ...state,
        // when user switches channel, if the previous channel `hasMore`
        // the onScroll gets called twice, setting hasMore false prevents this
        hasMore: false,
        allMessages: [],
      };
    case actionTypes.GET_PREV_MESSAGES_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.CLEAR_SENT_MESSAGES:
      return {
        ...state,
        allMessages: [
          ...state.allMessages.filter((m) => (
            m.sendingStatus !== SUCCEEDED
          )),
        ],
      };
    case actionTypes.GET_PREV_MESSAGES_SUCESS: {
      const receivedMessages = action.payload.messages || [];
      const { currentGroupChannel = {} } = action.payload;

      const stateChannel = state.currentGroupChannel || {};
      const stateChannelUrl = stateChannel.url;
      const actionChannelUrl = currentGroupChannel.url;
      if (actionChannelUrl !== stateChannelUrl) {
        return state;
      }

      // remove duplicate messages
      const filteredAllMessages = state.allMessages.filter((msg) => (
        !(receivedMessages.find(({ messageId }) => compareIds(messageId, msg.messageId)))
      ));

      const hasHasMoreToBottom = hasOwnProperty('hasMoreToBottom')(action.payload);
      const hasLatestFetchedMessageTimeStamp = hasOwnProperty('latestFetchedMessageTimeStamp')(action.payload);
      return {
        ...state,
        loading: false,
        initialized: true,
        hasMore: action.payload.hasMore,
        lastMessageTimeStamp: action.payload.lastMessageTimeStamp,
        // if present change else, keep
        ...(hasHasMoreToBottom && {
          hasMoreToBottom: action.payload.hasMoreToBottom,
        }),
        ...(hasLatestFetchedMessageTimeStamp && {
          latestFetchedMessageTimeStamp: action.payload.latestFetchedMessageTimeStamp,
        }),
        allMessages: [
          ...receivedMessages,
          ...filteredAllMessages,
        ],
      };
    }
    case actionTypes.GET_NEXT_MESSAGES_SUCESS: {
      const receivedMessages = action.payload.messages || [];
      const { currentGroupChannel = {} } = action.payload;

      const stateChannel = state.currentGroupChannel || {};
      const stateChannelUrl = stateChannel.url;
      const actionChannelUrl = currentGroupChannel.url;
      if (actionChannelUrl !== stateChannelUrl) {
        return state;
      }

      // remove duplicate messages
      const filteredAllMessages = state.allMessages.filter((msg) => (
        !(receivedMessages.find(({ messageId }) => compareIds(messageId, msg.messageId)))
      ));

      return {
        ...state,
        loading: false,
        initialized: true,
        hasMore: action.payload.hasMore,
        lastMessageTimeStamp: action.payload.lastMessageTimeStamp,
        hasMoreToBottom: action.payload.hasMoreToBottom,
        latestFetchedMessageTimeStamp: action.payload.latestFetchedMessageTimeStamp,
        allMessages: [
          ...filteredAllMessages,
          ...receivedMessages,
        ],
      };
    }
    case actionTypes.GET_NEXT_MESSAGES_FAILURE: {
      return { ...state };
    }
    case actionTypes.SEND_MESSAGEGE_START:
      return {
        ...state,
        allMessages: [
          ...state.allMessages,
          { ...action.payload },
        ],
      };
    case actionTypes.SEND_MESSAGEGE_SUCESS: {
      const newMessages = state.allMessages.map((m) => (
        compareIds(m.reqId, action.payload.reqId) ? action.payload : m
      ));
      [...newMessages].sort((a, b) => (
        (
          a.sendingStatus
          && b.sendingStatus
          && a.sendingStatus === SUCCEEDED
          && (
            b.sendingStatus === PENDING
            || b.sendingStatus === FAILED
          )
        ) ? -1 : 1
      ));
      return {
        ...state,
        allMessages: newMessages,
      };
    }
    case actionTypes.SEND_MESSAGEGE_FAILURE: {
      // eslint-disable-next-line no-param-reassign
      action.payload.failed = true;
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.reqId, action.payload.reqId)
            ? action.payload
            : m
        )),
      };
    }
    case actionTypes.SET_CURRENT_CHANNEL: {
      return {
        ...state,
        currentGroupChannel: action.payload,
        isInvalid: false,
      };
    }
    case actionTypes.SET_CHANNEL_INVALID: {
      return {
        ...state,
        isInvalid: true,
      };
    }
    case actionTypes.UPDATE_UNREAD_COUNT: {
      const { channel } = action.payload;
      const { currentGroupChannel = {}, unreadCount } = state;
      const currentGroupChannelUrl = currentGroupChannel.url;
      if (!compareIds(channel.url, currentGroupChannelUrl)) {
        return state;
      }
      return {
        ...state,
        unreadSince: unreadCount + 1,
      };
    }
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const { channel, message, scrollToEnd } = action.payload;
      let unreadCount = 0;
      const { currentGroupChannel = {}, unreadSince } = state;
      const currentGroupChannelUrl = currentGroupChannel.url;
      if (!compareIds(channel.url, currentGroupChannelUrl)) {
        return state;
      }
      // Excluded overlapping messages
      if (!(state.allMessages.map((msg) => msg.messageId).indexOf(message.messageId) < 0)) {
        return state;
      }

      unreadCount = state.unreadCount + 1;
      // reset unreadCount if have to scrollToEnd
      if (scrollToEnd) {
        unreadCount = 0;
      }

      if (message.isAdminMessage && message.isAdminMessage()) {
        return {
          ...state,
          allMessages: passUnsuccessfullMessages(state.allMessages, message),
        };
      }
      return {
        ...state,
        unreadCount,
        unreadSince: (unreadCount === 1)
          ? format(new Date(), 'p MMM dd')
          : unreadSince,
        allMessages: passUnsuccessfullMessages(state.allMessages, message),
      };
    }
    case actionTypes.ON_MESSAGE_UPDATED:
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.messageId, action.payload.message.messageId)
            ? action.payload.message
            : m
        )),
      };
    case actionTypes.RESEND_MESSAGEGE_START:
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.reqId, action.payload.reqId)
            ? action.payload
            : m
        )),
      };
    case actionTypes.MARK_AS_READ:
      return {
        ...state,
        unreadCount: 0,
        unreadSince: null,
      };
    case actionTypes.ON_MESSAGE_DELETED:
      return {
        ...state,
        allMessages: state.allMessages.filter((m) => (
          !compareIds(m.messageId, action.payload)
        )),
      };
    case actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID:
      return {
        ...state,
        allMessages: state.allMessages.filter((m) => (
          !compareIds(m.reqId, action.payload)
        )),
      };
    case actionTypes.SET_EMOJI_CONTAINER: {
      return {
        ...state,
        emojiContainer: action.payload,
      };
    }
    case actionTypes.SET_READ_STATUS: {
      return {
        ...state,
        readStatus: action.payload,
      };
    }
    case actionTypes.ON_REACTION_UPDATED: {
      return {
        ...state,
        allMessages: state.allMessages.map((m) => {
          if (compareIds(m.messageId, action.payload.messageId)) {
            if (m.applyReactionEvent && typeof m.applyReactionEvent === 'function') {
              m.applyReactionEvent(action.payload);
            }
            return m;
          }
          return m;
        }),
      };
    }
    default:
      return state;
  }
}
