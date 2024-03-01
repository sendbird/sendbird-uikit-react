import { SdkStore } from '../../types';
export interface SdkStoreStateType {
    initialized: SdkStore['initialized'];
    loading: SdkStore['loading'];
    sdk: SdkStore['sdk'];
    error: SdkStore['error'];
}
declare const initialState: SdkStoreStateType;
export default initialState;
