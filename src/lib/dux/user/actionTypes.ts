import { CreateAction } from '../../../utils/typeHelpers/reducers/CreateAction';

export const INIT_USER = 'INIT_USER';
export const RESET_USER = 'RESET_USER';
export const SET_USER_LOADING = 'SET_USER_LOADING';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';

export const USER_ACTIONS = {
  INIT_USER: 'INIT_USER',
  RESET_USER: 'RESET_USER',
  SET_USER_LOADING: 'SET_USER_LOADING',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
} as const;

type USER_PAYLOAD_TYPES = {
  [USER_ACTIONS.INIT_USER]: any,
  [USER_ACTIONS.RESET_USER]: any,
  [USER_ACTIONS.SET_USER_LOADING]: any,
  [USER_ACTIONS.UPDATE_USER_INFO]: any,
};

export type UserActionTypes = CreateAction<USER_PAYLOAD_TYPES>;
