import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';
import { SdkStoreStateType } from './initialState';

export const SDK_ACTIONS = {
  INIT_SDK: 'INIT_SDK',
  SET_SDK_LOADING: 'SET_SDK_LOADING',
  RESET_SDK: 'RESET_SDK',
  SDK_ERROR: 'SDK_ERROR',
} as const;

type SDK_PAYLOAD_TYPES = {
  [SDK_ACTIONS.SET_SDK_LOADING]: boolean,
  [SDK_ACTIONS.INIT_SDK]: SdkStoreStateType['sdk'],
  [SDK_ACTIONS.SDK_ERROR]: null,
  [SDK_ACTIONS.RESET_SDK]: null,
};

export type SdkActionTypes = CreateAction<SDK_PAYLOAD_TYPES>;
