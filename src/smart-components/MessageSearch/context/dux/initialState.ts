import SendBird from 'sendbird';
import {
  ClientFileMessage,
  ClientUserMessage,
} from '../../../../types';

export interface State {
  allMessages: Array<ClientFileMessage | ClientUserMessage>;
  loading: boolean;
  isInvalid: boolean;
  initialized: boolean;
  currentChannel: SendBird.GroupChannel;
  currentMessageSearchQuery: SendBird.MessageSearchQuery | SendBird.MessageSearchQueryOptions;
  hasMoreResult: boolean;
}

const initialState: State = {
  allMessages: [],
  loading: false,
  isInvalid: false,
  initialized: false,
  currentChannel: null,
  currentMessageSearchQuery: null,
  hasMoreResult: false,
};

export default initialState;
