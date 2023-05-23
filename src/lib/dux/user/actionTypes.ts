import { User } from '@sendbird/chat';
import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';

export const USER_ACTIONS = {
  INIT_USER: 'INIT_USER',
  RESET_USER: 'RESET_USER',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
} as const;

type USER_PAYLOAD_TYPES = {
  [USER_ACTIONS.INIT_USER]: User,
  [USER_ACTIONS.RESET_USER]: null,
  [USER_ACTIONS.UPDATE_USER_INFO]: User,
};

export type UserActionTypes = CreateAction<USER_PAYLOAD_TYPES>;
