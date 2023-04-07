import { User } from "@sendbird/chat";

export interface UserStoreInitialState {
  initialized: boolean;
  loading: boolean;
  user: User;
}

const initialState: UserStoreInitialState = {
  initialized: false,
  loading: false,
  user: {} as User,
};

export default initialState;
