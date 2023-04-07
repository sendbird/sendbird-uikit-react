import { User } from '@sendbird/chat';
import actions, { UserStoreActionTypes } from './actionTypes';
import initialState, { UserStoreInitialState } from './initialState';

type ActionType = {
  type: UserStoreActionTypes;
  payload: unknown;
};

export default function reducer(state: UserStoreInitialState, action: ActionType): UserStoreInitialState {
  switch (action.type) {
    case actions.INIT_USER:
      return {
        initialized: true,
        loading: false,
        user: action.payload as User,
      };
    case actions.RESET_USER:
      return initialState;
    case actions.UPDATE_USER_INFO:
      return {
        ...state,
        user: action.payload as User,
      };
    default:
      return state;
  }
}
