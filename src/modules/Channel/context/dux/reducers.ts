import format from 'date-fns/format';
import {
  MessageListParams,
  MultipleFilesMessage,
  SendingStatus,
} from '@sendbird/chat/message';
import { match, P } from 'ts-pattern';

import * as channelActions from './actionTypes';
import type { ChannelActionTypes } from './actionTypes';
import compareIds from '../../../../utils/compareIds';
import { PREV_RESULT_SIZE, NEXT_RESULT_SIZE } from '../const';
import { passUnsuccessfullMessages, mergeAndSortMessages } from '../utils';
import {
  CoreMessageType,
  filterMessageListParams,
  isSendableMessage,
} from '../../../../utils';
import { ChannelInitialStateType } from './initialState';

const getOldestMessageTimeStamp = (messages: CoreMessageType[] = []) => {
  const oldestMessage = messages[0];
  return (oldestMessage && oldestMessage.createdAt) || null;
};
const getLatestMessageTimeStamp = (messages: CoreMessageType[] = []) => {
  const latestMessage = messages[messages.length - 1];
  return (latestMessage && latestMessage.createdAt) || null;
};

function hasReqId<T extends object>(
  message: T,
): message is T & { reqId: string } {
  return 'reqId' in message;
}

export default function channelReducer(
  state: ChannelInitialStateType,
  action: ChannelActionTypes,
): ChannelInitialStateType {
  return match(action)
    .with({ type: channelActions.RESET_MESSAGES }, () => {
      return {
        ...state,
        // when user switches channel, if the previous channel `hasMorePrev`
        // the onScroll gets called twice, setting hasMorePrev false prevents this
        hasMorePrev: false,
        hasMoreNext: false,
        allMessages: [],
      };
    })
    .with({ type: channelActions.FETCH_INITIAL_MESSAGES_START }, () => {
      return {
        ...state,
        loading: true,
        allMessages: state.allMessages.filter((m) => isSendableMessage(m)
          ? m.sendingStatus !== SendingStatus.SUCCEEDED
          : true,
        ),
      };
    })
    .with({ type: channelActions.FETCH_INITIAL_MESSAGES_SUCCESS }, (action) => {
      const { currentGroupChannel, messages } = action.payload;
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
    })
    .with({ type: channelActions.FETCH_PREV_MESSAGES_SUCCESS }, (action) => {
      const { currentGroupChannel, messages } = action.payload;
      if (!(currentGroupChannel?.url === state.currentGroupChannel?.url)) {
        return state;
      }
      const hasMorePrev = (messages?.length ?? 0)
        >= (state?.messageListParams?.prevResultSize ?? PREV_RESULT_SIZE) + 1;
      const oldestMessageTimeStamp = getOldestMessageTimeStamp(messages);

      // Remove duplicated messages
      const duplicatedMessageIds = [];
      const updatedOldMessages = state.allMessages.map((msg) => {
        const duplicatedMessage = messages.find(({ messageId }) => compareIds(messageId, msg.messageId),
        );
        if (!duplicatedMessage) {
          return msg;
        }
        duplicatedMessageIds.push(duplicatedMessage.messageId);
        return duplicatedMessage.updatedAt > msg.updatedAt
          ? duplicatedMessage
          : msg;
      });
      const filteredNewMessages = duplicatedMessageIds.length > 0
        ? messages.filter(
          (msg) => !duplicatedMessageIds.find((messageId) => compareIds(messageId, msg.messageId),
          ),
        )
        : messages;

      return {
        ...state,
        hasMorePrev,
        oldestMessageTimeStamp,
        allMessages: [...filteredNewMessages, ...updatedOldMessages],
      };
    })
    .with({ type: channelActions.FETCH_NEXT_MESSAGES_SUCCESS }, (action) => {
      const { currentGroupChannel, messages } = action.payload;
      if (!(currentGroupChannel?.url === state.currentGroupChannel?.url)) {
        return state;
      }
      const hasMoreNext = (messages?.length ?? 0)
        === (state?.messageListParams?.nextResultSize ?? NEXT_RESULT_SIZE) + 1;
      const latestMessageTimeStamp = getLatestMessageTimeStamp(messages);

      // sort ~
      const sortedMessages = mergeAndSortMessages(state.allMessages, messages);

      return {
        ...state,
        hasMoreNext,
        latestMessageTimeStamp,
        allMessages: sortedMessages,
      };
    })
    .with(
      {
        type: P.union(
          channelActions.FETCH_INITIAL_MESSAGES_FAILURE,
          channelActions.FETCH_PREV_MESSAGES_FAILURE,
          channelActions.FETCH_NEXT_MESSAGES_FAILURE,
        ),
      },
      (action) => {
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
      },
    )
    .with({ type: channelActions.SEND_MESSAGE_START }, (action) => {
      // Message should not be spread here
      // it will loose some methods like `isUserMessage`
      return {
        ...state,
        localMessages: [...state.localMessages, action.payload],
      };
    })
    .with({ type: channelActions.SEND_MESSAGE_SUCCESS }, (action) => {
      const message = action.payload;
      const filteredMessages = state.allMessages.filter(
        (m) => hasReqId(m) && m?.reqId !== message?.reqId,
      );
      // [Policy] Pending messages and failed messages
      // must always be at the end of the message list
      return {
        ...state,
        allMessages: [...filteredMessages, message],
        localMessages: state.localMessages.filter(
          (m) => hasReqId(m) && m?.reqId !== message?.reqId,
        ),
      };
    })
    .with({ type: channelActions.SEND_MESSAGE_FAILURE }, (action) => {
      // @ts-ignore
      action.payload.failed = true;
      return {
        ...state,
        localMessages: state.localMessages.map((m) => compareIds(hasReqId(m) && m.reqId, action.payload.reqId)
          ? action.payload
          : m,
        ),
      };
    })
    .with({ type: channelActions.SET_CURRENT_CHANNEL }, (action) => {
      return {
        ...state,
        currentGroupChannel: action.payload,
        isInvalid: false,
      };
    })
    .with({ type: channelActions.SET_CHANNEL_INVALID }, () => {
      return {
        ...state,
        currentGroupChannel: null,
        isInvalid: true,
      };
    })
    .with({ type: channelActions.ON_MESSAGE_RECEIVED }, (action) => {
      const { channel, message } = action.payload;
      const { members } = channel;
      const { sender } = message;
      const { currentGroupChannel } = state;

      const currentGroupChannelUrl = currentGroupChannel?.url;

      if (!compareIds(channel?.url, currentGroupChannelUrl)) {
        return state;
      }
      // Excluded overlapping messages
      if (
        state.allMessages.some((msg) => msg.messageId === message.messageId)
      ) {
        return state;
      }
      // Filter by userFilledQuery
      if (
        state.messageListParams
        && !filterMessageListParams(
          state.messageListParams as MessageListParams,
          message,
        )
      ) {
        return state;
      }

      if (message.isAdminMessage && message.isAdminMessage()) {
        return {
          ...state,
          allMessages: passUnsuccessfullMessages(state.allMessages, message),
        };
      }

      // Update members when sender profileUrl, nickname, friendName has been changed
      const senderMember = members?.find((m) => m?.userId === sender?.userId);
      if (
        senderMember?.profileUrl !== sender?.profileUrl
        || senderMember?.friendName !== sender?.friendName
        || senderMember?.nickname !== sender?.nickname
      ) {
        // @ts-ignore
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
        unreadSince: state.unreadSince ?? format(new Date(), 'p MMM dd'),
        unreadSinceDate: state.unreadSinceDate ?? new Date(),
        allMessages: passUnsuccessfullMessages(state.allMessages, message),
      };
    })
    .with({ type: channelActions.ON_MESSAGE_UPDATED }, (action) => {
      const { channel, message } = action.payload;
      const currentGroupChannelUrl = state?.currentGroupChannel?.url || '';
      if (!compareIds(channel?.url, currentGroupChannelUrl)) {
        return state; // Ignore event when it is not for the current channel
      }
      if (
        state.messageListParams
        && !filterMessageListParams(
          state.messageListParams as MessageListParams,
          message,
        )
      ) {
        // Delete the message if it doesn't match to the params anymore
        return {
          ...state,
          allMessages: state.allMessages.filter(
            (m) => !compareIds(m.messageId, message?.messageId),
          ),
        };
      }
      return {
        ...state,
        allMessages: state.allMessages.map((m) => {
          if (compareIds(m.messageId, message.messageId)) {
            return message;
          }
          if (compareIds(m.parentMessageId, message.messageId)) {
            m.parentMessage = message; // eslint-disable-line no-param-reassign
          }
          return m;
        }),
      };
    })
    .with({ type: channelActions.ON_MESSAGE_THREAD_INFO_UPDATED }, (action) => {
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
    })
    .with({ type: channelActions.RESEND_MESSAGE_START }, (action) => {
      return {
        ...state,
        allMessages: state.allMessages.map((m) => compareIds(hasReqId(m) && m.reqId, action.payload.reqId)
          ? action.payload
          : m,
        ),
      };
    })
    .with({ type: channelActions.MARK_AS_READ }, (action) => {
      if (state.currentGroupChannel?.url !== action.payload?.channel?.url) {
        return state;
      }
      return {
        ...state,
        unreadSince: null,
        unreadSinceDate: null,
      };
    })
    .with({ type: channelActions.ON_MESSAGE_DELETED }, (action) => {
      return {
        ...state,
        allMessages: state.allMessages.filter(
          (m) => !compareIds(m.messageId, action.payload),
        ),
      };
    })
    .with({ type: channelActions.ON_MESSAGE_DELETED_BY_REQ_ID }, (action) => {
      return {
        ...state,
        localMessages: state.localMessages.filter(
          (m) => !compareIds(hasReqId(m) && m.reqId, action.payload),
        ),
      };
    })
    .with({ type: channelActions.SET_EMOJI_CONTAINER }, (action) => {
      return {
        ...state,
        emojiContainer: action.payload,
      };
    })
    .with({ type: channelActions.ON_REACTION_UPDATED }, (action) => {
      return {
        ...state,
        allMessages: state.allMessages.map((m) => {
          if (compareIds(m.messageId, action.payload.messageId)) {
            if (
              m.applyReactionEvent
              && typeof m.applyReactionEvent === 'function'
            ) {
              m.applyReactionEvent(action.payload);
            }
            return m;
          }
          return m;
        }),
      };
    })
    .with({ type: channelActions.MESSAGE_LIST_PARAMS_CHANGED }, (action) => {
      return {
        ...state,
        messageListParams: action.payload,
      };
    })
    .with({ type: channelActions.ON_FILE_INFO_UPLOADED }, (action) => {
      const { channelUrl, requestId, index, uploadableFileInfo, error } = action.payload;
      if (!compareIds(channelUrl, state?.currentGroupChannel?.url)) {
        return state;
      }
      /**
       * We don't have to do anything here because
       * onFailed() will be called so handle error there instead.
       */
      if (error) return state;
      const { localMessages } = state;
      const messageToUpdate = localMessages.find((message) => compareIds(hasReqId(message) && message.reqId, requestId),
      );
      const fileInfoList = (messageToUpdate as MultipleFilesMessage)
        .messageParams?.fileInfoList;
      if (Array.isArray(fileInfoList)) {
        fileInfoList[index] = uploadableFileInfo;
      }
      return {
        ...state,
        localMessages,
      };
    })
    .otherwise(() => state);
}
