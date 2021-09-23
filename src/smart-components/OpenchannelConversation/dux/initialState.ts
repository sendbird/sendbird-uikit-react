// import Sendbird from 'sendbird';
import Sendbird from '../../../sendbird.min.js';
import { EveryMessage } from '../../../index';

export interface State {
  allMessages: Array<EveryMessage>;
  loading: boolean;
  initialized: boolean;
  currentOpenChannel: Sendbird.OpenChannel;
  isInvalid: boolean;
  hasMore: boolean;
  lastMessageTimestamp: number;
  frozen: boolean;
  operators: Array<Sendbird.User>;
  participants: Array<Sendbird.User>;
  bannedParticipantIds: Array<string | number>;
  mutedParticipantIds: Array<string | number>;
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
