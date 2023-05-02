import type { User } from '@sendbird/chat';
import { AdminMessage, FileMessage, UserMessage } from '@sendbird/chat/message';
import type { OpenChannel } from '@sendbird/chat/openChannel';

export interface State {
  allMessages: Array<AdminMessage | UserMessage | FileMessage>;
  loading: boolean;
  initialized: boolean;
  currentOpenChannel: OpenChannel;
  isInvalid: boolean;
  hasMore: boolean;
  lastMessageTimestamp: number;
  frozen: boolean;
  operators: Array<User>;
  participants: Array<User>;
  bannedParticipantIds: Array<string>;
  mutedParticipantIds: Array<string>;
}

const initialState: State = {
  allMessages: [],
  loading: false,
  initialized: false,
  currentOpenChannel: null,
  isInvalid: false,
  hasMore: false,
  lastMessageTimestamp: 0,
  frozen: false,
  operators: [],
  participants: [],
  bannedParticipantIds: [],
  mutedParticipantIds: [],
};

export default initialState;
