import { match } from 'ts-pattern';
import { UserActionTypes, USER_ACTIONS } from './actionTypes';
import initialState, { UserStoreStateType } from './initialState';

export default function reducer(state: UserStoreStateType, action: UserActionTypes): UserStoreStateType {
  return match(action)
    .with({ type: USER_ACTIONS.INIT_USER }, ({ payload }) => {
      return {
        initialized: true,
        loading: false,
        user: payload,
      };
    })
    .with({ type: USER_ACTIONS.RESET_USER }, () => {
      return initialState;
    })
    .with({ type: USER_ACTIONS.UPDATE_USER_INFO }, ({ payload }) => {
      return {
        ...state,
        user: payload,
      };
    })
    .otherwise(() => {
      return state;
    }) as UserStoreStateType;
}
