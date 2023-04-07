import { ObjectValues } from "../../../utils/typeHelpers/objectValues";

const actionTypes = {
  INIT_USER: 'INIT_USER',
  RESET_USER: 'RESET_USER',
  SET_USER_LOADING: 'SET_USER_LOADING',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
} as const;

export type UserStoreActionTypes = ObjectValues<typeof actionTypes>;

export default actionTypes;
