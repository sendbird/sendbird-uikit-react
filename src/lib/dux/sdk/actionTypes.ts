import { ObjectValues } from "../../../utils/typeHelpers/objectValues";

const actionTypes = {
  INIT_SDK: 'INIT_SDK',
  SET_SDK_LOADING: 'SET_SDK_LOADING',
  RESET_SDK: 'RESET_SDK',
  SDK_ERROR: 'SDK_ERROR',
} as const;

export type SdkStoreActionTypes = ObjectValues<typeof actionTypes>;

export default actionTypes;
