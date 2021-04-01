import * as sdkActions from './actionTypes';
import initialState from './initialState';

export default function reducer(state, action) {
  switch (action.type) {
    case sdkActions.SET_SDK_LOADING:
      return {
        ...state,
        initialized: false,
        loading: action.payload,
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
        sdk: action.payload,
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
