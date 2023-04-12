import { match } from 'ts-pattern';
import { SdkActionTypes, SDK_ACTIONS } from './actionTypes';
import initialState, { SdkStoreStateType } from './initialState';

export default function reducer(state: SdkStoreStateType, action: SdkActionTypes): SdkStoreStateType {
  return match(action)
    .with({ type: SDK_ACTIONS.SET_SDK_LOADING }, ({ payload }) => {
      return {
        ...state,
        initialized: false,
        loading: payload,
      };
    })
    .with({ type: SDK_ACTIONS.SDK_ERROR }, () => {
      return {
        ...state,
        initialized: false,
        loading: false,
        error: true,
      };
    })
    .with({ type: SDK_ACTIONS.INIT_SDK }, ({ payload }) => {
      return {
        sdk: payload,
        initialized: true,
        loading: false,
        error: false,
      };
    })
    .with({ type: SDK_ACTIONS.RESET_SDK }, () => {
      return initialState;
    })
    .otherwise(() => {
      return state;
    });
}
