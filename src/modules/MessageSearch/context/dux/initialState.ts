import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import {
  ClientFileMessage,
  ClientUserMessage,
} from '../../../../types';

export interface State {
  allMessages: Array<ClientFileMessage | ClientUserMessage>;
  loading: boolean;
  isInvalid: boolean;
  initialized: boolean;
  currentChannel: GroupChannel;
  currentMessageSearchQuery: MessageSearchQuery;
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
