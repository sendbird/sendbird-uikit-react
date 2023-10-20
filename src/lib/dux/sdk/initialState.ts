import { SdkStore } from '../../types';

export interface SdkStoreStateType {
  initialized: SdkStore['initialized']
  loading: SdkStore['loading']
  sdk: SdkStore['sdk'],
  error: SdkStore['error'];
}

const initialState: SdkStoreStateType = {
  initialized: false,
  loading: false,
  sdk: {} as SdkStore['sdk'],
  error: false,
};

export default initialState;
