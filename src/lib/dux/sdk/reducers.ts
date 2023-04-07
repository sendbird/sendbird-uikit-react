import { SdkActionTypes, SDK_ACTIONS } from './actionTypes';
import initialState, { SdkStoreStateType } from './initialState';

export default function reducer(state: SdkStoreStateType, action: SdkActionTypes): SdkStoreStateType {
  switch (action.type) {
    case SDK_ACTIONS.SET_SDK_LOADING:
      return {
        ...state,
        initialized: false,
        loading: action.payload,
      };
    case SDK_ACTIONS.SDK_ERROR:
      return {
        ...state,
        initialized: false,
        loading: false,
        error: true,
      };
    case SDK_ACTIONS.INIT_SDK:
      return {
        sdk: action.payload,
        initialized: true,
        loading: false,
        error: false,
      };
    case SDK_ACTIONS.RESET_SDK:
      return initialState;
    default:
      return state;
  }
}
