import format from 'date-fns/format';

import * as actionTypes from './actionTypes';
import initialState from './initialState';

import compareIds from '../../../../utils/compareIds';
import { passUnsuccessfullMessages, hasOwnProperty } from '../utils';
import { filterMessageListParams, getSendingMessageStatus } from '../../../../utils';

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
        // when user switches channel, if the previous channel `hasMorePrev`
        // the onScroll gets called twice, setting hasMorePrev false prevents this
        hasMorePrev: false,
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
      const {
        hasMorePrev,
        hasMoreNext,
        currentGroupChannel = {},
        oldestMessageTimeStamp,
        latestMessageTimeStamp,
    } = action.payload;
      const hasHasMoreNext = hasOwnProperty('hasMoreNext')(action.payload);
      const hasLatestFetchedMessageTimeStamp = hasOwnProperty('latestMessageTimeStamp')(action.payload);
      const stateChannel = state.currentGroupChannel || {};
      const stateChannelUrl = stateChannel.url;
      const actionChannelUrl = currentGroupChannel.url;
      if (actionChannelUrl !== stateChannelUrl) {
        return state;
      }

      // remove duplicate messages
      const duplicatedMessageIds = [];
      const updatedAllMessages = state.allMessages.map((msg) => {
        const duplicatedMessage = receivedMessages.find(({ messageId }) => (
          compareIds(messageId, msg.messageId)
        ));
        if (!duplicatedMessage) {
          return msg;
        }
        duplicatedMessageIds.push(duplicatedMessage.messageId);
        return (duplicatedMessage.updatedAt > msg.updatedAt) ? duplicatedMessage : msg;
      });
      const filteredNewMessages = (duplicatedMessageIds.length > 0)
        ? receivedMessages.filter((msg) => (
          !duplicatedMessageIds.find((messageId) => compareIds(messageId, msg.messageId))
        ))
        : receivedMessages;
      return {
        ...state,
        loading: false,
        initialized: true,
        hasMorePrev: hasMorePrev,
        oldestMessageTimeStamp: oldestMessageTimeStamp,
        // if present change else, keep
        ...(hasHasMoreNext && {
          hasMoreNext: hasMoreNext,
        }),
        ...(hasLatestFetchedMessageTimeStamp && {
          latestMessageTimeStamp: action.payload.latestMessageTimeStamp,
        }),
        allMessages: [
          ...filteredNewMessages,
          ...updatedAllMessages,
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
      const duplicatedMessageIds = [];
      const updatedAllMessages = state.allMessages.map((msg) => {
        const duplicatedMessage = receivedMessages.find(({ messageId }) => (
          compareIds(messageId, msg.messageId)
        ));
        if (!duplicatedMessage) {
          return msg;
        }
        duplicatedMessageIds.push(duplicatedMessage.messageId);
        return (duplicatedMessage.updatedAt > msg.updatedAt) ? duplicatedMessage : msg;
      });
      const filteredNewMessages = (duplicatedMessageIds.length > 0)
        ? receivedMessages.filter((msg) => (
          !duplicatedMessageIds.find((messageId) => compareIds(messageId, msg.messageId))
        ))
        : receivedMessages;
      return {
        ...state,
        loading: false,
        initialized: true,
        hasMorePrev: action.payload.hasMorePrev,
        oldestMessageTimeStamp: action.payload.oldestMessageTimeStamp,
        hasMoreNext: action.payload.hasMoreNext,
        latestMessageTimeStamp: action.payload.latestMessageTimeStamp,
        allMessages: [
          ...updatedAllMessages,
          ...filteredNewMessages,
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
        unreadCount: 0,
      };
    }
    case actionTypes.SET_CHANNEL_INVALID: {
      return {
        ...state,
        isInvalid: true,
      };
    }
    case actionTypes.UPDATE_UNREAD_COUNT: {
      console.log('업언카')
      const { channel } = action.payload;
      const { currentGroupChannel = {}, unreadCount } = state;
      const currentGroupChannelUrl = currentGroupChannel.url;
      if (!compareIds(channel.url, currentGroupChannelUrl)) {
        return state;
      }
      return {
        ...state,
        unreadCount: unreadCount + 1,
        unreadSince: unreadCount + 1,
      };
    }
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const { channel, message, scrollToEnd } = action.payload;
      const { members } = channel;
      const { sender } = message;
      let unreadCount = 0;
      const { currentGroupChannel = {}, unreadSince } = state;
      const currentGroupChannelUrl = currentGroupChannel.url;

      if (!compareIds(channel.url, currentGroupChannelUrl)) {
        return state;
      }
      // Excluded overlapping messages
      if (state.allMessages.some((msg) => msg.messageId === message.messageId)) {
        return state;
      }
      // Filter by userFilledQuery
      if (state.messageListParams && !filterMessageListParams(state.messageListParams, message)) {
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

      // Update members when sender profileUrl, nickname, friendName has been changed
      const senderMember = members?.find((m) => (m?.userId === sender?.userId));
      if ((senderMember?.profileUrl !== sender?.profileUrl)
      || (senderMember?.friendName !== sender?.friendName)
      || (senderMember?.nickname !== sender?.nickname)) {
        channel.members = members.map((member) => {
          if (member.userId === sender.userId) {
            return sender;
          }
          return member;
        });
      }

      return {
        ...state,
        unreadCount,
        currentGroupChannel: channel,
        unreadSince: (unreadCount === 1)
          ? format(new Date(), 'p MMM dd')
          : unreadSince,
        allMessages: passUnsuccessfullMessages(state.allMessages, message),
      };
    }
    case actionTypes.ON_MESSAGE_UPDATED: {
      const { channel, message } = action.payload;
      const currentGroupChannelUrl = (state.currentGroupChannel && state.currentGroupChannel.url) || '';
      if (!compareIds(channel.url, currentGroupChannelUrl)) {
        return state; // Ignore event when it is not for the current channel
      }
      if (state.messageListParams && !filterMessageListParams(state.messageListParams, message)) {
        // Delete the message if it doesn't match to the params anymore
        return {
          ...state,
          allMessages: state.allMessages.filter((m) => (
            !compareIds(m.messageId, message?.messageId)
          )),
        };
      }
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.messageId, action.payload.message.messageId)
            ? action.payload.message
            : m
        )),
      };
    }
    case actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED: {
      const { channel, event } = action.payload;
      const { channelUrl, threadInfo, targetMessageId } = event;
      const currentGroupChannelUrl = (state.currentGroupChannel && state.currentGroupChannel.url) || '';
      if (
        !compareIds(channel.url, currentGroupChannelUrl)
        || !compareIds(channel.url, channelUrl)
      ) {
        return state; // Ignore event when it is not for the current channel
      }
      return {
        ...state,
        allMessages: state.allMessages.map((m) => {
          if (compareIds(m.messageId, targetMessageId)) {
            // eslint-disable-next-line no-param-reassign
            m.threadInfo = threadInfo; // Upsert threadInfo to the target message
          }
          return m;
        }),
      };
    }
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
      const { channel } = action.payload;
      if (state.currentGroupChannel?.url !== channel?.url) {
        return state;
      }
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
    case actionTypes.MESSAGE_LIST_PARAMS_CHANGED: {
      return {
        ...state,
        messageListParams: action.payload,
      };
    }
    default:
      return state;
  }
}
