import { EmojiContainer } from "@sendbird/chat";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { BaseMessage, FileMessage, UserMessage } from "@sendbird/chat/message";
import {
  ChannelStateTypes,
  ParentMessageInfoStateTypes,
  ThreadListStateTypes,
} from "../../types";

export interface ThreadContextInitialState {
  currentChannel: GroupChannel;
  allThreadMessages: Array<BaseMessage>;
  parentMessage: UserMessage | FileMessage;
  channelStatus: ChannelStateTypes;
  parentMessageInfoStatus: ParentMessageInfoStateTypes;
  threadListStatus: ThreadListStateTypes;
  hasMorePrev: boolean;
  hasMoreNext: boolean;
  emojiContainer: EmojiContainer;
  isMuted: boolean;
  isOperator: boolean;
  isChannelFrozen: boolean;
  currentUserId: string;
}

const initialState: ThreadContextInitialState = {
  currentChannel: null,
  allThreadMessages: [],
  parentMessage: null,
  channelStatus: ChannelStateTypes.NIL,
  parentMessageInfoStatus: ParentMessageInfoStateTypes.NIL,
  threadListStatus: ThreadListStateTypes.NIL,
  hasMorePrev: false,
  hasMoreNext: false,
  emojiContainer: {} as EmojiContainer,
  isMuted: false,
  isOperator: false,
  isChannelFrozen: false,
  currentUserId: '',
}

export default initialState;
