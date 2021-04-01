import * as actions from './actionTypes';
import initialState from './initialState';

export default function reducer(state, action) {
  switch (action.type) {
    case actions.INIT_USER:
      return {
        initialized: true,
        loading: false,
        user: action.payload,
      };
    case actions.RESET_USER:
      return initialState;
    case actions.UPDATE_USER_INFO:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
