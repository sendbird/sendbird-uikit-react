import SendbirdChat from '@sendbird/chat';

export interface SdkStoreStateType {
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChat,
  error: boolean;
}

const initialState: SdkStoreStateType = {
  initialized: false,
  loading: false,
  sdk: {} as SendbirdChat,
  error: false,
};

export default initialState;
