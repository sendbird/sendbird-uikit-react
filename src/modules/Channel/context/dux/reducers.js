import format from 'date-fns/format';

import * as actionTypes from './actionTypes';
import compareIds from '../../../../utils/compareIds';
import { PREV_RESULT_SIZE, NEXT_RESULT_SIZE } from '../const';
import { passUnsuccessfullMessages, mergeAndSortMessages } from '../utils';
import { filterMessageListParams, getSendingMessageStatus } from '../../../../utils';

const {
  SUCCEEDED,
} = getSendingMessageStatus();
const getOldestMessageTimeStamp = (messages = []) => {
  const oldestMessage = messages[0];
  return (oldestMessage && oldestMessage.createdAt) || null;
};
const getLatestMessageTimeStamp = (messages = []) => {
  const latestMessage = messages[messages.length - 1];
  return (latestMessage && latestMessage.createdAt) || null;
};

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.RESET_MESSAGES:
      return {
        ...state,
        // when user switches channel, if the previous channel `hasMorePrev`
        // the onScroll gets called twice, setting hasMorePrev false prevents this
        hasMorePrev: false,
        hasMoreNext: false,
        allMessages: [],
      };
    case actionTypes.FETCH_INITIAL_MESSAGES_START: {
      return {
        ...state,
        loading: true,
        allMessages: [
          ...state.allMessages.filter((m) => (
            m.sendingStatus !== SUCCEEDED
          )),
        ],
      };
    }
    case actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS: {
      const {
        currentGroupChannel,
        messages,
      } = action.payload;
      if (!(currentGroupChannel?.url === state.currentGroupChannel?.url)) {
        return state;
      }
      const oldestMessageTimeStamp = getOldestMessageTimeStamp(messages);
      const latestMessageTimeStamp = getLatestMessageTimeStamp(messages);
      return {
        ...state,
        loading: false,
        initialized: true,
        hasMorePrev: true,
        hasMoreNext: true,
        oldestMessageTimeStamp,
        latestMessageTimeStamp,
        allMessages: [...messages],
      };
    }
    case actionTypes.FETCH_PREV_MESSAGES_SUCCESS: {
      const {
        currentGroupChannel,
        messages,
      } = action.payload;
      if (!(currentGroupChannel?.url === state.currentGroupChannel?.url)) {
        return state;
      }
      const hasMorePrev = ((messages?.length ?? 0)
        >= (state?.messageListParams?.prevResultSize ?? PREV_RESULT_SIZE) + 1);
      const oldestMessageTimeStamp = getOldestMessageTimeStamp(messages);

      // Remove duplicated messages
      const duplicatedMessageIds = [];
      const updatedOldMessages = state.allMessages.map((msg) => {
        const duplicatedMessage = messages.find(({ messageId }) => (
          compareIds(messageId, msg.messageId)
        ));
        if (!duplicatedMessage) {
          return msg;
        }
        duplicatedMessageIds.push(duplicatedMessage.messageId);
        return (duplicatedMessage.updatedAt > msg.updatedAt) ? duplicatedMessage : msg;
      });
      const filteredNewMessages = (duplicatedMessageIds.length > 0)
        ? messages.filter((msg) => (
          !duplicatedMessageIds.find((messageId) => compareIds(messageId, msg.messageId))
        ))
        : messages;

      return {
        ...state,
        hasMorePrev,
        oldestMessageTimeStamp,
        allMessages: [
          ...filteredNewMessages,
          ...updatedOldMessages,
        ],
      };
    }
    case actionTypes.FETCH_NEXT_MESSAGES_SUCCESS: {
      const {
        currentGroupChannel,
        messages,
      } = action.payload;
      if (!(currentGroupChannel?.url === state.currentGroupChannel?.url)) {
        return state;
      }
      const hasMoreNext = ((messages?.length ?? 0)
        === (state?.messageListParams?.nextResultSize ?? NEXT_RESULT_SIZE) + 1);
      const latestMessageTimeStamp = getLatestMessageTimeStamp(messages);

      // sort ~
      const sortedMessages = mergeAndSortMessages(state.allMessages, messages);

      return {
        ...state,
        hasMoreNext,
        latestMessageTimeStamp,
        allMessages: sortedMessages,
      };
    }
    case actionTypes.FETCH_INITIAL_MESSAGES_FAILURE:
    case actionTypes.FETCH_PREV_MESSAGES_FAILURE:
    case actionTypes.FETCH_NEXT_MESSAGES_FAILURE: {
      const { currentGroupChannel } = action.payload;
      if (currentGroupChannel?.url !== state?.currentGroupChannel?.url) {
        return state;
      }
      return {
        ...state,
        loading: false,
        initialized: false,
        allMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
        oldestMessageTimeStamp: null,
        latestMessageTimeStamp: null,
      };
    }
    case actionTypes.SEND_MESSAGE_START:
      // Message should not be spread here
      // it will loose some methods like `isUserMessage`
      return {
        ...state,
        localMessages: [...state.localMessages, action.payload],
      };
    case actionTypes.SEND_MESSAGE_SUCESS: {
      const message = action.payload;
      const filteredMessages = state.allMessages.filter((m) => (
        m?.reqId !== message?.reqId
      ));
      // [Policy] Pending messages and failed messages
      // must always be at the end of the message list
      return {
        ...state,
        allMessages: [...filteredMessages, message],
        localMessages: state.localMessages.filter((m) => m?.reqId !== message?.reqId),
      };
    }
    case actionTypes.SEND_MESSAGE_FAILURE: {
      // eslint-disable-next-line no-param-reassign
      action.payload.failed = true;
      return {
        ...state,
        localMessages: state.localMessages.map((m) => (
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
        currentGroupChannel: null,
        isInvalid: true,
      };
    }
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const { channel, message } = action.payload;
      const { members } = channel;
      const { sender } = message;
      const { currentGroupChannel = {}, unreadSince } = state;
      const currentGroupChannelUrl = currentGroupChannel?.url;

      if (!compareIds(channel?.url, currentGroupChannelUrl)) {
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
        currentGroupChannel: channel,
        unreadSince: state?.unreadSince ? unreadSince : format(new Date(), 'p MMM dd'),
        allMessages: passUnsuccessfullMessages(state.allMessages, message),
      };
    }
    case actionTypes.ON_MESSAGE_UPDATED: {
      const { channel, message } = action.payload;
      const currentGroupChannelUrl = state?.currentGroupChannel?.url || '';
      if (!compareIds(channel?.url, currentGroupChannelUrl)) {
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
        allMessages: state.allMessages.map((m) => {
          if (compareIds(m.messageId, message.messageId)) {
            return message;
          }
          if (compareIds(m.parentMessageId, message.messageId)) {
            m.parentMessage = message;// eslint-disable-line no-param-reassign
          }
          return m;
        }),
      };
    }
    case actionTypes.ON_MESSAGE_THREAD_INFO_UPDATED: {
      const { channel, event } = action.payload;
      const { channelUrl, threadInfo, targetMessageId } = event;
      const currentGroupChannelUrl = state?.currentGroupChannel?.url || '';
      if (
        !compareIds(channel?.url, currentGroupChannelUrl)
        || !compareIds(channel?.url, channelUrl)
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
    case actionTypes.RESEND_MESSAGE_START:
      return {
        ...state,
        allMessages: state.allMessages.map((m) => (
          compareIds(m.reqId, action.payload.reqId)
            ? action.payload
            : m
        )),
      };
    case actionTypes.MARK_AS_READ:
      if (state.currentGroupChannel?.url !== action.payload?.channel?.url) {
        return state;
      }
      return {
        ...state,
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
        localMessages: state.localMessages.filter((m) => (
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
    case actionTypes.ON_FILE_INFO_UPLOADED: {
      const {
        channelUrl,
        requestId,
        index,
        uploadableFileInfo,
        error,
      } = action.payload;
      if (!compareIds(channelUrl, state?.currentGroupChannel?.url)) {
        return state;
      }
      /**
       * We don't have to do anything here because
       * onFailed() will be called so handle error there instead.
       */
      if (error) return state;
      const { localMessages } = state;
      const messageToUpdate = localMessages.find((message) => (
        compareIds(message.reqId, requestId)
      ));
      const fileInfoList = messageToUpdate.messageParams?.fileInfoList;
      if (Array.isArray(fileInfoList)) {
        fileInfoList[index] = uploadableFileInfo;
      }
      return {
        ...state,
        localMessages,
      };
    }
    default:
      return state;
  }
}
