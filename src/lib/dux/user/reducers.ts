import { UserActionTypes, USER_ACTIONS } from './actionTypes';
import initialState, { UserStoreStateType } from './initialState';

export default function reducer(state: UserStoreStateType, action: UserActionTypes): UserStoreStateType {
  switch (action.type) {
    case USER_ACTIONS.INIT_USER:
      return {
        initialized: true,
        loading: false,
        user: action.payload,
      };
    case USER_ACTIONS.RESET_USER:
      return initialState;
    case USER_ACTIONS.UPDATE_USER_INFO:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
