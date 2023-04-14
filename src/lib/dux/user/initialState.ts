import { User } from "@sendbird/chat";

export interface UserStoreStateType {
  initialized: boolean;
  loading: boolean;
  user: User,
}

const initialState: UserStoreStateType = {
  initialized: false,
  loading: false,
  user: {} as User,
};

export default initialState
