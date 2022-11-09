import { GroupChannel } from "@sendbird/chat/groupChannel";
import { FileMessage, UserMessage } from "@sendbird/chat/message";
import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from "../../consts";
import { ChannelStateTypes, ParentMessageInfoStateTypes, ThreadListStateTypes } from "../../types";
import { compareIds } from "../utils";
import { ThreadContextActionTypes as actionTypes } from "./actionTypes";
import { ThreadContextInitialState } from "./initialState";

interface ActionInterface {
  type: actionTypes;
  payload?: any;
}

export default function reducer(
  state: ThreadContextInitialState,
  action: ActionInterface,
): ThreadContextInitialState {
  switch (action.type) {
    // initialize
    case actionTypes.INIT_USER_ID: {
      return {
        ...state,
        currentUserId: action.payload,
      };
    }
    case actionTypes.GET_CHANNEL_START: {
      return {
        ...state,
        channelStatus: ChannelStateTypes.LOADING,
        currentChannel: null,
      };
    }
    case actionTypes.GET_CHANNEL_SUCCESS: {
      const groupChannel = action.payload.groupChannel as GroupChannel;
      return {
        ...state,
        channelStatus: ChannelStateTypes.INITIALIZED,
        currentChannel: groupChannel,
        // only support in normal group channel
        isMuted: groupChannel?.members?.find((member) => member?.userId === state.currentUserId)?.isMuted || false,
        isChannelFrozen: groupChannel?.isFrozen || false,
      };
    }
    case actionTypes.GET_CHANNEL_FAILURE: {
      return {
        ...state,
        channelStatus: ChannelStateTypes.INVALID,
        currentChannel: null,
      };
    }
    case actionTypes.SET_EMOJI_CONTAINER: {
      const { emojiContainer } = action.payload;
      return {
        ...state,
        emojiContainer: emojiContainer,
      }
    }
    case actionTypes.GET_PARENT_MESSAGE_START: {
      return {
        ...state,
        parentMessageInfoStatus: ParentMessageInfoStateTypes.LOADING,
        parentMessage: null,
      };
    }
    case actionTypes.GET_PARENT_MESSAGE_SUCCESS: {
      return {
        ...state,
        parentMessageInfoStatus: ParentMessageInfoStateTypes.INITIALIZED,
        parentMessage: action.payload.parentMessage,
      };
    }
    case actionTypes.GET_PARENT_MESSAGE_FAILURE: {
      return {
        ...state,
        parentMessageInfoStatus: ParentMessageInfoStateTypes.INVALID,
        parentMessage: null,
      };
    }
    // fetch threads
    case actionTypes.INITIALIZE_THREAD_LIST_START: {
      return {
        ...state,
        threadListStatus: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }
    case actionTypes.INITIALIZE_THREAD_LIST_SUCCESS: {
      const { parentMessage, anchorMessage, threadedMessages } = action.payload;
      const anchorMessageCreatedAt = (!anchorMessage?.messageId) ? parentMessage?.createdAt : anchorMessage?.createdAt;
      const anchorIndex = threadedMessages.findIndex((message) => message?.createdAt > anchorMessageCreatedAt);
      const prevThreadMessages = anchorIndex > -1 ? threadedMessages.slice(0, anchorIndex) : threadedMessages;
      const anchorThreadMessage = anchorMessage?.messageId ? [anchorMessage] : [];
      const nextThreadMessages = anchorIndex > -1 ? threadedMessages.slice(anchorIndex) : [];
      return {
        ...state,
        threadListStatus: ThreadListStateTypes.INITIALIZED,
        hasMorePrev: anchorIndex === -1 || anchorIndex === PREV_THREADS_FETCH_SIZE,
        hasMoreNext: threadedMessages.length - anchorIndex === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [prevThreadMessages, anchorThreadMessage, nextThreadMessages].flat(),
      };
    }
    case actionTypes.INITIALIZE_THREAD_LIST_FAILURE: {
      return {
        ...state,
        threadListStatus: ThreadListStateTypes.INVALID,
        allThreadMessages: [],
      };
    }
    case actionTypes.GET_NEXT_MESSAGES_START: {
      return {
        ...state,
      };
    }
    case actionTypes.GET_NEXT_MESSAGES_SUCESS: {
      const { threadedMessages } = action.payload;
      return {
        ...state,
        hasMoreNext: threadedMessages.length === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [...state.allThreadMessages, ...threadedMessages],
      };
    }
    case actionTypes.GET_NEXT_MESSAGES_FAILURE: {
      return {
        ...state,
        hasMoreNext: false,
      };
    }
    case actionTypes.GET_PREV_MESSAGES_START: {
      return {
        ...state,
      };
    }
    case actionTypes.GET_PREV_MESSAGES_SUCESS: {
      const { threadedMessages } = action.payload;
      return {
        ...state,
        hasMorePrev: threadedMessages.length === PREV_THREADS_FETCH_SIZE,
        allThreadMessages: [...threadedMessages, ...state.allThreadMessages],
      };
    }
    case actionTypes.GET_PREV_MESSAGES_FAILURE: {
      return {
        ...state,
        hasMorePrev: false,
      };
    }
    // event handlers - message status change
    case actionTypes.ON_MESSAGE_RECEIVED: {
      const { channel, message } = action.payload;
      if (state.currentChannel?.url !== channel?.url || state.hasMoreNext) {
        return state;
      }
      // Add message if thread list is fetched to the last (hasMoreNext == false)
      return {
        ...state,
        allThreadMessages: [...state.allThreadMessages, message],
      };
    }
    case actionTypes.ON_MESSAGE_UPDATED: {
      const { channel, message } = action.payload;
      if (state.currentChannel?.url !== channel?.url) {
        return state;
      }
      return {
        ...state,
        allThreadMessages: state.allThreadMessages?.map((msg) => (
          (msg?.messageId === message?.messageId) ? message : msg
        ))
      };
    }
    case actionTypes.ON_MESSAGE_DELETED: {
      const { channel, message } = action.payload;
      if (state.currentChannel?.url !== channel?.url) {
        return state;
      }
      return {
        ...state,
        allThreadMessages: state.allThreadMessages?.filter((msg) => (
          msg?.messageId !== message?.messageId
        )),
      };
    }
    case actionTypes.ON_MESSAGE_DELETED_BY_REQ_ID: {
      return {
        ...state,
        allThreadMessages: state.allThreadMessages.filter((m) => (
          !compareIds((m as UserMessage | FileMessage).reqId, action.payload)
        )),
      };
    }
    case actionTypes.ON_REACTION_UPDATED: {
      const { reactionEvent } = action.payload;
      return {
        ...state,
        allThreadMessages: state.allThreadMessages.map((m) => {
          if (compareIds(m?.messageId, reactionEvent.messageId)) {
            if (m?.applyReactionEvent && typeof m.applyReactionEvent === 'function') {
              m?.applyReactionEvent?.(reactionEvent);
            }
            return m;
          }
          return m;
        })
      };
    }
    // event handlers - user status change
    case actionTypes.ON_USER_MUTED: {
      const { channel, user } = action.payload;
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      console.log('이거 불렸나?')
      return {
        ...state,
        isMuted: true,
      };
    }
    case actionTypes.ON_USER_UNMUTED: {
      const { channel, user } = action.payload;
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: false,
      };
    }
    case actionTypes.ON_USER_BANNED: {
      return {
        ...state,
        channelStatus: ChannelStateTypes.NIL,
        threadListStatus: ThreadListStateTypes.NIL,
        parentMessageInfoStatus: ParentMessageInfoStateTypes.NIL,
        currentChannel: null,
        parentMessage: null,
        allThreadMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
      };
    }
    case actionTypes.ON_USER_UNBANNED: {
      return {
        ...state,
      };
    }
    case actionTypes.ON_USER_LEFT: {
      return {
        ...state,
        channelStatus: ChannelStateTypes.NIL,
        threadListStatus: ThreadListStateTypes.NIL,
        parentMessageInfoStatus: ParentMessageInfoStateTypes.NIL,
        currentChannel: null,
        parentMessage: null,
        allThreadMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
      };
    }
    // event handler - channel status change
    case actionTypes.ON_CHANNEL_FROZEN: {
      return {
        ...state,
        isChannelFrozen: true,
      };
    }
    case actionTypes.ON_CHANNEL_UNFROZEN: {
      return {
        ...state,
        isChannelFrozen: false,
      };
    }
    // message
    case actionTypes.SEND_MESSAGE_START: {
      const { message } = action.payload;
      return {
        ...state,
        allThreadMessages: [
          ...state.allThreadMessages,
          message,
        ]
      };
    }
    case actionTypes.SEND_MESSAGE_SUCESS: {
      const { message } = action.payload;
      const newMessages = state.allThreadMessages.filter((m) => (
        !compareIds((m as UserMessage)?.reqId, message?.reqId)
      ));
      return {
        ...state,
        allThreadMessages: [
          ...newMessages,
          message,
        ],
      };
    }
    case actionTypes.SEND_MESSAGE_FAILURE: {
      const { message } = action.payload;
      return {
        ...state,
        allThreadMessages: state.allThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        ))
      };
    }
    case actionTypes.RESEND_MESSAGE_START: {
      return {
        ...state,
      };
    }
    case actionTypes.EDIT_MESSAGE: {
      return {
        ...state,
      };
    }
    case actionTypes.DELETE_MESSAGE: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
