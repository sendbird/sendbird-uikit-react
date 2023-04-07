import SendbirdChat from "@sendbird/chat";

export interface SdkStoreInitialState {
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChat,
  error: boolean;
}

const initialState: SdkStoreInitialState = {
  initialized: false,
  loading: false,
  sdk: {} as SendbirdChat,
  error: false,
};

export default initialState;
