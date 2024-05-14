import { SdkStore } from '../../types';

export interface SdkStoreStateType {
  initialized: SdkStore['initialized']
  loading: SdkStore['loading']
  sdk: SdkStore['sdk'] | null,
  error: SdkStore['error'];
}

const initialState: SdkStoreStateType = {
  initialized: false,
  loading: false,
  sdk: null,
  error: false,
};

export default initialState;
