import { User } from '@sendbird/chat';
export interface UserStoreStateType {
    initialized: boolean;
    loading: boolean;
    user: User;
}
declare const initialState: UserStoreStateType;
export default initialState;
