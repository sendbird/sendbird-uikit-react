import SendbirdUIKit from '../../../index';
export interface State {
  allMessages: Array<SendbirdUIKit.ClientFileMessage | SendbirdUIKit.ClientUserMessage>;
  loading: boolean;
  isInvalid: boolean;
  initialized: boolean;
  currentChannel: SendbirdUIKit.GroupChannelType;
  currentMessageSearchQuery: SendbirdUIKit.ClientMessageSearchQuery;
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
