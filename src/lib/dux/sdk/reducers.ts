import SendbirdChat from '@sendbird/chat';
import sdkActions, { SdkStoreActionTypes } from './actionTypes';
import initialState, { SdkStoreInitialState } from './initialState';

type ActionType = {
  type: SdkStoreActionTypes;
  payload: unknown;
}

export default function reducer(state: SdkStoreInitialState, action: ActionType): SdkStoreInitialState {
  switch (action.type) {
    case sdkActions.SET_SDK_LOADING:
      return {
        ...state,
        initialized: false,
        loading: action.payload as boolean,
      };
    case sdkActions.SDK_ERROR:
      return {
        ...state,
        initialized: false,
        loading: false,
        error: true,
      };
    case sdkActions.INIT_SDK:
      return {
        sdk: action.payload as SendbirdChat,
        initialized: true,
        loading: false,
        error: false,
      };
    case sdkActions.RESET_SDK:
      return initialState;
    default:
      return state;
  }
}
